const router = require('express').Router();
const Article = require('../models/article_model');
const User = require('../models/user_model');

router.get('/', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
});

router.get('/login', (req, res) => {
  res.redirect('/auth/login');
});

router.get('/signup', (req, res) => {
  res.render('signup', {errors: []});
});

router.get('/search', (req, res) => {
  res.render('search', {articles: [], errors: []});
});

router.get('/search/:tag', (req, res) => {
  Article.find({tags: req.params.tag}).populate('author', 'username').then((articles) => {
    let errors = []
    if (!articles.length) {
      errors.push('Sorry, no blog posts have that tag :(');
    }
    res.render('search', {articles,errors,}) 
  }).catch((err) => {
    console.log(`unexpected error: ${err}`); 
    res.render('search', {arcules: []});
  });
});

router.get('/dashboard', (req, res) => {
  let errors = [];
  let user = req.session.user || req.user;
  if (!user) {
    return res.redirect('/');
  }

  let user_ids = [];
  User.find({username: { $in: user.following}}).then((users) => {
    users.forEach((u) => {
      user_ids.push(u._id);
    }) 
  }).then(() => {
    Article.find({author: { $in: user_ids }}).populate('author', ['username']).then((articles) => {
      res.render('dashboard', {articles,})
    });
  }).catch((err) => {
    res.redirect('/');
  });
});

router.get('/profile/:username', (req, res) => {
  let user = req.session.user || req.user;
  if (!user) {
    return res.redirect('/');
  }

  let is_following = user.following.includes(req.params.username);
  User.findOne({ username: req.params.username }).then((user) => {
    Article.find({author: user._id}).then((articles) => {
      res.render('profile', {articles, user, is_following});
    }).catch((err) => {
      res.redirect('/dashboard');
    });
  });
});

router.get('/profile', (req, res) => {
  let user = req.session.user || req.user;
  if (!user) {
    return res.redirect('/');
  }

  res.redirect('/profile/' + user.username);
});


module.exports = router;
