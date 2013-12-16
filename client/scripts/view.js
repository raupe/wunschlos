var url = "http://place2co.de/nodejs/wishlist/"

var wishlistId,
	wishlist;

$(document).ready(function () {
	wishlistId = location.search.substring(1);
	$("#addWish").on('click', addItem);
	
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
	vip = wishlist.vip;
	
	for(var i=0; i<wishlist.items.length; i++) {
			
		createWish(i);
		
		var item = wishlist.items[i],
			titleHtml = $("#item-" + i),
			amountHtml = $("#price-" + i),
			linkHtml = $("#link-" + i),
			commentsBut = $("#comments-" + i);
		
		if(item.title) {
			titleHtml.val(item.title);
			titleHtml.prev().removeClass('wishlist_wish_field_label-hidden');
//			if ( !list.hasClass('wishlist_wish-open') ) {
//	            list.addClass('wishlist_wish-open');
//          	}
			
			if(item.amount) {
				amountHtml.val(item.amount);
				amountHtml.prev().removeClass('wishlist_wish_field_label-hidden');
			}
			
			if(item.link) {
				linkHtml.val(item.link);
				linkHtml.prev().removeClass('wishlist_wish_field_label-hidden');
			}
			
			calculateShare(i);
			
			commentsBut.html("Comments (" + item.comments.length + ")");
			var text = "";
			for(var j=0; j<item.comments.length; j++) {
				text += item.comments[j].name + ": "
					+ item.comments[j].comment + "<br/>";
			}
			$("#commentP-" + i).html(text);
			
			initItem(i);
		}
	}
}

function initItem(i) {
	$("#edit-" + i).on('click', editItem);
	$("#cancel-" + i).on('click', cancelEditItem);
	$("#save-" + i).on('click', saveItem);
	$("#delete-" + i).on('click', deleteItem);
	
	$("#share-" + i).on('click', showShare);
	$("#shareBut-" + i).on('click', share);
	$("#comments-" + i).on('click', showComments);
	$("#commentBut-" + i).on('click', comment);
	
	$("#shareDiv-" + i).hide();
	$("#commentDiv-" + i).hide();
}

function calculateShare(i) {
	var shareBut = $("#share-" + i),
		shareP = $("#shareP-" + i),
		item = wishlist.items[i],
		text = "";
		
	if(vip) {
		shareBut.html("Share: ? of " + item.amount + " " + item.unit);
	} else {			
		var shareSum = 0;
		for(var j=0; j<item.shares.length; j++) {
			shareSum += item.shares[j].amount;
			text += item.shares[j].name + ": " + item.shares[j].amount + " " + item.unit + "<br/>";
		}
		shareBut.html("Share: " + shareSum + " " + item.unit + " of " + item.amount + " " + item.unit);
	}
	shareP.html(text);
}

function editItem(e) {
	var wishHtml = $(e.target).closest('.wishlist_wish');
	makeEditable(wishHtml);
}

function cancelEditItem(e) {
	var wishHtml = $(e.target).closest('.wishlist_wish');
	
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1),
		item = wishlist.items[i];
	
	if(! item._id) {
		removeWish(wishHtml);
	} else {
		$("#item-" + i).val(item.title);
		$("#link-" + i).val(item.link);
		$("#price-" + i).val(item.amount);
		makeNotEditable(wishHtml);
	}
}

function saveItem(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1),
		item = wishlist.items[i],
		wishHtml = $(e.target).closest('.wishlist_wish');

	makeNotEditable(wishHtml);
	
	item.title = $("#item-" + i).val();
	item.amount = parseFloat($("#price-" + i).val());
	item.unit = "piece";
	item.link = $("#link-" + i).val();
//	item.idea = itemHtml.children("#idea").val();
//	item.secret = !vip;
	
	var msg = $.extend(true, {}, item);
		
	if(item._id) {
		
		// don't send the whole item:
		delete msg._id;
		delete msg.shares;
		delete msg.comments;
		
		var request = $.ajax({
			url: url + "wishlist/" + wishlistId + "/" + item._id,
			type: "put",
			data: msg
		});
		request.done(function (msg) {
			console.log(msg);
		});
		request.fail(function (jqXHR, textStatus) {
			console.log("failed: " + textStatus);
		});
		
	} else {
		
		delete msg._id;
		
		var request = $.ajax({
			url: url + "wishlist/" + wishlistId + "/item",
			type: "post",
			data: msg
		});
		request.done(function (msg) {
			item._id = msg;
		});
		request.fail(function (jqXHR, textStatus) {
			console.log("failed: " + textStatus);
		});
		
	}
}

function deleteItem(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1),
		item = wishlist.items[i],
		wishHtml = $(e.target).closest('.wishlist_wish');
		
	removeWish(wishHtml);
	delete wishlist.items[i];
	
	var request = $.ajax({
		url: url + "wishlist/" + wishlistId + "/" + item._id,
		type: "delete"
	});
	request.done(function (msg) {
		console.log(msg);
	});
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
}

function addItem() {
	var i = wishlist.items.length;

	createWish(i);
	makeEditable($(".wishlist_wish:last"));
	
	initItem(i);
	
	var item = {};
	item.unit = "piece";
	item.secret = !vip;
	item.shares = [];
	item.comments = [];
	wishlist.items[i] = item;
}

function showShare(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1);
	if($("#shareDiv-" + i).css("display") == "none") {
		$("#shareDiv-" + i).show();
	} else  {
		$("#shareDiv-" + i).hide();
	}
}

function share(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1),
		item = wishlist.items[i],
		share = {};
		
	share.name = $("#shareName-" + i).val();
	share.amount = parseFloat($("#shareAmount-" + i).val());
	share.secret = !vip;
	
	item.shares.push(share);
	calculateShare(i);
	
	if(item._id) {
		var request = $.ajax({
			url: url + "wishlist/" + wishlistId + "/" + item._id + "/share",
			type: "post",
			data: share
		});
		request.done(function (msg) {
			share._id = msg;
		});
		request.fail(function (jqXHR, textStatus) {
			console.log("failed: " + textStatus);
		});
	}
}

function showComments(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1);
	if($("#commentDiv-" + i).css("display") == "none") {
		$("#commentDiv-" + i).show();
	} else  {
		$("#commentDiv-" + i).hide();
	}
}

function comment(e) {
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1),
		item = wishlist.items[i],
		comment = {};
		
	comment.name = $("#commentName-" + i).val();
	comment.comment = $("#commentContent-" + i).val();
	comment.secret = !vip;
	
	item.comments.push(comment);
	
	var text = "";
	for(var j=0; j<item.comments.length; j++) {
		text += item.comments[j].name + ": "
			+ item.comments[j].comment + "<br/>";
	}
	$("#commentP-" + i).html(text);
	
	if(item._id) {
		var request = $.ajax({
			url: url + "wishlist/" + wishlistId + "/" + item._id + "/comment",
			type: "post",
			data: comment
		});
		request.done(function (msg) {
			comment._id = msg;
		});
		request.fail(function (jqXHR, textStatus) {
			console.log("failed: " + textStatus);
		});
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