

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String, required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
