require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const GroceryTemplate = require('../models/GroceryTemplate');

const northIndianVeg = require('./templates/north-indian-veg');
const southIndianVeg = require('./templates/south-indian-veg');
const panIndian = require('./templates/pan-indian');

const templates = [northIndianVeg, southIndianVeg, panIndian];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing templates
    await GroceryTemplate.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const created = await GroceryTemplate.insertMany(templates);
    console.log(`Seeded ${created.length} grocery templates:`);
    created.forEach(t => {
      console.log(`  - ${t.name} (${t.items.length} items)`);
    });

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
