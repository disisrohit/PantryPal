const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  nameHindi: { type: String, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'dals_pulses', 'rice_grains', 'atta_flour', 'spices_masalas',
      'oils_ghee', 'salt_sugar', 'tea_coffee', 'dairy',
      'snacks_namkeen', 'pickles_chutneys', 'dry_fruits',
      'cleaning_household', 'personal_care', 'vegetables', 'fruits'
    ]
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'L', 'ml', 'packet', 'piece', 'dozen', 'box', 'bottle', 'pouch']
  },
  frequency: {
    type: String,
    required: true,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
    default: 'monthly'
  },
  preferredBrand: { type: String, trim: true },
  currentStock: {
    type: String,
    enum: ['full', 'half', 'low', 'empty'],
    default: 'full'
  },
  lastRestocked: { type: Date },
  avgConsumptionDays: { type: Number, default: 30 },
  predictedEmptyDate: { type: Date },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  isCustom: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

groceryItemSchema.index({ userId: 1, category: 1 });
groceryItemSchema.index({ userId: 1, currentStock: 1 });

groceryItemSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.lastRestocked && this.avgConsumptionDays) {
    const daysLeft = this.stockDaysRemaining();
    this.predictedEmptyDate = new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000);
  }
  next();
});

groceryItemSchema.methods.stockDaysRemaining = function () {
  const stockMultiplier = { full: 1.0, half: 0.5, low: 0.2, empty: 0 };
  const multiplier = stockMultiplier[this.currentStock] || 0;
  return Math.round(this.avgConsumptionDays * multiplier);
};

groceryItemSchema.methods.needsRestock = function () {
  if (this.currentStock === 'empty') return true;
  if (this.currentStock === 'low') return true;
  if (this.predictedEmptyDate && this.predictedEmptyDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('GroceryItem', groceryItemSchema);
