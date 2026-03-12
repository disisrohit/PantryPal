/**
 * Scale grocery quantities based on household size and guest adjustments.
 *
 * Base quantities in templates are calibrated for 1 adult.
 * We scale by: (adults + 0.5 * kids + additionalPeople) * perPersonMultiplier
 */

function getScaleFactor(household, guestAdjustment = null) {
  const { adultsCount = 2, kidsCount = 0 } = household;
  const basePeople = adultsCount + (kidsCount * 0.5);

  let totalPeople = basePeople;
  if (guestAdjustment && guestAdjustment.enabled) {
    totalPeople += guestAdjustment.additionalPeople;
  }

  return totalPeople;
}

/**
 * Scale a single item's quantity for a household.
 * perPersonMultiplier is the quantity per person (from template).
 */
function scaleQuantity(baseQuantityPerPerson, scaleFactor) {
  const raw = baseQuantityPerPerson * scaleFactor;
  return roundToNiceNumber(raw);
}

/**
 * Round quantities to nice, purchasable numbers.
 * e.g., 1.3 kg → 1.5 kg, 0.7 L → 1 L, 240 g → 250 g
 */
function roundToNiceNumber(value) {
  if (value <= 0) return 0;
  if (value < 0.1) return 0.1;
  if (value < 1) {
    return Math.ceil(value * 4) / 4; // Round to nearest 0.25
  }
  if (value < 5) {
    return Math.ceil(value * 2) / 2; // Round to nearest 0.5
  }
  return Math.ceil(value); // Round up to whole number
}

/**
 * Scale a full template's items for a household.
 */
function scaleTemplate(templateItems, household) {
  const factor = getScaleFactor(household);

  return templateItems.map(item => ({
    ...item,
    quantity: scaleQuantity(item.perPersonMultiplier || item.defaultQuantity, factor),
    unit: item.unit
  }));
}

/**
 * Calculate guest-adjusted order quantity.
 * If guests are visiting, temporarily increase the order quantity.
 */
function getGuestAdjustedQuantity(normalQuantity, household, guestAdjustment) {
  if (!guestAdjustment || !guestAdjustment.enabled) return normalQuantity;

  const normalFactor = getScaleFactor(household);
  const guestFactor = getScaleFactor(household, guestAdjustment);

  const durationMultiplier = getDurationMultiplier(guestAdjustment);
  const ratio = (guestFactor / normalFactor) * durationMultiplier;

  return roundToNiceNumber(normalQuantity * ratio);
}

function getDurationMultiplier(guestAdjustment) {
  switch (guestAdjustment.duration) {
    case 'next_3_days': return 0.43; // 3/7
    case 'this_week': return 1.0;
    case 'next_2_weeks': return 2.0;
    default: {
      if (guestAdjustment.customDays) {
        return guestAdjustment.customDays / 7;
      }
      return 1.0;
    }
  }
}

module.exports = {
  getScaleFactor,
  scaleQuantity,
  roundToNiceNumber,
  scaleTemplate,
  getGuestAdjustedQuantity
};
