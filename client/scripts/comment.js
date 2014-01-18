/**
 *  comments
 *  ========
 *
 *  comment functionality is performed in a lightbox
 */
 
 // TO DO: out-comment line 74, for-loop line 77 mit commentsLength rückwärts , add comment, edit comment + CONNECTION, delete comment

 var comment = (function(){

var itemIndex = 0,
    wishlist = {},
	heightExtra = 130,
	$comments_lightbox = $('#comments_lightbox');

  // ------------------------------------------------- //

  
$comments_lightbox.on('click', function( e ){ 
 
	if (e.target.id === "comments_lightbox") {
			$('#comments_lightbox').fadeOut(300);
			$('body').off("click.comments_lightbox_wrap");
		} 
		
    var trg = $(e.target).closest('button');
    if(!trg || !trg.attr('class'))
      return;

    if ( trg.attr('class').indexOf('edit_button-edit') > -1) {
      $comment = $(trg).closest('.comment_entry');
      $comment.find('.comment-edit').removeAttr('disabled').removeClass('invisible');
	  $comment.find('.edit_button-edit').addClass('invisible').attr('disabled');		

      return;
    }	  

  
});

	
// if comments-button is hit
var initCommentLightbox = function(itemIndexCurrent, wishlistCurrent){

	itemIndex = itemIndexCurrent;
	wishlist = wishlistCurrent;

	loadCommentForm();

	$('#comments_lightbox').fadeIn(200);
	$('#comments_lightbox').height($('body').height());

}

function loadCommentForm(){

	$('#comments_lightbox').empty();
	
	getTemplate("partial/template_commentlist.html", function(e) {

		var item = wishlist.items[itemIndex],
		    commentForm = parseTemplate(e, {title: item.title});

		$('#comments_lightbox').append(commentForm);
		$("body").animate({scrollTop:0}, '500');
		loadCommentEntries();
	});
}

function loadCommentEntries(){

	getTemplate("partial/template_comment.html", function(e) {

		var item = wishlist.items[itemIndex],
		    comments = new Array({name: "Berta", comment: "Essen und Trinken"},{name: "Anton", comment: "hallo hallo"}),//item.comments,
			commentsLength = comments.length,
		    commentEntry, commentHTML = e, 
			i, IdIndex = 2 -1;//commentsLength - 1;
			
		for (i = 2-1; i >= 0; i--) {	
		
			commentEntry = parseTemplate(commentHTML, { num: IdIndex, tab: 1 + IdIndex * 2 });
			$('#comments').append(commentEntry);
			
			if( comments[i].name ){
				var $name = $("#comment_by-" + i);
				$name.val(comments[i].name);
			}
			
			if( comments[i].comment ){
				var $comment = $("#comment-" + i);
				$comment.val(comments[i].comment);
				$comment.parents('.comment_entry').height($comment.height() + heightExtra );
			}
			
			IdIndex--;
		}
	});
}

return{
	initCommentLightbox: initCommentLightbox
}

})();