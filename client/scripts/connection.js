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
    },
    
    deleteWish : function(wishlistId, itemId) {
      var request = $.ajax({
        url: url + "wishlist/" + wishlistId + "/" + itemId,
        type: "delete"
      });
      
      request.done(function (msg) {
        console.log(msg);
      });
      
      request.fail(function (jqXHR, textStatus) {
        console.log("failed: " + textStatus);
      });
    },
    
    editWish : function(wishlistId, item) {
      var clone = $.extend(true, {}, item);
      if(item._id) {
        // don't send the whole item:
        delete clone._id;
        delete clone.shares;
        delete clone.comments;
        
        var request = $.ajax({
          url: url + "wishlist/" + wishlistId + "/" + item._id,
          type: "put",
          data: clone
        });
        request.done(function (msg) {
          console.log(msg);
        });
        request.fail(function (jqXHR, textStatus) {
          console.log("failed: " + textStatus);
        });
        
      } else {
        delete clone._id;
        var request = $.ajax({
          url: url + "wishlist/" + wishlistId + "/item",
          type: "post",
          data: clone
        });
        request.done(function (msg) {
          item._id = msg;
        });
        request.fail(function (jqXHR, textStatus) {
          console.log("failed: " + textStatus);
        });
        
      }
    }
    
  }
};