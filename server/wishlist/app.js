// Load modules
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

// Load own modules
var routes = require('./routes');
var schemas = require('./schemas');

// Create express app
var app = express();

// Code to allow Cross Origin
// Source: http://stackoverflow.com/questions/18642828/origin-http-localhost3000-is-not-allowed-by-access-control-allow-origin
var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*"); // later only allow from wunsch-los.com
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
}

// App Configuration and middleware
app.set('port', 3000);
app.use(express.urlencoded()); // use that instead of bodyParser() because bodyParser is deprecated
app.use(express.methodOverride()); // to use app.delete and app.put for better semantic than using post all the time: http://stackoverflow.com/questions/8378338/what-does-connect-js-methodoverride-do
app.use(express.cookieParser('d3(1KIPGKhDqQbYn')); // to use cookies
app.use(express.session()); // to use sessions
app.use(allowCrossDomain); // For CORS, use function declared above
// app.use(app.router); // not really sure what that do, so outcommented

// Database
//mongoose.connect('mongodb://test:testpw@localhost:20883/test'); // online
mongoose.connect('mongodb://localhost:27017/test'); // local
var Schema = mongoose.Schema;
var connection = mongoose.connection;

// define database schemas
var wishlistSchema = new Schema(schemas.wishlist, { versionKey: false });

// define models build from defined schemas
var Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Routes http://localhost:3000/hi and http://place2co.de/nodejs/wishlist/hi
// Testroute
app.get('/hi', function (req, res) {
	//console.log(req.query.name);
	res.send("get successfully");
});

// Routes

// Creating, Getting and Updating wishlist
app.post('/wishlist', routes.createWishlist(Wishlist, mongoose));
app.get('/wishlist/:wishlistId', routes.getWishlist(Wishlist));
app.put('/wishlist/:wishlistId', routes.updateWishlist(Wishlist));

app.post('/wishlist/:wishlistId/item', routes.createItem(Wishlist));


connection.once('error', function() {
	console.log("error: failed to connect to mongodb");
});

connection.once('open', function callback() {
	console.log("DB Connection to mongodb opened");
	
	// Start the server
	http.createServer(app).listen(app.get('port'), function () {
		console.log('Express server listening on port ' + app.get('port'));
	});
});