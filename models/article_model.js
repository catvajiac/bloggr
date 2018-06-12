const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

let articleSchema = new Schema({
  title:  String,
  desc:   String,
  image:  String,
  tags:   [String],
  author: {
    type: objectId,
    ref: 'user',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('article', articleSchema);
