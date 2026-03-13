const express = require('express');
const User = require('../models/User');
const GroceryTemplate = require('../models/GroceryTemplate');
const GroceryItem = require('../models/GroceryItem');
const auth = require('../middleware/auth');
const { scaleTemplate } = require('../services/quantityScaler');

const router = express.Router();

// PUT /api/household — Update household settings
router.put('/', auth, async (req, res) => {
  try {
    const { adultsCount, kidsCount, cuisinePreference, dietaryPreference, preferredApps } = req.body;

    const household = req.user.household || {};
    if (adultsCount !== undefined) household.adultsCount = adultsCount;
    if (kidsCount !== undefined) household.kidsCount = kidsCount;
    if (cuisinePreference) household.cuisinePreference = cuisinePreference;
    if (dietaryPreference) household.dietaryPreference = dietaryPreference;
    if (preferredApps) household.preferredApps = preferredApps;

    req.user.household = household;
    await req.user.save();

    res.json({ household: req.user.household });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/household — Get household settings
router.get('/', auth, async (req, res) => {
  res.json({ household: req.user.household });
});

// GET /api/household/templates — Get matching grocery templates
router.get('/templates', auth, async (req, res) => {
  try {
    const { cuisinePreference, dietaryPreference } = req.user.household || {};

    let templates = await GroceryTemplate.find({
      cuisineType: cuisinePreference || 'pan_indian',
      dietaryType: dietaryPreference || 'vegetarian'
    });

    // Fallback to pan_indian if no exact match
    if (templates.length === 0) {
      templates = await GroceryTemplate.find({
        cuisineType: 'pan_indian',
        dietaryType: dietaryPreference || 'vegetarian'
      });
    }

    // Scale items for household size
    const scaledTemplates = templates.map(t => {
      const obj = t.toObject();
      obj.items = scaleTemplate(obj.items, req.user.household || {});
      return obj;
    });

    res.json({ templates: scaledTemplates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/household/apply-template — Apply a template to create user's grocery items
router.post('/apply-template', auth, async (req, res) => {
  try {
    const { templateId, customizations } = req.body;

    const template = await GroceryTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Scale items for household (toObject() to convert Mongoose subdocs to plain JS)
    const scaledItems = scaleTemplate(template.toObject().items, req.user.household || {});

    // Apply any customizations from the user
    const customMap = {};
    if (customizations && Array.isArray(customizations)) {
      customizations.forEach(c => {
        customMap[c.name] = c;
      });
    }

    // Remove existing items and create new ones
    await GroceryItem.deleteMany({ userId: req.user._id, isCustom: false });

    const groceryItems = scaledItems.map((item, index) => {
      const custom = customMap[item.name];
      return {
        userId: req.user._id,
        name: item.name,
        nameHindi: item.nameHindi,
        category: item.category,
        quantity: custom?.quantity || item.quantity,
        unit: custom?.unit || item.unit,
        frequency: custom?.frequency || item.defaultFrequency || 'monthly',
        preferredBrand: custom?.brand || (item.commonBrands && item.commonBrands[0]) || '',
        currentStock: 'full',
        avgConsumptionDays: getDefaultConsumptionDays(item.defaultFrequency || 'monthly'),
        lastRestocked: new Date(),
        isActive: custom?.isActive !== undefined ? custom.isActive : true,
        sortOrder: index
      };
    });

    const created = await GroceryItem.insertMany(groceryItems);

    // Mark onboarding as complete
    req.user.onboardingComplete = true;
    await req.user.save();

    res.status(201).json({ items: created, count: created.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getDefaultConsumptionDays(frequency) {
  switch (frequency) {
    case 'weekly': return 7;
    case 'biweekly': return 14;
    case 'monthly': return 30;
    case 'quarterly': return 90;
    default: return 30;
  }
}

module.exports = router;
