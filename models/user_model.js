const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

let userSchema = new Schema({
  email:        String,
  facebookid:   String,
  password:     String,
  profile_pic:  String,
  following:    [String],
  followers:    [String],
  username: {
    type: String,
    required: true,
    unique: true
  },
  articles: {
    type: objectId,
    ref: 'Article',
  }
});

module.exports = mongoose.model('user', userSchema);
