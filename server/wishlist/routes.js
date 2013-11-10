exports.createWishlist = function(dbModel) {
	
	return function(req, res) {
		new dbModel(req.body).save(function(err, result) {
			res.send(result.id);
		});
	};
};

exports.getWishlist = function(dbModel) {
	
	return function(req, res) {
		var wishlistId= req.params.wishlistId;
		dbModel.find({ _id: wishlistId }, function(err, result){
			res.send(result[0]);
		});
	};
};
