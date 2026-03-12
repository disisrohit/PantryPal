module.exports = {
  name: 'Pan-Indian Vegetarian',
  cuisineType: 'pan_indian',
  dietaryType: 'vegetarian',
  description: 'Versatile grocery list for a general Indian vegetarian household',
  isDefault: true,
  items: [
    // Dals & Pulses
    { name: 'Toor Dal', nameHindi: 'अरहर दाल', category: 'dals_pulses', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 0.25, commonBrands: ['Tata Sampann', 'Fortune'], sortOrder: 1 },
    { name: 'Chana Dal', nameHindi: 'चना दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.12, commonBrands: ['Tata Sampann'], sortOrder: 2 },
    { name: 'Moong Dal', nameHindi: 'मूंग दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.12, commonBrands: [], sortOrder: 3 },
    { name: 'Masoor Dal', nameHindi: 'मसूर दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.12, commonBrands: [], sortOrder: 4 },
    { name: 'Urad Dal', nameHindi: 'उड़द दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 5 },
    { name: 'Rajma', nameHindi: 'राजमा', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 6 },
    { name: 'Chole (Kabuli Chana)', nameHindi: 'छोले', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 7 },

    // Rice & Grains
    { name: 'Basmati Rice', nameHindi: 'बासमती चावल', category: 'rice_grains', defaultQuantity: 5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 1.0, commonBrands: ['India Gate', 'Daawat'], sortOrder: 1 },
    { name: 'Poha', nameHindi: 'पोहा', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 2 },
    { name: 'Suji (Semolina)', nameHindi: 'सूजी', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },

    // Atta & Flour
    { name: 'Whole Wheat Atta', nameHindi: 'गेहूं का आटा', category: 'atta_flour', defaultQuantity: 5, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 1.0, commonBrands: ['Aashirvaad', 'Fortune'], sortOrder: 1 },
    { name: 'Maida', nameHindi: 'मैदा', category: 'atta_flour', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 2 },
    { name: 'Besan (Gram Flour)', nameHindi: 'बेसन', category: 'atta_flour', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },

    // Spices & Masalas
    { name: 'Haldi (Turmeric)', nameHindi: 'हल्दी', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH', 'Everest', 'Catch'], sortOrder: 1 },
    { name: 'Lal Mirch Powder', nameHindi: 'लाल मिर्च', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH', 'Everest'], sortOrder: 2 },
    { name: 'Dhaniya Powder', nameHindi: 'धनिया पाउडर', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH'], sortOrder: 3 },
    { name: 'Jeera (Cumin)', nameHindi: 'जीरा', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['Catch'], sortOrder: 4 },
    { name: 'Garam Masala', nameHindi: 'गरम मसाला', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MDH', 'Everest'], sortOrder: 5 },
    { name: 'Mustard Seeds', nameHindi: 'राई', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 15, commonBrands: [], sortOrder: 6 },
    { name: 'Kaali Mirch (Black Pepper)', nameHindi: 'काली मिर्च', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 10, commonBrands: [], sortOrder: 7 },
    { name: 'Heeng', nameHindi: 'हींग', category: 'spices_masalas', defaultQuantity: 10, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 2, commonBrands: ['LG'], sortOrder: 8 },

    // Oils & Ghee
    { name: 'Refined Oil', nameHindi: 'रिफाइंड तेल', category: 'oils_ghee', defaultQuantity: 1, unit: 'L', defaultFrequency: 'monthly', perPersonMultiplier: 0.3, commonBrands: ['Fortune', 'Saffola'], sortOrder: 1 },
    { name: 'Mustard Oil', nameHindi: 'सरसों तेल', category: 'oils_ghee', defaultQuantity: 1, unit: 'L', defaultFrequency: 'monthly', perPersonMultiplier: 0.2, commonBrands: ['Fortune'], sortOrder: 2 },
    { name: 'Desi Ghee', nameHindi: 'देसी घी', category: 'oils_ghee', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Amul'], sortOrder: 3 },

    // Salt, Sugar
    { name: 'Salt', nameHindi: 'नमक', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.2, commonBrands: ['Tata Salt'], sortOrder: 1 },
    { name: 'Sugar', nameHindi: 'चीनी', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: [], sortOrder: 2 },

    // Tea & Coffee
    { name: 'Tea (Chai Patti)', nameHindi: 'चाय पत्ती', category: 'tea_coffee', defaultQuantity: 250, unit: 'g', defaultFrequency: 'biweekly', perPersonMultiplier: 50, commonBrands: ['Tata Tea', 'Red Label'], sortOrder: 1 },

    // Dairy
    { name: 'Milk', nameHindi: 'दूध', category: 'dairy', defaultQuantity: 1, unit: 'L', defaultFrequency: 'weekly', perPersonMultiplier: 0.5, commonBrands: ['Amul', 'Mother Dairy'], sortOrder: 1 },
    { name: 'Curd (Dahi)', nameHindi: 'दही', category: 'dairy', defaultQuantity: 400, unit: 'g', defaultFrequency: 'weekly', perPersonMultiplier: 100, commonBrands: ['Amul'], sortOrder: 2 },
    { name: 'Paneer', nameHindi: 'पनीर', category: 'dairy', defaultQuantity: 200, unit: 'g', defaultFrequency: 'weekly', perPersonMultiplier: 50, commonBrands: ['Amul'], sortOrder: 3 },

    // Cleaning
    { name: 'Dish Wash', nameHindi: 'बर्तन धोने का साबुन', category: 'cleaning_household', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Vim', 'Pril'], sortOrder: 1 },
    { name: 'Detergent', nameHindi: 'कपड़े का साबुन', category: 'cleaning_household', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: ['Surf Excel', 'Tide'], sortOrder: 2 },

    // Personal Care
    { name: 'Soap', nameHindi: 'साबुन', category: 'personal_care', defaultQuantity: 3, unit: 'piece', defaultFrequency: 'monthly', perPersonMultiplier: 1, commonBrands: ['Dove', 'Dettol'], sortOrder: 1 },
    { name: 'Toothpaste', nameHindi: 'टूथपेस्ट', category: 'personal_care', defaultQuantity: 1, unit: 'piece', defaultFrequency: 'monthly', perPersonMultiplier: 0.5, commonBrands: ['Colgate'], sortOrder: 2 },
  ]
};
