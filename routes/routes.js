const db = require("../models")

// This is necessary for the news api content to be rendered
// properly on the front page
const NewsAPI = require('newsapi')
const news = new NewsAPI('5439e9fa2da2484b9bd22fccfd986aab')


module.exports = (app) => {
  
  // These routes do not require any sort of authentication

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
  
  // Displays about page
  app.get('/about', (req, res)=>{
    res.render("about-us", {user: req.user})
  })
}

