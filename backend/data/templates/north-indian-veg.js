module.exports = {
  name: 'North Indian Vegetarian',
  cuisineType: 'north_indian',
  dietaryType: 'vegetarian',
  description: 'Complete grocery list for a North Indian vegetarian household',
  isDefault: true,
  items: [
    // Dals & Pulses
    { name: 'Toor Dal', nameHindi: 'अरहर दाल', category: 'dals_pulses', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 0.25, commonBrands: ['Tata Sampann', 'Fortune'], sortOrder: 1 },
    { name: 'Chana Dal', nameHindi: 'चना दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.15, commonBrands: ['Tata Sampann'], sortOrder: 2 },
    { name: 'Moong Dal', nameHindi: 'मूंग दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.15, commonBrands: ['Tata Sampann'], sortOrder: 3 },
    { name: 'Urad Dal', nameHindi: 'उड़द दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: ['Tata Sampann'], sortOrder: 4 },
    { name: 'Masoor Dal', nameHindi: 'मसूर दाल', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.15, commonBrands: ['Tata Sampann'], sortOrder: 5 },
    { name: 'Rajma', nameHindi: 'राजमा', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: ['Tata Sampann'], sortOrder: 6 },
    { name: 'Chole (Kabuli Chana)', nameHindi: 'छोले', category: 'dals_pulses', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: ['Tata Sampann'], sortOrder: 7 },

    // Rice & Grains
    { name: 'Basmati Rice', nameHindi: 'बासमती चावल', category: 'rice_grains', defaultQuantity: 5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 1.0, commonBrands: ['India Gate', 'Daawat', 'Fortune'], sortOrder: 1 },
    { name: 'Poha (Flattened Rice)', nameHindi: 'पोहा', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 2 },
    { name: 'Daliya (Broken Wheat)', nameHindi: 'दलिया', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },
    { name: 'Suji (Semolina)', nameHindi: 'सूजी', category: 'rice_grains', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 4 },

    // Atta & Flour
    { name: 'Whole Wheat Atta', nameHindi: 'गेहूं का आटा', category: 'atta_flour', defaultQuantity: 5, unit: 'kg', defaultFrequency: 'biweekly', perPersonMultiplier: 1.25, commonBrands: ['Aashirvaad', 'Fortune', 'Pillsbury'], sortOrder: 1 },
    { name: 'Maida (All Purpose Flour)', nameHindi: 'मैदा', category: 'atta_flour', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 2 },
    { name: 'Besan (Gram Flour)', nameHindi: 'बेसन', category: 'atta_flour', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },

    // Spices & Masalas
    { name: 'Haldi (Turmeric Powder)', nameHindi: 'हल्दी', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH', 'Everest', 'Catch'], sortOrder: 1 },
    { name: 'Lal Mirch (Red Chilli Powder)', nameHindi: 'लाल मिर्च', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH', 'Everest'], sortOrder: 2 },
    { name: 'Dhaniya Powder (Coriander)', nameHindi: 'धनिया पाउडर', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 25, commonBrands: ['MDH', 'Everest'], sortOrder: 3 },
    { name: 'Jeera (Cumin Seeds)', nameHindi: 'जीरा', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MDH', 'Catch'], sortOrder: 4 },
    { name: 'Garam Masala', nameHindi: 'गरम मसाला', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MDH', 'Everest'], sortOrder: 5 },
    { name: 'Rai (Mustard Seeds)', nameHindi: 'राई', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 15, commonBrands: [], sortOrder: 6 },
    { name: 'Ajwain (Carom Seeds)', nameHindi: 'अजवाइन', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 10, commonBrands: [], sortOrder: 7 },
    { name: 'Kitchen King Masala', nameHindi: 'किचन किंग', category: 'spices_masalas', defaultQuantity: 100, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 20, commonBrands: ['MDH', 'Everest'], sortOrder: 8 },
    { name: 'Chaat Masala', nameHindi: 'चाट मसाला', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 10, commonBrands: ['MDH', 'Everest'], sortOrder: 9 },
    { name: 'Kaali Mirch (Black Pepper)', nameHindi: 'काली मिर्च', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 10, commonBrands: ['Catch'], sortOrder: 10 },
    { name: 'Heeng (Asafoetida)', nameHindi: 'हींग', category: 'spices_masalas', defaultQuantity: 10, unit: 'g', defaultFrequency: 'quarterly', perPersonMultiplier: 2, commonBrands: ['LG', 'Vandevi'], sortOrder: 11 },
    { name: 'Amchur Powder', nameHindi: 'अमचूर', category: 'spices_masalas', defaultQuantity: 50, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 10, commonBrands: ['MDH'], sortOrder: 12 },

    // Oils & Ghee
    { name: 'Mustard Oil', nameHindi: 'सरसों का तेल', category: 'oils_ghee', defaultQuantity: 1, unit: 'L', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: ['Fortune', 'Patanjali', 'Dhara'], sortOrder: 1 },
    { name: 'Refined Oil (Sunflower/Soybean)', nameHindi: 'रिफाइंड तेल', category: 'oils_ghee', defaultQuantity: 1, unit: 'L', defaultFrequency: 'monthly', perPersonMultiplier: 0.3, commonBrands: ['Fortune', 'Saffola'], sortOrder: 2 },
    { name: 'Desi Ghee', nameHindi: 'देसी घी', category: 'oils_ghee', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Amul', 'Patanjali', 'Gowardhan'], sortOrder: 3 },

    // Salt, Sugar & Essentials
    { name: 'Salt', nameHindi: 'नमक', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.2, commonBrands: ['Tata Salt', 'Catch'], sortOrder: 1 },
    { name: 'Sugar', nameHindi: 'चीनी', category: 'salt_sugar', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: [], sortOrder: 2 },
    { name: 'Jaggery (Gur)', nameHindi: 'गुड़', category: 'salt_sugar', defaultQuantity: 0.5, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.1, commonBrands: [], sortOrder: 3 },

    // Tea & Coffee
    { name: 'Tea (Chai Patti)', nameHindi: 'चाय पत्ती', category: 'tea_coffee', defaultQuantity: 250, unit: 'g', defaultFrequency: 'biweekly', perPersonMultiplier: 50, commonBrands: ['Tata Tea', 'Red Label', 'Wagh Bakri'], sortOrder: 1 },

    // Dairy
    { name: 'Milk', nameHindi: 'दूध', category: 'dairy', defaultQuantity: 1, unit: 'L', defaultFrequency: 'weekly', perPersonMultiplier: 0.5, commonBrands: ['Amul', 'Mother Dairy'], sortOrder: 1 },
    { name: 'Curd (Dahi)', nameHindi: 'दही', category: 'dairy', defaultQuantity: 400, unit: 'g', defaultFrequency: 'weekly', perPersonMultiplier: 100, commonBrands: ['Amul', 'Mother Dairy'], sortOrder: 2 },
    { name: 'Paneer', nameHindi: 'पनीर', category: 'dairy', defaultQuantity: 200, unit: 'g', defaultFrequency: 'weekly', perPersonMultiplier: 50, commonBrands: ['Amul', 'Mother Dairy'], sortOrder: 3 },
    { name: 'Butter', nameHindi: 'मक्खन', category: 'dairy', defaultQuantity: 100, unit: 'g', defaultFrequency: 'biweekly', perPersonMultiplier: 25, commonBrands: ['Amul'], sortOrder: 4 },

    // Pickles & Chutneys
    { name: 'Mango Pickle (Aam ka Achaar)', nameHindi: 'आम का अचार', category: 'pickles_chutneys', defaultQuantity: 200, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: ['Mothers Recipe', 'Priya'], sortOrder: 1 },

    // Dry Fruits
    { name: 'Almonds (Badam)', nameHindi: 'बादाम', category: 'dry_fruits', defaultQuantity: 250, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 50, commonBrands: ['Happilo', 'Nutraj'], sortOrder: 1 },
    { name: 'Cashews (Kaju)', nameHindi: 'काजू', category: 'dry_fruits', defaultQuantity: 250, unit: 'g', defaultFrequency: 'monthly', perPersonMultiplier: 40, commonBrands: ['Happilo'], sortOrder: 2 },

    // Cleaning & Household
    { name: 'Dish Wash Liquid', nameHindi: 'बर्तन धोने का लिक्विड', category: 'cleaning_household', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Vim', 'Pril'], sortOrder: 1 },
    { name: 'Detergent Powder', nameHindi: 'कपड़े धोने का पाउडर', category: 'cleaning_household', defaultQuantity: 1, unit: 'kg', defaultFrequency: 'monthly', perPersonMultiplier: 0.25, commonBrands: ['Surf Excel', 'Tide', 'Ariel'], sortOrder: 2 },
    { name: 'Floor Cleaner', nameHindi: 'फ्लोर क्लीनर', category: 'cleaning_household', defaultQuantity: 500, unit: 'ml', defaultFrequency: 'monthly', perPersonMultiplier: 100, commonBrands: ['Lizol', 'Harpic'], sortOrder: 3 },

    // Personal Care
    { name: 'Soap / Body Wash', nameHindi: 'साबुन', category: 'personal_care', defaultQuantity: 3, unit: 'piece', defaultFrequency: 'monthly', perPersonMultiplier: 1, commonBrands: ['Dove', 'Lux', 'Dettol'], sortOrder: 1 },
    { name: 'Toothpaste', nameHindi: 'टूथपेस्ट', category: 'personal_care', defaultQuantity: 1, unit: 'piece', defaultFrequency: 'monthly', perPersonMultiplier: 0.5, commonBrands: ['Colgate', 'Pepsodent'], sortOrder: 2 },
  ]
};
