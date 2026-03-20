const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  plan: { type: String, default: 'free' },
  conversionsToday: { type: Number, default: 0 },
  lastConversionDate: String
});

module.exports = mongoose.model('User', UserSchema);