exports.createWishlist = function(req, res){
	
	// Dummy code for now to get started
	var nameOfWishlist = req.body.name;
	console.log(nameOfWishlist);
	res.send(nameOfWishlist + " list created.");
};