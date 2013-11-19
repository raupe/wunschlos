/**
 *  Form
 *  ====
 *
 *  A form using the float-pattern and progressive input fields.
 */

//(function(){

  // ------------------------------------------------- //

  // helper
  var transitionEnd       = getTransitionEnd(),
      supportPlaceholder  = checkPlaceholderSupport();

  // elements
  var $wrap   = $('#wrap'),
      $wishes = $wrap.find('#wishes');

  // config
  var template_URL = 'partial/template.html',
      template_STR = '';


  // ------------------------------------------------- //


  $wrap.on('click', function ( e ) {

    var trg = e.target;

    if ( trg.nodeName == 'INPUT' ) return;

    var input = $wishes.find(':input').filter( function( i, el ){ return !el.value; });

    if ( !input.length ) return;

    input.get(0).focus();
  });


  $wishes.on( transitionEnd, function ( e ) {

    if ( e.target.classList.contains('wishlist_wish-open')
    	&& $wishes.children()[$wishes.children().length - 1].classList.contains('wishlist_wish-open') ) {

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

          if ( val.indexOf('http://') > -1 ) {

            $prev.text('Link');

          } else {

            $prev.text('Item');
          }

          if ( !item.hasClass('wishlist_wish-open') ) {

            // enable fields, disabled by default
            item.addClass('wishlist_wish-open');

            item.find('.js-input').removeAttr('disabled');
          }
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


  getTemplate( template_URL, createWish );


  /**
   *  [createWish description]
   *
   *  @return {[type]} [description]
   */

  function createWish(){

    var num  = $wishes.children().length,

        tmpl = parseTemplate( template_STR, { num: num, tab: 1 + num * 5 }),  // fields

        wish = $( tmpl );

    if ( supportPlaceholder ) {

      wish.find('.js-label').addClass('wishlist_wish_field_label-hidden');
    }

    $wishes.append( wish );

    var fields = wish.find('.js-field'); fields.offset();

    fields.addClass('wishlist_wish_field-visible');
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


  // -------------------------------------------------- //


  /** Helper **/


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

//})();
