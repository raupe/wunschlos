var url = "http://place2co.de/nodejs/wishlist/"

var wishlistId,
	vip;

$(document).ready(function () {
	wishlistId = location.search.substring(1);
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId,
		type: "GET"
	});
	
	request.done(function (msg) {
		loadWishlist(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});

function loadWishlist(wishlist) {
	vip = wishlist.vip;
	
	for(var i=0; i<wishlist.items.length; i++) {
		
		var item = wishlist.items[i],
			titleHtml = $("#item-" + i),
			amountHtml = $("#price-" + i),
			linkHtml = $("#link-" + i),
			list = titleHtml.parent().closest('.wishlist_wish');
		
		if(item.title) {
			list.append("<input type=\"hidden\" id=\"id-"+i+"\"/>");
			$("#id-"+i).val(item._id);
			
			titleHtml.val(item.title);
			titleHtml.prev().removeClass('wishlist_wish_field_label-hidden');
			if ( !list.hasClass('wishlist_wish-open') ) {
	            list.addClass('wishlist_wish-open');
	            list.find('.js-input').removeAttr('disabled');
          	}
			
			if(item.amount) {
				amountHtml.val(item.amount);
				amountHtml.prev().removeClass('wishlist_wish_field_label-hidden');
			}
			
			if(item.link) {
				linkHtml.val(item.link);
				linkHtml.prev().removeClass('wishlist_wish_field_label-hidden');
			}
			
			createWish();
		}
	}
}

/* Nötige Eingabefelder fehlen, bringt also zur Zeit nichts
function changeWishlist() {
	var changedWishlist = {};
	changedWishlist["title"] = $("#title").val();
	changedWishlist["to"] = $("#user").val();
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId,
		type: "put",
		data: changedWishlist
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
	
	wishlist.title = changedWishlist.title;
	wishlist.to = changedWishlist.to;
}
*/

function addItem(i) {
	var item = {};
	
	item.title = $("#item-" + i).val();
	item.amount = $("#price-" + i).val();
	item.unit = "piece";
	item.link = $("#link-" + i).val();
//	item.idea = itemHtml.children("#idea").val();
	item.position = i;
	item.secret = !vip;
	item.share = [];
	item.comments = [];
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId + "/item",
		type: "post",
		data: item
	});
	
	request.done(function (msg) {
		console.log(msg);
		var list = $("#item-" + i).parent().closest('.wishlist_wish');
		list.append("<input type=\"hidden\" id=\"id-"+i+"\"/>");
		$("#id-"+i).val(msg);
	});
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
}

function changeItem(i) {
	var item = {},
		id = $("#id-"+i).val();
	
	item.title = $("#item-" + i).val();
	item.amount = $("#price-" + i).val();
	item.unit = "piece";
	item.link = $("#link-" + i).val();
//	item.idea = itemHtml.children("#idea").val();
	item.position = i;
	item.secret = !vip;
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId + "/" + id,
		type: "put",
		data: item
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
}