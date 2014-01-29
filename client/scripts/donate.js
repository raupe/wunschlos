/**
 *  donate
 *  ========
 *
 *  donate functionality is performed in a lightbox
 */

var donate = (function(){

// const
var heightExtra = 130,
    tabOffset = 3,
    tabsPerComment = 2;

var wishlistId = 0,
    item = {},
    updateWishlist,
    template_comment_STR = "",
    template_commentList_STR = "";

$comments_lightbox = $('#comments_lightbox');

  // ------------------------------------------------- //


$comments_lightbox.on('click', function( e ){

    if ((e.target.id === "comments_lightbox") || ( e.target.id === "close_img_icon") ) {
      $('#comments_lightbox').fadeOut(300);
      $('body').off("click.comments_lightbox_wrap");
    }

    var trg = $(e.target).closest('button');
    if(!trg || !trg.attr('class'))
      return;

    if ( trg.attr('class').indexOf('donate-save') > -1) {
      $donate = $(trg).closest('.donate_entry');
      saveDonation($donate);

      return;
    }

    if ( trg.attr('class').indexOf('donate-edit') > -1) {
      $donate = $(trg).closest('.donate_entry');
      setCommentStyle_Editable($donate);

      return;
    }

    if ( trg.attr('class').indexOf('donate-cancel') > -1) {
      $donate = $(trg).closest('.donate_entry');
      cancelEdit($donate);

      return;
    }

    if ( trg.attr('class').indexOf('donate-delete') > -1) {
      $donate = $(trg).closest('.donate_entry');
      var donateId = $donate.attr('id'),
          i = donateId.substring(donateId.lastIndexOf('-')+1);

      $donate.remove();

      donateId = item.shares[i]._id;

      delete item.shares[i];
      CONNECTION.deleteDonation(wishlistId, item._id, donateId);
	  calculateBar();
      updateWishlist();

      return;
    }

    if ( trg.attr('class').indexOf('') < -1) {

      return;
    }


});


// if shares-button is hit
var initDonateLightbox = function(itemCurrent, wishlistIdCurrent, updateCallback){

  item = itemCurrent;
  wishlistId = wishlistIdCurrent;
  updateWishlist = updateCallback;

  $('#comments_lightbox').empty();
  if(template_commentList_STR)
    loadDonateForm();
  else
    getTemplate("partial/template_donatelist.html", function(e) {
      template_commentList_STR = e;
      loadDonateForm();
    });

  $('#comments_lightbox').fadeIn(200);
  $('#comments_lightbox').height($('body').height());

}

function loadDonateForm(){
  var donateForm = parseTemplate(template_commentList_STR, {title: item.title , unit: item.unit});

  $('#comments_lightbox').append(donateForm);
  $("body").animate({scrollTop:0}, '500');

  if(template_comment_STR)
    setTimeout(loadDonateEntries, 0); // without timeout the donate height isn't stated correctly
  else
    getTemplate("partial/template_donate.html", function(e) {
      template_comment_STR = e;
      loadDonateEntries();
    });
}

function loadDonateEntries(){


	
  var shares = item.shares,
      donateLength = shares.length;

  for (var i = 0; i < donateLength; i++) {
    if(shares[i])
      createDonation(shares[i], i);
  }
  
  calculateBar();
}

  function calculateBar() {
    var sum = 0;
	var openSum = parseInt( item.amount );
	
    for(var i=0; i<item.shares.length; i++) {
      if(item.shares[i])
        sum += parseInt( item.shares[i].amount );
    }
     
	 var barwidthPercentage = sum/openSum;
	 var wrapWidth = $("#bar_wrap_width").width();
	 
	 var barWidth = barwidthPercentage * wrapWidth;
	 $("#price_donate").val(openSum+ " "+item.unit);
	 $("#current_donation").text(sum + " "+item.unit);
	 if(barWidth > 0) $("#inner_bar_width").animate({width:barWidth}, 1000, function(){
		 if(barWidth >= wrapWidth){
			$("#status_donation").text("100% funded").fadeIn(500);
		}else{
			$("#status_donation").text("100% funded").fadeOut(300);
		}
	 });
	
	
  }

function createDonation(donate, i) {

  var donateEntry = parseTemplate(template_comment_STR, { num: i, tab: i * tabsPerComment, unit: item.unit });
  $('.donate_entry:eq(0)').after(donateEntry);

  if( donate.name ){
    var $name = $("#donation_by-" + i);
    $name.val(donate.name);
  }

  if( donate.amount ){
    var $donate = $("#donation-" + i);
    $donate.val(donate.amount);
  }

}

function saveDonation($donate) {

  var donate;
  
   if ($donate.find('[name="donation"]').val() === "" || $donate.find('[name="donation"]').val() <= 0) 
  {
	$donate.find('[name="donation"]').val("").attr("placeholder","number");
    return false;
  }
  
  if($donate.attr("id")) { // existing donate
    setCommentStyle_Fixed($donate);
    var donateId = $donate.attr("id") || "-" + item.shares.length-1,
        i = donateId.substring(donateId.lastIndexOf('-')+1);
    donate = item.shares[i];

    donate.name = $donate.find('[name="donation_by"]').val();
    donate.amount = $donate.find('[name="donation"]').val();

  } else { // new donate
    donate = {}
    item.shares.push(donate);
    donate.name = $donate.find('[name="donation_by"]').val();
    donate.amount = $donate.find('[name="donation"]').val();

    $donate.find('[name="donation_by"]').val('');
    $donate.find('[name="donation"]').val('');
	
    createDonation(donate, item.comments.length-1);
    updateWishlist();
  }

  calculateBar();
  CONNECTION.editDonation(wishlistId, item._id, donate);
}

function cancelEdit($donate) {
  if($donate.attr("id")) { // existing donate
    setCommentStyle_Fixed($donate);
    var donateId = $donate.attr("id"),
        i = donateId.substring(donateId.lastIndexOf('-')+1),
        donate = item.shares[i];

    $donate.find('[name="donation_by"]').val(donate.name);
    $donate.find('[name="donation"]').val(donate.donate);

  } else  { // new donate
      $donate.find('[name="donation_by"]').val('');
      $donate.find('[name="donation"]').val('');
  }
}

function setCommentStyle_Fixed($donate) {
  $donate.find('.js-input').attr('disabled', true);

  $donate.find('.donate-edit').removeAttr('disabled').removeClass('invisible');
  $donate.find('.donate-delete').addClass('invisible').attr('disabled');
  $donate.find('.donate-save').addClass('invisible').attr('disabled');
  $donate.find('.donate-cancel').addClass('invisible').attr('disabled');
}

function setCommentStyle_Editable($donate) {
  $donate.find('.js-input').removeAttr('disabled');

  $donate.find('.donate-edit').addClass('invisible').attr('disabled');
  $donate.find('.donate-delete').removeAttr('disabled').removeClass('invisible');
  $donate.find('.donate-save').removeAttr('disabled').removeClass('invisible');
  $donate.find('.donate-cancel').removeAttr('disabled').removeClass('invisible');
}

return{
  initDonateLightbox: initDonateLightbox
}

})();
