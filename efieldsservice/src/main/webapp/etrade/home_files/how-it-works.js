ETRADE.HiwFlyout = {
	
	$content: null,	
	show: function ($content) {
		
		var hiwFlyout = '<div class="hiw-flyout"><div class="hiw-content"></div><span class="bot-shadow"></span><span class="top-shadow"></span></div>';
		var hiwLoaded = 0;
		var $flyOut = $(hiwFlyout);
		var isOnHoverHiwFlyout = false;
		var onHoverHiwFlyoutTimer=0;
	
		$('body').append($flyOut);
		$('.hiw-content').html($content.html());
		$('.hiw-content ol li').prepend('<span class="checks"></span>');
		$('.hiw-content ol li:first-child').addClass('first');
		$('.hiw-content ol li:last-child').addClass('last');
		$('.hiw-content ol li div').wrapInner("<table><tr><td></td></tr></table>");
		
		$("span[rel='hiw-flyout-right'],a[rel='hiw-flyout-right']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-right');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (92)) + "px",
					left: (offset.left - (330)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
	
		$("span[rel='hiw-flyout-left'],a[rel='hiw-flyout-left']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-left');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (222)) + "px",
					left: (offset.left + (85)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
	
		$("span[rel='hiw-flyout-bottom'],a[rel='hiw-flyout-bottom']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-bottom');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				var h = $flyOut.height();
				$flyOut.css({
					top: (offset.top - (h + 20)) + "px",
					left: (offset.left - (95)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
		
		var onHoverHiwFlyoutOut = function () {
			onHoverHiwFlyoutTimer = setTimeout(function () {
				$flyOut.unbind("mouseenter").unbind("mouseleave");
				$flyOut.removeClass('hiw-flyout-right');
				$flyOut.removeClass('hiw-flyout-left');
				$flyOut.removeClass('hiw-flyout-bottom');
				$('.ear').remove();
				$('div.hiw-flyout').fadeOut('fast');
				isOnHoverHiwFlyout = false;
			}, 200);
		}
	}
}


ETRADE.HiwFlyoutAndroid = {
	
	$content: null,	
	show: function ($content) {
		
		var hiwFlyout = '<div class="hiw-flyoutAndroid"><div id="android-content" class="hiw-content"></div><span class="bot-shadow"></span><span class="top-shadow"></span></div>';
		var hiwLoaded = 0;
		var $flyOut = $(hiwFlyout);
		var isOnHoverHiwFlyout = false;
		var onHoverHiwFlyoutTimer=0;
	
		$('body').append($flyOut);
		$('#android-content').html($content.html());
		$('.hiw-content ol li').prepend('<span class="checks"></span>');
		$('.hiw-content ol li:first-child').addClass('first');
		//$('.hiw-content ol li:last-child').addClass('last');
		$('.hiw-content ol li').wrapInner("<table><tr><td></td></tr></table>");
		
		$("span[rel='hiw-flyout-right-android'],a[rel='hiw-flyout-right-android']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-right');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (92)) + "px",
					left: (offset.left - (330)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
			
		var onHoverHiwFlyoutOut = function () {
			onHoverHiwFlyoutTimer = setTimeout(function () {
				$flyOut.unbind("mouseenter").unbind("mouseleave");
				$flyOut.removeClass('hiw-flyout-right');
				$flyOut.removeClass('hiw-flyout-left');
				$flyOut.removeClass('hiw-flyout-bottom');
				$('.ear').remove();
				$('div.hiw-flyoutAndroid').fadeOut('fast');
				isOnHoverHiwFlyout = false;
			}, 200);
		}
	}
}

ETRADE.HiwFlyoutBlackberry = {
	
	$content: null,	
	show: function ($content) {
		
		var hiwFlyout = '<div class="hiw-flyoutBlackberry"><div id="blackberry-content" class="hiw-content"></div><span class="bot-shadow"></span><span class="top-shadow"></span></div>';
		var hiwLoaded = 0;
		var $flyOut = $(hiwFlyout);
		var isOnHoverHiwFlyout = false;
		var onHoverHiwFlyoutTimer=0;
	
		$('body').append($flyOut);
		$('#blackberry-content').html($content.html());
		$('.hiw-content ol li').prepend('<span class="checks"></span>');
		$('.hiw-content ol li:first-child').addClass('first');
		//$('.hiw-content ol li:last-child').addClass('last');
		$('.hiw-content ol li').wrapInner("<table><tr><td></td></tr></table>");
		
		$("span[rel='hiw-flyout-right-blackberry'],a[rel='hiw-flyout-right-blackberry']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-right');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (92)) + "px",
					left: (offset.left - (330)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
			
		var onHoverHiwFlyoutOut = function () {
			onHoverHiwFlyoutTimer = setTimeout(function () {
				$flyOut.unbind("mouseenter").unbind("mouseleave");
				$flyOut.removeClass('hiw-flyout-right');
				$flyOut.removeClass('hiw-flyout-left');
				$flyOut.removeClass('hiw-flyout-bottom');
				$('.ear').remove();
				$('div.hiw-flyoutBlackberry').fadeOut('fast');
				isOnHoverHiwFlyout = false;
			}, 200);
		}
	}
}

ETRADE.WhatYoullNeed = {
	
	$content: null,	
	show: function ($content) {
		
		var hiwFlyout = '<div class="hiw-flyoutWhatYoullNeed"><div id="WhatYoullNeed-content" class="hiw-content"></div><span class="bot-shadow"></span><span class="top-shadow"></span></div>';
		var hiwLoaded = 0;
		var $flyOut = $(hiwFlyout);
		var isOnHoverHiwFlyout = false;
		var onHoverHiwFlyoutTimer=0;
	
		$('body').append($flyOut);
		$('#WhatYoullNeed-content').html($content.html());
		$('.hiw-content ol li').prepend('<span class="checks"></span>');
		$('.hiw-content ol li:first-child').addClass('first');
		$('.hiw-content ol li:last-child').addClass('last');
		$('.hiw-content ol li').wrapInner("<table><tr><td></td></tr></table>");
		
		$("span[rel='hiw-flyout-right-WhatYoullNeed'],a[rel='hiw-flyout-right-WhatYoullNeed']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-right');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (92)) + "px",
					left: (offset.left - (330)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
			
		$("span[rel='hiw-flyout-left-WhatYoullNeed'],a[rel='hiw-flyout-left-WhatYoullNeed']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-left');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				$flyOut.css({
					top: (offset.top - (222)) + "px",
					left: (offset.left + (85)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});
	
		$("span[rel='hiw-flyout-bottom-WhatYoullNeed'],a[rel='hiw-flyout-bottom-WhatYoullNeed']").addClass('flyOutButton').hover(function (event) {
			if (!isOnHoverHiwFlyout) {
				$flyOut.addClass('hiw-flyout-bottom');
				$flyOut.append('<span class="ear"></span>');
				$flyOut.show();
				var offset = $(this).offset();
				var h = $flyOut.height();
				$flyOut.css({
					top: (offset.top - (h + 20)) + "px",
					left: (offset.left - (95)) + "px"
				});
				$flyOut.bind("mouseenter", function () {
					clearTimeout(onHoverHiwFlyoutTimer);
				}).bind("mouseleave", function () {
					onHoverHiwFlyoutOut();
				});
			}
			isOnHoverHiwFlyout = true;
		}, function (event) {
			onHoverHiwFlyoutOut();
		});

		var onHoverHiwFlyoutOut = function () {
			onHoverHiwFlyoutTimer = setTimeout(function () {
				$flyOut.unbind("mouseenter").unbind("mouseleave");
				$flyOut.removeClass('hiw-flyout-right');
				$flyOut.removeClass('hiw-flyout-left');
				$flyOut.removeClass('hiw-flyout-bottom');
				$('.ear').remove();
				$('div.hiw-flyoutWhatYoullNeed').fadeOut('fast');
				isOnHoverHiwFlyout = false;
			}, 200);
		}
	}
}

$('.global-footer-gray .footer-specific, .global-footer .footer-specific').each(function (i) {
	$(this).attr('id', 'disclosure-1');
});