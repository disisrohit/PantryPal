const express = require('express');
const GroceryItem = require('../models/GroceryItem');
const PantryCheck = require('../models/PantryCheck');
const auth = require('../middleware/auth');
const { updatePredictions, getRestockItems } = require('../services/predictionEngine');

const router = express.Router();

// GET /api/pantry — Get all pantry items (grouped by category)
router.get('/', auth, async (req, res) => {
  try {
    const items = await GroceryItem.find({ userId: req.userId, isActive: true })
      .sort({ category: 1, sortOrder: 1 });

    // Group by category
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    res.json({ items, grouped, total: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pantry/low — Get items that need restocking
router.get('/low', auth, async (req, res) => {
  try {
    const items = await getRestockItems(req.userId);
    res.json({ items, count: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/pantry/:id — Update a single pantry item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const allowed = ['name', 'quantity', 'unit', 'frequency', 'preferredBrand',
      'currentStock', 'isActive', 'sortOrder', 'category'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    });

    if (req.body.currentStock === 'full') {
      item.lastRestocked = new Date();
    }

    await item.save();
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pantry — Add a custom item
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, quantity, unit, frequency, preferredBrand } = req.body;

    if (!name || !category || !quantity || !unit) {
      return res.status(400).json({ error: 'Name, category, quantity, and unit are required' });
    }

    const item = new GroceryItem({
      userId: req.userId,
      name,
      category,
      quantity,
      unit,
      frequency: frequency || 'monthly',
      preferredBrand,
      currentStock: 'full',
      lastRestocked: new Date(),
      isCustom: true,
      avgConsumptionDays: frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30
    });

    await item.save();
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/pantry/:id — Deactivate an item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.isActive = false;
    await item.save();
    res.json({ message: 'Item removed from pantry' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pantry/check — Submit a pantry check
router.post('/check', auth, async (req, res) => {
  try {
    const { items: checkItems, guestAdjustment } = req.body;

    if (!checkItems || !Array.isArray(checkItems)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const checkEntries = [];
    let needsRestock = 0;

    for (const entry of checkItems) {
      const item = await GroceryItem.findOne({ _id: entry.itemId, userId: req.userId });
      if (!item) continue;

      const previousStock = item.currentStock;
      item.currentStock = entry.stock;

      if (entry.stock === 'full' && previousStock !== 'full') {
        item.lastRestocked = new Date();
      }

      await item.save();

      if (item.needsRestock()) needsRestock++;

      checkEntries.push({
        itemId: item._id,
        itemName: item.name,
        previousStock,
        updatedStock: entry.stock
      });
    }

    const pantryCheck = new PantryCheck({
      userId: req.userId,
      items: checkEntries,
      guestAdjustment: guestAdjustment || { enabled: false },
      totalItemsChecked: checkEntries.length,
      itemsNeedingRestock: needsRestock
    });

    await pantryCheck.save();

    // Update predictions based on new check data
    await updatePredictions(req.userId);

    // Update user's last pantry check date
    req.user.lastPantryCheck = new Date();
    await req.user.save();

    res.status(201).json({
      check: pantryCheck,
      summary: {
        totalChecked: checkEntries.length,
        needsRestock,
        nextCheckDate: getNextCheckDate(req.user)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pantry/checks — Get pantry check history
router.get('/checks', auth, async (req, res) => {
  try {
    const checks = await PantryCheck.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(20);

    res.json({ checks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getNextCheckDate(user) {
  const daysMap = { weekly: 7, biweekly: 14 };
  const days = daysMap[user.pantryCheckSchedule] || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = router;
