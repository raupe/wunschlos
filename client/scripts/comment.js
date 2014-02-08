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
    tabOffset = 205,
    tabsPerComment = 5;

var wishlistId = 0,
    item = {},
    vip,
    updateWishlist,
    template_comment_STR = "",
    template_commentList_STR = "";

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

    if ( trg.attr('class').indexOf('comment-delete') > -1) {
      $comment = $(trg).closest('.comment_entry');
      var commentId = $comment.attr('id'),
          i = commentId.substring(commentId.lastIndexOf('-')+1);

      $comment.remove();

      commentId = item.comments[i]._id;
      delete item.comments[i];
      CONNECTION.deleteComment(wishlistId, item._id, commentId);
      updateWishlist();

      return;
    }

    if ( trg.attr('class').indexOf('') < -1) {

      return;
    }


});


// if comments-button is hit
var initCommentLightbox = function(itemCurrent, wishlistIdCurrent, vipList, updateCallback){

  item = itemCurrent;
  wishlistId = wishlistIdCurrent;
  updateWishlist = updateCallback;
  vip = vipList;

  $('#comments_lightbox').empty();
  if(template_commentList_STR)
    loadCommentForm();
  else
    getTemplate("partial/template_commentlist.html", function(e) {
      template_commentList_STR = e;
      loadCommentForm();
    });

  $('#comments_lightbox').fadeIn(400);
  $('#comments_lightbox').height($('body').height());

}

function loadCommentForm(){
  var commentForm = parseTemplate(template_commentList_STR, {title: item.title});

  $('#comments_lightbox').append(commentForm);
  $("body").animate({scrollTop:0}, '500');

  if(template_comment_STR)
    setTimeout(loadCommentEntries, 0); // without timeout the comment height isn't stated correctly
  else
    getTemplate("partial/template_comment.html", function(e) {
      template_comment_STR = e;
      loadCommentEntries();
    });
}

function loadCommentEntries(){

  var comments = item.comments,
      commentsLength = comments.length;

  for (i = 0; i < commentsLength; i++) {
    if(comments[i])
      createComment(comments[i], i);
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
}

function createComment(comment, i) {
  //TODO: change tab index
  var commentEntry = parseTemplate(template_comment_STR, { num: i, tab: tabOffset i * tabsPerComment });
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

  if( comment.date ) {
    var $date = $("#comment_date-" + i),
        date = new Date(comment.date),
        now = new Date();

    if(isNaN(date.getTime()))
      $date.text(comment.date);
    else if(now.toDateString() === date.toDateString())
      $date.text(date.toLocaleTimeString());
    else
      $date.text(date.toLocaleDateString());
  }

  if( !vip && !comment.secret ) {
    var $edit = $("#comment_edit-" + i);
    $edit.attr('disabled', '').addClass('invisible');
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
    comment.secret = !vip;
    comment.date = "just now";

    $comment.find('[name="comment_by"]').val('');
    $comment.find('[name="comment"]').val('');

    createComment(comment, item.comments.length-1);
  }

  updateWishlist();
  CONNECTION.editComment(wishlistId, item._id, comment);
}

function cancelEdit($comment) {
  if($comment.attr("id")) { // existing comment
    setCommentStyle_Fixed($comment);
    var commentID = $comment.attr("id"),
        i = commentID.substring(commentID.lastIndexOf('-')+1),
        comment = item.comments[i];

    $comment.find('[name="comment_by"]').val(comment.name);
    $comment.find('[name="comment"]').val(comment.comment);

  } else  { // new comment
      $comment.find('[name="comment_by"]').val('');
      $comment.find('[name="comment"]').val('');
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
