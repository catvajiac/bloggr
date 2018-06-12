const router = require('express').Router();
const Article = require('../models/article_model');
const User = require('../models/user_model');

router.post('/follower/new', (req, res) => {
  let user = req.session.user || req.user;
  if (!user) {
    return res.redirect('/');
  }

  User.findOne({ username: user.username }).then((user) => {
    user.following.push(req.body.username);
    user.save();
  });
});

module.exports = router;
