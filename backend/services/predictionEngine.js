const GroceryItem = require('../models/GroceryItem');
const PantryCheck = require('../models/PantryCheck');

const STOCK_VALUES = { full: 1.0, half: 0.5, low: 0.2, empty: 0 };

/**
 * Calculate consumption rate from pantry check history.
 * Uses the last N checks to estimate how fast an item is consumed.
 */
async function calculateConsumptionRate(userId, itemId) {
  const checks = await PantryCheck.find({ userId })
    .sort({ date: -1 })
    .limit(10);

  if (checks.length < 2) return null;

  const itemChecks = [];
  for (const check of checks) {
    const itemEntry = check.items.find(i => i.itemId.toString() === itemId.toString());
    if (itemEntry) {
      itemChecks.push({ date: check.date, stock: itemEntry.updatedStock });
    }
  }

  if (itemChecks.length < 2) return null;

  let totalDaysPerUnit = 0;
  let segments = 0;

  for (let i = 0; i < itemChecks.length - 1; i++) {
    const newer = itemChecks[i];
    const older = itemChecks[i + 1];
    const daysBetween = (newer.date - older.date) / (1000 * 60 * 60 * 24);
    const stockDrop = STOCK_VALUES[older.stock] - STOCK_VALUES[newer.stock];

    if (stockDrop > 0 && daysBetween > 0) {
      totalDaysPerUnit += daysBetween / stockDrop;
      segments++;
    }
  }

  if (segments === 0) return null;
  return Math.round(totalDaysPerUnit / segments);
}

/**
 * Predict when a user's item will run empty.
 */
function predictEmptyDate(currentStock, avgConsumptionDays) {
  const remaining = STOCK_VALUES[currentStock] || 0;
  if (remaining === 0) return new Date();
  const daysLeft = Math.round(avgConsumptionDays * remaining);
  return new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000);
}

/**
 * Update predictions for all items of a user after a pantry check.
 */
async function updatePredictions(userId) {
  const items = await GroceryItem.find({ userId, isActive: true });

  for (const item of items) {
    const rate = await calculateConsumptionRate(userId, item._id);
    if (rate) {
      item.avgConsumptionDays = rate;
    }
    item.predictedEmptyDate = predictEmptyDate(item.currentStock, item.avgConsumptionDays);
    await item.save();
  }
}

/**
 * Get items that need restocking (empty, low, or predicted to empty within 3 days).
 */
async function getRestockItems(userId) {
  const items = await GroceryItem.find({ userId, isActive: true });
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return items.filter(item => {
    if (item.currentStock === 'empty' || item.currentStock === 'low') return true;
    if (item.predictedEmptyDate && item.predictedEmptyDate <= threeDaysFromNow) return true;
    return false;
  }).sort((a, b) => {
    const priority = { empty: 0, low: 1, half: 2, full: 3 };
    return priority[a.currentStock] - priority[b.currentStock];
  });
}

module.exports = {
  calculateConsumptionRate,
  predictEmptyDate,
  updatePredictions,
  getRestockItems
};
