//var url = "http://localhost:3000/wishlist";
var url = "http://place2co.de/nodejs/wishlist/wishlist"

var publicId = "63fdf9e:1b5d79c78111112eq";
var id = "52ece8d90a4c68b67000001d";
var itemId = "52ece8ee0a4c68b670000020";
var shareId = "52ece9180a4c68b670000021";
var commentId = "";

//var foo = document.createElement("button");
//foo.innerHTML = "foo";
//foo.addEventListener("click", function(){
//	
//});
//document.body.appendChild(foo);
console.log(url + "/mail");
var request = $.ajax({
    url: url + "/mail",
    type: "post",
    data: {
      email: "d.ngoviet@gmail.com",
      publicLink: "public id",
      vipLink: "private id"
    }
});
request.done(function (msg) {
    console.log(msg);
});

request.fail(function (jqXHR, textStatus) {
    console.log("failed: " + textStatus);
});

// Wunschliste erstellen
// ========================================================================================
var button = document.createElement("button");
button.innerHTML = "POST /wishlist";
button.addEventListener("click", function () {
	var request = $.ajax({
		url: url,
		type: "post",
		data: {
			title: "Weihnachten",
			to: "Andre",
			items: [
				{
					id: 0,
					title: "Power Ranger",
					amount: 20.5,
					unit: "€",
					link: "http://www.amazon.de/Power-Rangers-Der-Film-Turbo/dp/B00DRYZC3Q",
					idea: "Duc",
					position: 0,
					secret: false,
					share: [
						{
							id: 0,
							name: "Duc",
							amount: 10.0,
							secret: false
    					}
					],
					comments: [
						{
							id: 0,
							name: "Duc",
							comment: "Coole Sache",
							secret: false
    					}
					]
  				}
			]
		}
	});
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button);

// Wunschliste holen
// ========================================================================================
var button2 = document.createElement("button");
button2.innerHTML = "GET /wishlist/" + "publicId";
button2.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + publicId,
		type: "get"
	});
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button2);

// Wunschliste updaten
// ========================================================================================
var button3 = document.createElement("button");
button3.innerHTML = "PUT /wishlist/" + "publicId";
button3.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id,
		type: "put",
		data: {
			title: "Updated id",
			to: "Updated id"
		}
	});
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button3);

// Item erstellen
// ========================================================================================
var button4 = document.createElement("button");
button4.innerHTML = "POST /wishlist/" + "id" + "/item";
button4.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/item",
		type: "post",
		data: {
			title: "Rennauto",
			amount: "20",
			unit: "€", // €, $, piece (Stück)
			link: "http://ball",
			idea: "Duc",
			position: 1,
			secret: true
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button4);

// Item updaten
// ========================================================================================
var button5 = document.createElement("button");
button5.innerHTML = "PUT /wishlist/" + "id" + "/itemId";
button5.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId,
		type: "put",
		data: {
			title: "PUT Rennauto",
			amount: 2000,
			unit: "PUT €", // €, $, piece (Stück)
			link: "PUT http://ball",
			idea: "PUT Duc",
			position: 3,
			secret: true
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button5);

// Item löschen
// ========================================================================================
var button6 = document.createElement("button");
button6.innerHTML = "DELETE /wishlist/" + "id" + "/itemId";
button6.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId,
		type: "delete"
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button6);

// Share erstellen
// ========================================================================================
var button7 = document.createElement("button");
button7.innerHTML = "POST /wishlist/" + "id" + "/itemId/share";
button7.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/share",
		type: "post",
		data: {
			name: "John",
			amount: 10,
			secret: true
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button7);

// Share updaten
// ========================================================================================
var button8 = document.createElement("button");
button8.innerHTML = "PUT /wishlist/" + "id" + "/itemId/share/shareId";
button8.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/share/" + shareId,
		type: "put",
		data: {
			name: "John DOE CHANGED",
			amount: 14,
			secret: false
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button8);

// Share löschen
// ========================================================================================
var button9 = document.createElement("button");
button9.innerHTML = "DELETE /wishlist/" + "id" + "/itemId/share/shareId";
button9.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/share/" + shareId,
		type: "delete"
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button9);

// Kommentar erstellen
// ========================================================================================
var button10 = document.createElement("button");
button10.innerHTML = "POST /wishlist/" + "id" + "/itemId/comment";
button10.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/comment",
		type: "post",
		data: {
			name: "John",
			comment: "Heyho! Coole IDEE",
			secret: true
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button10);

// Kommentar updaten
// ========================================================================================
var button11 = document.createElement("button");
button11.innerHTML = "PUT /wishlist/" + "id" + "/itemId/comment/commentId";
button11.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/comment/" + commentId,
		type: "put",
		data: {
			name: "John DOE CHANGED",
			comment: "Changed Comment",
			secret: false
		}
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button11);

// Kommentar löschen
// ========================================================================================
var button12 = document.createElement("button");
button12.innerHTML = "DELETE /wishlist/" + "id" + "/itemId/comment/commentId";
button12.addEventListener("click", function(){
	var request = $.ajax({
		url: url + "/" + id + "/" + itemId + "/comment/" + commentId,
		type: "delete"
	});
	
	request.done(function (msg) {
		console.log(msg);
	});
	
	request.fail(function (jqXHR, textStatus) {
		console.log("failed: " + textStatus);
	});
});
document.body.appendChild(button12);


