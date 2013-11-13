

$("#wishlist").on('click', '.more', function(){

  $(this).parents('.wishlist_item').css('height', 'auto');
});


$("#wishlist").on('click', '.less', function(){

  $(this).parents('.wishlist_item').css('height', 225 );
});


$("#add").click(function() {

    $("#wishlist").append($('ul#wishlist li:first').clone()).html();

	$('ul#wishlist li:last').find('input').val('');

});


$("#wishlist").on('click', '.down', function(){

  var item = $(this).parents('.wishlist_item');

  item.insertAfter(item.next());

});


$("#wishlist").on('click', '.up', function(){

  var item = $(this).parents('.wishlist_item');

   item.insertBefore(item.prev());

});

 $(function() {
$( "#wishlist" ).sortable();
});
