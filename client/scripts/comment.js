/**
 *  comments
 *  ========
 *
 *  comment functionality is performed in a lightbox
 */

 // TO DO: out-comment line 74, for-loop line 77 mit commentsLength r�ckw�rts , add comment, edit comment + CONNECTION, delete comment

var comment = (function(){

// const
var heightExtra = 130,
    tabOffset = 3,
    tabsPerComment = 2;

var wishlistId = 0,
    item = {},
    template_STR;

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

    if ( trg.attr('class').indexOf('comment-save') > -1) {
      $comment = $(trg).closest('.comment_entry');
      saveComment($comment);

      return;
    }

    if ( trg.attr('class').indexOf('comment-edit') > -1) {
      $comment = $(trg).closest('.comment_entry');
      setCommentStyle_Editable($comment);

      return;
    }

    if ( trg.attr('class').indexOf('comment-cancel') > -1) {
      $comment = $(trg).closest('.comment_entry');
      cancelEdit($comment);

      return;
    }

    if ( trg.attr('class').indexOf('comment-delete') < -1) {
      $comment = $(trg).closest('.comment_entry');

      return;
    }

    if ( trg.attr('class').indexOf('') < -1) {

      return;
    }


});


// if comments-button is hit
var initCommentLightbox = function(itemCurrent, wishlistIdCurrent){

  item = itemCurrent;
  wishlistId = wishlistIdCurrent;

  loadCommentForm();

  $('#comments_lightbox').fadeIn(200);
  $('#comments_lightbox').height($('body').height());

}

function loadCommentForm(){

  $('#comments_lightbox').empty();

  getTemplate("partial/template_commentlist.html", function(e) {

    var commentForm = parseTemplate(e, {title: item.title});

    $('#comments_lightbox').append(commentForm);
    $("body").animate({scrollTop:0}, '500');
    loadCommentEntries();
  });
}

function loadCommentEntries(){

  getTemplate("partial/template_comment.html", function(e) {

//    var comments = new Array({name: "Berta", comment: "Essen und Trinken"},{name: "Anton", comment: "hallo hallo"}),
    var comments = item.comments,
        commentsLength = comments.length;
    template_STR = e;

    for (i = 0; i < commentsLength; i++) {
      createComment(comments[i]);
    }

    /*
    for (i = commentsLength-1; i >= 0; i--) {

      commentEntry = parseTemplate(commentHTML, { num: i, tab: tabOffset + (commentsLength - i - 1) * tabsPerComment });
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

    }
    */
  });
}

function createComment(comment) {
  //TODO: change tab index
  var commentEntry = parseTemplate(template_STR, { num: i, tab: i * tabsPerComment });
//  $('#comments').append(commentEntry);
  $('.comment_entry:eq(0)').after(commentEntry);

  if( comment.name ){
    var $name = $("#comment_by-" + i);
    $name.val(comment.name);
  }

  if( comment.comment ){
    var $comment = $("#comment-" + i);
    $comment.val(comment.comment);
    $comment.parents('.comment_entry').height($comment.height() + heightExtra );
  }
}

function saveComment($comment) {
  var comment;
  if($comment.attr("id")) { // existing comment
    setCommentStyle_Fixed($comment);
    var commentId = $comment.attr("id") || "-" + item.comments.length-1,
        i = commentId.substring(commentId.lastIndexOf('-')+1);
    comment = item.comments[i];

    comment.name = $comment.find('[name="comment_by"]').val();
    comment.comment = $comment.find('[name="comment"]').val();

  } else { // new comment
    comment = {}
    item.comments.push(comment);

    comment.name = $comment.find('[name="comment_by"]').val();
    comment.comment = $comment.find('[name="comment"]').val();

    createComment(comment);
  }


  CONNECTION.editComment(wishlistId, item._id, comment);
}

function cancelEdit($comment) {
  setCommentStyle_Fixed($comment);
  var commentID = $comment.attr("id"),
      i = commentID.substring(commentID.lastIndexOf('-')+1),
      comment = item.comments[i];

  if(comment._id) {
    $comment.find('[name="comment_by"]').val(comment.name);
    $comment.find('[name="comment"]').val(comment.comment);
  } else {
    $comment.remove();
    delete item.comments[i];
  }
}

function setCommentStyle_Fixed($comment) {
  $comment.find('.js-input').attr('disabled', true);

  $comment.find('.comment-edit').removeAttr('disabled').removeClass('invisible');
  $comment.find('.comment-delete').addClass('invisible').attr('disabled');
  $comment.find('.comment-save').addClass('invisible').attr('disabled');
  $comment.find('.comment-cancel').addClass('invisible').attr('disabled');
}

function setCommentStyle_Editable($comment) {
  $comment.find('.js-input').removeAttr('disabled');

  $comment.find('.comment-edit').addClass('invisible').attr('disabled');
  $comment.find('.comment-delete').removeAttr('disabled').removeClass('invisible');
  $comment.find('.comment-save').removeAttr('disabled').removeClass('invisible');
  $comment.find('.comment-cancel').removeAttr('disabled').removeClass('invisible');
}

return{
  initCommentLightbox: initCommentLightbox
}

})();
