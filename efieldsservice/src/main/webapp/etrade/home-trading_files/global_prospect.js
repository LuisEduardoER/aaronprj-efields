/*global ETRADE: true */

/**
  Declare the E*TRADE Namespace
*/
window.ETRADE = window.ETRADE || {};

ETRADE.Global = {
  /**
   * Initialize Global Methods
   * @public
   * @returns nothing
  */
  init: function(){
    $("input").placehold();
    $("select:first").change(saveStart);
    $(".global_site").click(cookieThenRedirect);
    $(".global_site_footer").click(cookieThenRedirectFooter);
    $("#log-out-submit").click(nodice);
    $("header > div.row-two").mouseover(suggest);
    this.searchInput();
    this.logOn();
    !!window.location.hash || this.userIDAutofocus();
    this.subNavigationFlyout();
    this.attachOverlayEvents();
    this.attachFooterOverlay();
  },

	/**
   * Overlay Event Attachment
   */
  attachOverlayEvents: function() {
    $("a.overlay").hover(function() {
    	var text = $(this).attr("overlayContent") == "" ? "Empty" : $(this).attr("overlayContent");
    	var overlay = [];
    	var content = [];

    	if($(this).hasClass("howItWorks")) {
    		content.push(
    			'<h3>How It Works</h3>',
    			'<p>',text,'</p>'
    		);
    	} else if($(this).hasClass("whatYouNeed")) {
    		content.push(
    			'<div class="titleText">What you\'ll need to open your account</div>',
    			'<ul>',
    			'<li>10-12 minutes to complete the application</li>',
    			'<li>U.S permanent Residention Address</li>',
    			'<li>Date of Bith</li>',
    			'<li>Social Security number or Tax ID number</li>',
    			'<li>Employer Name &amp; Address</li>',
    			'<ul>'
    		);
    	}
    	else {
    		content.push('<p>',text,'</p>');
    	}

    	overlay.push(
    		'<div class="overlay">',
    			content.join(""),
    			'<span></span>',
    		'</div>'
    	);

    	$(this).append($(overlay.join("")).show());
    },
    function() {
    	$("div.overlay").remove();
    });
  },
    /**
   * Footer overlay event
   */
  attachFooterOverlay: function() {
    $("#calletrade").mouseover(function() {
    	$('.call-tip').show();
	});

	$('#calletrade').mouseout(function(){
		$('.call-tip').hide();
	});
  },
  /**
   * Detects whether HTML5's autofocus is supported for the User ID. If not, simulate it
   */
  userIDAutofocus: function() {
    $('#user-id').focus().select();
  },

  /**
   * Detects Focus on the Search Input Field
   * @public
   * @returns nothing
  */
  searchInput : function(){
    var focusedClass = "focused",
        $search = $("#searchtext"),
        $submit = $("#search-submit");

    $search.focus(function(){
             $(document).trigger("autosearch");
             $search.closest("form").addClass(focusedClass);
           })
           .blur(function(){
             $search.closest("form").removeClass(focusedClass);
           });

    $submit.click(function(e){
      e.preventDefault();
      $("#search-form").submit();
    });

  },

  /**
   * Behavior for the Log On Overlay
   * @public
   * @returns nothing
  */
  logOn : function(){
    var focusedClass = "focused",
        help = "log-on-help-go",
        Submitted = "log-on-submit",
        userId = "user-id",
        password = "password",
        $userId = $("#" + userId),
        $options = $("#log-on-help-options"),
        $password = $("#" + password),
        $form = $("#log-on-form"),
        $help = $("." + help),
        $close = $("#log-on-help-options-close");

    function openLogin(){
       $form.addClass(focusedClass);
       $options.css("display", "block");

	   /* hack for IE */
	   $('.sub-nav-open-an-account a').hide();
    }

    $userId.keydown(function(e){
             if (e.metaKey || !/[a-z0-9]/i.test(String.fromCharCode(e.keyCode))) { return; }
             if ($userId.val() === $userId.attr("placeholder")) { $userId.val(""); }
             openLogin();
           })
           .click(function(){
             if ($userId.val() === $userId.attr("placeholder")) {
               $userId.val("");
               openLogin();
             }
           })
           .focus(function (){
             if ($userId.data('autofocus')) {
               openLogin();
             }
             else {
                $userId.val('User ID').select();
                  //     .data('autofocus',true);
             }
           });

    $password.focus(function (e){
      e.preventDefault();

      openLogin();
      $password.select();
    });

    $help.click(function (e){
      e.preventDefault();

      openLogin();
    });

    $close.click(function (e){
      e.preventDefault();

      $form.removeClass(focusedClass);
      $options.css("display", "none");

 	  /* hack for IE */
	   $('.sub-nav-open-an-account a').show();
    });
  },

  /**
   * Sub Navigation Flyout
   * @public
   * @returns nothing
  */
  subNavigationFlyout : function(){
    var userAgent = navigator.userAgent.toLowerCase(),
        iOs = userAgent.match(/(iphone|ipod|ipad)/),
        $subnav = $("#sub-navigation"),
        $ul = $subnav.children("ul");

    // iOS
    if (iOs) {
      $subnav.delegate(".close", "click", function (e){
        var $this = $(this);

        e.preventDefault();

        $this.remove();
        $subnav.find(".content:visible").css("display", "none");
        $ul.removeClass("flyout-displayed");
        $(".flyout").removeClass("selected");

        return;
      });

      $subnav.delegate(".flyout .tab a", "click", function (e){
        var $this = $(this).parent().parent(),
          isSelected = $this.is(".selected"),
          navHeight = $subnav.eq(0).height(),
          flyoutHeight = $this.find(".content").eq(0).height(),
          totalHeight = navHeight + flyoutHeight;
		  $this.find(".content").css("top","52px");

        if (isSelected) {
          $this.unbind();
          return;
        }

        e.preventDefault();

        $subnav.find(".close").remove();
        $subnav.find(".content:visible").css("display", "none");
        $(".flyout").removeClass("selected");
        $ul.addClass("flyout-displayed");
        $this.addClass("selected");
        $this.find(".content")
             .css("display", "block");
        $this.append('<a href="#" class="close" style="top: ' + totalHeight + 'px;">Close</a>');
      });
    }
    else {
    //using hoverIntent
    var config = {
      over: function(){
        $(this).addClass("selected");
      },
      timeout: 200, // number = milliseconds delay before onMouseOut
      out: function(){
        $(this).removeClass("selected");
      }
    };

    /* Hide third-level nav in IE7 */
    if($("#third-nav").css("hasLayout") )
      {
      $("#sub-navigation").mouseover(function(){
      $("#third-nav").css("z-index",-1);});
      $("#sub-navigation").mouseout(function(){
      $("#third-nav").removeAttr("style");});
      }
    $(".flyout").hoverIntent( config );

    }
  }
};

/**
   * Generic Page Overlay Functionality
   * @public
   * @returns nothing
  */
ETRADE.PageOverlay = {
	$mask: $('<div id="page-overlay-mask" onclick="ETRADE.PageOverlay.close();" style="z-index:2900;position:fixed;top:0;left:0;background:#000000;opacity:0.7;-moz-opacity:0.7;-ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=70)\';filter:alpha(opacity=70);width:100%;height:100%;"></div>'),
	$wrapper: $('<div id="page-overlay-wrapper"></div>'),
	$content: null,
	/*
	 * @$content jQuery object to show
	 */
	show: function ($content) {
		var me = this, smallestW = 750, smallestH = 550;
		me.close();
		$('body').append(this.$mask);

		var w = $content.outerWidth(false);
		var h = $content.outerHeight(false);
		me.$wrapper.css({
			'position': 'fixed',
			'z-index': '3000',
			'left': '50%',
			'top': '50%',
			'width': w + 'px',
			'margin-left': -w / 2 + 'px',
			'margin-top': -$content.outerHeight(true) / 2 + 'px',
			'zoom': 1,
			'-moz-transform': 'scale(1)',
			'backgroundColor': '#ffffff'
		});
		var maxW = $(window).width() - 100;
		var maxH = $(window).height() - 100;
		if (w >= maxW || h >= maxH) {
			if (maxW <= smallestW || maxH <= smallestH) {
				maxW = smallestW;
				maxH = smallestH;
				me.$wrapper.css({
					'position': 'absolute',
					'top': $(document).scrollTop(),
					'margin-top': 50
				});
			}
		}
		me.$content = $content.show().wrap(me.$wrapper);
		var wrapper = $('#page-overlay-wrapper'); // get DOM instance
		wrapper.append('<div id="page-overlay-close" style="cursor: pointer;z-index:10;position: absolute; top: -22px; right: -20px; width: 49px; height: 57px;" onclick="ETRADE.PageOverlay.close();"></div>');
		$(document).bind('keydown', me.closeOnEsc);
		$(document).trigger('ETRADE.PageOverlay.show');
	},
	close: function () {
		$(document).unbind('keydown', this.closeOnEsc); // unbind to prevent duplicate binding
		if (this.$content != null) {
			this.$content.hide().unwrap(); //.attr('style',''); // reset for width calculations on next show
			this.$content = null;
		}
		this.$mask.remove();
		$('#page-overlay-close').remove();
		$(document).trigger('ETRADE.PageOverlay.close');
	},
	closeOnEsc: function (e) {
		if (e.keyCode == 27) { // esc key
			e.preventDefault();
			ETRADE.PageOverlay.close();
		}
	}
};

ETRADE.Util = {
  /**
   * Fires Events
   * @public
   * @param {String} func - Class of the Section
   * @param {String} funcname - ID of the Page
   * @returns nothing
  */
  fire : function (func, funcname){
    var namespace = ETRADE;

    funcname = (funcname === undefined) ? "init" : funcname;

    if (func !== "" && namespace[func] && typeof namespace[func][funcname] === "function"){
      namespace[func][funcname]();
    }
  },

  /**
   * Load Events based on the DOM
   * @public
   * @returns nothing
  */
  loadEvents : function(){
    var htmlId = document.documentElement.id;

    ETRADE.Util.fire("Global");

    // do all the classes too.
    if (htmlId.length){
      $.each(document.documentElement.className.split(/\s+/), function (i, classnm){
        ETRADE.Util.fire(classnm, htmlId);
      });
    }
  checkForStartInCookie();
  }
};

// kick it all off here
$(document).ready(ETRADE.Util.loadEvents);

//code from bootstrap.js

(function () {
	/*
		Removes the "no-js" class from the HTML element and replaces it
		with "js" to indicate that JavaScript is enabled
	*/
	try {
		var html = document.getElementsByTagName("html")[0];
		html.className = html.className.replace("no-js", "js");
	} catch (e) {}

	/* Enable HTML 5 elements for styling in IE */
	if (!(!/*@cc_on!@*/0)) {
		var elem,
			elems = "abbr article aside audio canvas datalist details eventsource figcaption figure footer header hgroup mark menu meter nav output progress section time video".split(" "),
			i = elems.length + 1;

		while (--i) {
			elem = document.createElement(elems[i]);
		}

		elem = null;
	}
}());

function CreateModalOverlay($content) {
	$("body").prepend('<div class="bodyCover"></div>');
	$("div.bodyCover").height($("body").height());

	$("body").prepend(
		'<div class="modalOverlay"><a href="#" class="exitButton"></a></div>'
	);

	$("div.modalOverlay").append($content.show());

	$("a.exitButton").live("click", function() {
		$content
			.hide()
			.prependTo($("body"));

		$("div.modalOverlay").remove();
		$("div.bodyCover").remove();
	});
}

function getExpire(nodays) {
    var UTCstring;
    Today = new Date();
    diff=Date.parse(Today);
    Today.setTime(diff+nodays*24*60*60*1000);
    UTCstring = Today.toUTCString();
    return UTCstring;
}

function getCook(cookiename) {
    var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+/,"").replace("=","") : "");
}

function checkForStartInCookie() {
  var cookieValue = getCook('startin');
  $("select:first option[name='"+cookieValue+"']").attr("selected","selected");
}

function setStartInCookie (destination) {
    var where,cookiestring;
    where = destination;
    cookiestring="startin="+where+";DOMAIN=.etrade.com;PATH=/;EXPIRES="+getExpire(12000);
    document.cookie=cookiestring;
}

function saveStart() {
      setStartInCookie($("select:first option:selected").text() );
}

function checkSpeedBump(urlPath)
{
	var isSpeedBump = urlPath.indexOf("/e/t/user/speedbump");
	var refr = "";
	if(isSpeedBump != -1)
	{
		var referrer = document.URL;
		refr="&hReferrer="+referrer;
	}
	return refr;
}

function GoToETURL(urlPath,thirdParty) {

	if(thirdParty == null) {
		thirdParty = "etrade";

	}
	window.top.location.href = etURL.parse(urlPath,thirdParty);
}

GoToETURL.thirdParty = function(sParty) {
	switch(sParty) {
		case "activate": return page.url.ACTIVATE;
		case "bankus": return page.url.BANKUS;
		case "bond": return page.url.BOND;
		case "edocs": return page.url.EDOCS;
		case "etrade": return page.url.ETRADE;
		case "express": return page.url.EXPRESS;
		case "olink": return page.url.OLINK;
		case "search": return page.url.SEARCH;
		case "global": return page.url.GLOBAL;
		case "optchart": return page.url.OPTCHART;
		case "lendingproxy": return page.url.LENDINGPROXY;
		case "pingfederate": return page.url.PINGFEDERATE;
		case "homedepositproxy": return page.url.HOMEDEPOSITPROXY;
        case "community": return page.url.COMMUNITY_BASE;
        case "chat": return "";
	}
};

function etWin(url, windowName, sWidth, sHeight, toolbarYS, locationYS, scrollbarYS, menubarYS, resizeYS, HorizPos, VertPos, server, bUseDefaults) {
    var features;
    if (bUseDefaults == null) {
        bUseDefaults = true;
    }
    if (!url) {
        return;
    }
    windowName = (bUseDefaults ? (windowName ? windowName : "ETpopUP") : (windowName ? windowName : "_blank"));
    features = (bUseDefaults ? "width=" + (sWidth ? sWidth : 400) + "," : (sWidth ? "width=" + sWidth + "," : "")) + (bUseDefaults ? "height=" + (sHeight ? sHeight : 400) + "," : (sHeight ? "height=" + sHeight + "," : "")) + (bUseDefaults ? "toolbar=" + (toolbarYS ? toolbarYS : 1) + "," : (toolbarYS ? "toolbar=" + toolbarYS + "," : "")) + (bUseDefaults ? "location=" + (locationYS ? locationYS : 1) + "," : (locationYS ? "location=" + locationYS + "," : "")) + (bUseDefaults ? "scrollbars=" + (scrollbarYS ? scrollbarYS : 1) + "," : (scrollbarYS ? "scrollbars=" + scrollbarYS + "," : "")) + (bUseDefaults ? "menubar=" + (menubarYS ? menubarYS : 1) + "," : (menubarYS ? "menubar=" + menubarYS + "," : "")) + (bUseDefaults ? "resizable=" + (resizeYS ? resizeYS : 1) + "," : (resizeYS ? "resizable=" + resizeYS + "," : "")) + (bUseDefaults ? "top=" + (VertPos ? VertPos : 5) + "," : (VertPos ? "top=" + VertPos + "," : "")) + (bUseDefaults ? "left=" + (HorizPos ? HorizPos : 5) + "," : (HorizPos ? "left=" + HorizPos + "," : ""));
    if (!server || url.substr(0, 4) == "http") {
        server = "";
    }
    windowName = removeSpecialChar(windowName, "*");
    windowName = removeSpecialChar(windowName, " ");
    var rtpc = /etrtpcounter_goto/.test(url),
        gxml = url.indexOf("gxml");
    if (rtpc != false && gxml != -1) {
        var bgxml = url.substring(0, gxml),
            agxml = url.substring(gxml);
        url = bgxml + encode(agxml);
    }
    if (windowName == "_blank") {
        features = "toolbar=1,menubar=1,location=1,scrollbars=1,resizable=1";
    }
    ETpopUp = (features ? window.open(server + url, windowName, features) : window.open(server + url, windowName));
    if (windowName == "_blank") {
        if (window.screen) {
            var aw = screen.availWidth,
                ah = screen.availHeight;
            ETpopUp.moveTo(0, 0);
            ETpopUp.resizeTo(aw, ah);
        }
    }
    if (window.focus) {
        ETpopUp.focus();
    }
}
function etURL(urlPath, thirdParty) {
    this.sHref = arguments.callee.parse(urlPath, thirdParty);
    return this.sHref;
}
etURL.parse = function (urlPath, thirdParty) {
    var ref = checkSpeedBump(urlPath),
        url = "";
    if (thirdParty.length < 1) {
        var thirdParty = "etrade";
    }
    if (!urlPath) {
        urlPath = "";
    }
    if (!thirdParty) {
        url = urlPath + ref;
    } else {
        if (urlPath == "" || urlPath.length < 1) {
            urlPath = "/";
        }
        url = GoToETURL.thirdParty(thirdParty) + urlPath + ref;
    }
    return url;
};
etURL.jump = function (urlPath, thirdParty) {
    top.location.href = etURL(urlPath, thirdParty);
};
etURL.open = function (urlPath, thirdParty) {
    etWin(etURL(urlPath, thirdParty), "_blank", null, null, null, null, null, null, null, null, null, null, 0);
};
function removeSpecialChar(str, pattern) {
    while (str.indexOf(pattern) != -1) {
        str = str.substring(0, str.indexOf(pattern)) + str.substring(str.indexOf(pattern) + 1, str.length);
    }
    return str;
}

function openHelp(freshurl)
  {
  var fresh_url = freshurl;
  var leftPos = 0;
  if (screen)
    {
    leftPos = screen.width - 280;
    }
  var SmallWin = window.open(fresh_url, "HelpWindow", "scrollbars=yes,resizable=yes,toolbar=no,height=688,width=270,left=" + leftPos + ",top=0");
  if (window.focus)
    {
    SmallWin.focus();
    }
  if (SmallWin.opener === null)
    {
    SmallWin.opener = window;
    SmallWin.opener.name = "newPUMain";
    }
  }

function setCountryLocaleCookie(locale, country)
  {
  var cookiestring;
  cookiestring = country + "_locale=" + locale + ";DOMAIN=.etrade.com;PATH=/;EXPIRES=" + getExpire(12000);
  document.cookie = cookiestring;
  }

function set_site(x)
  {
  var cookiestring, site = "";
  switch (x)
    {
  case "site04":
    site = "site04:serena2";
    break;
  case "serena":
    site = "site04:serena2";
    break;
  case "xborder":
    site = "xborder:serena2";
    break;
  default:
    site = "site04:serena2";
    }
  cookiestring = "et_site=" + site + ";DOMAIN=.etrade.com;PATH=/;EXPIRES=" + getExpire(12000);
  document.cookie = cookiestring;
  document.location.href = document.location.href;
  }

function setGhomeCookie(locale, country, cust_type)
  {
  var LOC, CONTENTS, cookiestring;
  CONTENTS = cust_type + ":" + locale + ":" + country;
  cookiestring = "ghome=" + CONTENTS + ";DOMAIN=.etrade.com;PATH=/;EXPIRES=" + getExpire(12000);
  document.cookie = cookiestring;
  setCountryLocaleCookie(locale, country);
  }

function cookieThenRedirectFooter(x)
{
	var ploc = "?ploc=footer";
switch (x)
  {
case "us_english":
  setGhomeCookie("en_US", "US", "visitor");
  self.location.href = page.url.ETRADE + "/e/t/home"+ploc;
  break;
case "xborder":
  set_site("xborder");
  setGhomeCookie("in_US", "US", "visitor");
  self.location.href = page.url.GLOBAL + "/gl/home"+ploc;
  break;
case "us_chinese":
  setGhomeCookie("zh_TW", "US", "visitor");
  self.location.href = page.url.ETRADE + "/e/t/home"+ploc;
  break;
default:
  set_site("xborder");
  setGhomeCookie("in_US", "US", "visitor");
  self.location.href = page.url.GLOBAL + "/gl/home"+ploc;
  break;
  }
}

function cookieThenRedirect(x)
  {
  switch (x)
    {
  case "us_english":
    setGhomeCookie("en_US", "US", "visitor");
    self.location.href = page.url.ETRADE + "/e/t/home";
    break;
  case "xborder":
    set_site("xborder");
    setGhomeCookie("in_US", "US", "visitor");
    self.location.href = page.url.GLOBAL + "/gl/home";
    break;
  case "us_chinese":
    setGhomeCookie("zh_TW", "US", "visitor");
    self.location.href = page.url.ETRADE + "/e/t/home";
    break;
  default:
    set_site("xborder");
    setGhomeCookie("in_US", "US", "visitor");
    self.location.href = page.url.GLOBAL + "/gl/home";
    break;
    }
  }


function setRC()
  {
  var tz = (new Date().getTimezoneOffset() / 60) * (-1);
  var ul = (typeof(navigator.userLanguage) != "undefined") ? navigator.userLanguage : ((typeof(navigator.language) != "undefined") ? navigator.language : "");
  var ulcookiestring = "UserLanguage=" + ul + ";DOMAIN=.etrade.com;PATH=/;EXPIRES=" + getExpire(12000);
  var tzcookiestring = "TimeZone=" + tz + ";DOMAIN=.etrade.com;PATH=/;EXPIRES=" + getExpire(12000);
  document.cookie = ulcookiestring;
  document.cookie = tzcookiestring;
  }

function brkFrm()
  {
  var s = self.location.href;
  if (window.top != window.self)
    {
    window.top.location.href = s;
    }
  }

    function formalizeIntegerDate()
      {
      var sDate = aSplitDate[1],
          iDate = parseInt(sDate, 10),
          sLastDigit = sDate.substr(-1, 1);

      if (sLastDigit > 3 || (parseInt(sDate, 10) % 10) === 0 || (iDate > 10 && iDate < 14))
        {
        return sDate + "th";
        }
      if (sLastDigit == "1")
        {
        return sDate + "st";
        }
      if (sLastDigit == "2")
        {
        return sDate + "nd";
        }
      if (sLastDigit == "3")
        {
        return sDate + "rd";
        }
      return false;
      }

function formatTimeStamp(sTimeStamp, sFormatString)
  {
  if (sTimeStamp.length > 0)
    {
    var replaceChar = function replaceChar(sChar)
      {
      if (aLookup[sChar])
        {
        return aLookup[sChar];
        }
      else
        {
        return sChar;
        }
      };
    var getIntegerDate = function getIntegerDate()
      {
      for (var i = 0; i < 12; i++)
        {
        if (aMonths[i] == aSplitTimeStamp[0])
          {
          return ++i;
          }
        }
      return false;
      };


    var convertHourTo24 = function convertHourTo24()
      {
      var iHour = parseInt(aSplitTime[0], 10);
      if (aSplitTimeStamp[4] == "PM")
        {
        if (iHour < 12)
          {
          iHour += 12;
          }
        }
      else
        { if (iHour == 12)
          {
          iHour = 0;
          }
        }
      return iHour.toString();
      };

    if (!sFormatString)
      {
      sFormatString = "";
      }
    var aMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        aSplitTimeStamp = sTimeStamp.replace(",", "").split(" "),
        aSplitTime = aSplitTimeStamp[3].split(":"),
        aLookup = {},
        aFormatString = sFormatString.split(""),
        iFSLength = aFormatString.length;

    if (iFSLength > 0)
      {
      aLookup.m = getIntegerDate();
      aLookup.M = aSplitTimeStamp[0];
      aLookup.n = aSplitTimeStamp[0].substr(0, 3);
      aLookup.d = aSplitTimeStamp[1];
      aLookup.D = formalizeIntegerDate();
      aLookup.y = aSplitTimeStamp[2].substr(2, 2);
      aLookup.Y = aSplitTimeStamp[2];
      aLookup.h = aSplitTime[0];
      aLookup.H = convertHourTo24();
      aLookup.i = aSplitTime[1];
      aLookup.s = (aSplitTime[2]) ? aSplitTime[2] : "00";
      aLookup.r = aSplitTimeStamp[4];
      aLookup.t = (aSplitTimeStamp[5] == "EDT") ? "ET" : aSplitTimeStamp[5];
      for (var i = 0; i < iFSLength; i++)
        {
        aFormatString[i] = replaceChar(aFormatString[i]);
        }
      return aFormatString.join("");
      }
    else
      {
      return sTimeStamp;
      }
    }
  return false;
  }

    function getIntegerDate()
      {
      for (var i = 0; i < 12; i++)
        {
        if (aMonths[i] == aSplitTimeStamp[0])
          {
          return ++i;
          }
        }
      return false;
      }


function formatDelayedMarketTimeStamp(sTimeStamp)
  {
  if (sTimeStamp.length > 0)
    {
    var sSplitTimestamp = formatTimeStamp(sTimeStamp, "h i").split(" "),
        iHour = parseInt(sSplitTimestamp[0], 10),
        iMinute = parseInt(sSplitTimestamp[1], 10) - 15;

    if (iMinute < 0)
      {
      iMinute += 60;
      if (iHour == 1)
        {
        iHour = 12;
        }
      else
        {
        iHour--;
        }
      }
    if (iMinute < 10)
      {
      iMinute = "0" + iMinute;
      }
    return iHour + ":" + iMinute + " " + formatTimeStamp(sTimeStamp, "r t m/d/y") + " 15 min delay";
    }
  return false;
  }

function formatClosedMarketTimeStamp(sTimeStamp)
  {
  if (sTimeStamp.length > 0)
    {
    console.log(formatFlashTimeString(sTimeStamp, "Y m d h i r"));
    var oDate = new Date(),
        sSplitTimestamp = formatFlashTimeString(sTimeStamp, "Y m d h i r").split(" "),
        iYear = sSplitTimestamp[0],
        iMonth = sSplitTimestamp[1],
        iDay = sSplitTimestamp[2],
        iDayOfWeek, aFINRA_Holidays = ["11", "119", "216", "410", "625", "73", "907", "1126", "1225"],
        bAfterMarket = false,
        bBeforeMarket = false;

    if (sSplitTimestamp[5] == "AM")
      {
      if (sSplitTimestamp[3] == 9)
        {
        if (sSplitTimestamp[4] < 45)
          {
          bBeforeMarket = true;
          }
        }
      else
        { if (sSplitTimestamp[3] < 9)
          {
          bBeforeMarket = true;
          }
        }
      }
    else
      { if (sSplitTimestamp[5] == "PM")
        {
        if (sSplitTimestamp[3] >= 4)
          {
          bAfterMarket = true;
          }
        }
      }
    oDate.setFullYear(iYear, iMonth - 1, iDay);
    iDayOfWeek = oDate.getDay();
    switch (iDayOfWeek)
      {
    case 0:
      oDate.setDate(oDate.getDate() - 2);
      iDay -= 2;
      break;
    case 1:
      if (bBeforeMarket)
        {
        oDate.setDate(oDate.getDate() - 3);
        }
      iDay -= 3;
      break;
    case 6:
      oDate.setDate(oDate.getDate() - 1);
      iDay -= 1;
      break;
      }
    iDayOfWeek = oDate.getDay();
    sShortHandDate = (oDate.getMonth() + 1) + "" + oDate.getDate();
    if (iDayOfWeek !== 0 && iDayOfWeek !== 1 && iDayOfWeek !== 6)
      {
      for (var i = 0; i < aFINRA_Holidays.length; i++)
        {
        if (sShortHandDate == aFINRA_Holidays[i])
          {
          oDate.setDate(oDate.getDate() - 1);
          }
        }
      }
    return (oDate.getMonth() + 1) + "/" + oDate.getDate() + "/" + oDate.getFullYear().toString().substr(2, 2);
    }
  }

function callSpeedbump(query,param)
{
	  var finalurl="";
	  var splitURL = query.split(param);
	  var interForRTP = splitURL[0];
	  var interForComp = splitURL[1];
	  if(interForComp==undefined || param=="" || param==undefined)
	  {
		  finalurl=query;
	  }
	  else
	  {
		  finalurl=interForRTP+param+encodeURIComponent(interForComp)
	  }
	  etWin(finalurl,'ETRADE','1000','800','yes','yes','yes','yes','yes','5','5','');
}

function mortgage_popup(url) {
	document.cookie = "mortgage_popup=opened; domain=etrade.com; path=/";
	etWin(etURL(url, 'lendingproxy'), "mortgage_popup", 1000, 855);
}

function nodice() {
GoToETURL('/e/t/accounts/accountscombo','etrade');
return false;
}

function suggest() {
     var jqs = document.createElement("script");
     jqs.src = "/skins/prospect/js/autocomplete.js";
     document.getElementsByTagName("body")[0].appendChild(jqs);
     $("header > div.row-two").unbind("mouseover");
}
