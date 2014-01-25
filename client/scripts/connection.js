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
    },

    deleteComment : function(wishlistId, itemId, commentId) {
      var request = $.ajax({
        url: url + "wishlist/" + wishlistId + "/" + itemId + "/comment/"+ commentId,
        type: "delete"
      });

      request.done(function (msg) {
        console.log(msg);
      });

      request.fail(function (jqXHR, textStatus) {
        console.log("failed: " + textStatus);
      });
    },

    editComment : function(wishlistId, itemId, comment) {
      var clone = $.extend(true, {}, comment);
      if(comment._id) {
        // don't send the whole item:
        delete clone._id;

        var request = $.ajax({
          url: url + "wishlist/" + wishlistId + "/" + itemId + "/comment/"+ comment._id,
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
          url: url + "wishlist/" + wishlistId + "/" + itemId + "/comment",
          type: "post",
          data: clone
        });
        request.done(function (msg) {
          comment._id = msg;
        });
        request.fail(function (jqXHR, textStatus) {
          console.log("failed: " + textStatus);
        });

      }
    },

    deleteDonation : function(wishlistId, itemId, donationId) {
      var request = $.ajax({
        url: url + "wishlist/" + wishlistId + "/" + itemId + "/share/"+ donationId,
        type: "delete"
      });

      request.done(function (msg) {
        console.log(msg);
      });

      request.fail(function (jqXHR, textStatus) {
        console.log("failed: " + textStatus);
      });
    },

    editDonation : function(wishlistId, itemId, donation) {
      var clone = $.extend(true, {}, donation);
      if(donation._id) {
        // don't send the whole item:
        delete clone._id;

        var request = $.ajax({
          url: url + "wishlist/" + wishlistId + "/" + itemId + "/share/"+ donation._id,
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
          url: url + "wishlist/" + wishlistId + "/" + itemId + "/share",
          type: "post",
          data: clone
        });
        request.done(function (msg) {
          donation._id = msg;
        });
        request.fail(function (jqXHR, textStatus) {
          console.log("failed: " + textStatus);
        });

      }
    }

  }
};
