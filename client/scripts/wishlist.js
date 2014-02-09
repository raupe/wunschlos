/**
 *  Form
 *  ====
 *
 *  A form using the float-pattern and progressive input fields.
 */

(function(){

  $('#design').removeClass('preload');

  // ------------------------------------------------- //

  // values from css file
  var wishTransitionDuration = 2000,
      fieldTransitionDuration = 1000;

  // helper
  var transitionEnd       = getTransitionEnd(),
      supportPlaceholder  = checkPlaceholderSupport();

  // elements
  var $wrap    = $('#wrap'),
      $wishes  = $wrap.find('#wishes'),
      $buttons = $wrap.find('.js-share-button');

  // config
  var template_URL   = 'partial/template.html',
      template_query = 'partial/template_query.html',
      template_STR   = '';

  var wishlist = {},
      wishlistId = 0,
      wishCount = 0,
      creationMode = true;

  var activeDesign = 0;


  var CURRENCIES    = [ '\\$', '€', '£', 'Dollar', 'dollar', 'Euro', 'euro' ],

      PATTERN_PRICE = new RegExp('^(\\d*\[\.,]?\\d+)\\s*(' + CURRENCIES.join('|') + ')?');


  // ------------------------------------------------- //


  var $selection        = $('#selection'),
      $selectionWrap    = $('#selectionWrap'),
      $selectionContent = $('.js-selection-content');




  $wrap.on('click', function( e ){

    var trg = $(e.target).closest('button');
    if(!trg || !trg.attr('class'))
      return;

    if ( trg.attr('class').indexOf('js-share-button') > -1 ) return showSelection();

    var $wish;

    if ( trg.attr('class').indexOf('edit_button-more') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      more($wish);

      return;
    }

    if ( trg.attr('class').indexOf('edit_button-less') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      less($wish);
      return;
    }

    if ( trg.attr('class').indexOf('comments') > -1 ) {
      $wish = $(trg).closest('.wishlist_wish');
      var titleId = $wish.find('[name="item"]').attr('id'),
          i = titleId.substring(titleId.lastIndexOf('-')+1);
      // calling comment.js
      comment.initCommentLightbox(wishlist.items[i], wishlistId, wishlist.vip, updateComments);
      return;
    }

    if ( trg.attr('class').indexOf('edit_button-delete') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      var titleId = $wish.find('[name="item"]').attr('id'),
                i = titleId.substring(titleId.lastIndexOf('-')+1);

      $wish.remove();

      if(! creationMode) {
        var itemId = wishlist.items[i]._id;
        delete wishlist.items[i]; // sets to null, so that following entries not get effected

        CONNECTION.deleteWish(wishlistId, itemId);
      }

      return;
    }

    if ( trg.attr('class').indexOf('donate_button') > -1 ) {
      $wish = $(trg).closest('.wishlist_wish');
      var titleId = $wish.find('[name="item"]').attr('id'),
          i = titleId.substring(titleId.lastIndexOf('-')+1);
      // calling donate.js
      donate.initDonateLightbox(wishlist.items[i], wishlistId, wishlist.vip, updateDonations);
      return;
    }

    if ( trg.attr('class').indexOf('edit_button-edit') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      hideButtons($wish.find('.js-edit-buttons').get(1));
      setWishStyle_Editable($wish);
      return;
    }

    if ( trg.attr('class').indexOf('edit_button-move-down') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      var $nextWish = $wish.next('li:not(:last-child)');

      if($nextWish)
        $nextWish.after($wish);
    }

    if ( trg.attr('class').indexOf('edit_button-move-up') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      var $prevWish = $wish.prev('li');

      if($prevWish)
        $prevWish.before($wish);
    }

    if ( trg.attr('class').indexOf('edit_button-cancel') > -1) {
      $wish = $(trg).closest('.wishlist_wish');
      cancelEdit($wish);
    }

    if ( trg.attr('class').indexOf('edit_button-save') > -1 ) {
      $wish = $(trg).closest('.wishlist_wish');
      saveWish($wish);
    }

    if ( trg.attr('class').indexOf('js-new-button') > -1 ) {
      addNewWish();

    // create space for buttons
    $("#wishes li:last-child").css( "margin-bottom", "5rem" );

    // if snow design is active, its backgroundimage needs to be positioned
    if(activeDesign === 2) positionBackgroundImage();
    }

  });


  function showSelection(){

    if($selection.attr('class').indexOf('selection_wrap-show') == -1) {
      $('html, body').animate({scrollTop: 0}, 1000);
    }

    $selection.addClass('selection_wrap-show');
    $selectionWrap.addClass('selection_overlay-show');
    $selectionContent.addClass('selection_content-show');
  }



  $selectionWrap.on('click', function( e ){

    var trg = $(e.target).closest('button');
    if(!trg || !trg.attr('class'))
      return;

    if ( trg.attr('class').indexOf('selection_form_submit') > -1) {
      sendWishlist();
    }

    if (trg.attr('class').indexOf('gallery_button') > -1) {
      var design = trg.parent().index();

      if(design != activeDesign)
        switchDesign(design);
    }

  });


  // confirm email
  $('#emailButton').click(function(){
    sendLinks();
  });

  $('#email').keypress(function (e) {
    if (e.which == 13) {
      sendLinks();
      return false;
    }
  });

  $('#about_link').click(function(){
    $( "#about_text" ).fadeToggle();
  });


  $('#wishlist-role').on('change', function(e) {
    var isChecked = $(this).prop('checked');

    if ( isChecked ) {
      $('#wishlist-presentee').attr('disabled', '');//.fadeOut();
      $('#wishlist-presentee').parent().css('visibility', 'hidden');
    } else {
      $('#wishlist-presentee').removeAttr('disabled');//.fadeIn();
      $('#wishlist-presentee').parent().css('visibility', 'visible');
    }

  });

  window.onpopstate = function(event) {
    if(event.state && event.state.creationMode !== creationMode)
      location.reload();
  };


  var VISIBLE = false;

  $edit = $('.js-edit');

  $wishes.on( transitionEnd, function ( e ) {

    if (creationMode && e.target.classList.contains('wishlist_wish-open') &&
        $('.wishlist_wish:last .js-input:first').val()) {

      if ( !VISIBLE ) {

        VISIBLE = true;

        $buttons.removeAttr('disabled');
        $buttons.removeClass('invisible');
      }

      $('.edit_position .edit_button').removeAttr('disabled').removeClass('invisible');
      createWish();
    }

  if(activeDesign === 2) positionBackgroundImage();

  });


  $wishes.on('keypress keyup blur focus', 'input, textarea', function ( e ) {

    var $current  = $(e.target),
        $prev     = $current.prev(),
        $parent   = $current.parent(),

        first     = $parent.is(':first-child'),
        item      = $parent.closest('.wishlist_wish'),

        type      = $current.attr('type'),
        val       = $current.val() || $current.text(),
        action    = e.type;


    if ( action === 'keyup' ) {

      if ( val ) {

        $prev.removeClass('wishlist_wish_field_label-hidden');

        if ( first ) {

          more(item);
        }

      } else {

        $prev.addClass('wishlist_wish_field_label-hidden');
      }

    } else if ( action === 'blur' ) { // TODO: wont trigger

      $prev.removeClass('wishlist_wish_field_label-highlight');

    } else if ( action === 'focus' ) {

      $prev.addClass('wishlist_wish_field_label-highlight');
    }

  });


  // -------------------------------------------------- //








  getTemplate( template_URL, setup );


  // Check for creation mode
  function setup( template )  {

    template_STR = template;

    var query = location.search.substring(1);

    if(query) {
      creationMode = false;
      wishlistId = query;
      CONNECTION.requestWishlist(query, loadWishlist);
      var $newButton = $wrap.find('.js-new-button');
      $newButton.removeAttr('disabled');
      $newButton.removeClass('invisible');

    } else {
      creationMode = true;
      $( "#wishes" ).sortable({ items : "> li:not(:last-child)" });
      createWish();
    }
  }

  function sendLinks() {
    var publicLink,
        vipLink;

    if(wishlist.vip) {
      vipLink = window.location.origin + window.location.pathname + '?' + wishlistId;
      publicLink = window.location.origin + window.location.pathname + '?' + localStorage[wishlistId];
    } else {
      vipLink = window.location.origin + window.location.pathname + '?' + localStorage[wishlistId];
      publicLink = window.location.origin + window.location.pathname + '?' + wishlistId;
    }

    CONNECTION.sendLinks($('#email').val(), vipLink, publicLink);
    $('#email').val('');
  }

  function getCollectedSum(item) {
    var sum = 0;
    for(var i=0; i<item.shares.length; i++) {
      if(item.shares[i])
        sum += parseInt( item.shares[i].amount );
    }

    return sum;
  }

  function loadWishlist(param) {
    wishlist = param;

    document.title = ":: Wunschlos :: " + wishlist.title.toUpperCase()
      + " :: " + (wishlist.vip ? "VIP Ansicht" : "Public Ansicht");

    $('.content_description').first().text(wishlist.title).css('font-size','2rem');
    switchDesign(wishlist.design);

    var indexLastVip = -1;

    for(var i=0; i<wishlist.items.length; i++) {
      var wish,
          item = wishlist.items[i];

      if(item.secret) {
        wish = createWish();
      } else {
        indexLastVip++;
        wish = createWish(indexLastVip);
      }

      if(item.title) {
        var $title = $("#item-" + i);
        $title.val(item.title);
        $title.prev().removeClass('wishlist_wish_field_label-hidden');
      }

      if(item.amount) {
        var $amount = $("#price-" + i);
        $amount.val(item.amount + ' ' + item.unit);
        $amount.prev().removeClass('wishlist_wish_field_label-hidden');

        var $sum = $("#sum-" + i);

        updateDonation(i);
      }

      if(item.link) {
        var $link = $("#link-" + i);
        $link.val(item.link);
        $link.prev().removeClass('wishlist_wish_field_label-hidden');
      }

      if(item.description) {
        var $desc = $("#details-" + i);
        $desc.val(item.description);
        $desc.prev().removeClass('wishlist_wish_field_label-hidden');
      }

      var $comments = $("#comments-" + i);
      $comments.text("comments(" + item.comments.length + ")");

      if(!item.secret) {
        wish.addClass('wishlist_wish-presentee');
      }
    }

    if(activeDesign === 2) positionBackgroundImage();

    if(localStorage[wishlistId]) {
      var publicLink,
          vipLink;

      if(wishlist.vip) {
        vipLink = window.location.origin + window.location.pathname + '?' + wishlistId;
        publicLink = window.location.origin + window.location.pathname + '?' + localStorage[wishlistId];
      } else {
        vipLink = window.location.origin + window.location.pathname + '?' + localStorage[wishlistId];
        publicLink = window.location.origin + window.location.pathname + '?' + wishlistId;
      }

      showSelection();
      showLinks(vipLink, publicLink, wishlist.vip);
    }
  }

  function sendWishlist() {
    wishlist = {};
    var items = [],
        myName = $('#wishlist-by').val(),
        secret = ! ($('#wishlist-role:checked').val() ? true : false);

    wishlist.title = $('#wishlist-title').val();
    wishlist.design = activeDesign;
    if(secret)
      wishlist.to = $('#wishlist-presentee').val();
    else
      wishlist.to = myName;

    $(".wishlist_wish").each(function() {
      var $wish = $(this);
      if(! $wish.is(':last-child') ) {

        var item = {},
            price = $wish.find('[name="price"]').val().match(PATTERN_PRICE);

        item.title = $wish.find('[name="item"]').val();
        item.description = $wish.find('[name="details"]').val();
        item.amount  = (price? price[1] || '1' : '1').replace(',', '.');
        item.unit   = price? price[2] || '' : '';
        item.link   = $wish.find('[name="link"]').val();
        item.idea   = myName;
        item.secret = secret;

        items.push(item);
      }
    });

    wishlist.items = items;
    CONNECTION.sendWishlist(wishlist, switchToReceiveMode);
  }

  function saveWish($wish) {
    setWishStyle_Fixed($wish);
    showButtons($wish.find('.js-edit-buttons').get(1));

    var titleId = $wish.find('[name="item"]').attr('id'),
        i = titleId.substring(titleId.lastIndexOf('-')+1),
        item = wishlist.items[i],
        price = $wish.find('[name="price"]').val().match(PATTERN_PRICE);

    item.title = $wish.find('[name="item"]').val();
    item.description = $wish.find('[name="details"]').val();
    item.amount  = (price? price[1] || '1' : '1').replace(',', '.');
    item.unit   = price? price[2] || '' : '';
    item.link = $wish.find('[name="link"]').val();
    item.secret = !wishlist.vip;

    $wish.find('[name="price"]').val(item.amount + ' ' + item.unit);
    updateDonation(i);

    CONNECTION.editWish(wishlistId, item);
  }

  function cancelEdit($wish) {
    setWishStyle_Fixed($wish);
    showButtons($wish.find('.js-edit-buttons').get(1));

    var titleId = $wish.find('[name="item"]').attr('id'),
        i = titleId.substring(titleId.lastIndexOf('-')+1),
        item = wishlist.items[i];

    if(item._id) {
      $wish.find('[name="item"]').val(item.title);
      $wish.find('[name="details"]').val(item.description);
      $wish.find('[name="price"]').val(item.amount + ' ' + item.unit);
      $wish.find('[name="link"]').val(item.link);
    } else {
      $wish.remove();
      delete wishlist.items[i]; // sets to null, so that following entries not get effected
    }
  }

  function addNewWish() {
    var $wish = createWish(),
        item = {};
    item.unit = "€";
    item.secret = !wishlist.vip;
    item.shares = [];
    item.comments = [];
    wishlist.items[wishCount - 1] = item;

    setWishStyle_Editable($wish);
  }

  function switchToReceiveMode(vipId, publicId) {
    var isPresentee = $('#wishlist-role:checked').val(),
        id = isPresentee ? vipId : publicId,
        vipLink = window.location + '?' + vipId,
        publicLink = window.location + '?' + publicId;

    localStorage[vipId] = publicId;
    localStorage[publicId] = vipId;

    history.replaceState({creationMode:true}, '', window.location);
    history.pushState({creationMode:false}, '', window.location + '?' + id);
    wishlistId = id;

    $wishes.empty();
    wishCount = 0;
    creationMode = false;
    CONNECTION.requestWishlist(wishlistId, loadWishlist);

    // disable sortable:
    $buttons.attr('disabled', '');
    $buttons.addClass('invisible');
    $('#wishes').sortable('disable');
    $('#wishes').removeClass('ui-sortable');
    $('#wishes').removeClass('ui-sortable-disabled');

    showLinks(vipLink, publicLink, isPresentee);

    var $newButton = $wrap.find('.js-new-button');
    $newButton.removeAttr('disabled');
    $newButton.removeClass('invisible');
  }

  function showLinks(vipLink, publicLink, isPresentee) {

    $('#prelinks').addClass('invisible');
    $('#postlinks').removeClass('invisible');

    $('#link_private').attr('href', vipLink).text(vipLink);
    $('#link_public').attr( 'href', publicLink).text(publicLink);
    $('#link_private_description').text( isPresentee ? 'you' : 'the presentee' );
    $('#link_lightbox').fadeIn(400);
  }

  $('#link_lightbox').on('click', function ( e ) {
    if ( e.target.id !== 'link_lightbox' ) return;
    $('#link_lightbox').fadeOut(300);
  });


  function showFields ( el , enable) {
    $(el).addClass('wishlist_wish_field-visible');
    if(enable)
      $(el).find('.js-input').removeAttr('disabled');
    $(el).find('.js-button').removeAttr('disabled');
  }

  function hideFields ( el ) {
    $(el).removeClass('wishlist_wish_field-visible');
    $(el).find('.js-input').attr('disabled', '');
    $(el).find('.js-button').attr('disabled', '');
  }

  function showButtons ( el ) {
    $(el).removeAttr('disabled').removeClass('invisible');

  }

  function hideButtons ( el ) {
   $(el).attr('disabled', '').addClass('invisible');
  }

  function hideWish( wish ) {
    if(creationMode){
      wish.removeClass('wishlist_wish-open');
    }else{
      wish.removeClass('wishlist_wish-open_donate');
    }
  }

  function more(wish) {
    if ( (!wish.hasClass('wishlist_wish-open')) || (!wish.hasClass('wishlist_wish-open_donate'))  ) {

      var titleId = wish.find('[name="item"]').attr('id'),
          index = titleId.substring(titleId.lastIndexOf('-')+1);

      // enable fields, disabled by default

      if(creationMode){
        wish.addClass('wishlist_wish-open');
      }else{
        wish.addClass('wishlist_wish-open_donate');
      }

      wish.addClass('wishlist_wish-editable');

      var fields = wish.find('.js-field'),
          editable = !fields.first().find('.js-input').first().attr('disabled'),
          length = creationMode ? 4 : 6;
          interval = wishTransitionDuration / (length - 1);
      for ( var i = 1, l = length; i < l; i++ ) {
        setTimeout( showFields, i * interval, fields.get(i), editable);
      }

      if(activeDesign === 2) {
        var startTime = new Date().getTime();
        var interval = setInterval(function(){
          if(new Date().getTime() - startTime > wishTransitionDuration){
            clearInterval(interval);
            return;
          }
          positionBackgroundImage();

        }, 50);
      }


      var buttons = wish.find('.js-edit-buttons'),
          iStart;

      if(creationMode || editable)
        iStart = 2;
      else if(!wishlist.items[index].secret && !wishlist.vip)
        iStart = 3;
      else
        iStart = 1;

      hideButtons(buttons.get(0));
      var dontShowEdit = creationMode || editable;
      for ( i = iStart, l = 4; i < l; i++ ) {
        setTimeout( showButtons, (i-1) * 1000, buttons.get(i) );
      }

    }
  }

  function less(wish) {
    if ( (wish.hasClass('wishlist_wish-open')) || (wish.hasClass('wishlist_wish-open_donate')) ) {
      setTimeout( hideWish, fieldTransitionDuration, wish);

      var fields = wish.find('.js-field'),
          length = creationMode ? 4 : 6,
          interval = wishTransitionDuration / (length - 1);
      for ( var i = 1, l = length; i < l; i++ ) {
        setTimeout( hideFields, (l-i-1) * interval, fields.get(i) );
      }

      var buttons = wish.find('.js-edit-buttons');
      for ( i = 1, l = 4; i < l; i++ ) {
        setTimeout( hideButtons, (l-i-1) * 1000, buttons.get(i) );
      }
      setTimeout( showButtons, 2000, buttons.get(0) );
    }
  }

  function updateComments() {
    for(var i=0; i<wishlist.items.length; i++) {
      var item = wishlist.items[i];
      if(item) {
        var count = 0;
        for(var j=0; j<item.comments.length; j++) //don't count deleted items;
          if(item.comments[j])
            count++;

        $("#comments-" + i).text("comments(" + count + ")");
      }
    }
  }

  function updateDonation(i) {
    var item = wishlist.items[i];
    if(item) {
      var difference = item.amount - getCollectedSum(item);
//        if(item.amount != 1)
        $("#sum-" + i).val(difference+ " "+item.unit);
      if(difference < 0)
        $("#sum-" + i).val("+ "+(-1)*difference+ " "+item.unit);
    }
  }

  function updateDonations() {
    for(var i=0; i<wishlist.items.length; i++)
      updateDonation(i);
  }

  function switchDesign(design) {
    $('.gallery_button:eq('+activeDesign+')').find('img').removeClass('gallery_entry_image_active');
    $('.gallery_button:eq('+design+')').find('img').addClass('gallery_entry_image_active');

    //TODO: try changing the design without reloading it every time

    //remove old design
    switch(activeDesign){
      case 1: // Butterfly
        $('link[href$="butterfly.css"]').remove();
        break;
      case 2: // Christmas
        $('link[href$="xmas.css"]').remove();
        snow.stop();
        break;
      case 3: // Wedding
        $('link[href$="love.css"]').remove();
        break;
    }

    activeDesign = design;

    // add new design
    switch (activeDesign){
      case 1: // Butterfly
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/themes/butterfly.css" media="screen">');
        break;
      case 2: // Christmas
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/themes/xmas.css" media="screen">');
        if(typeof snow === 'undefined')
          $('body').append('<script src="scripts/snow.js"></script>');
        else
          snow.init();
        break;
      case 3: // Wedding
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/themes/love.css" media="screen">');
        break;
    }

  }

  /**
   *  [createWish description]
   *
   *  @return {[type]} [description]
   */

  var FIELDS = 4;

  function createWish(position){

    position = position === undefined? -1 : position;

    var num  = wishCount++,

        tmpl = parseTemplate( template_STR, { num: num, tab: 1 + num * FIELDS }),

        wish = $( tmpl );

    if ( supportPlaceholder ) {

      wish.find('.js-label').addClass('wishlist_wish_field_label-hidden');
    }

    // TODO:
    //
    // increase container before inserting a new wish: $wishes

    if(position == -1 || position >= $wishes.children().length)
      $wishes.append( wish );
    else
      $($wishes.children()[position]).before(wish);

    var first = wish.find('.js-field').first();

    first.offset();

    first.addClass('wishlist_wish_field-visible');

    if(creationMode) {
      wish.find('.js-input').first().attr('disabled', false);

      var buttons = wish.find('.js-edit-buttons');
      hideButtons(buttons.get(0));
    }

    return wish;
  }

  function setWishStyle_Fixed(wish) {
    wish.find('.js-input').attr('disabled', true);

    wish.find('.edit_button-save').addClass('invisible');
    wish.find('.edit_button-cancel').addClass('invisible');

    wish.css( "margin-bottom", "2rem" );
  }

  function setWishStyle_Editable(wish) {
    wish.find('.js-input').attr('disabled', false);
    wish.find('.wishlist_wish_field_sum').attr('disabled', true);

    wish.find('.edit_button-save').removeClass('invisible');
    wish.find('.edit_button-cancel').removeClass('invisible');

    // create space for buttons
    wish.css( "margin-bottom", "5rem" );
  }


  /**
   *  [getTransitionEnd description]
   *
   *  @return {[type]} [description]
   */
  function getTransitionEnd(){

    var prefix = {

        'WebkitTransition'  : 'webkitTransitionEnd',
        'MozTransition'     : 'transitionend',
        'MSTransition'      : 'msTransitionEnd',
        'OTransition'       : 'oTransitionEnd',
        'transition'        : 'transitionEnd'
      },

      temp = document.createElement('div'),
      keys = Object.keys( prefix ),

      i, l; // iterator

    for ( i = 0, l = keys.length; i < l; i++ ) {

      if ( temp.style[ keys[i] ] !== undefined ) return prefix[ keys[i] ];
    }

    console.log('TransitionEnd - is not supported');
  }


  /**
   *  [checkPlaceholderSupport description]
   *
   *  @return {[type]} [description]
   */
  function checkPlaceholderSupport(){

    var el = document.createElement('input');

    return 'placeholder' in el;
  }

})();
