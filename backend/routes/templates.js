const express = require('express');
const GroceryTemplate = require('../models/GroceryTemplate');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/templates — Get all templates (optionally filter by cuisine/diet)
router.get('/', auth, async (req, res) => {
  try {
    const { cuisine, diet } = req.query;
    const query = {};
    if (cuisine) query.cuisineType = cuisine;
    if (diet) query.dietaryType = diet;

    const templates = await GroceryTemplate.find(query).sort({ name: 1 });
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/templates/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const template = await GroceryTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ template });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
