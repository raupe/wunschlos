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
    
    if ( trg.attr('class').indexOf('edit_button-more') > -1) {
      var $wish = $(trg).closest('.wishlist_wish');
      more($wish);
      return;
    }
    
    if ( trg.attr('class').indexOf('edit_button-less') > -1) {
      var $wish = $(trg).closest('.wishlist_wish');
      less($wish);
      return;
    }
    
    if ( trg.attr('class').indexOf('edit_button-delete') > -1) {
      var $wish = $(trg).closest('.wishlist_wish'),
          titleId = $wish.find('[name="item"]').attr('id'),
          i = titleId.substring(titleId.lastIndexOf('-')+1);

      $wish.remove();
      
      if(! creationMode) {
        var itemId = wishlist.items[i]._id;
        delete wishlist.items[i]; // sets to null, so that following entries not get effected

        CONNECTION.deleteWish(wishlistId, itemId);
      }
      
      return;
    }
    
    if ( trg.attr('class').indexOf('edit_button-move-down') > -1) {
      var $wish = $(trg).closest('.wishlist_wish'),
          $nextWish = $wish.next('li:not(:last-child)');
      
      if($nextWish)
        $nextWish.after($wish);
    }
    
    if ( trg.attr('class').indexOf('edit_button-move-up') > -1) {
      var $wish = $(trg).closest('.wishlist_wish'),
          $prevWish = $wish.prev('li');
      
      if($prevWish)
        $prevWish.before($wish);
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
	    location.reload();
	}


/*  $wrap.on('click', function ( e ) {

    var trg = e.target;

    // TODO:
    //
    // handle showing more / less

    if ( trg.classList.contains('js-edit-button') ) {

      console.log(trg);
    }

  });
  */


  function enableMore(){

  }


  function enableLess(){

  }

  var VISIBLE = false;

  $edit = $('.js-edit');

  $wishes.on( transitionEnd, function ( e ) {

    if (creationMode && e.target.classList.contains('wishlist_wish-open') 
        && $('.wishlist_wish:last .js-input:first').val()) {

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
        val       = $current.val(),
        action    = e.type;


    if ( action === 'keypress' && type === 'number' ) {

      var key = e.which;

      if ( key < 48 || key > 57 ) {

        e.preventDefault();
        e.stopPropagation();

        return;
      }
    }


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
  function setup() {
    var query = location.search.substring(1);
    
    if(query) {
      creationMode = false;
      wishlistId = query;
      CONNECTION.requestWishlist(query, loadWishlist);
    } else {
      creationMode = true;
      $( "#wishes" ).sortable({ items : "> li:not(:last-child)" });
      createWish();
    }
  };

  function loadWishlist(param) {
    wishlist = param;
    $('.content_description').first().text(wishlist.title);
    switchDesign(wishlist.design);
    
    for(var i=0; i<wishlist.items.length; i++) {
      var wish = createWish(),
          inputs = wish.find('.js-input');
          buttons = wish.find('.js-edit-buttons');
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
        item.unit = '�';
        item.link = $wish.find('[name="link"]').val();
        item.idea = myName;
        item.secret = secret;
        
        items.push(item);
      }
    });
    
    wishlist.items = items;
    CONNECTION.sendWishlist(wishlist, switchToReceiveMode);
  }
  
  function switchToReceiveMode(vipId, publicId) {
    var id = $('#wishlist-role:checked').val() ? vipId : publicId;
    history.pushState(null, '', window.location + '?' + id);
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
      for ( i = creationMode? 2 : 1, l = buttons.length-2; i < l; i++ ) {
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
      for ( i = 1, l = buttons.length-2; i < l; i++ ) {
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
    switch(activeDesign){
      case 1: // Butterfly
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/butterfly.css" media="screen">');
        break;
      case 2: // Christmas
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/xmas.css" media="screen">');
        if(typeof snow === 'undefined')
          $('body').append('<script src="scripts/snow.js"></script>');        
        else
          snow.init();
        break;
      case 3: // Wedding
        $('link[href$="style/design.css"]').after('<link rel="stylesheet" type="text/css" href="style/love.css" media="screen">');
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

    var num  = wishCount++;

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
  }
  
  function setWishStyle_Editable(wish) {
    wish.find('.js-input').attr('disabled', false);
  }
  
  


  // -------------------------------------------------- //

  /** Template **/

  var CACHE = {};

  /**
   *  Simple pattern matching + caching for lookups.
   *
   *  @param  {[type]} str  [description]
   *  @param  {[type]} data [description]
   *  @return {[type]}      [description]
   */

  function parseTemplate ( str, data ) {

    var keys = Object.keys( data ),

        prop = '', pattern = null, diff = 0;

    str = str.trim();

    for ( var i = 0, l = keys.length; i < l; i++ ) {

      prop = keys[i];

      pattern = CACHE[prop] || ( CACHE[prop] = new RegExp('{{' + prop + '(.*?)}}', 'gi') );

      str = str.replace( pattern, interpolate.bind( null, data[prop] ) );
    }

    return str;
  }


  /**
   *  [interpolate description]
   *
   *  @param  {[type]} value [description]
   *  @param  {[type]} match [description]
   *  @param  {[type]} group [description]
   *  @return {[type]}       [description]
   */

  function interpolate ( value, match, group ) {

    if ( group ) group = parseFloat(group);

    return value + group;
  }


  /**
   *  [getTemplate description]
   *
   *  @param  {[type]}   url      [description]
   *  @param  {Function} callback [description]
   *  @return {[type]}            [description]
   */

  function getTemplate ( url, callback ) {

    $.ajax({ type: 'GET', url: url }).always( function ( e ) {

      if ( typeof e == 'object' ) return console.log( e );

      template_STR = e;

      callback( e );
    });
  }

})();
