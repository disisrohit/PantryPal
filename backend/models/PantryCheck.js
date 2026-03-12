const mongoose = require('mongoose');

const checkItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem', required: true },
  itemName: { type: String, required: true },
  previousStock: { type: String, enum: ['full', 'half', 'low', 'empty'] },
  updatedStock: { type: String, enum: ['full', 'half', 'low', 'empty'], required: true }
}, { _id: false });

const pantryCheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, default: Date.now },
  items: [checkItemSchema],
  guestAdjustment: {
    enabled: { type: Boolean, default: false },
    additionalPeople: { type: Number, default: 0, min: 0, max: 20 },
    duration: {
      type: String,
      enum: ['this_week', 'next_3_days', 'next_2_weeks', 'custom'],
      default: 'this_week'
    },
    customDays: { type: Number }
  },
  totalItemsChecked: { type: Number, default: 0 },
  itemsNeedingRestock: { type: Number, default: 0 }
});

pantryCheckSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('PantryCheck', pantryCheckSchema);
