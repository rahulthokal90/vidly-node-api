const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  dob: {
    type: Date
  },
  address: {
    type: String,
    required: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    maxlength: 25
  },
  state: {
    type: String,
    required: true,
    maxlength: 50
  },
  mobile: {
    type: String,
    required: true,
    maxlength: 10
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
