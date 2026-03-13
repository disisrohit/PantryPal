const GroceryItem = require('../models/GroceryItem');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llava:7b';

const ANALYSIS_PROMPT = `You are a kitchen pantry analyst for Indian households. Look at this photo carefully.

Tasks:
1. Identify ALL visible grocery/kitchen items
2. Estimate fill level: "full" (75-100%), "half" (40-74%), "low" (10-39%), "empty" (<10%)
3. Look at transparent containers, jars, plastic bags, bottles — estimate fill by visible level
4. Note items missing from a typical Indian kitchen

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "items": [
    {
      "name": "Item name (English)",
      "nameHindi": "Hindi name if applicable",
      "category": "one of: dals_pulses, rice_grains, atta_flour, spices_masalas, oils_ghee, salt_sugar, tea_coffee, dairy, snacks_namkeen, pickles_chutneys, dry_fruits, cleaning_household, personal_care, vegetables, fruits",
      "estimatedStock": "full",
      "confidence": 0.8,
      "containerType": "jar",
      "notes": "Brief observation"
    }
  ],
  "missingFromTypicalPantry": ["Item name"],
  "overallAssessment": "1-2 sentence summary",
  "restockUrgent": ["Items needing restocking now"],
  "restockSoon": ["Items to restock within a week"]
}`;

/**
 * Analyze a pantry image using Ollama LLaVA running locally.
 * Completely free, no API keys, no rate limits, works offline.
 */
async function analyzePantryImage(base64Image, userId) {
  // Verify Ollama is running
  try {
    await fetch(`${OLLAMA_URL}/api/tags`);
  } catch (e) {
    throw new Error('Ollama is not running. Start it with: brew services start ollama');
  }

  // Get user's existing pantry items for context
  let existingItems = [];
  if (userId) {
    existingItems = await GroceryItem.find({ userId, isActive: true }).select('name category currentStock');
  }

  const userContext = existingItems.length > 0
    ? `\nUser's current pantry items: ${existingItems.map(i => `${i.name} (${i.category}, stock: ${i.currentStock})`).join(', ')}`
    : '';

  // Strip data URI prefix if present
  const imageData = base64Image.startsWith('data:')
    ? base64Image.split(',')[1]
    : base64Image;

  // Call Ollama's local API with the vision model
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: ANALYSIS_PROMPT + userContext,
      images: [imageData],
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2048,
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.response;

  if (!content) {
    throw new Error('No response from local vision model');
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Raw LLaVA response:', content);
    throw new Error('Could not parse AI response as JSON');
  }

  const analysis = JSON.parse(jsonMatch[0]);
  return analysis;
}

/**
 * Match scanned items against user's existing pantry and update stock levels.
 */
async function applyScannedResults(userId, scannedItems) {
  const existingItems = await GroceryItem.find({ userId, isActive: true });
  const updates = [];
  const newItems = [];

  for (const scanned of scannedItems) {
    // Try to match by name (fuzzy)
    const match = existingItems.find(existing => {
      const existingLower = existing.name.toLowerCase();
      const scannedLower = scanned.name.toLowerCase();
      return existingLower.includes(scannedLower) ||
        scannedLower.includes(existingLower) ||
        levenshteinSimilarity(existingLower, scannedLower) > 0.6;
    });

    if (match) {
      // Update existing item's stock level
      if (scanned.confirmed) {
        match.currentStock = scanned.estimatedStock;
        if (scanned.estimatedStock === 'full') {
          match.lastRestocked = new Date();
        }
        await match.save();
        updates.push({ itemId: match._id, name: match.name, newStock: scanned.estimatedStock });
      }
    } else if (scanned.addToInventory) {
      newItems.push(scanned);
    }
  }

  return { updates, newItems };
}

/**
 * Simple Levenshtein-based similarity score (0-1).
 */
function levenshteinSimilarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return 1 - matrix[a.length][b.length] / maxLen;
}

module.exports = { analyzePantryImage, applyScannedResults };
