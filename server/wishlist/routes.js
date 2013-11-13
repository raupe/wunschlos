// Creating, Getting, Updating wishlist ============================================

exports.createWishlist = function (dbModel, mongoose) {
	
	return function (req, res) {
		
		req.body.publicId = mongoose.Types.ObjectId();
		
		new dbModel(req.body).save(function (err, result) {
			
			res.send({ publicId: req.body.publicId, vipId: result.id});
		});
	};
};

exports.getWishlist = function (dbModel) {
	
	return function (req, res) {
		var wishlistId = req.params.wishlistId;
		
		dbModel.find({ _id: wishlistId }, function (err, result) { // _id
			
			if (result && result[0]) {
				var result = result[0].toJSON();
				result.vip = true;
				res.send(result);
			}
		});
		
		dbModel.find({ publicId: wishlistId }, function (err, result) { // publicId
			
			if (result && result[0]) {
				var result = result[0].toJSON();
				result.vip = false;
				res.send(result);
			} else {
				res.send("wishlist with id: '" + wishlistId + "' not found.");
			}
		});
	};
};

exports.updateWishlist = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId;
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) { // _id
			
			if (!err) {
				if (result !== null) {
					result.to = req.body.to;
					result.title = req.body.title;
					result.save(function () {
						res.send("ok");
					});
				} else {
					dbModel.findOne({publicId: wishlistId}, function (err, result2) { // publicId
						
						if (!err && result2 !== null) {
							result2.to = req.body.to;
							result2.title = req.body.title;
							result2.save(function () {
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

exports.createItem = function (dbModel) {
	
	return function (req, res) {
		var wishlistId = req.params.wishlistId;
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) { // _id
			
			if (!err) {
				if (result !== null) {
					result.items.push(req.body);
					result.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							console.log("saved");
							var idOfLast = result.items[result.items.length - 1]._id;
							res.send(idOfLast);
						}
					});
					
				} else {
					dbModel.findOne({publicId: wishlistId}, function (err, result2) { // publicId
						
						if (!err && result2 !== null) {
							result2.items.push(req.body);
							result2.save(function (err) {
								if (err) {
									console.log(err);
								} else {
									console.log("saved");
									var idOfLast = result.items[result2.items.length - 1]._id;
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

exports.updateItem = function (dbModel) {
	
	return function (req, res) {
		var wishlistId = req.params.wishlistId;
		var itemId = req.params.itemId;
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) { // _id
			
			if (!err) {
				if (result !== null) {
					
					var currentItem,
						i;
					for (i = 0; i < result.items.length; i++) {
						currentItem = result.items[i];
						if (currentItem._id.toString() === itemId) {
							
							if (req.body.title) currentItem.title = req.body.title;
							if (req.body.price) currentItem.price = req.body.price;
							if (req.body.unit) currentItem.unit = req.body.unit;
							if (req.body.link) currentItem.link = req.body.link;
							if (req.body.idea) currentItem.idea = req.body.idea;
							if (req.body.position) currentItem.position = req.body.position;
							if (req.body.secret) currentItem.secret = req.body.secret;
							
							result.save(function () {
								res.send("ok");
							});
							
						}
					}
					
				} else {
					dbModel.findOne({publicId: wishlistId}, function (err, result2) { // publicId
						
						if (!err && result2 !== null) {
							
							var currentItem,
								i;
							for (i = 0; i < result2.items.length; i++) {
								currentItem = result2.items[i];
								if (currentItem._id.toString() === itemId) {
									
									if (req.body.title) currentItem.title = req.body.title;
									if (req.body.price) currentItem.price = req.body.price;
									if (req.body.unit) currentItem.unit = req.body.unit;
									if (req.body.link) currentItem.link = req.body.link;
									if (req.body.idea) currentItem.idea = req.body.idea;
									if (req.body.position) currentItem.position = req.body.position;
									if (req.body.secret) currentItem.secret = req.body.secret;
									
									result2.save(function () {
										res.send("ok");
									});
								}
							}
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