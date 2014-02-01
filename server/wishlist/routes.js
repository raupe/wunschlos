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

exports.createWishlist = function (dbModel) {
	
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
			resultCopy,
			
			itemIndex,
			currentItem,
			
			shareIndex,
			currentShare,
			
			commentIndex,
			currentComment;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({_id: wishlistId}, function(err, result) {
			
			if (!err && result !== null) {
				resultCopy = result.toJSON();
				
				if (public) {
					
					resultCopy.vip = false;
					res.send(resultCopy);
					
				} else {
					
					resultCopy.vip = true;
					for (itemIndex = 0; itemIndex < resultCopy.items.length; itemIndex++) {
						
						currentItem = resultCopy.items[itemIndex];
						
						if (currentItem.secret) {
							
							resultCopy.items.splice(itemIndex, 1);
							
						} else {
							
							for (shareIndex = 0; shareIndex < currentItem.shares.length; shareIndex++) {
								
								currentShare = currentItem.shares[shareIndex];
								
								if (currentShare.secret) {
									
									currentItem.shares.splice(shareIndex, 1);
								}
							}
							
							for (commentIndex = 0; commentIndex < currentItem.comments.length; commentIndex++) {
								
								currentComment = currentItem.comments[commentIndex];
								
								if (currentComment.secret) {
									
									currentItem.comments.splice(commentIndex, 1);
								}
							}
						}
					}
					res.send(resultCopy);
				}
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
					itemFound = false,
					i;
				
				for (i = 0; i < result.items.length; i++) {
					currentItem = result.items[i];
					if (currentItem._id.toString() === itemId) {
						
						if(public && !currentItem.secret)
							continue;
						
						itemFound = true;
						if (req.body.title) currentItem.title = req.body.title;
						if (req.body.description) currentItem.description = req.body.description;
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
				
				if (!itemFound) {
					res.send("error");
				}
			} else {
				res.send("error");
			}
		});
	};
};

exports.deleteItem = function (dbModel) {
	
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
						
						if(public && !currentItem.secret)
							continue;
						
						result.items.splice(i, 1);
						result.save();
						res.send("deleted");
					}
				}
			} else {
				res.send("error");
			}
		});
	};
};

// Creating, Updating, Deleting share ============================================

exports.createShare = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId;
		
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
						result.items[i].shares.push(req.body);
						result.save(function(err, result){
							if (err) {
								console.log(err);
							} else {
								console.log("saved share");
								var shareLength = currentItem.shares.length;
								var idOfLast = currentItem.shares[shareLength - 1]._id;
								res.send(idOfLast);
							}
						});
					}
				}
				
			} else {
				res.send("error");
			}
		});
	};
};

exports.updateShare = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId,
			shareId = req.params.shareId;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				
				var currentItem,
					currentShare,
					i, i2,
					itemFound = false,
					shareFound = false;
				
				for (i = 0; i < result.items.length; i++) {
					
					currentItem = result.items[i];
					
					if (currentItem._id.toString() === itemId) {
						itemFound = true;
						
						for (i2 = 0; i2 < currentItem.shares.length; i2++) {
							
							currentShare = currentItem.shares[i2];
							
							if (currentShare._id.toString() === shareId) {
								
								if (public && !currentShare.secret)
									continue;
									
								shareFound = true;
								
								if (req.body.name) currentShare.name = req.body.name;
								if (req.body.amount) currentShare.amount = req.body.amount;
								if (req.body.secret) currentShare.secret = req.body.secret;
								
								result.save(function(){
									console.log("share updated");
									res.send("ok");
								})
							}
						}
					}
				}
				
				if (shareFound === false || itemFound === false) {
					res.send("error");
				} 
				
			} else {
				res.send("error");
			}
		});
	};
};

exports.deleteShare = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId,
			shareId = req.params.shareId;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				
				var currentItem,
					currentShare,
					i, i2;
				
				for (i = 0; i < result.items.length; i++) {
					
					currentItem = result.items[i];
					
					if (currentItem._id.toString() === itemId) {
						
						for (i2 = 0; i2 < currentItem.shares.length; i2++) {
							
							currentShare = currentItem.shares[i2];
							
							if (currentShare._id.toString() === shareId) {
								
								if (public && !currentShare.secret)
									continue;
								
								currentItem.shares.splice(i2, 1);
								result.save();
								res.send("deleted");
							}
						}
					}
				}
				
			} else {
				res.send("error");
			}
		});
	};
};

// Creating, Updating, Deleting comment ============================================

exports.createComment = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				
				var currentItem,
					i,
                    comment;
				
				for (i = 0; i < result.items.length; i++) {
					
					currentItem = result.items[i];
					if (currentItem._id.toString() === itemId) {
                        comment = req.body;
                        comment.date = new Date().getTime();
                      
						result.items[i].comments.push(comment);
                      
						result.save(function(err, result){
							if (err) {
								console.log(err);
							} else {
								console.log("saved comment");
								var length = currentItem.comments.length;
								var idOfLast = currentItem.comments[length - 1]._id;
								res.send(idOfLast);
							}
						});
					}
				}
				
			} else {
				res.send("error");
			}
		});
	};
};

exports.updateComment = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId,
			commentId = req.params.commentId;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				
				var currentItem,
					currentComment,
					i, i2,
					itemFound = false,
					commentFound = false;
				
				for (i = 0; i < result.items.length; i++) {
					
					currentItem = result.items[i];
					
					if (currentItem._id.toString() === itemId) {
						itemFound = true;
						
						for (i2 = 0; i2 < currentItem.comments.length; i2++) {
							
							currentComment = currentItem.comments[i2];
							
							if (currentComment._id.toString() === commentId) {
								
								if (public && !currentComment.secret)
									continue;
								
								commentFound = true;
								
								if (req.body.name) currentComment.name = req.body.name;
								if (req.body.comment) currentComment.comment = req.body.comment;
								if (req.body.secret) currentComment.secret = req.body.secret;
								
								result.save(function(){
									console.log("comment updated");
									res.send("ok");
								})
							}
						}
					}
				}
				
				if (commentFound === false || itemFound === false) {
					res.send("error");
				} 
				
			} else {
				res.send("error");
			}
		});
	};
};

exports.deleteComment = function (dbModel) {
	
	return function (req, res) {
		
		var wishlistId = req.params.wishlistId,
			public = isPublic(wishlistId),
			itemId = req.params.itemId,
			commentId = req.params.commentId;
		
		if ( public ) {
			wishlistId = createId(wishlistId);
		}
		
		dbModel.findOne({ _id: wishlistId }, function (err, result) {
			
			if (!err && result !== null) {
				
				var currentItem,
					currentComment,
					i, i2;
				
				for (i = 0; i < result.items.length; i++) {
					
					currentItem = result.items[i];
					
					if (currentItem._id.toString() === itemId) {
						
						for (i2 = 0; i2 < currentItem.comments.length; i2++) {
							
							currentComment = currentItem.comments[i2];
							
							if (currentComment._id.toString() === commentId) {
								
								if (public && !currentComment.secret)
									continue;
								
								currentItem.comments.splice(i2, 1);
								result.save();
								res.send("deleted");
							}
						}
					}
				}
				
			} else {
				res.send("error");
			}
		});
	};
};