/**
 *  Form
 *  ====
 *
 *  A form using the float-pattern and progressive input fields.
 */

(function(){

  // ------------------------------------------------- //

  // helper
  var transitionEnd       = getTransitionEnd(),
      supportPlaceholder  = checkPlaceholderSupport();

  // elements
  var $wrap    = $('#wrap'),
      $wishes  = $wrap.find('#wishes'),
      $buttons = $wrap.find('.js-share-button');

  // config
  var template_URL = 'partial/template.html',
      template_STR = '';

  var wishlist = {},
      wishlistId = 0,
      wishCount = 0,
      creationMode = true;

  var activeDesign = 0;

  // ------------------------------------------------- //


  var $selection        = $('#selection'),
      $selectionWrap    = $selection.children().first(),
      $selectionContent = $selectionWrap.children().first().children();

  $wrap.on('click', function( e ){

    var trg = $(e.target).closest('button');
    if(!trg || !trg.attr('class'))
      return;

    if ( trg.attr('class').indexOf('js-share-button') > -1 ) {

      if($selection.attr('class').indexOf('selection_wrap-show') == -1)
        $('html, body').animate({scrollTop: 0}, 1000);

      $selection.toggleClass('selection_wrap-show');

      $selectionWrap.toggleClass('selection_overlay-show');

      $selectionContent.toggleClass('selection_content-show ');

      return;
    }

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
    }
  });

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

  function loadWishlist(param) {
    wishlist = param;
    $('.content_description').first().text(wishlist.title);
    switchDesign(wishlist.design);

    for(var i=0; i<wishlist.items.length; i++) {
      var wish = createWish(),
          inputs = wish.find('.js-input'),
          buttons = wish.find('.js-edit-buttons'),
          item = wishlist.items[i];

      if(item.title) {
        var $title = $("#item-" + i);
        $title.val(item.title);
        $title.prev().removeClass('wishlist_wish_field_label-hidden');
      }

      if(item.amount) {
        var $amount = $("#price-" + i);
        $amount.val(item.amount);
        $amount.prev().removeClass('wishlist_wish_field_label-hidden');
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
    }
  }

  function sendWishlist() {
    wishlist = {};
    var items = [],
        myName = $('#wishlist-by').val(),
        secret = $('#wishlist-role:checked').val() ? true : false;

    wishlist.title = $('#wishlist-title').val();
    wishlist.design = activeDesign;
    if(secret)
      wishlist.to = myName;
    else
      wishlist.to = $('#wishlist-presentee').val();

    $(".wishlist_wish").each(function() {
      var $wish = $(this);
      if(! $wish.is(':last-child') ) {
        var item = {};
        item.title = $wish.find('[name="item"]').val();
        item.description = $wish.find('[name="details"]').val();
        item.amount = $wish.find('[name="price"]').val();
        item.unit = '€';
        item.link = $wish.find('[name="link"]').val();
        item.idea = myName;
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
        item = wishlist.items[i];

    item.title = $wish.find('[name="item"]').val();
    item.description = $wish.find('[name="details"]').val();
    item.amount = $wish.find('[name="price"]').val();
    item.unit = '€';
    item.link = $wish.find('[name="link"]').val();
    item.secret = !wishlist.vip;

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
      $wish.find('[name="price"]').val(item.amount);
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

    setWishStyle_Editable($wish, true);
  }

  function switchToReceiveMode(vipId, publicId) {
    console.log('vip:' + vipId);
    console.log('public:' + publicId);
    var id = $('#wishlist-role:checked').val() ? vipId : publicId;
    history.replaceState({creationMode:true}, '', window.location);
    history.pushState({creationMode:false}, '', window.location + '?' + id);
    wishlistId = id;

    $wishes.empty();
    wishCount = 0;
    // disable sortable:
    $buttons.attr('disabled', '');
    $buttons.addClass('invisible');
    $('#wishes').sortable('disable');
    $('#wishes').removeClass('ui-sortable');
    $('#wishes').removeClass('ui-sortable-disabled');
    // remove wihlist options:
    $selection.removeClass('selection_wrap-show');
    $selectionWrap.removeClass('selection_overlay-show');
    $selectionContent.removeClass('selection_content-show ');

    var $newButton = $wrap.find('.js-new-button');
    $newButton.removeAttr('disabled');
    $newButton.removeClass('invisible');

    creationMode = false;
    loadWishlist(wishlist);
  }

  function showFields ( el ) {
    $(el).parent().addClass('wishlist_wish_field-visible');
    if(creationMode)
      $(el).removeAttr('disabled');
  }

  function hideFields ( el ) {
    $(el).parent().removeClass('wishlist_wish_field-visible');
    $(el).attr('disabled');
  }

  function showButtons ( el ) {
    $(el).removeAttr('disabled').removeClass('invisible');
  }

  function hideButtons ( el ) {
   $(el).attr('disabled', '').addClass('invisible');
  }

  function hideWish( wish ) {
    wish.removeClass('wishlist_wish-open');
  }

  function more(wish) {
    if ( !wish.hasClass('wishlist_wish-open') ) {

      // enable fields, disabled by default
      wish.addClass('wishlist_wish-open');
      wish.addClass('wishlist_wish-editable');

      var inputs = wish.find('.js-input');
      for ( var i = 1, l = inputs.length; i < l; i++ ) {
        setTimeout( showFields, i * 500, inputs.get(i) );
      }

      var buttons = wish.find('.js-edit-buttons');
      hideButtons(buttons.get(0));
      var dontShowEdit = creationMode || !inputs.first().attr('disabled');
      for ( i = dontShowEdit? 2 : 1, l = 4; i < l; i++ ) {
        setTimeout( showButtons, (i-1) * 1000, buttons.get(i) );
      }

    }
  }

  function less(wish) {
    if ( wish.hasClass('wishlist_wish-open') ) {
      setTimeout( hideWish, 500, wish );

      var inputs = wish.find('.js-input');
      for ( var i = 1, l = inputs.length; i < l; i++ ) {
        setTimeout( hideFields, (l-i-1) * 500, inputs.get(i) );
      }

      var buttons = wish.find('.js-edit-buttons');
      for ( i = 1, l = 4; i < l; i++ ) {
        setTimeout( hideButtons, (l-i-1) * 1000, buttons.get(i) );
      }
      setTimeout( showButtons, 2000, buttons.get(0) );
    }
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

  function createWish(){

    var num  = wishCount++,

        tmpl = parseTemplate( template_STR, { num: num, tab: 1 + num * FIELDS }),

        wish = $( tmpl );

    if ( supportPlaceholder ) {

      wish.find('.js-label').addClass('wishlist_wish_field_label-hidden');
    }

    // TODO:
    //
    // increase container before inserting a new wish: $wishes

    $wishes.append( wish );

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
  }

  function setWishStyle_Editable(wish, creation) {
    wish.find('.js-input').attr('disabled', false);

    //if ( creation ) return; // prevent showing on new creation

    wish.find('.edit_button-save').removeClass('invisible');
    wish.find('.edit_button-cancel').removeClass('invisible');
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
