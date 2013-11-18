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
		
		field.children("#id").val(item._id);
		field.children("#item").val(item.title);
		field.children("#price").val(item.amount);
		field.children("#link").val(item.link);
		field.children("#idea").val(item.idea);
	});
}

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

function addItem(i) {
	var item = {};
	var itemHtml = $(".fields:eq("+i+")");
	
	item.title = itemHtml.children("#item").val();
	item.amount = itemHtml.children("#price").val();
	item.unit = "piece";
	item.link = itemHtml.children("#link").val();
	item.idea = itemHtml.children("#idea").val();
	item.position = i;
	item.secret = !wishlist.vip;
	item.share = [];
	item.comments = [];
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId + "/item",
		type: "post",
		data: item
	});
	
	request.done(function (msg) {
		console.log(msg);
		item["_id"] = msg;
		itemHtml.children("#id").val(msg);
		wishlist.items.push(item);
	});
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
}

function changeItem(i) {
	var item = {};
	var itemHtml = $(".fields:eq("+i+")");
	var id = itemHtml.children("#id").val();

	item.title = itemHtml.children("#item").val();
	item.amount = itemHtml.children("#price").val();
	item.unit = "piece";
	item.link = itemHtml.children("#link").val();
	item.idea = itemHtml.children("#idea").val();
	item.position = i;
	item.secret = !wishlist.vip;
	
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