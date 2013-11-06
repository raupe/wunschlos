exports.createWishlist = function(dbModel) {
	
	return function(req, res) {
		new dbModel(req.body).save(function(err, result) {
			res.send(result.id);
		});
	};
};

exports.getWishlist = function(dbModel) {
	
	return function(req, res) {
		var wishlistId= req.query.id;
		dbModel.find({ _id: wishlistId }, function(err, result){
			res.send(result[0]);
		});
	};
};

// Old testcode with monk

//exports.get = function(db) {
//    return function(req, res) {
//		
//		var collection = db.get('mycollection').find({}, function(err, docs){
//			
//			if (err) {
//                // If it failed, return error
//                res.send("There was a problem adding the information to the database.");
//            }
//            else {
//                // If it worked, forward to success page
////				res.send(JSON.stringify(docs));
//				res.json(docs);
//            }
//		});
//    };
//};
//
//exports.update = function(db) {
//    return function(req, res) {
//		
//		var testobject = {
//			school: {
//				rooms: 23,
//				teachers: 50
//			},
//			children: 200
//		}
//		
//		var collection = db.get('mycollection');
//		collection.findAndModify({_id: "5272c9f7ea6b69ac2cca9789"}, {$set: {age:22, building: testobject} }); // things to change into $set object
//		res.send("updated");
//		res.redirect("/get");
//    };
//};
//
//exports.add = function(db) {
//	return function(req, res) {
//		
//		// Set our collection
//        var collection = db.get('mycollection');
//
//        // Submit to the DB
//        collection.insert({
//            name : "some1",
//            age : 20
//        }, function (err, docs) {
//            if (err) {
//                // If it failed, return error
//                res.send("There was a problem adding the information to the database.");
//            }
//            else {
//                // If it worked, forward to success page
//                res.send("added");
//            }
//        });
//	};
//};