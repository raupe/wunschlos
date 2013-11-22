//*
$("#next").on('click', function(){
    sendWishlist();
});
//*/

var url = "http://place2co.de/nodejs/wishlist/";

function sendWishlist() {
	var wishlist = {};
//	wishlist["title"] = $("#title").val();
//	wishlist["to"] = $("#user").val();

	var items = [];

	var i = 0;
	$(".wishlist_wish_fields").each(function() {
		var item = {};

		if($("#item-"+i).val()) {
			item["title"] = $("#item-"+i).val();
			item["amount"] = parseFloat($("#price-"+i).val());
			item["unit"] = "piece";
			item["link"] = $("#link-"+i).val();
			item["idea"] = $("#idea-"+i).val();
			item["position"] = i;
			item["secret"] = false;

			/*
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
			*/
			
			items.push(item);
			i++;
		}
	});
	wishlist["items"] = items;

//	var str = JSON.stringify(wishlist);  // str ?! =>  || + form templates ?
//	alert(str);

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
