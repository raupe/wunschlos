function createPublicId ( vipId ) {
	
	var publicId = vipId + "p",
		i,
		publicIdEncoded = "",
		encodedCharCode,
		encodedChar;
	
	for (i = 0; i < publicId.length; i++) {
		encodedCharCode = publicId[i].charCodeAt(0) + 1;
		encodedChar = String.fromCharCode(encodedCharCode);
		publicIdEncoded += encodedChar;
	}
	
	return publicIdEncoded;
}

function createId ( publicId ){
	
	var i,
		vipId = "",
		decodedCharCode,
		decodedChar,
		vipId;

	for (i = 0; i < publicId.length - 1; i++) {
		decodedCharCode = publicId[i].charCodeAt(0) - 1;
		decodedChar = String.fromCharCode(decodedCharCode);
		vipId += decodedChar;
	}
	
	return vipId;
}

function isPublic( urlId ) {
	
	if (urlId.length === 25) {
		return true;
	} else {
		return false;
	}
}

// Creating, Getting, Updating wishlist ============================================

exports.createWishlist = function (dbModel, mongoose) {
	
	return function (req, res) {
		
		new dbModel(req.body).save(function (err, result) {
			
			var publicId = createPublicId(result.id);
			
			res.send({ publicId: publicId, vipId: result.id});
		});
	};
};

exports.getWishlist = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			resultCopy;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({_id: wishlistId}, function(err, result) {
			
			if (!err && result !== null) {
				resultCopy = result.toJSON();
				if (public) {
					resultCopy.vip = false;
				} else {
					resultCopy.vip = true;
				}
				res.send(resultCopy);
			}
		});
	};
};

exports.updateWishlist = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId);
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				result.to = req.body.to;
				result.title = req.body.title;
				result.save(function () {
					res.send("ok");
				});
			} else {
				res.send("error");
			}
		});
	};
};

// Creating, Updating, Deleting item ============================================

exports.createItem = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId);
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
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
				res.send("error");
			}
		});
	};
};

exports.updateItem = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			itemId = req.params.itemId,
			public = isPublic(wishlistId);
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				var currentItem,
					i;
				for (i = 0; i < result.items.length; i++) {
					currentItem = result.items[i];
					if (currentItem._id.toString() === itemId) {
						
						if (req.body.title) currentItem.title = req.body.title;
						if (req.body.amount) currentItem.amount = req.body.amount;
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
				res.send("error");
			}
		});
	};
};