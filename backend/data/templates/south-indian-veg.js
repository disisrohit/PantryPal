module.exports = {
  name: 'South Indian Vegetarian',
  cuisineType: 'south_indian',
  dietaryType: 'vegetarian',
  description: 'Complete grocery list for a South Indian vegetarian household',
  isDefault: true,
  items: [
    // Dals & Pulses
    { name: 'Toor Dal', nameHindi: 'अरहर दाल', category: 'dals_pulses', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 0.3, commonBrands: ['Tata Sampann'], sortOrder: 1 },
    { name: 'Urad Dal (Split)', nameHindi: 'उड़द दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 0.15, commonBrands: [], sortOrder: 2 },
    { name: 'Moong Dal', nameHindi: 'मूंग दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },
    { name: 'Chana Dal', nameHindi: 'चना दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 4 },

    // Rice & Grains
    { name: 'Sona Masoori Rice', nameHindi: 'सोना मसूरी चावल', category: 'rice_grains', defaultQuantity: 5, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 1.5, commonBrands: ['India Gate', '24 Mantra'], sortOrder: 1 },
    { name: 'Idli Rava', nameHindi: 'इडली रवा', category: 'rice_grains', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 0.25, commonBrands: [], sortOrder: 2 },
    { name: 'Ragi Flour', nameHindi: 'रागी आटा', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },
    { name: 'Poha (Flattened Rice)', nameHindi: 'पोहा', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 4 },

    // Atta & Flour
    { name: 'Rice Flour', nameHindi: 'चावल का आटा', category: 'atta_flour', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.2, commonBrands: [], sortOrder: 1 },
    { name: 'Besan (Gram Flour)', nameHindi: 'बेसन', category: 'atta_flour', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 2 },
    { name: 'Whole Wheat Atta', nameHindi: 'गेहूं का आटा', category: 'atta_flour', defaultQuantity: 2, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.4, commonBrands: ['Aashirvaad'], sortOrder: 3 },

    // Spices & Masalas
    { name: 'Haldi (Turmeric Powder)', nameHindi: 'हल्दी', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MTR', 'Everest'], sortOrder: 1 },
    { name: 'Lal Mirch (Red Chilli Powder)', nameHindi: 'लाल मिर्च', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MTR', 'Everest'], sortOrder: 2 },
    { name: 'Dhaniya Powder', nameHindi: 'धनिया पाउडर', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MTR'], sortOrder: 3 },
    { name: 'Mustard Seeds (Rai)', nameHindi: 'राई', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: [], sortOrder: 4 },
    { name: 'Curry Leaves (Kadi Patta)', nameHindi: 'कड़ी पत्ता', category: 'spices_masalas', defaultQuantity: 1, unit: 'packet', defaultFrequency: 'weekly', perPersonMultiplier: 0.5, commonBrands: [], sortOrder: 5 },
    { name: 'Sambar Powder', nameHindi: 'सांभर पाउडर', category: 'spices_masalas', defaultQuantity: 200, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: ['MTR', 'Sakthi'], sortOrder: 6 },
    { name: 'Rasam Powder', nameHindi: 'रसम पाउडर', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MTR', 'Sakthi'], sortOrder: 7 },
    { name: 'Jeera (Cumin Seeds)', nameHindi: 'जीरा', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: [], sortOrder: 8 },
    { name: 'Kaali Mirch (Black Pepper)', nameHindi: 'काली मिर्च', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 10, commonBrands: [], sortOrder: 9 },
    { name: 'Heeng (Asafoetida)', nameHindi: 'हींग', category: 'spices_masalas', defaultQuantity: 10, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 2, commonBrands: ['LG'], sortOrder: 10 },
    { name: 'Tamarind (Imli)', nameHindi: 'इमली', category: 'spices_masalas', defaultQuantity: 200, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: [], sortOrder: 11 },

    // Oils & Ghee
    { name: 'Coconut Oil', nameHindi: 'नारियल तेल', category: 'oils_ghee', defaultQuantity: 1, unit: 'L', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: ['Parachute', 'KLF Coconad'], sortOrder: 1 },
    { name: 'Gingelly Oil (Sesame)', nameHindi: 'तिल का तेल', category: 'oils_ghee', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Idhayam'], sortOrder: 2 },
    { name: 'Desi Ghee', nameHindi: 'देसी घी', category: 'oils_ghee', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Amul', 'Nandini'], sortOrder: 3 },

    // Salt, Sugar & Essentials
    { name: 'Salt', nameHindi: 'नमक', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.2, commonBrands: ['Tata Salt'], sortOrder: 1 },
    { name: 'Sugar', nameHindi: 'चीनी', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: [], sortOrder: 2 },
    { name: 'Jaggery (Gur)', nameHindi: 'गुड़', category: 'salt_sugar', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },
    { name: 'Coconut (Fresh)', nameHindi: 'नारियल', category: 'salt_sugar', defaultQuantity: 4, unit: 'piece', defaultFrequency: 'weekly', perPersonMultiplier: 1, commonBrands: [], sortOrder: 4 },

    // Tea & Coffee
    { name: 'Filter Coffee Powder', nameHindi: 'फिल्टर कॉफ़ी', category: 'tea_coffee', defaultQuantity: 200, unit: 'g', defaultFrequency: 'biweekly', perPersonMultiplier: 40, commonBrands: ['Narasus', 'Cothas', 'Bru'], sortOrder: 1 },
    { name: 'Tea (Chai Patti)', nameHindi: 'चाय पत्ती', category: 'tea_coffee', defaultQuantity: 250, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: ['Red Label', 'Tata Tea'], sortOrder: 2 },

    // Dairy
    { name: 'Milk', nameHindi: 'दूध', category: 'dairy', defaultQuantity: 1, unit: 'L', defaultFrequency: 'weekly', perPersonMultiplier: 0.5, commonBrands: ['Nandini', 'Amul'], sortOrder: 1 },
    { name: 'Curd (Dahi)', nameHindi: 'दही', category: 'dairy', defaultQuantity: 500, unit: 'g', defaultFrequency: 'weekly', perPersonMultiplier: 100, commonBrands: ['Nandini'], sortOrder: 2 },
    { name: 'Butter', nameHindi: 'मक्खन', category: 'dairy', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['Amul'], sortOrder: 3 },

    // Pickles
    { name: 'Avakaya (Mango Pickle)', nameHindi: 'आवकाय अचार', category: 'pickles_chutneys', defaultQuantity: 250, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 50, commonBrands: ['Priya', 'Mothers Recipe'], sortOrder: 1 },

    // Dry Fruits
    { name: 'Cashews (Kaju)', nameHindi: 'काजू', category: 'dry_fruits', defaultQuantity: 250, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: [], sortOrder: 1 },

    // Cleaning
    { name: 'Dish Wash Liquid', nameHindi: 'बर्तन धोने का लिक्विड', category: 'cleaning_household', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Vim'], sortOrder: 1 },
    { name: 'Detergent Powder', nameHindi: 'कपड़े धोने का पाउडर', category: 'cleaning_household', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: ['Surf Excel'], sortOrder: 2 },
  ]
};
