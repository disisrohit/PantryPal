const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  brand: { type: String },
  category: { type: String },
  included: { type: Boolean, default: true },
  purchased: { type: Boolean, default: false },
  estimatedPrice: { type: Number }
}, { _id: true });

const shoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['draft', 'ordered', 'completed'],
    default: 'draft'
  },
  items: [shoppingItemSchema],
  orderedVia: {
    type: String,
    enum: ['blinkit', 'zepto', 'bigbasket', 'swiggy_instamart', 'jiomart', 'amazon_fresh', 'local_kirana', 'manual', ''],
    default: ''
  },
  guestScaleFactor: { type: Number, default: 1.0 },
  notes: { type: String },
  completedAt: { type: Date }
});

shoppingListSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
