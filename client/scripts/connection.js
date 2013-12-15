var CONNECTION = new function() {
  var url = "http://place2co.de/nodejs/wishlist/";
  
  return {
    requestWishlist : function(wishlistId, callback) {
      var request = $.ajax({
        url: url + "wishlist/" + wishlistId,
        type: "GET"
      });
      
      request.done(callback);
    
      request.fail(function (jqXHR, textStatus) {
        console.log("failed: " + textStatus);
      }); 
    },
    
    sendWishlist : function(wishlist, callback) {
      var request = $.ajax({
        url: url + "wishlist",
        type: "post",
        data: wishlist
      });

      request.done(function (msg) {
        callback(msg.vipId, msg.publicId);
      });
      
      request.fail(function (jqXHR, textStatus) {
        console.log("failed: " + textStatus);
      });
    }
    
  }
};