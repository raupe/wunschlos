var url = "http://place2co.de/nodejs/wishlist/"

var wishlist;
var wishlistId;

$(document).ready(function () {
	wishlistId = location.search.substring(1);
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId,
		type: "GET"
	});
	
	request.done(function (msg) {
		wishlist = msg;
		loadWishlist();
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});

function loadWishlist() {
	$("#title").val(wishlist.title);
	$("#user").val(wishlist.to);
	
	var itemHtml = $('ul#wishlist li:first');
	var first = true;
	
	wishlist.items.forEach(function (item){
		if(first) {
			first = false;
		} else {
			$("#wishlist").append(itemHtml.clone());
		}
		
		var field = $('.fields:last');
		
		field.children("#item").val(item.title);
		field.children("#price").val(item.amount);
		field.children("#link").val(item.link);
		field.children("#idea").val(item.idea);
	});
	
}