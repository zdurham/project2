var express = require('express');
//var materialize = require('materialize-css');

var app = express();

app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.get('/', function (req, res){
	res.render('index2', {title: 'Mom it\'s broken', message: 'this is a temp message'});
});

app.listen(3000, function(){
	console.log('we are listening on port 3000');
});