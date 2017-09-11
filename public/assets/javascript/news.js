//Require NewsAPI npm package
var NewsAPI = require('newsapi');
 
var newsapi = new NewsAPI('5439e9fa2da2484b9bd22fccfd986aab');

module.exports = (news) => {
		app.get('/', function(req, res){
			
			// To query news api articles: 
			newsapi.articles({
			  source: 'cnn', // This will define the news source that will be used in the application
			  sortBy: 'top' // This will return the top CNN news stories
			}).then(articlesResponse => {
			  //Test to confirm the news data being returned
			  //console.log(articlesResponse);
			  
			  //Tests to confirm returning news article title, link and image
			  // console.log("First Article Title: " + articlesResponse.articles[0].title);
			  // console.log("First Article CNN Link: " + articlesResponse.articles[0].url);
			  // console.log("First Article CNN Image: " + articlesResponse.articles[0].urlToImage);
			  
			  //Test to confirm returning articles array objects
			  // for (var i=0; i<articlesResponse.articles.length; i++){
			  // 	console.log("Articles Array Objects: " + articlesResponse.articles[i].author);
			  // }

			  // console.log(articlesResponse.articles);

			  // var newsStories = articlesResponse.articles;

			  // res.render("/", {
			  // 		"newsStories": newsStories
			  // });

			  for(var i=0; i<articlesResponse.articles.length; i++){
			  	//var articlesArray = [];

			  	//Set each news story to newsStory variable and create slider object for each
			  	var newsStories = articlesResponse.articles[i];

			  	//articlesArray.push(newsStories);
			  	console.log(newsStories);
			     //Test each news story data object is being returned
			     res.render("header", {
			     	newsStories: newsStories
			     });
			     
			  }

			});
		});
}


// //Unit test to confirm return articles array
// function getArticles(){
// // To query news api articles: 
// 			newsapi.articles({
// 			  source: 'cnn', // This will define the news source that will be used in the application
// 			  sortBy: 'top' // This will return the top CNN news stories
// 			}).then(articlesResponse => {
// 			  //Test to confirm the news data being returned
// 			  //console.log(articlesResponse);
			  
// 			  //Tests to confirm returning news article title, link and image
// 			  // console.log("First Article Title: " + articlesResponse.articles[0].title);
// 			  // console.log("First Article CNN Link: " + articlesResponse.articles[0].url);
// 			  // console.log("First Article CNN Image: " + articlesResponse.articles[0].urlToImage);
			  
// 			  //Test to confirm returning articles array objects
// 			  // for (var i=0; i<articlesResponse.articles.length; i++){
// 			  // 	console.log("Articles Array Objects: " + articlesResponse.articles[i].author);
// 			  // }

// 			  // console.log(articlesResponse.articles);

// 			  // var newsStories = articlesResponse.articles;

// 			  // res.render("/", {
// 			  // 		"newsStories": newsStories
// 			  // });

// 			  for(var i=0; i<articlesResponse.articles.length; i++){
// 			  	//var articlesArray = [];

// 			  	//Set each news story to newsStory variable and create slider object for each
// 			  	var newsStories = articlesResponse.articles[0].urlToImage;

// 			  	//articlesArray.push(newsStories);
// 			  	console.log(newsStories);
// 			     //Test each news story data object is being returned
// 			     // res.render("/", {
// 			     // 	"newsStories": articlesArray
// 			     // });
			     
// 			  }

// 			});
//  }

// getArticles();



