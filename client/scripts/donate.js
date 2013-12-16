// ?52adc3a008a1809c0e000013

var TEMPLATECACHE = {};

function createSingleShare(name, amount, unit) {
	var shareString = 
		'<li class="clearfix">'
+			'<div class="left">'
+				'<label>Name</label>'
+				'<input class="name_input" type="text" name="name" value="' + name + '" disabled>'
+			'</div>'
			
+			'<span class="left">:</span>'
			
+			'<div class="left">'
+				'<label>Donation</label>'
+				'<input class="donation_input" type="text" name="donation" value="' + amount + ' ' + unit + '" disabled>'
+			'</div>'
			
+			'<button class="left edit_button">edit</button>'
+		'</li>';
	return shareString;
}

function createEditButtons() {
	var htmlString = 
	'<div class="edit_buttons">'
+		'<button>cancel</button>'
+		'<button>save changes</button>'
+	'</div>';
	return htmlString;
}

function createShareTemplates() {
	var shares = wishlist.items[itemIndex].shares,
		currentShare,
		currentAmount,
		i;
	
	for (i = 0; i < shares.length; i++) {
		currentShare = shares[shareIndex];
		currentAmount += currentShare.amount;
		shareTemplates += createSingleShare(currentShare.name, currentAmount, item.unit);
	}
}

function createShareLightbox( donateTemplate, itemIndex ) {
	
	var parsedTemplate,	template,
		item = wishlist.items[itemIndex],
		shares = item.shares,
		i, currentAmount = 0, currentShare,
		donationPercentage,
		shareTemplatesString = "",
		shareTemplates,
		ul, donateButton;
	
	
	for (i = 0; i < shares.length; i++) {
		currentShare = shares[i];
		currentAmount += currentShare.amount;
		shareTemplatesString += createSingleShare(currentShare.name, currentShare.amount, item.unit);
	}
	
	donationPercentage = ~~((currentAmount / item.amount) * 100);
	
	parsedTemplate = parseTemplate(donateTemplate, {title: item.title, price: item.amount + " " + item.unit, currentAmount: currentAmount + " " + item.unit});
	template = $(parsedTemplate);
	
	donateButton = template.find("#donateButton");
	
	donateButton.on("click", function() {
		var share = {};
		share.name = template.find("input[name=name]")[0].value,
		share.amount = template.find("input[name=donation]")[0].value;
		share.vip = !vip;
		
		var request = $.ajax({
			url: url + "wishlist/" + wishlistId + "/" + item._id + "/share",
			type: "post",
			data: share
		});
		request.done(function (msg) {
			share._id = msg;
		});
		request.fail(function (jqXHR, textStatus) {
			console.log("failed: " + textStatus);
		});
	});
	
	ul = template.find("ul");
	
	shareTemplates = $(shareTemplatesString);	
	$(ul).append(shareTemplates);
	
	// Handle interaction with available shares
	for (i = 0; i < shareTemplates.length; i++) {
		$(shareTemplates[i]).children('button').on("click.edit", function(e) {
			var button = e.target,
				liIndex = $(button.parentNode).index(),
				editButtons = createEditButtons();
			
			button.classList.remove("edit_button");
			button.classList.add("delete_button");
			
			button.innerHTML = "delete";
			button.parentNode.classList.add("edit");
			
			$(button.parentNode).find("input").removeAttr("disabled");
			$(editButtons).insertAfter(button.parentNode); // TODO handle edit buttons
			
			$(this).off("click.edit");
			$(this).on("click.delete", function() {
				var shareToDelete = shares[liIndex];
				var request = $.ajax({
					url: url + "wishlist/" + wishlistId + "/" + item._id + "/share/" + shareToDelete._id,
					type: "delete"
				});
				request.done(function (msg) {
					console.log("deleted");
					$(button.parentNode).remove();
					// TODO remove edit buttons, update greenbar and amount
				});
				request.fail(function (jqXHR, textStatus) {
					console.log("failed: " + textStatus);
				});
			});
		});
	}
	
	$('#donate_wrapper').replaceWith(template);
	$('#donate_wrapper').fadeIn(800);
	
	$('#donate_innerbar').css("width", donationPercentage+"%");
}

// triggered in view.js line 76 from julias code
function showShare(e) {
	
	var butId = e.target.id,
		i = butId.substring(butId.lastIndexOf('-')+1);
	
	if (!TEMPLATECACHE['donate']) {
		
		getTemplate("partial/template_donate.html", function(e) {
			TEMPLATECACHE['donate'] = e;
			createShareLightbox(TEMPLATECACHE['donate'], i);
		})
	} else {
		createShareLightbox(TEMPLATECACHE['donate'], i);
	}
	
	$('#donate_bg').fadeIn(300);
	$('body').on("click.donatebg", function(e) {
		if (e.target.id === "donate_bg") {
			$('#donate_bg').fadeOut(300);
			$('#donate_wrapper').fadeOut(300);
			$('body').off("click.donatebg");
		}
	});
}
