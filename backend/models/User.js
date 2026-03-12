const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const householdSchema = new mongoose.Schema({
  adultsCount: { type: Number, default: 2, min: 1, max: 20 },
  kidsCount: { type: Number, default: 0, min: 0, max: 15 },
  cuisinePreference: {
    type: String,
    enum: ['north_indian', 'south_indian', 'bengali', 'gujarati', 'maharashtrian', 'punjabi', 'rajasthani', 'pan_indian'],
    default: 'pan_indian'
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan'],
    default: 'vegetarian'
  },
  preferredApps: [{
    type: String,
    enum: ['blinkit', 'zepto', 'bigbasket', 'swiggy_instamart', 'jiomart', 'amazon_fresh', 'local_kirana']
  }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  household: { type: householdSchema, default: () => ({}) },
  pantryCheckSchedule: {
    type: String,
    enum: ['weekly', 'biweekly'],
    default: 'weekly'
  },
  pantryCheckDay: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: 'sunday'
  },
  onboardingComplete: { type: Boolean, default: false },
  lastPantryCheck: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
