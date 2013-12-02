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
