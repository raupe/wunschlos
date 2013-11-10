var url = "http://localhost:3000/wishlist";
//var url = "http://place2co.de/nodejs/wishlist/wishlist"

//var foo = document.createElement("button");
//foo.innerHTML = "foo";
//foo.addEventListener("click", function(){
//	
//});
//document.body.appendChild(foo);

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
					share: [
						{
							id: 0,
							name: "Jenny",
							amount: 10.0
    				}
					],
					comments: [
						{
							id: 0,
							name: "Jenny",
							comment: "Coole Sache"
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

var button2 = document.createElement("button");
var id = "528012524523a3601c000010";
button2.innerHTML = "GET /wishlist/" + id;
button2.addEventListener("click", function(){
	/*Route: /wishlist
	HTTP Verb: GET*/
	var request = $.ajax({
		url: url + "/" + id,
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


