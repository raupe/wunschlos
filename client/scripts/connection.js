

$(".next").on('click', function(){
    getJSON();
});


function getJSON() {
	
	var wishlist = {};
	wishlist["title"] = $("#title").val();
	wishlist["user"] = $("#user").val();
	
	var fieldsets = $("fieldset");
	var items = [];
	
	$(".fields").each(function() {
		var item = {};
		
		item["name"] = $(this).children("#item").val();
		item["price"] = $(this).children("#price").val();
		item["link"] = $(this).children("#link").val();
		item["giver"] = $(this).children("#giver").val();
		item["idea"] = $(this).children("#idea").val();
		item["share"] = $(this).children("#share").val();
		item["idea"] = $(this).children("#idea").val();
		item["comment"] = $(this).children("#comment").val();
		
		items.push(item);
	});
	
	wishlist["items"] = items;
	var str = JSON.stringify(wishlist);
	alert(str);
	
}