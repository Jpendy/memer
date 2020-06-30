const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  top: String,
  image: String,
  bottom: String
});

module.exports = mongoose.model('Meme', schema);
