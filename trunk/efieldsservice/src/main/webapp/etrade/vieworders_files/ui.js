function initEtradeHeader(options){if(typeof jQuery==="undefined"||document.getElementById("et-nav-main")===null){var _f=arguments.callee;setTimeout(function(){_f(options);},100);return;}var _settings={isAuth:false,tab:"home",subtab:"open an account",clickHandler:null,display:{userType:"visitor",includeSpTab:false,sitename:"",tBankCust:false,tCardCust:false}};_settings=$.extend({},_settings,options);var _val=getCookie("includesptab");_settings.display.includeSpTab=(_val==="y");var _disp=_settings.display;var _navState="et-nav-state-unauthenticated";if(_disp.userType!=="visitor"&&_disp.includeSpTab&&_disp.sitename==="sp_brkgonly"){_navState="et-nav-state-espIntl";}else{if(_disp.userType!=="visitor"&&_disp.includeSpTab){_navState="et-nav-state-usEsp";}else{if((_disp.userType!=="visitor"&&(_disp.tBankCust||_disp.tCardCust))||_disp.userType==="member"){_navState="et-nav-state-usBanking";}else{if(_disp.sitename.indexOf("xborder")>=0){_navState="et-nav-state-xbRetail";}else{if(_disp.userType==="customer"){_navState="et-nav-state-usRetail";}}}}}_val=getCookie("US_locale");if("zh_tw"===_val.toLowerCase()){$("#et-nav").addClass("et-header-chinese");}$("body").addClass("et-header-present");try{document.execCommand("BackgroundImageCache",false,true);}catch(e){}var _headerEl=$(document.getElementById("et-header"));var _m=document.getElementById("et-nav-main");var _tabs=$("li.et-nav-main-item",_m);var _mainNav=$("#et-nav").addClass(_navState).removeClass("ui-helper-hidden");var _curActiveTab=$("li.et-nav-main-item.ui-state-active",_m);var _curActiveSubTab=$("li.et-nav-main-item.ui-state-active",_curActiveTab);var _tabHash=$("li.et-nav-main-item",_m);$("li.ui-state-active",_m).removeClass("ui-state-active");function isBank(tab){return(tab.indexOf("mortgages")>-1||tab.indexOf("borrow")>-1||tab.indexOf("bank")>-1);}function getSpeedbump(t,p){switch(t){case"community":return"/e/t/user/speedbump?target_app="+encodeURIComponent(t)+"&target_page="+encodeURIComponent(p)+"&target_webapp=neo&TargetHost="+COMMUNITY;break;case"accounts":if(p=="etrade360"){return"/e/t/user/speedbump?target_app="+encodeURIComponent(t)+"&target_page="+encodeURIComponent(p)+"&target_webapp=neo&TargetHost="+ETRADE;}else{return"/e/t/user/speedbump?target_app="+encodeURIComponent(t)+"&target_page="+encodeURIComponent(p);}break;default:return"/e/t/user/speedbump?target_app="+encodeURIComponent(t)+"&target_page="+encodeURIComponent(p);}}function getCookie(cookieName){var cookiestring=document.cookie;var index1=cookiestring.indexOf(cookieName);if(index1==-1||cookieName==""){return"";}var index2=cookiestring.indexOf(";",index1);if(index2==-1){index2=cookiestring.length;}var _value=decodeURIComponent(cookiestring.substring(index1+cookieName.length+1,index2));return _value;}function getTabWithKey(tab){var _t=tab.replace("&amp;","&").toLowerCase();for(var x=0;x<_tabHash.length;x++){var _selKey=String($(_tabHash[x]).attr("selectKey")).replace("&amp;","&").toLowerCase();var _sk=String(_selKey).split(",");for(var y=0;y<_sk.length;y++){if(_t.indexOf(_sk[y])>-1){return $(_tabHash[x]);}}}var _els=$("li.et-nav-main-item:visible",_m);if(_els.length>0){return $(_els[0]);}return $();}function getSubtabWithKey(tabEl,subtab){var _s=subtab.replace("&amp;","&").toLowerCase();var _subtabs=$("ul.et-nav-sub li",tabEl);for(var x=0;x<_subtabs.length;x++){var _selKey=String($(_subtabs[x]).attr("selectKey")).replace("&amp;","&").toLowerCase();var _sk=_selKey.split(",");for(var y=0;y<_sk.length;y++){if(_s.indexOf(_sk[y])>-1){if($(_subtabs[x]).is(":visible")){return $(_subtabs[x]);}}}}var _els=$("ul li:visible",tabEl);if(_els.length>0){return $(_els[0]);}return $();}function positionArrow(subtabEl){subtabEl.addClass("current-tab");}function setSelectedTabs(tab,subtab){_curActiveTab.add(_curActiveSubTab).removeClass("ui-state-active").removeClass("ui-state-hover");if(tab.indexOf("chinese")>-1){var _subtabSelector="";var _tabSelector="#et-hdr-main-chinese";if(subtab=="2"){_subtabSelector=".et-nav-sub-chinese-ec";}else{if(subtab=="3"){_subtabSelector=".et-nav-sub-chinese-fin";}else{if(subtab=="4"){_subtabSelector=".et-nav-sub-chinese-asia";}else{if(subtab=="5"){_subtabSelector=".et-nav-sub-chinese-ear";}else{_subtabSelector=".et-nav-sub-chinese-exc";}}}}_curActiveTab=$(_tabSelector).addClass("ui-state-active").removeClass("ui-state-hover");_curActiveSubTab=$(_subtabSelector).addClass("ui-state-active").removeClass("ui-state-hover");}else{_curActiveTab=getTabWithKey(tab).addClass("ui-state-active").removeClass("ui-state-hover");_curActiveSubTab=getSubtabWithKey(_curActiveTab,subtab).addClass("ui-state-active").removeClass("ui-state-hover");}positionArrow(_curActiveSubTab);}setSelectedTabs(_settings.tab.toLowerCase(),_settings.subtab.toLowerCase());$(window).resize(function(){positionArrow(_curActiveSubTab);});$("ul.et-nav-sub > li").hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});if(isBank(_settings.tab)){_tabs.each(function(idx,elm){if(elm.id!=="et-hdr-main-bank"){if(elm.id!=="et-hdr-main-communities"){$("a",elm).addClass("et-nav-speedbump").each(function(i,e){var _e=$(e);var _s=_e.attr("href").split("/");if(_e.html()=="E*TRADE 360"){var _t=_s[2]||"";var _p=_s[3]||"";}else{var _t=_s[3]||"";if(_e.html()=="Bill Pay"){var _p=_s[4]+"/"+_s[5]||"";}else{var _p=_s[4]||"";}}_e.attr({"href":getSpeedbump(_t,_p)});});}else{if(elm.id=="et-hdr-main-communities"){$("a",elm).addClass("et-nav-speedbump").each(function(i,e){var _e=$(e);var _s=_e.attr("href").split("/");var _t=_s[2]||"";var _p=_s[3]||"";_e.attr({"href":getSpeedbump(_t,_p)});_e.attr({"thirdparty":"etrade"});});}}}});}$("a",document.getElementById("et-nav-top")).click(function(evt){if($(this).hasClass("et-nav-passthru")){return true;}if("function"===typeof _settings.clickHandler){_settings.clickHandler($(this).attr("href"),null);evt.preventDefault();return false;}});$("a",document.getElementById("et-nav-main")).click(function(evt){if($(this).hasClass("et-nav-passthru")){return true;}if("function"!==typeof _settings.clickHandler){return;}var _thirdParty=null;var _tp=$(this).attr("thirdparty");if("undefined"!=typeof _tp&&_tp!=""){_thirdParty=_tp;}var _href=$(this).attr("href");if("undefined"==typeof _href||_href==""){return;}_settings.clickHandler(_href,_thirdParty);evt.preventDefault();});function removeTabHoverStates(){_curActiveTab.addClass("ui-state-active");_headerEl.find("li.ui-state-hover.et-nav-main-item").removeClass("ui-state-hover");_headerEl.removeClass("ui-state-tab-hovering");}var _entertimer=null,_leavetimer=null;_tabs.click(function(evt){if(!$(this).hasClass("ui-state-active")){_curActiveTab.removeClass("ui-state-active");var _activeTab=String($(this).find(".et-hdr-main-elm .et-nav-lbl a").text()).toLowerCase();var _activeSubtab=String($(evt.target).text()).toLowerCase();setSelectedTabs(_activeTab,_activeSubtab);_headerEl.removeClass("ui-state-tab-hovering");_mainNav.find("li.ui-state-active").removeClass("ui-state-active");}}).bind("mouseenter",function(){window.clearTimeout(_leavetimer);window.clearTimeout(_entertimer);var _tab=$(this);_entertimer=setTimeout(function(){removeTabHoverStates();if(!_tab.hasClass("ui-state-active")){_tab.addClass("ui-state-hover");_curActiveTab.removeClass("ui-state-active");_headerEl.addClass("ui-state-tab-hovering");}},500);}).bind("mouseleave",function(){window.clearTimeout(_leavetimer);_leavetimer=window.setTimeout(function(){removeTabHoverStates();_curActiveTab.addClass("ui-state-active");},500);});var _srch=$("input#searchtext",document.getElementById("et-nav-top"));var _text=$.trim(_srch.attr("value"));_srch.focus(function(){if($.trim(this.value)==_text){this.value="";}});_srch.blur(function(){if($.trim(this.value)==""){this.value=_text;}});var _quote=$("li.et-nav-quote input");var _qtext=$.trim(_quote.attr("value"));_quote.focus(function(){if($.trim(this.value)==_qtext){this.value="";}});_quote.blur(function(){if($.trim(this.value)==""){this.value=_qtext;}});$(".dropdown dt a").click(function(){$(".dropdown dd ul li a").addClass("et-nav-passthru");$(".dropdown dd ul").toggle();$(".dropdown dd ul li").addClass("u-arrow").removeClass("d-arrow");$(".dropdown dt a").html('US<span class="value">US</span></a>').addClass("u-arrow").removeClass("d-arrow");});$(".dropdown dd ul li a").click(function(){var text=$(this).html();$(".dropdown dt a").html(text).addClass("d-arrow").removeClass("u-arrow");var country=$(".dropdown dt a span").html();$(".dropdown dd ul").hide();});$(".goButton").click(function(){var quoteSymbol=$("#sym").val();if(quoteSymbol!=="Enter Symbol"){var quoteCountry=$(".dropdown dt a span").html();if(quoteCountry=="US"){window.top.location.href=ETRADE+"/e/t/invest/quotesandresearch?cmenu=DetQ&sym="+quoteSymbol;}else{window.top.location.href=ETRADE+"/e/t/gmc/globalsnapshot?cmenu=DetQ&sym="+quoteSymbol+"&country="+quoteCountry;}}});$("#sym").keyup(function(event){if(event.keyCode==13){$(".goButton").click();}});}