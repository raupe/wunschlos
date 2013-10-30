

$("#wishlist").on('click', '.more', function(){
    
  $(this).parent().css("height","auto");
  
});


$("#wishlist").on('click', '.less', function(){
    
  $(this).parent().css("height","130px");
  
});


$("#add").click(function() {

    $("#wishlist").append($('ul#wishlist li:first').clone()).html();
	
	$('ul#wishlist li:last').find('input').val('');
        
});


$("#wishlist").on('click', '.down', function(){
    
  var item = $(this).parent();

   item.insertAfter(item.next());
  
});


$("#wishlist").on('click', '.up', function(){
   
  var item = $(this).parent();

   item.insertBefore(item.prev());
  
});

 $(function() {
$( "#wishlist" ).sortable();
});