var url = "http://localhost:3000/wishlist";
//var url = "http://place2co.de/nodejs/wishlist/wishlist"

var publicId = "528294ac856e73d825000004";
var id = "52829545f11333241d000005";

//var foo = document.createElement("button");
//foo.innerHTML = "foo";
//foo.addEventListener("click", function(){
//	
//});
//document.body.appendChild(foo);

// ========================================================================================
var button = document.createElement("button");
button.innerHTML = "POST /wishlist";
button.addEventListener("click", function () {
	/*Route: /wishlist
	HTTP Verb: POST*/
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
					price: 20.0,
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

// ========================================================================================
var button2 = document.createElement("button");
button2.innerHTML = "GET /wishlist/" + "publicId";
button2.addEventListener("click", function(){
	/*Route: /wishlist
	HTTP Verb: GET*/
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

// ========================================================================================
var button3 = document.createElement("button");
button3.innerHTML = "PUT /wishlist/" + "id";
button3.addEventListener("click", function(){
	/*Route: /wishlist
	HTTP Verb: GET*/
	var request = $.ajax({
		url: url + "/" + id,
		type: "put",
		data: {
			title: "Updated Title",
			to: "Updated To"
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

// ========================================================================================
var button4 = document.createElement("button");
button4.innerHTML = "PUT /wishlist/" + "id" + "/item";
button4.addEventListener("click", function(){
	/*Route: /wishlist
	HTTP Verb: GET*/
	var request = $.ajax({
		url: url + "/" + id + "/item",
		type: "post",
		data: {
			title: "Rennauto",
			price: "20",
			unit: "€", // €, $, piece (Stück)
			link: "http://ball",
			idea: "Duc",
			position: 1,
			secret: true,
			share: [],
			comments: []
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
