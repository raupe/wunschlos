// load modules
var express = require('express');
var http = require('http');
var path = require('path');

// load own modules
var routes = require('./routes');

// create express app
var app = express();

// Code to allow Cross Origin
// Source: http://stackoverflow.com/questions/18642828/origin-http-localhost3000-is-not-allowed-by-access-control-allow-origin
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*"); // later only allow from wunsch-los.com
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

// app configurations
app.set('port', 3000);
app.use(express.urlencoded()); // use that instead of bodyParser() because bodyParser is deprecated
app.use(express.methodOverride()); // to use app.delete and app.put for better semantic than using post all the time: http://stackoverflow.com/questions/8378338/what-does-connect-js-methodoverride-do
app.use(express.cookieParser('d3(1KIPGKhDqQbYn')); // to use cookies
app.use(express.session()); // to use sessions
app.use(allowCrossDomain); // For CORS, use function declared above
// app.use(app.router); // not really sure what that do, so outcommented

// http://localhost:3000/hi
// http://place2co.de/nodejs/wishlist/hi
// Testroutes
app.get('/hi', function (req, res) {
	console.log(req.query.name);
	res.send("get successfully");
});
app.post('/hi', function (req, res) {
	console.log(req.body.name);
	res.send("post successfully");
});

// Routes
app.post("/wishlist", routes.createWishlist);


// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
