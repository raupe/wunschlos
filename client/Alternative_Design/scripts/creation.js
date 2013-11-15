//*
$("#next").on('click', function(){
    sendWishlist();
});
//*/

var url = "http://place2co.de/nodejs/wishlist/";

function sendWishlist() {
	var wishlist = {};
	wishlist["title"] = $("#title").val();
	wishlist["to"] = $("#user").val();

	var items = [];

	var pos = 0;
	$(".fields").each(function() {
		var item = {};

		if($(this).children("#item").val()) {
			item["title"] = $(this).children("#item").val();
			item["amount"] = parseFloat($(this).children("#price").val());
			item["unit"] = "piece";
			item["link"] = $(this).children("#link").val();
			item["idea"] = $(this).children("#idea").val();
			item["position"] = pos;
			item["secret"] = false;

			var shares = [];
			if($(this).children("#share").val()) {
				var share = {};
				share["name"] = $(this).children("#giver").val();
				share["amount"] = parseFloat($(this).children("#share").val());
				share["secret"] = false;
				shares.push(share);
			}
			item["share"] = shares;

			var comments = [];
			if($(this).children("#comment").val()) {
				var comment = {};
				comment["name"] = "Ich";
				comment["comment"] = $(this).children("#comment").val();
				comment["secret"] = false;
				comments.push(comment);
			}
			item["comments"] = comments;
		}

		items.push(item);
		pos++;
	});
	wishlist["items"] = items;

	var str = JSON.stringify(wishlist);  // str ?! =>  || + form templates ?

	var request = $.ajax({
		url: url + "wishlist",
		type: "post",
		data: wishlist
	});

	request.done(function (msg) {
		console.log(msg);
	});
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
}
