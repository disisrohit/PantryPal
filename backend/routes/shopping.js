const express = require('express');
const ShoppingList = require('../models/ShoppingList');
const GroceryItem = require('../models/GroceryItem');
const auth = require('../middleware/auth');
const { getRestockItems } = require('../services/predictionEngine');
const { getGuestAdjustedQuantity } = require('../services/quantityScaler');

const router = express.Router();

// POST /api/shopping/generate — Auto-generate a shopping list from pantry status
router.post('/generate', auth, async (req, res) => {
  try {
    const { guestAdjustment } = req.body;
    const restockItems = await getRestockItems(req.userId);

    if (restockItems.length === 0) {
      return res.status(200).json({ list: null, message: 'Your pantry is fully stocked! No items are running low.' });
    }

    const household = req.user.household || {};
    const guestScale = guestAdjustment && guestAdjustment.enabled
      ? getGuestScaleFactor(household, guestAdjustment)
      : 1.0;

    const shoppingItems = restockItems.map(item => {
      let qty = item.quantity;
      if (guestAdjustment && guestAdjustment.enabled) {
        qty = getGuestAdjustedQuantity(qty, household, guestAdjustment);
      }

      return {
        itemId: item._id,
        name: item.name,
        quantity: qty,
        unit: item.unit,
        brand: item.preferredBrand || '',
        category: item.category,
        included: true,
        purchased: false
      };
    });

    const list = new ShoppingList({
      userId: req.userId,
      items: shoppingItems,
      guestScaleFactor: guestScale
    });

    await list.save();
    res.status(201).json({ list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shopping — Get user's shopping lists
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;

    const lists = await ShoppingList.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ lists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shopping/:id — Get a specific shopping list
router.get('/:id', auth, async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ _id: req.params.id, userId: req.userId });
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });
    res.json({ list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/shopping/:id — Update a shopping list (toggle items, mark ordered, etc.)
router.put('/:id', auth, async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ _id: req.params.id, userId: req.userId });
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });

    const { status, orderedVia, items, notes } = req.body;

    if (status) list.status = status;
    if (orderedVia) list.orderedVia = orderedVia;
    if (notes !== undefined) list.notes = notes;

    if (items && Array.isArray(items)) {
      items.forEach(update => {
        const existing = list.items.id(update._id);
        if (existing) {
          if (update.included !== undefined) existing.included = update.included;
          if (update.purchased !== undefined) existing.purchased = update.purchased;
          if (update.quantity !== undefined) existing.quantity = update.quantity;
        }
      });
    }

    if (status === 'completed') {
      list.completedAt = new Date();
      // Mark purchased items as restocked in pantry
      for (const item of list.items) {
        if (item.purchased && item.itemId) {
          await GroceryItem.findByIdAndUpdate(item.itemId, {
            currentStock: 'full',
            lastRestocked: new Date()
          });
        }
      }
    }

    await list.save();
    res.json({ list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shopping/:id/deeplinks — Get deep links for a shopping list
router.get('/:id/deeplinks', auth, async (req, res) => {
  try {
    const { app } = req.query; // blinkit, zepto, bigbasket
    const list = await ShoppingList.findOne({ _id: req.params.id, userId: req.userId });
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });

    const includedItems = list.items.filter(i => i.included);
    const links = includedItems.map(item => {
      const searchQuery = item.brand
        ? `${item.brand} ${item.name} ${item.quantity}${item.unit}`
        : `${item.name} ${item.quantity}${item.unit}`;

      return {
        name: item.name,
        quantity: `${item.quantity} ${item.unit}`,
        links: generateDeepLinks(searchQuery, app)
      };
    });

    // Also generate a formatted text list for clipboard/sharing
    const textList = includedItems.map(item => {
      const brand = item.brand ? `${item.brand} ` : '';
      return `• ${brand}${item.name} — ${item.quantity} ${item.unit}`;
    }).join('\n');

    res.json({ links, textList, totalItems: includedItems.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateDeepLinks(query, preferredApp) {
  const encoded = encodeURIComponent(query);
  const allLinks = {
    blinkit: `https://blinkit.com/s/?q=${encoded}`,
    zepto: `https://www.zeptonow.com/search?query=${encoded}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${encoded}`,
    swiggy_instamart: `https://www.swiggy.com/instamart/search?query=${encoded}`,
    jiomart: `https://www.jiomart.com/search/${encoded}`,
    amazon_fresh: `https://www.amazon.in/s?k=${encoded}&i=nowstore`
  };

  if (preferredApp && allLinks[preferredApp]) {
    return { [preferredApp]: allLinks[preferredApp] };
  }
  return allLinks;
}

function getGuestScaleFactor(household, guestAdjustment) {
  const base = (household.adultsCount || 2) + ((household.kidsCount || 0) * 0.5);
  const withGuests = base + (guestAdjustment.additionalPeople || 0);
  return withGuests / base;
}

module.exports = router;
