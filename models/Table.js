const mongoose = require('mongoose');
const {genreSchema} = require('./Genre');

const TableSchema = new mongoose.Schema({
  module_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  genre: { 
    type: genreSchema,  
    required: true
  },
  module_desc: {
    type: String,
    required: true,
    maxlength: 100
  },
  upload_count: {
    type: String,
    required: true,
    maxlength: 20
  },
  module_type: {
    type: String,
    required: true,
    maxlength: 20
  },
  hist_count: {
    type: String,
    required: true,
    maxlength: 20
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Table = mongoose.model('table', TableSchema);
