//var url = "http://localhost:3000/wishlist";
var url = "http://place2co.de/nodejs/wishlist/wishlist"

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

/*Route: /wishlist
HTTP Verb: GET*/
//var request = $.ajax({
//	url: url,
//	type: "get",
//	data: {
//		id: '527ab38f3c570bb421000004'
//	}
//});


















request.done(function (msg) {

	console.log(msg);
});

request.fail(function (jqXHR, textStatus) {

	console.log("failed: " + textStatus);
});