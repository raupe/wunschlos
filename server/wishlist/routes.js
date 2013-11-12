// Creating, Getting, Updating wishlist ============================================

exports.createWishlist = function(dbModel, mongoose) {
	
	return function(req, res) {
		
		req.body.publicId = mongoose.Types.ObjectId();
		
		new dbModel(req.body).save(function(err, result) {
			res.send(result.id);
		});
	};
};

exports.getWishlist = function(dbModel) {
	
	return function(req, res) {
		var wishlistId= req.params.wishlistId;
		
		dbModel.find({ _id: wishlistId }, function(err, result){ // _id
			
			if (result[0]) {
				var result = result[0].toJSON();
				result.vip = true;
				res.send(result);
			}
		});
		
		dbModel.find({ publicId: wishlistId }, function(err, result){ // publicId
			
			if (result[0]) {
				var result = result[0].toJSON();
				result.vip = false;
				res.send(result);
			}
		});
	};
};

exports.updateWishlist = function(dbModel) {
	
	return function(req, res) {
		
		var wishlistId= req.params.wishlistId;
		
		dbModel.findOne({ _id: wishlistId }, function(err, result){ // _id
			
			if (!err) {
				if (result !== null) {
					result.to = req.body.to;
					result.title = req.body.title;
					result.save(function(){
						res.send("ok");
					});
				} else {
					dbModel.findOne({publicId: wishlistId}, function(err, result2){ // publicId
						
						if (!err && result2 !== null) {
							result2.to = req.body.to;
							result2.title = req.body.title;
							result2.save(function(){
								res.send("ok");
							});
						} else {
							res.send("error");
						}
					});
				}
			} else {
				res.send("error");
			}
		});
	};
};

// Creating, Updating, Deleting item ============================================

exports.createItem = function(dbModel) {
	
	return function(req, res) {
		var wishlistId = req.params.wishlistId;
		
		dbModel.findOne({ _id: wishlistId }, function(err, result){ // _id
			
			if (!err) {
				if (result !== null) {
					result.items.push(req.body);
					result.save(function(err){
						if (err) {
							console.log(err);
						} else {
							console.log("saved");
							var idOfLast = result.items[result.items.length-1]._id;
							res.send(idOfLast);
						}
					});
					
				} else {
					dbModel.findOne({publicId: wishlistId}, function(err, result2){ // publicId
						
						if (!err && result2 !== null) {
							result2.items.push(req.body);
							result2.save(function(err){
								if (err) {
									console.log(err);
								} else {
									console.log("saved");
									var idOfLast = result.items[result2.items.length-1]._id;
									res.send(idOfLast);
								}
							});
						} else {
							res.send("error");
						}
					});
				}
			} else {
				res.send("error");
			}
		});
	};
};