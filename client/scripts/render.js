/**
 *  Render
 *  ======
 *
 *  Handling client side rendering.
 */

var CACHE = {};

/**
 *  Simple pattern matching + caching for lookups.
 *
 *  @param  {String} str  - String Template
 *  @param  {Object} data - Data Object
 *  @return {String}      - Prepared Template
 */

function parseTemplate ( str, data ) {

  var keys = Object.keys( data ),

      prop = '', pattern = null;

  str = str.trim();

  for ( var i = 0, l = keys.length; i < l; i++ ) {

    prop = keys[i];

    pattern = CACHE[prop] || ( CACHE[prop] = new RegExp('{{' + prop + '(.*?)}}', 'gi') );

    str = str.replace( pattern, interpolate.bind( null, data[prop] ) );
  }

  return str;
}


/**
 *  Replace matches with insertions.
 *
 *  @param  {String|Number} value -
 *  @param  {String}        match -
 *  @param  {String}        group -
 */

function interpolate ( value, match, group ) {

  if ( group ) group = parseFloat(group);

  return value + group;
}


/**
 *  Retrieve a string template from the provided URL.
 *
 *  @param  {String}   url      -
 *  @param  {Function} callback -
 */

function getTemplate ( url, callback ) {

  $.ajax({ type: 'GET', url: url }).always( function ( e ) {

    if ( typeof e == 'object' ) return console.warn( e );

    callback( e );
  });
}
