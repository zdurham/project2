var NewsAPI = require('newsapi');

var newsapi = new NewsAPI('5439e9fa2da2484b9bd22fccfd986aab');

module.exports = (app) => {
   app.get('/', function(req, res){
     
     // To query news api articles: 
     newsapi.articles({
       source: 'cnn', // This will define the news source that will be used in the application
       sortBy: 'top' // This will return the top CNN news stories
     }).then(response => {
      console.log(response)

      res.render('front', {news: response.articles, user: req.user})
      //  for(var i=0; i< 3; i++){
      //    //var articlesArray = [];

      //    //Set each news story to newsStory variable and create slider object for each
      //    var newsStories = articlesResponse.articles[i];

      //    //articlesArray.push(newsStories);
      //    console.log(newsStories);
          
      //     res.render('front', {
      //       newsStories: newsStories
      //     }); 
      //   }
     });
   });
     app.get("/test", (req, res) => {
      res.render("test")
  })
   app.get("/", (req, res) => {
    res.render("front")
  })
}
