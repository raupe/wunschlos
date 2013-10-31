//var url = "http://localhost:3000/wishlist";
var url = "http://place2co.de/nodejs/wishlist/wishlist"

var request = $.ajax({
	url: url,
	type: "post",
	data: {
		name: "Birthday Party"
	}
});

request.done(function(msg){
	
	console.log(msg);
});

request.fail(function(jqXHR, textStatus){
	
	console.log("failed: " + textStatus);
});