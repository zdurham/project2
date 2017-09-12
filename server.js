const express = require('express')
const pug = require('pug')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const env = require('dotenv').load();
const passport = require('passport')
const db = require("./models")



const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"));

//---------------------------------------------
// For Passport
//---------------------------------------------
 
app.use(session({ secret: 'totallysecret',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//---------------------------------------------
// Body Parser Code below
//---------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json' }))

//---------------------------------------------
// Passport configuration below
//---------------------------------------------

require("./config/passport.js")(passport, db.User)

//---------------------------------------------
// Routing below
//---------------------------------------------

// News Route


// Post Routes
require('./routes/post-routes.js')(app)

// API Routes
require("./routes/comment-route.js")(app)

// User Routes
require('./routes/user-routes.js')(app)

// Authentication route
require("./routes/auth.js")(app, passport)

// General Routes
require("./routes/routes.js")(app)

require('./routes/news-route.js')(app)
//---------------------------------------------
// Start server code below
//---------------------------------------------

db.sequelize.sync({}).then(function() {
  app.listen(port, function() {
    console.log("App listening on PORT: " + port)
  })
})