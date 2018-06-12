const bodyParser  = require('body-parser');
const ejs         = require('ejs');
const express     = require('express');
const session     = require('express-session');
const mongoose    = require('mongoose');
const passport    = require('passport');

const app = express();


// routes
const baseRoutes    = require('./routes/base_routes');
const userRoutes    = require('./routes/user_routes');
const localRoutes   = require('./routes/local_routes');
const articleRoutes = require('./routes/article_routes');

const key = require('./key');

const db = "mongodb://localhost:27017/blog";
const port = process.env.PORT || 3000;


mongoose.connection.on("connected", () => {     
  console.log("Connection Established");
});

mongoose.connection.on("error", (error) => {
  console.log("ERROR: " + error);
});

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: key.session.secret }));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', baseRoutes);
app.use('/auth', localRoutes);
app.use('/article', articleRoutes);
app.use('/user', userRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log(`error ${error}`);
  } else {
    console.log(`listening on port ${port}`);
  }
});
