var online = false;

// Load database credentials
var credentials = require('./credentials');

// Load modules
var express = require('express');
var http = require('http');
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
app.use(allowCrossDomain); // For CORS, use function declared above

// define database schemas
var Schema = mongoose.Schema;
var wishlistSchema = new Schema(schemas.wishlist, { versionKey: false });

// define models build from defined schemas
var Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Connect to database
var connection = mongoose.connection;

if (online) {
	mongoose.connect('mongodb://' + credentials.user + ':' + credentials.pw + '@localhost:20883/wunsch-los'); // online
} else {
	mongoose.connect('mongodb://localhost:27017/test'); // local
}

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

// Routes http://localhost:3000/hi and http://place2co.de/nodejs/wishlist/hi
// Testroute
app.get('/hi', function (req, res) {
	//console.log(req.query.name);
	res.send("get successfully");
});

// Routes
// Creating, Getting and Updating wishlist
app.post('/wishlist', routes.createWishlist(Wishlist));
app.get('/wishlist/:wishlistId', routes.getWishlist(Wishlist));
app.put('/wishlist/:wishlistId', routes.updateWishlist(Wishlist));

// Creating, Updating, Deleting item 
app.post('/wishlist/:wishlistId/item', routes.createItem(Wishlist));
app.put('/wishlist/:wishlistId/:itemId', routes.updateItem(Wishlist));
app.delete('/wishlist/:wishlistId/:itemId', routes.deleteItem(Wishlist));

// Creating, Updating, Deleting share
app.post('/wishlist/:wishlistId/:itemId/share', routes.createShare(Wishlist));
app.put('/wishlist/:wishlistId/:itemId/share/:shareId', routes.updateShare(Wishlist));
app.delete('/wishlist/:wishlistId/:itemId/share/:shareId', routes.deleteShare(Wishlist));

// Creating, Updating, Deleting comment
app.post('/wishlist/:wishlistId/:itemId/comment', routes.createComment(Wishlist));
app.put('/wishlist/:wishlistId/:itemId/comment/:commentId', routes.updateComment(Wishlist));
app.delete('/wishlist/:wishlistId/:itemId/comment/:commentId', routes.deleteComment(Wishlist));

