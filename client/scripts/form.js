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


  // ------------------------------------------------- //

  
   $wrap.on('click', function( e ){
   
		var trg = e.target;
    // TODO:
    //
    // handle showing more / less
 
		if ( trg.parentNode.className.split(' ').indexOf('js-edit-buttons') > -1) {

		  console.log(trg);
		}
	});

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


	 $(function() {
	 
		$( "#wishes" ).sortable();
	});




  var VISIBLE = false;

  $wishes.on( transitionEnd, function ( e ) {

    if ( e.target.classList.contains('wishlist_wish-open') ) {

      if ( !VISIBLE ) {

        VISIBLE = true;

        $buttons.removeAttr('disabled');
        $buttons.removeClass('invisible');
      }

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

          if ( !item.hasClass('wishlist_wish-open') ) {

            // enable fields, disabled by default
            item.addClass('wishlist_wish-open');

            var inputs = item.find('.js-input');

            for ( var i = 0, l = inputs.length; i < l; i++ ) {

              setTimeout( showFields, i * 500, inputs.get(i) );
            }


            var buttons = item.find('.js-edit-buttons');

            $(buttons.get(0)).addClass('invisible');

            for ( i = 1, l = buttons.length; i < l; i++ ) {

              setTimeout( showButtons, i * 1000, buttons.get(i) );
            }

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


  function showFields ( el ) {

    $(el).removeAttr('disabled').parent().addClass('wishlist_wish_field-visible');
  }


  function showButtons ( el ) {

    $(el).removeClass('invisible');
  }






  // -------------------------------------------------- //


  getTemplate( template_URL, createWish );


  /**
   *  [createWish description]
   *
   *  @return {[type]} [description]
   */

  var FIELDS = 4;

  function createWish(){

    var num  = $wishes.children().length,

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
