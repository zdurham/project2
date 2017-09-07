const express = require('express')
const pug = require('pug')
const bodyParser = require('body-parser')
const path = require('path')


const app = express();
const port = process.env.PORT || 8080;

var db = require('./models');

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/vnd.api+json' }))

app.use(express.static("public"));

require("./routes/routes.js")(app)

db.sequelize.sync({force: true}).then(function() {
  app.listen(port, function() {
    console.log("App listening on PORT: " + port)
  })
})