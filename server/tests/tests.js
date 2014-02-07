var url = "http://place2co.de/nodejs/wishlist/wishlist"
//var url = "http://localhost:3000/wishlist";

var wishlist = {
	title: "Weihnachten",
	to: "Andre",
	design: 2,
	items: [
		{
			title: "Power Ranger",
			description: "DVD für Andree",
			amount: 20.5,
			unit: "€",
			link: "http://www.amazon.de/Power-Rangers-Der-Film-Turbo/dp/B00DRYZC3Q",
			idea: "Duc",
			position: 0,
			secret: true,
			shares: [
				{
					name: "Duc",
					amount: 10.0,
					secret: false
				}
			],
			comments: [
				{
					name: "Duc",
					comment: "Coole Sache",
					secret: false
				}
			]
		}
	]
};

var item = {
	title: "Ball",
	description: "Für mehr Bewegung in der Natur",
	amount: 1,
	unit: "Stück",
	link: "http://www.amazon.de",
	idea: "Duc",
	position: 1,
	secret: true,
	shares: [
		{
			name: "duc",
			amount: 1,
			secret: true
		}
	],
	comments: [
		{
			name: "duc",
			comment: "grad gekauft",
			secret: true
		}
	]
};

var $output = $('#output'),
	counter = 1;

function test(boolean, name) {
	var cssClass;
	if (boolean) cssClass = true;
	else cssClass = false;
	
	var appendContent = "<div class='" + cssClass + "'>" + counter + ". " + name + "</div>";
	$output.append($(appendContent));
	counter++;
};

var publicId,
	privateId,
	itemId,
	commentId,
	shareId;

async.series([
	function createWishlist(callback) {
		var request = $.ajax({
			url: url,
			type: "post",
			data: wishlist
		});
		
		// wishlist created
		request.done(function(msg) {
			publicId = msg.publicId;
			privateId = msg.vipId;
			test(publicId && privateId, "create wishlist");
			callback(null);
		});
	},
	function getWishlist(callback) {
		var request = $.ajax({
			url: url + "/" + publicId,
			type: "get"
		});
		
		// wishlist received
		request.done(function (msg) {
			
			var sameValues = true;
			if (msg.title !== wishlist.title) sameValues = false;
			if (msg.to !== wishlist.to) sameValues = false;
			if (msg.design !== wishlist.design) sameValues = false;
		
			if (msg.items[0].title !== wishlist.items[0].title) sameValues = false;
			if (msg.items[0].description !== wishlist.items[0].description) sameValues = false;
			if (msg.items[0].amount !== wishlist.items[0].amount) sameValues = false;
			if (msg.items[0].unit !== wishlist.items[0].unit) sameValues = false;
			if (msg.items[0].link !== wishlist.items[0].link) sameValues = false;
			if (msg.items[0].idea !== wishlist.items[0].idea) sameValues = false;
			if (msg.items[0].position !== wishlist.items[0].position) sameValues = false;
			if (msg.items[0].secret !== wishlist.items[0].secret) sameValues = false;
		
			if (msg.items[0].shares[0].name !== wishlist.items[0].shares[0].name) sameValues = false;
			if (msg.items[0].shares[0].amount !== wishlist.items[0].shares[0].amount) sameValues = false;
			if (msg.items[0].shares[0].secret !== wishlist.items[0].shares[0].secret) sameValues = false;
		
			if (msg.items[0].comments[0].name !== wishlist.items[0].comments[0].name) sameValues = false;
			if (msg.items[0].comments[0].comment !== wishlist.items[0].comments[0].comment) sameValues = false;
			if (msg.items[0].comments[0].secret !== wishlist.items[0].comments[0].secret) sameValues = false;
			test(sameValues, "get wishlist: wishlist has correct data");
			callback(null);
		});
	},
	function changeWishlist(callback) {
		var request = $.ajax({
		url: url + "/" + publicId,
		type: "put",
		data: {
				title: "Changed Name",
				to: "Changed To"
			}
		});
		
		request.done(function (msg) {
			test(msg === "ok", "update wishlist: wishlist updated");
			callback(null);
		});
	},
	function checkWishlist(callback) {
		var request = $.ajax({
			url: url + "/" + publicId,
			type: "get"
		});
		
		// Get Wishlist to check if changed correctly
		request.done(function(msg){
			var sameValues = true;
			if (msg.title !== "Changed Name") sameValues = false;
			if (msg.to !== "Changed To") sameValues = false;
			test(sameValues, "update wishlist: data are correct");
			callback(null);
		});
	},
	function addItem(callback) {
		var request = $.ajax({
			url: url + "/" + publicId + "/item",
			type: "post",
			data: item
		});
		
		request.done(function (msg){
			itemId = msg;
			test(msg, "add item: item added");
			callback(null);
		});
	},
	function checkItem(callback) {
		var request = $.ajax({
			url: url + "/" + publicId,
			type: "get"
		});
		
		request.done(function (msg){
			var sameValues = true;
		
			if (msg.items[1].title !== item.title) sameValues = false;
			if (msg.items[1].description !== item.description) sameValues = false;
			if (msg.items[1].amount !== item.amount) sameValues = false;
			if (msg.items[1].unit !== item.unit) sameValues = false;
			if (msg.items[1].link !== item.link) sameValues = false;
			if (msg.items[1].idea !== item.idea) sameValues = false;
			if (msg.items[1].position !== item.position) sameValues = false;
			if (msg.items[1].secret !== item.secret) sameValues = false;
		
			if (msg.items[1].shares[0].name !== item.shares[0].name) sameValues = false;
			if (msg.items[1].shares[0].amount !== item.shares[0].amount) sameValues = false;
			if (msg.items[1].shares[0].secret !== item.shares[0].secret) sameValues = false;
		
			if (msg.items[1].comments[0].name !== item.comments[0].name) sameValues = false;
			if (msg.items[1].comments[0].comment !== item.comments[0].comment) sameValues = false;
			if (msg.items[1].comments[0].secret !== item.comments[0].secret) sameValues = false;
			test(sameValues, "add item: item data are correct");
			callback(null);
		});
	},
	function changeItem(callback) {
		var request = $.ajax({
			url: url + "/" + publicId + "/" + itemId,
			type: "put",
			data: {
				title: "Changed Title",
				description: "Changed Description",
				amount: 2,
				unit: "€",
				link: "http://google.de",
				idea: "Changed Idea",
				position: 3,
				secret: true
			}
		});
		
		request.done(function (msg){
			test(msg === "ok", "update item: item updated");
			callback(null);
		});
	},
	function checkItem(callback) {
		var request = $.ajax({
			url: url + "/" + publicId,
			type: "get"
		});
		
		request.done(function (msg){
			var sameValues = true;
		
			if (msg.items[1].title !== "Changed Title") sameValues = false;
			if (msg.items[1].description !== "Changed Description") sameValues = false;
			if (msg.items[1].amount !== 2) sameValues = false;
			if (msg.items[1].unit !== "€") sameValues = false;
			if (msg.items[1].link !== "http://google.de") sameValues = false;
			if (msg.items[1].idea !== "Changed Idea") sameValues = false;
			if (msg.items[1].position !== 3) sameValues = false;
			if (msg.items[1].secret !== true) sameValues = false;
			
			test(sameValues, "change item: item data are correct");
			callback(null);
		});
	},
    function deleteItem(callback) {
		var request = $.ajax({
			url: url + "/" + publicId + "/" + itemId,
			type: "delete"
		});
		
		request.done(function(msg) {
			test(msg === "deleted", "delete item: item deleted")
			callback(null);
		});
    },
	function checkItemDeleted(callback) {
		var request = $.ajax({
			url: url + "/" + publicId,
			type: "get"
		});
		
		request.done(function(msg) {
			/*
			- length should be one since the wishlist starts with 1 item
			- then a item is added which means length = 2
			- after deletion the length is 1 again
			*/
			test(msg.items.length === 1, "delete item: item length is 1");
			callback(null);
		});
	}
	
])

