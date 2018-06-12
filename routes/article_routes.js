const router = require('express').Router();
const Article = require('../models/article_model.js');

router.get('/new', (req, res) => {
  res.render('new_article');
});

router.post('/new', (req, res) => {
  console.log(`user ${user} is creating a new post`);
  let user = req.session.user || req.user;
  if (!user) {
    return res.redirect('/');
  }

  let new_article = new Article;
  new_article.title = req.body.title;
  new_article.desc = req.body.desc;
  new_article.image = req.body.image;
  new_article.tags = req.body.tags;
  new_article.author = user._id;
  new_article.save((err, post) => {
    res.redirect('/dashboard'); 
  });
});

module.exports = router;
