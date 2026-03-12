const mongoose = require('mongoose');

const templateItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHindi: { type: String },
  category: { type: String, required: true },
  defaultQuantity: { type: Number, required: true },
  unit: { type: String, required: true },
  defaultFrequency: { type: String, default: 'monthly' },
  perPersonMultiplier: { type: Number, default: 1 },
  commonBrands: [{ type: String }],
  sortOrder: { type: Number, default: 0 }
}, { _id: false });

const groceryTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisineType: {
    type: String,
    required: true,
    enum: ['north_indian', 'south_indian', 'bengali', 'gujarati', 'maharashtrian', 'punjabi', 'rajasthani', 'pan_indian']
  },
  dietaryType: {
    type: String,
    required: true,
    enum: ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan']
  },
  description: { type: String },
  items: [templateItemSchema],
  isDefault: { type: Boolean, default: false }
});

groceryTemplateSchema.index({ cuisineType: 1, dietaryType: 1 });

module.exports = mongoose.model('GroceryTemplate', groceryTemplateSchema);
