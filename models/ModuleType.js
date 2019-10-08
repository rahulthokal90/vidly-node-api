//const Joi = require('joi');
const mongoose = require('mongoose');

const ModuleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Genre = mongoose.model('Genre', ModuleTypeSchema);

// function validateGenre(genre) {
//   const schema = {
//     name: Joi.string().required()
//   };

//   return Joi.validate(genre, schema);
// }

exports.genreSchema = ModuleTypeSchema;
exports.Genre = Genre; 