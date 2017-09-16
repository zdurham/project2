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
    // To conver the date into something meaningful
    
    db.User.findOne({
      where: {
        id: req.user.id
      },
      include: [{model: db.Post}, {model: db.Comment}, {model: db.Payment}, {model: db.Earning}, {model: db.Cause}]
    }).then(user => {
      res.json(user)
    })
   })
  
  app.get('/about', (req, res)=>{
    res.render("about-us", {user: req.user})
  })

  
  // app.use('/', (req, res) => {
  //   res.redirect('/')
  // })
}

