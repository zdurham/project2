const db = require("../models")

// News stuff that the APi requires
const NewsAPI = require('newsapi')
const news = new NewsAPI('5439e9fa2da2484b9bd22fccfd986aab')


module.exports = (app) => {
  
  // Displays the front page and pulls the news 
  app.get('/', (req, res) => {
    news.articles({
      source: 'cnn',
      sortBy: 'top'
    }).then(response => {
      if (req.user) {
        res.render('front', {news: response.articles, user: req.user})
      }
      else {
        res.render('front', {news: response.articles})
      }  
    })
  })

  

  // Display all Users and their related comments and posts
  app.get('/api/users', (req, res) => {
    db.User.findAll({ include: [{model: db.Post}, {model: db.Comment}]}).then(dbUser => {
      res.json(dbUser)
    })
  })
       app.get("/test", (req, res) => {
      res.render("test")
  });
    app.get('/profile', (req, res)=>{
    res.render("dashboard")
  });

  // app.use('/', (req, res) => {
  //   res.redirect('/')
  // })
}

