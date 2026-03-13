const express = require('express');
const auth = require('../middleware/auth');
const { analyzePantryImage, applyScannedResults } = require('../services/pantryScanner');
const GroceryItem = require('../models/GroceryItem');

const router = express.Router();

// POST /api/scan/analyze — Analyze a pantry photo with AI
router.post('/analyze', auth, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required (base64)' });
    }

    const analysis = await analyzePantryImage(image, req.userId);
    res.json({ analysis });
  } catch (error) {
    console.error('Scan analysis error:', error.message);
    if (error.message.includes('Ollama is not running')) {
      return res.status(503).json({ error: 'AI vision service not running. Start Ollama on your Mac.' });
    }
    // Send clean error message, not raw stack traces
    const cleanMsg = error.message.length > 100
      ? error.message.substring(0, 100) + '...'
      : error.message;
    res.status(500).json({ error: 'Analysis failed: ' + cleanMsg });
  }
});

// POST /api/scan/apply — Apply scan results to update pantry stock levels
router.post('/apply', auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const result = await applyScannedResults(req.userId, items);
    res.json({
      message: `Updated ${result.updates.length} items`,
      updates: result.updates,
      newItems: result.newItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scan/add-missing — Add items identified as missing to pantry
router.post('/add-missing', auth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const created = [];
    for (const item of items) {
      const groceryItem = new GroceryItem({
        userId: req.userId,
        name: item.name,
        nameHindi: item.nameHindi || '',
        category: item.category || 'spices_masalas',
        quantity: item.quantity || 1,
        unit: item.unit || 'packet',
        frequency: 'monthly',
        currentStock: 'empty',
        isCustom: true,
        avgConsumptionDays: 30
      });
      await groceryItem.save();
      created.push(groceryItem);
    }

    res.status(201).json({ items: created, count: created.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
