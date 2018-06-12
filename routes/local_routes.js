const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const router = require('express').Router();
const User = require('../models/user_model');
const key = require('../key');

router.get('/login', (req, res) => {
  res.render('login', {errors: []});
});

router.post('/signup', (req, res) => {
  // error handling
  let errors = [];
  let is_valid_username = req.body.username.length > 0;
  let is_valid_password = req.body.password.length > 0;
  let is_valid_email    = req.body.email.length > 0;
  
  if (!is_valid_username || !is_valid_password || !is_valid_email) {
      errors.push('Error: all fields must be filled');
  }

  User.findOne({ username: req.body.username }).then((user) => {
    console.log(`user is ${user}`)
    if (user) errors.push('Username already chosen. Please pick another'); 
  }).then(() => {
    if (errors.length) {
      return res.render('signup', {errors,});
    }
    // create new user, save to session
    console.log(`creating user ${req.body.username}`);
    let newuser = new User;
    newuser.username = req.body.username;
    newuser.email = req.body.email;
    newuser.password = bcrypt.hashSync(req.body.password, salt);
    newuser.profile_pic = req.body.profile_pic;
    newuser.followers.push(req.body.username);
    newuser.following.push(req.body.username);
    newuser.save((user) => {
      req.session.user = user;
      res.redirect('/dashboard');
    });
  }).catch((err) => {
    console.log(err); 
  });
});

router.post('/login', (req, res) => {
  // error handling
  let errors = []
  User.findOne({username: req.body.username}).then((user) => {
    if (user && bcrypt.compareSync(req.body.password, user.password) === true) {
      req.session.user= user;
      res.redirect('/dashboard');
    } else {
      errors.push('Authentication failed');
      res.render('login', {errors,});
    }
  }).catch((err) => {
    console.log(`error logging in: ${err}`);
    errors.push('Authentication FAILED'); 
    res.render('login', {errors,})
  });
});

module.exports = router;
