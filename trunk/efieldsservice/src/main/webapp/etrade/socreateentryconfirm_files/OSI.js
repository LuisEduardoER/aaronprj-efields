       
    String.prototype.reverse = function(){
        
        return this.split("").reverse().join("");
    };
    
    Number.prototype.floatPrecision = function(iPrec, iMinOnly){
    
        var sNum = this.toString(),
            aNumSplit = sNum.split("."),
            sPad = "";
        
        if(aNumSplit.length == 1){
            
            for(var i=0; i<iPrec; i++){sPad+="0"}
            
            return aNumSplit[0]+((sPad != "")?"."+sPad:"");
            
        }else if(aNumSplit.length == 2){
            
            if(iPrec > 0){
                
                if(iPrec <= aNumSplit[1].length && !iMinOnly){
                    
                    return aNumSplit[0]+"."+(aNumSplit[1].substr(0, iPrec))
                    
                }else{
                    
                    for(var i=0; i<(iPrec - aNumSplit[1].length);i++){sPad+="0"}
                    
                    return aNumSplit[0]+"."+aNumSplit[1]+sPad;
                }
                
            }else{
                
                return aNumSplit[0]
            }
        }
    };
    
    Number.prototype.round = function(iPrec){
        
        return Math.round(parseFloat(this) * Math.pow(10, iPrec)) / Math.pow(10, iPrec);
    }
    
    Number.prototype.roundFixed = function(iPrec){
        
        return this.round(iPrec).toFixed(iPrec);
    }
    
    
    var oOSI = {
        
        sSwitchDesignView: "",
        sOSIViewMode: "",
        bModalCreated: false,
        oMonths: {Jan:"1",Feb:"2",Mar:"3",Apr:"4",May:"5",Jun:"6",Jul:"7",Aug:"8",Sep:"9",Oct:"10",Nov:"11",Dec:"12"},
        sApplicationName: (this.applicationname)?this.applicationname:"invest",
        bUseFancyStrikes: true,
        bDST: false,
        bCacheEnabled: true,
        bRuleSetsEnabled:true,
        oOSICache: false,
        oOSIQueue: false,
		sWeeklyOptionsTooltip: "Weekly Options"
    };
    
    oOSI.oOSICache = new OSICache();
    oOSI.oOSIQueue = new OSIQueue();
    
    
    
    
    
  
    








    
    function OSIQuoteWidget(sID, sSymbol, sMode, iLegIndex){
        
        var oThis = this;
        
        oThis.ndContainer = (sID != undefined)?((sID.parent)?sID:$("#"+sID)):"";
        oThis.ndWidgetCont = oThis.ndContainer.find(".quote-widget");
        oThis.ndInnerCont = oThis.ndContainer.find(".qw-inner-cont");
        oThis.ndTitleCont = oThis.ndContainer.find(".qw-title-cont");
        oThis.ndTitle = oThis.ndContainer.find(".qw-title");
        oThis.ndPriceCont = oThis.ndContainer.find(".qw-price-cont");
        oThis.ndPrice = oThis.ndContainer.find(".qw-price");
        oThis.ndTable = oThis.ndContainer.find(".qw-table");
        oThis.ndBid = oThis.ndContainer.find(".qw-bid");
        oThis.ndAsk = oThis.ndContainer.find(".qw-ask");
        oThis.ndVol = oThis.ndContainer.find(".qw-vol");
        oThis.ndPrv = oThis.ndContainer.find(".qw-prv");
        oThis.ndFooter = oThis.ndContainer.find(".qw-footer");
        oThis.ndFreq = oThis.ndContainer.find(".qw-freq");
        oThis.ndTime = oThis.ndContainer.find(".qw-time");
        oThis.ndRefresh = oThis.ndContainer.find(".qw-refresh");
        oThis.ndError = oThis.ndContainer.find(".qw-error");
        oThis.ndErrorCopy = oThis.ndContainer.find(".qw-error-copy");
        oThis.ndLoading = oThis.ndContainer.find(".loading");
        
        oThis.sSymbol = sSymbol;
        oThis.sDisplaySymbol;
        oThis.oSymbol = {};
        
        oThis.bAdjustedOption = false;
        oThis.bExtendedHours = false;
        oThis.bAnimate = false;
        
        oThis.iScrollInterval;
        oThis.iLegIndex = (iLegIndex)?iLegIndex:0;
        
        oThis.sMode = (sMode)?sMode.toLowerCase():"multi";
        
        oThis.oDataURLs = {
            
            stock:"/e/t/invest/flash.json",
            option:"/e/t/invest/flash.json",
            index:"/e/t/invest/flash.json",
            multi:"/e/t/invest/flash.json"
        };
        
        oThis.oTypeCodes = {
            
            stock:"EQ",
            option:"OPTN",
            index:"INDX",
            multi:""
        };
        
        oThis.aErrors = [
            "You have entered an invalid symbol. Would you like to do a <a href=\"javascript:openFindSymbol("+oThis.iLegIndex+");\">symbol search</a>?",
            "Quotes are currently unavailable",
            "Please enter a valid symbol",
            "No options found for the symbol you've entered"
        ];
        
        
        
        
        oThis.start = function(sSymbol){
            
            if(sSymbol)oThis.getSymbolData(sSymbol);
            else if(oThis.sSymbol)oThis.getSymbolData(oThis.sSymbol);
            
            oThis.ndRefresh.click(oThis.refresh);
            
            if(!oThis.bAnimate)oThis.ndInnerCont.show();
        };
        
        oThis.getSymbolData = function(sSymbol, bRefreshing){
            
            oThis.clear();
            
            if(!sSymbol && !bRefreshing){
                
                if(oThis.sMode != "option")oThis.showError(0);
                return false;
            }
            
            oThis.showLoading();
            
            $.getJSON(oThis.oDataURLs[oThis.sMode], {sym:sSymbol, type:oThis.oTypeCodes[oThis.sMode], ah_flag:(oThis.bExtendedHours)?1:""}, 
                
                function(data, sStatus){
                    
                    if(sStatus == "success"){
                        
                        if(data.product){
                            
                            var oData = data.product;
                            
                            if(data["invest.flashinfo"].bad_symbols == ""){
                                
                                if(oData.adjusted_option_flag == "1"){
                                    
                                    oThis.bAdjustedOption = true;
                                }
                                oThis.sSymbol = oData.quote_symbol;
                                oThis.sDisplaySymbol = oData.display_symbol;
                                oThis.oSymbol = oData;
                                oThis.populate();
                                if(!bRefreshing)oThis.onSuccess(); else oThis.onRefreshSuccess();
                                
                            }else{
                                
                                if(data["invest.flashinfo"].bad_symbols != ""){
                                    
                                    oThis.showError(0);
                                }
                            }
                            
                        }else if(data["invest.flashinfo"]){
                            
                            if(data.product){
                                
                                oThis.showError(0);
                            
                            }else if(!data.product && data["invest.flashinfo"] && data["invest.flashinfo"].bad_symbols){
                                
                                oThis.showError(0);
                                
                            }else if(!data.product && !data["invest.flashinfo"]){
                                
                                oThis.showError(1);
                            }
                        }
                        
                    }else{
                        
                        oThis.onFailure();
                        oThis.showError(1);
                    }
                }
            )
            
            return true;
        };
        
        oThis.submit = function(e){
            
            oThis.getSymbolData(e.target.value);
        };
        
        oThis.showLoading = function(){
            
            //oThis.ndLoading.fadeIn();
        };
        
        oThis.hideLoading = function(){
            
            //oThis.ndLoading.fadeOut();
        };
        
        oThis.populate = function(){
            
            var oSym = oThis.oSymbol, sAdjImage = "";
            
            oThis.hideLoading();
            
            if(oThis.bAdjustedOption == true){
                
                sAdjImage += "<img class='qw-adj-icon' src='"+AkamaiURL+"/images/osi/adj_options.gif'/>&nbsp;";
                oThis.getDeliverables(oSym.symbol, oSym.exchange_code, oSym.type_code);
            }
            
            oThis.ndTitle.fadeOut((oThis.bAnimate)?500:0, function(){
                
                oThis.ndTitle.html((oThis.sMode == "option")?sAdjImage+oThis.oSymbol.display_symbol:oThis.oSymbol.sym_desc);
                oThis.ndTitle[0].title = ((oThis.sMode == "option")?oThis.oSymbol.display_symbol:oThis.oSymbol.sym_desc);
                
				if(checkDisplaySymbolForWeeklyFlag(oThis.oSymbol.display_symbol))oThis.ndTitle[0].title = oOSI.sWeeklyOptionsTooltip;
				
                oThis.ndTitle.fadeIn((oThis.bAnimate)?500:0, function(){
                    
                    if(oThis.bAnimate)oThis.ndInnerCont.slideDown();
                    
                    oThis.ndPrice.html(oThis.formatChange(oSym));
                    oThis.ndBid.html(parseFloat(oSym.bid).floatPrecision(2, true)+" ("+oSym.bidsize+")");
                    oThis.ndAsk.html(parseFloat(oSym.ask).floatPrecision(2, true)+" ("+oSym.asksize+")");
                    oThis.ndVol.html(formatNumber(parseInt(oSym.volume), ","));
                    oThis.ndPrv.html((oThis.sMode == "stock" || oThis.sMode == "index" || oThis.sMode == "multi")?parseFloat(oSym.close).floatPrecision(2, true):formatNumber(parseInt(oSym.opt_open_interest), ","));
                    oThis.ndFreq.html(getQuoteFreqString(oSym.quote_type, oThis.sMode));
                    if(oSym.timestring)oThis.ndTime.html(formatFlashTimeString(oSym.flashtimestring, "m/d/y h:i:s r t"));
                    
                    oThis.ndRefresh.css({"visibility":"visible"});
                    
                    clearInterval(oThis.iScrollInterval);
                    
                    var iDiff = oThis.ndTitle.width() - oThis.ndTitleCont.width();
                    
                    if(iDiff > 9){
                        
                        oThis.iScrollInterval = setInterval(function(){
                            
                            oThis.ndTitle.animate(
                                {left:"-"+iDiff+"px"},
                                (iDiff*100),
                                function(){oThis.ndTitle.fadeOut(500, function(){oThis.ndTitle.css({left:0}).fadeIn(500)})}
                            );
                            
                        }, (iDiff*100+1000+2000));
                    }
                });
            });
        };
        
        oThis.clear = function(){
            
            oThis.hideLoading();
            
            if(oThis.bAnimate)oThis.ndInnerCont.slideUp();
            
            oThis.oSymbol = {};
            oThis.sSymbol = "";
            oThis.sDisplaySymbol = "";
            
            oThis.ndPriceCont.removeClass("change-down").removeClass("change-up");
            
            oThis.ndTitle.html((oThis.sMode == "option")?"Option Quote":"Stock Quote");
            oThis.ndTitle[0].title = "";
            oThis.ndPrice.html("- -");
            oThis.ndBid.html("- -");
            oThis.ndAsk.html("- -");
            oThis.ndVol.html("- -");
            oThis.ndPrv.html("- -");
            oThis.ndFreq.html("&#160;");
            oThis.ndTime.html("&#160;");
            
            oThis.ndError.hide();
            oThis.ndTable.show();
            
            oThis.ndRefresh.css({"visibility":"hidden"});
            
            oThis.bAdjustedOption = false;
            
            clearInterval(oThis.iScrollInterval);
        }
        
        oThis.formatChange = function(oSym){
            
            var sOperator = "",
                sClass = "",
                sOut = "";
            
            if(oSym.change > 0){
                
                sOperator = "+";
                sClass = "qw-change-up";
                oThis.ndPriceCont.addClass("change-up").removeClass("change-down");
                
            }else if(oSym.change < 0){
                
                sClass = "qw-change-down";
                oThis.ndPriceCont.addClass("change-down").removeClass("change-up");
                
            }else{
                
                oThis.ndPriceCont.removeClass("change-down").removeClass("change-up");
            }
            
            sOut += parseFloat(oSym.price).floatPrecision(2, true);
            sOut += "&nbsp;&nbsp;<span class='"+sClass+"'>"+sOperator+parseFloat(oSym.change).floatPrecision(2, true)+"&nbsp;&nbsp;("+sOperator+parseFloat(oSym.percent_change).floatPrecision(2, true)+"%)</span>";
            
            return sOut;
        };
        
        oThis.trackInput = function(ndNode){
            
            $(ndNode).change(oThis.submit);
        };
        
        oThis.showError = function(iError, sError){
            
            if(iError >= 0 && !sError){
                
                oThis.ndErrorCopy.html(oThis.aErrors[iError]);
                oThis.ndError.show();
                oThis.ndTable.hide();
                oThis.onError();
                if(oThis.bAnimate)oThis.ndInnerCont.slideDown();
                
            }else if(sError){
                
                oThis.ndErrorCopy.html(sError);
                oThis.ndError.show();
                oThis.ndTable.hide();
                oThis.onError();
                if(oThis.bAnimate)oThis.ndInnerCont.slideDown();
            }
            
            oThis.hideLoading();
        };
        
        oThis.refresh = function(bSilent){
            
            oThis.getSymbolData(oThis.sSymbol, true);
            if(bSilent !== true)oThis.onRefresh();
            
            return false;
        };
        
        oThis.getDeliverables = function(sSymbol, sExchangeCode, sTypeCode){
            
            if(sSymbol && sExchangeCode && sTypeCode){
                
                getDeliverablesString(sSymbol, sExchangeCode, sTypeCode, function(oData){
                    
                    //{sDeliverables: sOut, sSymbol:sSymbol, sExchangeCode:sExchangeCode, sTypeCode:sTypeCode}
                    var ndAdjIcon = oThis.ndContainer.find(".qw-adj-icon");
                    if(ndAdjIcon[0])ndAdjIcon[0].title = oData.sDeliverables;
                });
            }
            
            return false;
        };
        
        oThis.onRefresh = function(){};
        oThis.onRefreshSuccess = function(){};
        oThis.onSuccess = function(){};
        oThis.onFailure = function(){};
        oThis.onError = function(){};
        
        oThis.start(sSymbol);
    }





    
    function OSIQuoteSpreadWidget(sID, sSymbol1, sSymbol2){
        
        var oThis = this;
        
        oThis.ndContainer = $("#"+sID);
        oThis.ndTitle = oThis.ndContainer.find(".sqw-title");
        
        oThis.ndLeg1 = oThis.ndContainer.find(".sqw-leg1");
        oThis.ndLeg2 = oThis.ndContainer.find(".sqw-leg2");
        
        oThis.ndLast1 = oThis.ndLeg1.find(".qw-last");
        oThis.ndBid1 = oThis.ndLeg1.find(".qw-bid");
        oThis.ndAsk1 = oThis.ndLeg1.find(".qw-ask");
        oThis.ndVol1 = oThis.ndLeg1.find(".qw-vol");
        
        oThis.ndLast2 = oThis.ndLeg2.find(".qw-last");
        oThis.ndBid2 = oThis.ndLeg2.find(".qw-bid");
        oThis.ndAsk2 = oThis.ndLeg2.find(".qw-ask");
        oThis.ndVol2 = oThis.ndLeg2.find(".qw-vol");
        
        oThis.ndFooter = oThis.ndContainer.find(".qw-footer");
        oThis.ndTime1 = oThis.ndContainer.find(".sqw-leg1-time");
        oThis.ndTime2 = oThis.ndContainer.find(".sqw-leg2-time");
        oThis.ndFreq = oThis.ndContainer.find(".qw-freq");
        
        oThis.ndNetLabel = oThis.ndContainer.find(".sqw-net-label");
        oThis.ndNetBid = oThis.ndContainer.find(".sqw-net-bid div");
        oThis.ndNetAsk = oThis.ndContainer.find(".sqw-net-ask div");
        oThis.ndNetLabelImg = oThis.ndContainer.find(".sqw-net-label img");
        oThis.ndNetBidImg = oThis.ndContainer.find(".sqw-net-bid img");
        oThis.ndNetAskImg = oThis.ndContainer.find(".sqw-net-ask img");
        oThis.ndNetBidCont = oThis.ndContainer.find(".sqw-net-bid");
        oThis.ndNetAskCont = oThis.ndContainer.find(".sqw-net-ask");
        //oThis.ndNetType = oThis.ndContainer.find(".sqw-net-type");
        
        oThis.ndRefresh = oThis.ndContainer.find(".qw-refresh");
        
        oThis.sSymbol1 = (sSymbol1)?sSymbol1:"";
        oThis.sSymbol2 = (sSymbol2)?sSymbol2:"";
        oThis.sRatio = "";
        
        oThis.oLeg1 = {
            sSymbol:"",
            sDisplaySymbol:"",
            oData:false
        };
        
        oThis.oLeg2 = {
            sSymbol:"",
            sDisplaySymbol:"",
            oData:false
        };
        
        oThis.aImages = [
            AkamaiURL+"/images/osi/adj_options.gif",
            AkamaiURL+"/images/osi/creditspread.gif",
            AkamaiURL+"/images/osi/debitspread.gif"
        ];
        
        oThis.sDataURL = "/e/t/invest/flash.json";
        
        oThis.oSymbol = {};
        
        
        
        
        oThis.start = function(sSymbol){
            
            oThis.getSymbolData(oThis.sSymbol1, oThis.sSymbol2);
            
            oThis.ndRefresh.click(oThis.refresh);
        };
        
        oThis.getSymbolData = function(sSymbol1, sSymbol2){
            
            if(sSymbol1){
                
                $.getJSON(oThis.sDataURL, {sym:sSymbol1, type:"OPTN"}, 
                    
                    function(data){
                        
                        if(data.product){
                            
                            oThis.sSymbol1 = data.product.symbol;
                            oThis.oLeg1.sSymbol = data.product.symbol;
                            oThis.oLeg1.sDisplaySymbol = data.product.display_symbol;
                            oThis.oLeg1.oData = data.product;
                            oThis.populate();
                            oThis.ndLeg1.find("td").each(function(){this.title = oThis.oLeg1.sDisplaySymbol});
                            
                        }else{
                            
                            oThis.showError();
                        }
                    }
                );
            }
            
            if(sSymbol2){
                
                $.getJSON(oThis.sDataURL, {sym:sSymbol2, type:"OPTN"}, 
                    
                    function(data){
                        
                        if(data.product){
                            
                            oThis.sSymbol2 = data.product.symbol;
                            oThis.oLeg2.sSymbol = data.product.symbol;
                            oThis.oLeg2.sDisplaySymbol = data.product.display_symbol;
                            oThis.oLeg2.oData = data.product;
                            oThis.populate();
                            oThis.ndLeg2.find("td").each(function(){this.title = oThis.oLeg2.sDisplaySymbol});
                            
                        }else{
                            
                            oThis.showError();
                        }
                    }
                );
            }
            
            return true;
        };
        
        oThis.populate = function(){
            
            var oSym;
            
            if(oThis.oLeg1.oData){
                
                oSym = oThis.oLeg1.oData;
                
                if(oSym.adjusted_option_flag == "1"){
                    
                    oThis.ndLast1.html("<img class='qw-adj-icon' src='"+oThis.aImages[0]+"'/>"+parseFloat(oSym.price).floatPrecision(2, true)+"*");
                    oThis.ndLast1.css({paddingLeft:"2px"})
                    oThis.getDeliverables(oThis.ndLast1, oSym.symbol, oSym.exchange_code, oSym.type_code);
                    
                }else{
                    
                    oThis.ndLast1.html(parseFloat(oSym.price).floatPrecision(2, true)+"*");
                    oThis.ndLast1.css({paddingLeft:"10px"})
                }
                oThis.ndBid1.html(parseFloat(oSym.bid).floatPrecision(2, true)+" ("+oSym.bidsize+")");
                oThis.ndAsk1.html(parseFloat(oSym.ask).floatPrecision(2, true)+" ("+oSym.asksize+")");
                oThis.ndVol1.html(formatNumber(parseInt(oSym.volume), ","));
                oThis.ndFreq.html(getQuoteFreqString(oSym.quote_type, "option"));
                if(oSym.timestring)oThis.ndTime1.html("*"+formatFlashTimeString(oSym.flashtimestring, "m/d/y h:i:s r t"));
                
                oThis.ndRefresh.css({"visibility":"visible"});
            }
            
            if(oThis.oLeg2.oData){
                
                oSym = oThis.oLeg2.oData;
                
                if(oSym.adjusted_option_flag == "1"){
                    
                    oThis.ndLast2.html("<img class='qw-adj-icon' src='"+oThis.aImages[0]+"'/>"+parseFloat(oSym.price).floatPrecision(2, true)+"**");
                    oThis.ndLast2.css({"padding-left":"2px"});
                    oThis.getDeliverables(oThis.ndLast2, oSym.symbol, oSym.exchange_code, oSym.type_code);
                    
                }else{
                    
                    oThis.ndLast2.html(parseFloat(oSym.price).floatPrecision(2, true)+"**");
                    oThis.ndLast2.css({"padding-left":"10px"});
                }
                oThis.ndBid2.html(parseFloat(oSym.bid).floatPrecision(2, true)+" ("+oSym.bidsize+")");
                oThis.ndAsk2.html(parseFloat(oSym.ask).floatPrecision(2, true)+" ("+oSym.asksize+")");
                oThis.ndVol2.html(formatNumber(parseInt(oSym.volume), ","));
                oThis.ndFreq.html(getQuoteFreqString(oSym.quote_type, "option"));
                if(oSym.timestring)oThis.ndTime2.html("**"+formatFlashTimeString(oSym.flashtimestring, "m/d/y h:i:s r t"));
                
                oThis.ndRefresh.css({"visibility":"visible"});
            }
            
            if(oThis.oLeg1.oData && oThis.oLeg2.oData)oThis.onLegsAquired();
        }
        
        oThis.clear = function(){
            
            oThis.clearLeg(1);
            oThis.clearLeg(2);
            
            oThis.clearNetBidAsk();
            
            oThis.ndFreq.html("");
            oThis.ndRefresh.css({"visibility":"hidden"});
            //oThis.ndNetType.hide();
        };
        
        oThis.clearNetBidAsk = function(){
            
            oThis.ndNetBid.html("- -");
            oThis.ndNetAsk.html("- -");
            
            oThis.ndBid1.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            oThis.ndAsk1.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            oThis.ndBid2.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            oThis.ndAsk2.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            oThis.ndNetBidCont.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            oThis.ndNetAskCont.removeClass("sqw-blu1-bg").removeClass("sqw-blu2-bg");
            
            oThis.ndNetLabelImg.css({"visibility":"hidden"});
            oThis.ndNetBidImg.css({"visibility":"hidden"});
            oThis.ndNetAskImg.css({"visibility":"hidden"});
        };
        
        oThis.clearLeg = function(iLeg){
            
            var sDefault = "- -";
            
            switch(iLeg){
                
                case 1:
                    
                    oThis.ndLast1.html(sDefault);
                    oThis.ndBid1.html(sDefault);
                    oThis.ndAsk1.html(sDefault);
                    oThis.ndVol1.html(sDefault);
                    oThis.ndTime1.html(sDefault);
                    oThis.ndLeg1.find("td").each(function(){this.title = ""});
                    oThis.oLeg1 = {sSymbol:"", sDisplaySymbol:"", oData:false};
                    break;
                
                case 2:
                    
                    oThis.ndLast2.html(sDefault);
                    oThis.ndBid2.html(sDefault);
                    oThis.ndAsk2.html(sDefault);
                    oThis.ndVol2.html(sDefault);
                    oThis.ndTime2.html("&#160;");
                    oThis.ndLeg2.find("td").each(function(){this.title = ""});
                    oThis.oLeg2 = {sSymbol:"", sDisplaySymbol:"", oData:false};
                    break;
            }
        };
        
        oThis.refresh = function(bSilent){
            
            oThis.getSymbolData(oThis.oLeg1.sSymbol, oThis.oLeg2.sSymbol);
            
            oThis.clear();
            
            if(bSilent !== true)oThis.onRefresh();
            
            return false;
        };
        
        oThis.updateNetBidAsk = function(iQty1, iQty2, iType1, iType2){
            
            var o = oThis;
            
            o.ndNetBid.html("- -");
            o.ndNetAsk.html("- -");
            
            if(iQty1 && iQty2 && iType1 && iType2 && oThis.oLeg1.oData && oThis.oLeg2.oData){
                
				iQty1 = parseInt(iQty1);
				iQty2 = parseInt(iQty2);
				
                var iAsk1 = parseFloat(oThis.oLeg1.oData.ask),
                    iBid1 = parseFloat(oThis.oLeg1.oData.bid),
                    iAsk2 = parseFloat(oThis.oLeg2.oData.ask),
                    iBid2 = parseFloat(oThis.oLeg2.oData.bid),
                    iMinQty = ((iQty1 < iQty2)?iQty1:iQty2),
                    sImgURL = "", 
					sImgTitle = "",
	                aRatio = reduceRatio(iQty1, iQty2);
                
				oThis.sRatio = aRatio[0]+":"+aRatio[1];
                
                // Buy/Sell (Vertical)
                if((iType1 == 1 || iType1 == 3) && (iType2 == 2 || iType2 == 4)){
                    
                    o.iNetBid = fixPrec(fixPrec(fixPrec(iQty1 * iBid1) - fixPrec(iQty2 * iAsk2)) / iMinQty);
                    o.iNetAsk = fixPrec(fixPrec(fixPrec(iQty1 * iAsk1) - fixPrec(iQty2 * iBid2)) / iMinQty);
                    
                    bgColor(o.ndBid1, 1);          bgColor(o.ndAsk1, 0);
                    bgColor(o.ndBid2, 0);          bgColor(o.ndAsk2, 1);
                    bgColor(o.ndNetBidCont, 1);    bgColor(o.ndNetAskCont, 0);
                    
                // Buy/Buy (Long Straddle)
                }else if(((iType1 == 1 || iType1 == 3) && (iType2 == 1 || iType2 == 3))){
                    
                    o.iNetBid = fixPrec(fixPrec(fixPrec(iQty1 * iBid1) + fixPrec(iQty2 * iBid2)) / iMinQty);
                    o.iNetAsk = fixPrec(fixPrec(fixPrec(iQty1 * iAsk1) + fixPrec(iQty2 * iAsk2)) / iMinQty);
                    
                    bgColor(o.ndBid1, 1);          bgColor(o.ndAsk1, 1);
                    bgColor(o.ndBid2, 1);          bgColor(o.ndAsk2, 1);
                    bgColor(o.ndNetBidCont, 1);    bgColor(o.ndNetAskCont, 1);
                
                // Sell/Sell (Short Straddle)
                }else if((iType1 == 2 || iType1 == 4) && (iType2 == 2 || iType2 == 4)){
                    
                    o.iNetBid = fixPrec(fixPrec(fixPrec(iQty1 * (iBid1)) + fixPrec(iQty2 * (iBid2))) / iMinQty);
                    o.iNetAsk = fixPrec(fixPrec(fixPrec(iQty1 * (iAsk1)) + fixPrec(iQty2 * (iAsk2))) / iMinQty);
                    
                    bgColor(o.ndBid1, 1);          bgColor(o.ndAsk1, 1);
                    bgColor(o.ndBid2, 1);          bgColor(o.ndAsk2, 1);
                    bgColor(o.ndNetBidCont, 1);    bgColor(o.ndNetAskCont, 1);
                    
                // Sell/Buy (Vertical)
                }else if((iType1 == 2 || iType1 == 4) && (iType2 == 1 || iType2 == 3)){
                    
                    o.iNetBid = fixPrec(fixPrec(fixPrec(iQty1 * fixPrec(iBid1 * -1)) + fixPrec(iQty2 * iAsk2)) / iMinQty);
                    o.iNetAsk = fixPrec(fixPrec(fixPrec(iQty1 * fixPrec(iAsk1 * -1)) + fixPrec(iQty2 * iBid2)) / iMinQty);
                    
                    bgColor(o.ndBid1, 0);          bgColor(o.ndAsk1, 1);
                    bgColor(o.ndBid2, 1);          bgColor(o.ndAsk2, 0);
                    bgColor(o.ndNetBidCont, 0);    bgColor(o.ndNetAskCont, 1);
                }
                
                oThis.ndNetBid.html(Math.abs(o.iNetBid).floatPrecision(2));
                oThis.ndNetAsk.html(Math.abs(o.iNetAsk).floatPrecision(2));
                
                
                
                oThis.iMidPoint = Math.abs((o.iNetAsk - (o.iNetAsk - o.iNetBid) / 2)).toFixed(2);
                oThis.onMidpointChange();
                
                if(aRatio[0] == 1 && aRatio[1] == 1){
                    
                    sImgURL = AkamaiURL+"/images/osi/qw-qmark2.gif";
                    oThis.ndNetLabelImg[0].title = "Quotes for Net Bid/Ask are provided at NBBO bid and ask of each option, however, the NBBO of both options may not be available at certain exchanges.";
                    
                }else{
                    
                    sImgURL = AkamaiURL+"/images/osi/qw-qmark1.gif";
                    oThis.ndNetLabelImg[0].title = "Quotes for Net Bid/Ask are provided at NBBO bid and ask of each option, however, the NBBO of both options may not be available at certain exchanges.";
                }
                
                /*
                Net Bid:
                    
                    Buy/Buy, 
                    "Net Bid is the sum of the buy side bid price calculated at a"+aRatio[0]+":"+aRatio[1]+" ratio.";
                
                    Sell/Sell
                    "Net Bid is the sum of the sell side bid price calculated at a"+aRatio[0]+":"+aRatio[1]+" ratio.";
                
                
                Net Ask:
                    
                    Buy/Buy, 
                    "Net Ask is the sum of the buy side bid price calculated at a"+aRatio[0]+":"+aRatio[1]+" ratio.";
                
                    Sell/Sell
                    "Net Ask is the sum of the sell side bid price calculated at a"+aRatio[0]+":"+aRatio[1]+" ratio.";
                */
                
				oThis.ndNetBidImg[0].title = "Net Bid is the buy side bid minus the sell side offer calculated at a "+aRatio[0]+":"+aRatio[1]+" ratio.";
                oThis.ndNetAskImg[0].title = "Net Ask is the buy side offer minus the sell side bid calculated at a "+aRatio[0]+":"+aRatio[1]+" ratio.";
				
                oThis.ndNetLabelImg[0].src = sImgURL;
                oThis.ndNetBidImg[0].src = sImgURL;
                oThis.ndNetAskImg[0].src = sImgURL;
                
                oThis.ndNetLabelImg.css({"visibility":"visible"});
                oThis.ndNetBidImg.css({"visibility":"visible"});
                oThis.ndNetAskImg.css({"visibility":"visible"});
                
				/*
                if(oThis.sRatio == "1:1" && oThis.oLeg1.oData.adjusted_option_flag != "1" && oThis.oLeg2.oData.adjusted_option_flag != "1"){
                    
                    switch(oThis.calculateDebitSpread()){
                        
                        case 0:
                            
                            oThis.ndNetType.fadeOut();
                            break;
                            
                        // Debit
                        case 1:
                            
                            oThis.ndNetType[0].src = oThis.aImages[2];
                            oThis.ndNetType[0].title = "A Debit Spread is based on the strikes that you have selected";
                            oThis.ndNetType.fadeIn();
                            break;
                            
                        // Credit
                        case 2:
                            
                            oThis.ndNetType[0].src = oThis.aImages[1];
                            oThis.ndNetType[0].title = "A Credit Spread is based on the strikes that you have selected";
                            oThis.ndNetType.fadeIn();
                            break;
                    }
                    
                }else{
                    
                    oThis.ndNetType.fadeOut();
                }
                */
				
                //oThis.ndNetType.hide();
				
            }else{
                
                o.iNetBid = 0;
                o.iNetAsk = 0;
                o.iMidPoint = false;
                
                //oThis.ndNetType.fadeOut();
                
                oThis.ndNetLabelImg.css({"visibility":"hidden"});
                oThis.ndNetBidImg.css({"visibility":"hidden"});
                oThis.ndNetAskImg.css({"visibility":"hidden"});
            }
            
            function bgColor(ndNode, iColor){
                var aColors = ["sqw-blu1-bg", "sqw-blu2-bg"];
                ndNode.addClass(aColors[iColor]).removeClass(aColors[((iColor == 0)?1:0)]);
            }
        };
        
        oThis.formatChange = function(oSym){
            
            var sOperator = "",
                sClass = "";
            
            if(oSym.change > 0){sOperator = "+";sClass = "qw-change-up"}
            else if(oSym.change < 0)sClass = "qw-change-down";
            
            return oSym.bid+"&nbsp;&nbsp;<span class='"+sClass+"'>"+sOperator+oSym.change+"&nbsp;&nbsp;("+sOperator+oSym.percent_change+"%)</span>";
        };
        
        oThis.getDeliverables = function(ndPrice, sSymbol, sExchangeCode, sTypeCode){
            
            if(ndPrice && sSymbol && sExchangeCode && sTypeCode){
                
                getDeliverablesString(sSymbol, sExchangeCode, sTypeCode, function(oData){
                    ndPrice.find(".qw-adj-icon")[0].title = oData.sDeliverables;
                });
            }
            
            return false;
        };
        
        oThis.trackInput = function(ndNode){
            
            $(ndNode).change(oThis.submit);
        };
        
        oThis.calculateDebitSpread = function(){return 0};
        oThis.onLegsAquired = function(){};
        oThis.updateByOrderType = function(){};
        oThis.onRefresh = function(){};
        oThis.getContractSums = function(){};
        oThis.getOrderTypes = function(){};
        oThis.onMidpointChange = function(){};
        oThis.showError = function(){};
        
        oThis.start();
    }






























    function OSIStockSelectionController(ndTransaction, ndShares, ndSymbol, ndSymbolButton){
        
        var oThis = this;
        
        oThis.sSymbol;
        
        oThis.ndTransaction = ndTransaction;
        oThis.ndShares = ndShares;
        oThis.ndSymbol = ndSymbol;
        oThis.ndSymbolButton = ndSymbolButton;
        
        oThis.aInputs = [
            oThis.ndTransaction,
            oThis.ndShares,
            oThis.ndSymbol,
            oThis.ndSymbolButton
        ];
        
        oThis.oInputs = {
            OrderType: oThis.ndTransaction,
            Shares: oThis.ndShares,
            Symbol: oThis.ndSymbol,
            Go: oThis.ndSymbolButton
        };
        
        oThis.bFormComplete = false;
        
        
        
        
        oThis.start = function(){
            
            $.each(oThis.aInputs, function(){$(this).change(oThis.validate)});
            
            if(oThis.ndSymbolButton)oThis.ndSymbolButton.click(oThis.submit);
            else oThis.ndSymbol.blur(oThis.onBlur);
        };
        
        oThis.validate = function(){
            
            var oInputs = oThis.oInputs;
            
            if(oInputs.OrderType.selectedIndex == 0){oThis.bFormComplete = false;oThis.onFormIncomplete();return true}
            if(oInputs.Shares.val().length == 0){oThis.bFormComplete = false;oThis.onFormIncomplete();return true}
            if(oInputs.Symbol.val().length == 0){oThis.bFormComplete = false;oThis.onFormIncomplete();return true}
            
            oThis.bFormComplete = true;
            oThis.onFormComplete();
            return true;
        };
        
        oThis.submit = function(){
            
            oThis.onSubmit();
            
            oThis.getSymbolData(oThis.ndSymbol.val());
                        
            return false;
        };
        
        oThis.setSymbol = function(sSymbol){

            if(sSymbol){
                
                oThis.ndSymbol.val(sSymbol);
                oThis.submit();
            }
        };
        
        oThis.getSymbolData = function(sSymbol, fSuccess, fFailure){
            
            if(!sSymbol && oThis.sSymbol)oSymbol = oThis.sSymbol;
            else if(!sSymbol && !oThis.sSymbol)return false;
            
            $.getJSON("/e/t/invest/flash.json", {sym:sSymbol},
                
                function(data){
                    
                    if(data.product){
                        
                        oThis.sSymbol = sSymbol;
                        oThis.oSymbol = data.product;
                        oThis.onSuccess();
                        if(fSuccess)fSuccess();
                        
                    }else{
                        
                        //oThis.ndSymbol.val(oThis.sSymbol);
                        oThis.showError();
                        oThis.onFailure();
                        if(fFailure)fFailure();
                    }
                }
            )
            
            return true;
        };
        
        oThis.onBlur = function(){};
        oThis.onSuccess = function(){};
        oThis.onSubmit = function(){};
        oThis.onSymbolSubmit = function(){};
        oThis.onFormIncomplete = function(){};
        oThis.onFormComplete = function(){};
    }










    
    
    function OSIOptionSelectionController(ndOrderType, ndContracts, ndType, ndExpiration, ndStrike, ndSymbol, ndStrikeAdjFlag){
        
        var oThis = this;
        
        oThis.ndTransaction = ndOrderType;
        oThis.ndContracts = ndContracts;
        oThis.ndType = ndType;
        oThis.ndExpiration = ndExpiration;
        oThis.ndStrike = ndStrike;
        oThis.ndSymbol = ndSymbol;
        oThis.ndStrikeAdjFlag = ndStrikeAdjFlag;
        
        oThis.aInputs = [
            ndOrderType,
            ndContracts,
            ndType,
            ndExpiration,
            ndStrike
        ];
        oThis.oInputs = {
            OrderType: ndOrderType,
            Contracts: ndContracts,
            Type: ndType,
            Expiration: ndExpiration,
            Strike: ndStrike
        };
        
        oThis.sSymbol = "";
        oThis.sOptionSymbol = "";
        oThis.sDisplaySymbol = "";
        oThis.sDefaultOptionSymbol = false;
        oThis.sDefaultDisplaySymbol = false;
        oThis.sDefaultOptionType = false;
        oThis.oDefaultExpiration = false;
        oThis.iDefaultOptionType = 0;
        oThis.iDefaultExpiration = 0;
        oThis.sLastValue = "";
        
        oThis.sCallPut = "";
        
        oThis.iStockPrice = 0;
        
        oThis.oExpData = {};
        oThis.oStrikeData = {};
        oThis.oFSDD;
        
        oThis.aExpirations = [];
        oThis.aStrikes = [];
        oThis.aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        oThis.bExpirationsLoaded = false;
        oThis.bStrikesLoaded = false;
        oThis.bAddAdjusted = 0;
        oThis.bShowAllStrikes = 1;
        oThis.bFormComplete = false;
        oThis.bStikesContainAdj = false;
        oThis.bSelectedAdjOpt = false;
        oThis.bRetainSelection = false;
        
        
        
        
        oThis.start = function(){
            
            $.each(oThis.aInputs, function(){if(this.change)this.change(oThis.validate)});
            
            oThis.oInputs.Expiration.change(oThis.onExpirationChange);
            
            oThis.oInputs.Type.change(oThis.getOptionQuote);
            oThis.oInputs.Expiration.change(oThis.getOptionQuote);
            oThis.oInputs.Strike.change(oThis.getOptionQuote);
            
            if(oOSI.bUseFancyStrikes)oThis.oFSDD = new OSIFancyStrikeDropDown(oThis.oInputs.Strike);
            
            oThis.validate();
        };
        
        oThis.reverseLookup = function(sSymbol, fAcuteReaction){
            
            $.getJSON("/e/t/invest/flash.json", {sym:sSymbol, type:"OPTN"},
                
                function(data){
                    
                    if(data.product){
                        
                        if(data.product.adjusted_option_flag == "1"){
                            
                            oThis.bAddAdjusted = 1;
                        }
                        
                        var aExp = data.product.expired_date.split("/");
                        
                        oThis.oDefaultExpiration = {Year:aExp[2], Day:aExp[1], Month:aExp[0]};
                        oThis.sDefaultDisplaySymbol = data.product.display_symbol;
                        oThis.sDefaultOptionSymbol = data.product.symbol.toUpperCase();
                        oThis.sDefaultOptionType = data.product.option_type;
                        oThis.sSymbol = data.product.underlying_symbol;
                        oThis.iStockPrice = data.underlying_product.price;
                        oThis.oInputs.Type.val(oThis.sDefaultOptionType);
                        oThis.oInputs.Type.change();
                        enableInputs([oThis.oInputs.Type]);
                        
                        oOSI.oOSIQueue.add(oThis.getExpirations);
                        
                        if(fAcuteReaction)fAcuteReaction(data.product);
                        
                        oThis.onReverseLookupUnderlier(oThis.sSymbol);
                    }
                }
            );
        };
        
        oThis.getExpirations = function(){
            
            disableInputs([oThis.oInputs.Expiration, oThis.oInputs.Strike], true);
            
            oThis.bExpirationsLoaded = false;
            
            var sDataURL = "/e/t/invest/OptionExpireDateGet.json",
                oParams = {symbol:oThis.sSymbol, addAdjustedFlag:(oThis.bAddAdjusted)?1:0},
                oData = oOSI.oOSICache.recall(sDataURL, oParams);
            
            if(oData){
                
                oThis.processExpirations(oData, sDataURL, oParams);
                
            }else{
                
                $.getJSON(sDataURL, oParams, function(oData){oThis.processExpirations(oData, sDataURL, oParams)});
            }
        };
        
        oThis.processExpirations = function(oData, sDataURL, oParams){
            
            if(oData.ExpireDates){
                
                oThis.bExpirationsLoaded = true;
                
                oOSI.oOSICache.cache(sDataURL, oParams, oData);
                
                var sSelected = "";
                
                oThis.oExpData = oData;
                
                oThis.aExpirations = (oData.ExpireDates.length)?oData.ExpireDates:[oData.ExpireDates];
                
                var sOptionsHTML = "<option value=''>- -</option>",
					sWeekly = "";
                
                for(var i=0; i<oThis.aExpirations.length;i++){
                    
                    if((i+1) == oThis.iDefaultExpiration || (oThis.oDefaultExpiration && oThis.oDefaultExpiration.Year == oThis.aExpirations[i].Year && oThis.oDefaultExpiration.Month == oThis.aExpirations[i].Month && oThis.oDefaultExpiration.Day == oThis.aExpirations[i].Day)){                                
                        sSelected = "SELECTED";
                    }else sSelected = "";
                    
					if(oThis.aExpirations[i].ExpireTypeCd && oThis.aExpirations[i].ExpireTypeCd == "2")sWeekly = "w"; else sWeekly = "";
					
                    sOptionsHTML += "<option value='"+(i+1)+"' "+sSelected+">"+ convertDateToString(oThis.aExpirations[i]) + sWeekly + "</option>";
                }
                
                if(oThis.iDefaultOptionType != "0")oThis.oInputs.Type.val(oThis.iDefaultOptionType);
                
                oThis.ndExpiration.html(sOptionsHTML);
                
                //if(oThis.oDefaultExpiration || oThis.iDefaultExpiration != "0")oThis.ndExpiration.change();
                if(oThis.oDefaultExpiration || oThis.iDefaultExpiration != "0"){

                    oOSI.oOSIQueue.add(oThis.getStrikePrices);
                }
                
                enableInputs([oThis.oInputs.Expiration]);
                
                oThis.onExpirationSuccess(oData);
                
            }else if(!oData.ExpireDates && oData.HasAdjusted.StandardFlag == 0 && oData.HasAdjusted.AdjustedFlag == 1){
                
                oThis.oExpData = oData;
                oThis.onExpirationSuccess();
                
            }else{
                
                oThis.onNoExpirations();
            	return false;
            }
            
            function convertDateToString(oDate){
                
                return oThis.aMonths[oDate.Month-1]+" "+oDate.Day+" '"+oDate.Year.substr(2,2);
            }
            
            oOSI.oOSIQueue.stepForward();
        };
        
        oThis.getStrikePrices = function(){
            
            var iIndex = oThis.ndExpiration[0].selectedIndex;
            
			oThis.sLastValue = oThis.oInputs.Strike.val();
			
            oThis.bStrikesLoaded = false;
            
            if(iIndex == 0){
                
                disableInputs([oThis.oInputs.Strike], true);
				oOSI.oOSIQueue.stepForward();
				oThis.oFSDD.sync();
                return false;
                
            }else if(oThis.aExpirations[iIndex-1]){
                
                disableInputs([oThis.oInputs.Strike], true);
                
                var sDataURL = "/e/t/invest/OptionStrikeGet.json",
                    oDate = oThis.aExpirations[iIndex-1],
                    oParams = {
                        symbol: oThis.sSymbol,
                        month: oDate.Month,
                        day: oDate.Day,
                        year: oDate.Year,
                        addAdjusted: oThis.bAddAdjusted,
                        showAllStrikes: oThis.bShowAllStrikes
                    },
                    oData = oOSI.oOSICache.recall(sDataURL, oParams);
                
                if(oData){
                    
                    oThis.processStrikePrices(oData, sDataURL, oParams);
                    
                }else{
                    
                    $.getJSON(sDataURL, oParams, function(oData){oThis.processStrikePrices(oData, sDataURL, oParams)});
                }
            }
        };
        
        oThis.processStrikePrices = function(oData, sDataURL, oParams){
            
            if(oData.OptionStrikes){
                
                oThis.bStrikesLoaded = true;
                
                oOSI.oOSICache.cache(sDataURL, oParams, oData);
                
                if(!oData.OptionStrikes.length){
                    
                    oData.OptionStrikes = [oData.OptionStrikes];
                }
                
                var sStrikePrice;
                
                oThis.bStikesContainAdj = false;
                
                oThis.oStrikeData = oData;
                
                enableInputs([oThis.oInputs.Strike]);
                
                var sStrikesHTML = "<option value=''>- -</option>",
                    iPrice, iDiff, iLastDiff = false,
                    sSelected = "", bSelected = false, iSelectedIndex = 0,
                    iLength = oData.OptionStrikes.length, aPrices = [], iATMIndex = false;
                
                oThis.aStrikes = [];
                
                for(var i=0; i<iLength;i++){
                    
                    sSelected = "";
                    
                    if(iLength == 1){
                        
                        oThis.aStrikes.push({oStrike:oData.OptionStrikes[i], oPut:oData.Put, oCall:oData.Call});
                        
                    }else{
                        
                        oThis.aStrikes.push({oStrike:oData.OptionStrikes[i], oPut:oData.Put[i], oCall:oData.Call[i]});
                    }
                    
                    if(oThis.sDefaultOptionType && oThis.sDefaultDisplaySymbol){
                        
                        if(iLength == 1){
                            
                            iSelectedIndex = 1;
                            
                        }else if(iLength > 1 && oData[(oThis.sDefaultOptionType == 1)?"Call":"Put"][i].Symbol == oThis.sDefaultOptionSymbol){
                            
                            iSelectedIndex = i+1;
                        }
                    }
                    
                    if(parseFloat(oData.OptionStrikes[i].StrikePrice) % 1 == 0){
						
                        sStrikePrice = parseFloat(oData.OptionStrikes[i].StrikePrice).floatPrecision(1);
						
                    }else{
						
                        sStrikePrice = parseFloat(oData.OptionStrikes[i].StrikePrice)
                    }
                    
                    if(oData.OptionStrikes[i].AdjustedFlag == 1){
                        
                        oThis.bStikesContainAdj = true;
                        sStrikesHTML += "<option class='fsdd-adj' style='color:red' value='"+parseFloat(oData.OptionStrikes[i].StrikePrice)+"'>"+ sStrikePrice +"</option>";
                        
                    }else{
                        
                        sStrikesHTML += "<option value='"+parseFloat(oData.OptionStrikes[i].StrikePrice)+"'>"+ sStrikePrice +"</option>";
                    }
                }
                
                if(oThis.ndStrikeAdjFlag)(oThis.bStikesContainAdj)?oThis.ndStrikeAdjFlag.show():oThis.ndStrikeAdjFlag.hide();
                
                oThis.ndStrike.html(sStrikesHTML);
                
                for(var i=0; i<iLength;i++){
                    
                    if(!bSelected){
                        
                        iPrice = parseFloat(oData.OptionStrikes[i].StrikePrice);
                        
                        if((iLength == 1) || (iPrice > oThis.iStockPrice && i == 0)){
                            
                            bSelected = true;
                            
                        }else{
                            
                            iDiff = Math.abs(oThis.iStockPrice - iPrice);
                            
                            if(iPrice > oThis.iStockPrice){
                                
                                if(iDiff <= iLastDiff){
                                    bSelected = true;
                                    iATMIndex = i+1;
                                }else{
                                    bSelected = true;
                                    iATMIndex = i;
                                }
                            }
                            
                            iLastDiff = iDiff;
                        }
                    }
                }
                
                if(iATMIndex)$(oThis.ndStrike[0].childNodes[iATMIndex]).addClass("fsdd-atm");
                
				
				oThis.ndStrike[0].selectedIndex = iSelectedIndex;
                
				try{oThis.ndStrike[0].childNodes[iSelectedIndex].selected = true}catch(e){}
                
                if(oThis.sDefaultOptionType)oThis.oInputs.Type.val(oThis.sDefaultOptionType).change();
				
                if(oThis.bRetainSelection && (oThis.sLastValue != "" || oThis.sLastValue != "- -") && !oThis.sDefaultOptionSymbol){
					
                    oThis.ndStrike[0].value = oThis.sLastValue;
                }
				
				oThis.sDefaultOptionSymbol = false;
                oThis.sDefaultDisplaySymbol = false;
                oThis.sDefaultOptionType = false;
                oThis.oDefaultExpiration = false;
                oThis.iDefaultOptionType = 0;
                oThis.iDefaultExpiration = 0;
				
                if(oOSI.bUseFancyStrikes)oThis.oFSDD.rebuildDropDown();
                
				oThis.getOptionQuote();
				
                oThis.onStrikeSuccess();
                
                oThis.validate();
            }
            
            oOSI.oOSIQueue.stepForward();
        };
        
        oThis.getOptionQuote = function(){
            
            if(oThis.aStrikes.length > 0){
                
                var oStrike,
                    iTypeIndex = oThis.ndType[0].selectedIndex,
                    iExpIndex = oThis.ndExpiration[0].selectedIndex,
                    iStrikeIndex = oThis.ndStrike[0].selectedIndex;
                
                if(iTypeIndex > 0 && iExpIndex > 0 && iStrikeIndex > 0){
                    
                    if(oStrike = oThis.aStrikes[iStrikeIndex-1]){
                        
                        switch(iTypeIndex){
                            
                            case 1:
                                if(oThis.sOptionSymbol == oStrike.oCall.Symbol)return false;
                                oThis.sOptionSymbol = oStrike.oCall.Symbol;
                                oThis.sDisplaySymbol = oStrike.oCall.DisplaySymbol;
                                if(oThis.ndSymbol)oThis.ndSymbol.val(oThis.sOptionSymbol);
                                break;
                                
                            case 2:
                                if(oThis.sOptionSymbol == oStrike.oPut.Symbol)return false;
                                oThis.sOptionSymbol = oStrike.oPut.Symbol;
                                oThis.sDisplaySymbol = oStrike.oPut.DisplaySymbol;
                                if(oThis.ndSymbol)oThis.ndSymbol.val(oThis.sOptionSymbol);
                                break;
                        }
                        
                        oThis.bSelectedAdjOpt = (oStrike.oStrike.AdjustedFlag == 0)?false:true;
                        
                        oThis.onOptionSelection();
                    }
                    
                }else{
                    
                    oThis.sOptionSymbol = "";
                	oThis.sDisplaySymbol = "";
                    if(oThis.ndSymbol)oThis.ndSymbol.val("");
                    oThis.onOptionDeselection();
                }
            }
        };
        
		oThis.onExpirationChange = function(){
			
			oOSI.oOSIQueue.add(oThis.getStrikePrices);			
		};
		
        oThis.updateSymbol = function(sSymbol, iPrice){
            
            oThis.sSymbol = sSymbol;
            oThis.iStockPrice = parseFloat(iPrice);
            
            oOSI.oOSIQueue.add(oThis.getExpirations);
        };
        
        oThis.validate = function(){
            
            var aInputs = oThis.aInputs,
                iLength = oThis.aInputs.length,
                ndNode, bComplete = true,
                oInputs = oThis.oInputs;
            
            
            if(oInputs.OrderType && oInputs.OrderType[0].selectedIndex == 0)bComplete = false;
            else if(oInputs.Contracts && oInputs.Contracts.val() == "")bComplete = false;
            else if(oInputs.Type && oInputs.Type[0].selectedIndex == 0)bComplete = false;
            else if(oInputs.Expiration && oInputs.Expiration[0].selectedIndex == 0)bComplete = false;
            else if(oInputs.Strike && oInputs.Strike[0].selectedIndex == 0)bComplete = false;
            
            if(!bComplete){
                
                oThis.bFormComplete = false;
                oThis.onFormIncomplete();
                
            }else{
                
                oThis.bFormComplete = true;
                oThis.onFormComplete();
            }
        };
        
        oThis.unloadExpirations = function(){
            
            oThis.bExpirationsLoaded = false;
            oThis.ndExpiration.html("<option value='' SELECTED>- -</option>");
        };
        
        oThis.unloadStrikes = function(){
            
            oThis.bStrikesLoaded = false;
            oThis.ndStrike.html("<option value='' SELECTED>- -</option>");
        };
        
        oThis.onExpirationSuccess = function(){};
        oThis.onStrikeSuccess = function(){};
        oThis.onFormIncomplete = function(){};
        oThis.onFormComplete = function(){};
        oThis.onOptionSelection = function(){};
        oThis.onOptionDeselection = function(){};
        oThis.onNoExpirations = function(){};
        oThis.onReverseLookupUnderlier = function(){};
        oThis.onSuccess = function(){};
        oThis.onFailure = function(){};
    }
    
    
    
    
    
    
    
    
    
    
    
    function OSIPriceSelectionController(ndPriceType, ndPrice, ndTerm, ndAON, ndPriceEntry, ndPriceLabel, ndAONCont, ndPrice2, ndPrice2Label, ndPrice2Entry, ndTWP, ndTWPCont, ndOrderType){
        
        var oThis = this;
        
        oThis.ndPriceType = ndPriceType;
        oThis.ndPrice = ndPrice;
        oThis.ndTerm = ndTerm;
        oThis.ndAON = (ndAON)?ndAON:false;
        oThis.ndAONCont = (ndAONCont)?ndAONCont:false;
        oThis.ndPriceEntry = ndPriceEntry;
        oThis.ndPriceLabel = ndPriceLabel;
        oThis.ndPrice2 = ndPrice2;
        oThis.ndPrice2Entry = ndPrice2Entry;
        oThis.ndPrice2Label = ndPrice2Label;
        oThis.ndTWP = ndTWP;
        oThis.ndTWPCont = ndTWPCont;
        oThis.ndOrderType = ndOrderType;
        
        
        oThis.aInputs = [
            oThis.ndPriceType,
            oThis.ndPrice,
            oThis.ndPrice2,
            oThis.ndTerm,
            oThis.ndAON,
            oThis.ndTWP
        ];
        
        oThis.oInputs = {
            PriceType: ndPriceType,
            Price: ndPrice,
            Price2:ndPrice2,
            Term: ndTerm,
            AON: ndAON,
            TWP: ndTWP
        };
        
        oThis.aTermGroups = [
            [{id:"3", name:"Good for the Day"}],
            [{id:"3", name:"Good for the Day"}, {id:"2", name:"Good for 60 Days"}],
            [{id:"3", name:"Good for the Day"}, {id:"2", name:"Good for 60 Days"}, {id:"5", name:"Immediate or Cancel"}, {id:"6", name:"Fill or Kill"}],
            [{id:"3", name:"Good for the Day"}, {id:"2", name:"Good for 60 Days"}, {id:"5", name:"Immediate or Cancel"}, {id:"6", name:"Fill or Kill"}, {id:"7", name:"Extended Hours (Good For The Day)"}, {id:"8", name:"Extended Hours (Immediate or Cancel)"}],
            [{id:"3", name:"Good for the Day"}, {id:"5", name:"Immediate or Cancel"}, {id:"6", name:"Fill or Kill"}]
        ];
        
        oThis.oDropDownChain = {
            "0":{id:"0", name:"- -",               terms:oThis.aTermGroups[0]},
            "1":{id:"1", name:"Market",            terms:oThis.aTermGroups[0]},
            "2":{id:"2", name:"Limit",             terms:oThis.aTermGroups[2], aon:{minQty:300, fade:true}, price:{name:"limitprice",          label:"Limit Price"}},
            "3":{id:"3", name:"Stop",              terms:oThis.aTermGroups[1],                              price:{name:"stopprice",           label:"Stop Price"}},
            "4":{id:"4", name:"Stop Limit",        terms:oThis.aTermGroups[1], aon:{minQty:300, fade:true}, price:{name:"stoplimitprice",      label:"Limit Price"}},
            "6":{id:"6", name:"Trailing Stop $",   terms:oThis.aTermGroups[1],                              price:{name:"trailingOffsetValue", label:"Stop Value $"}},
            "7":{id:"7", name:"Trailing Stop %",   terms:oThis.aTermGroups[1],                              price:{name:"trailingOffsetValue", label:"Stop Value %"}},
            "13":{id:"13", name:"Market On Close", terms:oThis.aTermGroups[0]}
        };
        
        oThis.iInitialPriceSelectedIndex = false;
        
        oThis.bFormComplete = false;
        
        
        
        
        oThis.start = function(){
            
            oThis.iInitialPriceSelectedIndex = oThis.oInputs.Term[0].selectedIndex;
            
            if(oThis.ndOrderType)oThis.ndOrderType.change(oThis.dropDownSelectionTransformation);
            oThis.oInputs.PriceType.change(oThis.dropDownSelectionTransformation);
            
            oThis.oInputs.PriceType.change(oThis.changePriceType);
            
            $.each(oThis.aInputs, function(){$(this).change(oThis.validate)});
            
            oThis.oInputs.PriceType.change();
        };
        
        oThis.changePriceType = function(){
            
            var oChain = oThis.oDropDownChain[oThis.oInputs.PriceType.val()];
            
            if(oChain){
                
                if(oThis.ndAONCont){
                    
                    if(oChain.aon && oThis.criteriaForAON()){
                        
                        (oChain.aon.fade)?oThis.ndAONCont.fadeIn():oThis.ndAONCont.show();
                        
                    }else if(oChain.aon && !oThis.criteriaForAON()){
                        
                        oThis.ndAON[0].checked = false;
                        (!oChain.aon.showDefault)?oThis.ndAONCont.fadeOut():oThis.ndAONCont.hide();
                        
                    }else{
                        
                        oThis.ndAON[0].checked = false;
                        oThis.ndAONCont.hide();
                    }
                }
                
                if(oThis.ndTWPCont){
                    
                    if(oChain.twp && oThis.criteriaForTWP()){
                        
                        (oChain.twp.fade)?oThis.ndTWPCont.fadeIn():oThis.ndTWPCont.show();
                        
                    }else if(oChain.twp && !oThis.criteriaForTWP()){
                        
                        oThis.ndTWP[0].checked = false;
                        (oChain.twp.fade)?oThis.ndTWPCont.fadeOut():oThis.ndTWPCont.hide();
                    
                    }else{
                        
                        oThis.ndTWP[0].checked = false;
                        oThis.ndTWPCont.hide();
                    }
                }
                
				oThis.updateTerms(oChain.terms)
				
                if(oChain.price && oChain.price.name){
                    
                    oThis.ndPrice[0].name = oChain.price.name;
                    oThis.ndPriceLabel.html(oChain.price.label);
                    oThis.ndPriceEntry.show();
                    if(!oChain.price.invisible)oThis.ndPriceEntry.show();
                    else oThis.ndPriceEntry.hide();
                    
                }else if(oThis.ndPriceLabel){
                    
                    oThis.ndPrice[0].name = "tempPrice";
                    oThis.ndPriceLabel.html("");
                    oThis.ndPriceEntry.hide();
                }
                
                if(oThis.ndPrice2){
                    
                    if(oChain.price2 && oChain.price2.name && oChain.price2.label){
                        
                        oThis.ndPrice2[0].name = oChain.price2.name;
                        oThis.ndPrice2Label.html(oChain.price2.label);
                        if(!oChain.price2.invisible)oThis.ndPrice2Entry.show();
                        else oThis.ndPrice2Entry.hide();
                        
                    }else{
                        
                        oThis.ndPrice2[0].name = "";
                        oThis.ndPrice2Label.html("");
                        oThis.ndPrice2Entry.hide();
                    }
                }
                
                if(oThis.iInitialPriceSelectedIndex !== false){
                    
                    oThis.oInputs.Term[0].selectedIndex = oThis.iInitialPriceSelectedIndex;
                    oThis.iInitialPriceSelectedIndex = false;
                }
            }
        };
        
		oThis.updateTerms = function(aTerms){
			
			if(!aTerms)aTerms = oThis.oDropDownChain[oThis.oInputs.PriceType.val()].terms;
			
			rebuildDropdown(oThis.oInputs.Term, oThis.processTermRestrictions(aTerms));
		}
		
		oThis.processTermRestrictions = function(aTerms){
			
			var aTermsOut = [];
			
			for(var i=0; i<aTerms.length; i++){
				
				if(!(aTerms[i].restrict && aTerms[i].restrict.length > 0 && oThis.validateTermRestrictions(aTerms[i].restrict) == true)){
					
					aTermsOut.push(aTerms[i]);
				}
			}
			
			return aTermsOut;
		};
		
		oThis.validateTermRestrictions = function(aRestrictions){return false};
		
        oThis.validate = function(){
            
            var aInputs = oThis.aInputs,
                iLength = oThis.aInputs.length,
                ndNode, bComplete = true;
            
            if(oThis.oInputs.PriceType[0].selectedIndex == 0)bComplete = false;
            if(oThis.ndPriceEntry && oThis.ndPriceEntry.css("display") != "none" && oThis.oInputs.Price.val() == "")bComplete = false;
            
            if(!bComplete){
                
                oThis.bFormComplete = false;
                oThis.onFormIncomplete();
                
            }else{
                
                oThis.bFormComplete = true;
                oThis.onFormComplete();
            }
        };
        
        oThis.dropDownSelectionTransformation = function(){};
        
        oThis.onFormIncomplete = function(){};
        oThis.onFormComplete = function(){};
        oThis.criteriaForAON = function(){return true};
        oThis.criteriaForTWP = function(){return true};
    }
    
    
    
    
    function OSICache(){

        var oThis = this;
        
        oThis.bEnabled = oOSI.bCacheEnabled;

        oThis.oCache = {};
        
        
        
        oThis.cache = function(sDataURL, oParams, oData){
            
            if(!oThis.bEnabled)return false;
            
            sDataURL = oThis.generateURL(sDataURL.toLowerCase(), oParams);
            
            if(!oThis.oCache[sDataURL]){
                
                oThis.oCache[sDataURL] = oData;
                return true;
                
            }else return false;
        };
        
        oThis.recall = function(sDataURL, oParams){
            
            if(!oThis.bEnabled)return false;
            
            sDataURL = oThis.generateURL(sDataURL.toLowerCase(), oParams);
            
            if(oThis.oCache[sDataURL]){
                
                return oThis.oCache[sDataURL];
            }
            else return false;
        };
        
        oThis.unCache = function(sDataURL, oParams){
            
            if(!oThis.bEnabled)return false;
            
            sDataURL = oThis.generateURL(sDataURL.toLowerCase(), oParams);
            
            if(oThis.oCache[sDataURL]){
                
                oThis.oCache[sDataURL] = false;
                return true;
                
            }else return false;
        };
        
        oThis.clear = function(){
            
            if(!oThis.bEnabled)return false;
            
            oThis.oCache = {};
            
            return true;
        };
        
        oThis.generateURL = function(sDataURL, oParams){
            
            sDataURL += "?";
            
            for(var prop in oParams){
                
                sDataURL += prop+"="+oParams[prop]+"&";
            }
            
            return sDataURL.slice(0, -1).toLowerCase();
        };
    }
    
    
    function OSIQueue(){

        var oThis = this;
        
        oThis.aQueue = [];
        oThis.fMethod = false;
        oThis.bReset = true;
        
        
        oThis.add = function(fMethod){
           
			if(fMethod)oThis.aQueue.push(fMethod);
            
            if(oThis.bReset){

                oThis.stepForward();
                oThis.bReset = false;
            }
        };
        
        oThis.stepForward = function(){
            
            if(oThis.aQueue[0]){
                
                oThis.fMethod = oThis.aQueue[0];
                                                
                oThis.aQueue[0] = false;
                oThis.rebuild();
                
                setTimeout(oThis.fMethod, 1);
                
                oThis.fMethod = false;
            
            }else{
                
                oThis.bReset = true;
            }
        };
        
        oThis.rebuild = function(){
            
            var aQueue = [];
            
            for(var i=0; i<oThis.aQueue.length; i++){
                
                if(oThis.aQueue[i])aQueue.push(oThis.aQueue[i]);
            }
            
            oThis.aQueue = aQueue;
            oThis.iIndex = 0;
        }
    }
    
    
    
    
    function StylishDropdown(sID, aOptions){}
    
    
    
    
    
    //
    // Common Utility Functions
    //
    
    function rebuildDropdown(ndNode, aOptions, bIndexed, bIndexStart){
        
        var sOptions = "", iSelectedIndex = ndNode[0].selectedIndex;
        
        if(!bIndexStart)bIndexStart = 0;
        
        if(bIndexed){
            
            for(var i=0; i<aOptions.length;i++){
                sOptions += "<option value='"+(bIndexStart++)+"'>"+ aOptions[i].name +"</option>";
            }
            
        }else if(aOptions.length){
            
            for(var i=0; i<aOptions.length;i++){
                sOptions += "<option value='"+ aOptions[i].id +"'>"+ aOptions[i].name +"</option>";
            }
            
        }else if(!aOptions.length){
        
            for(var id in aOptions){
                
                sOptions += "<option value='"+ aOptions[id].id +"'>"+ aOptions[id].name +"</option>";
            }
        }
        
        ndNode.html(sOptions);
        
        try{
            
            if(iSelectedIndex < aOptions.length){
                
                ndNode[0].selectedIndex = iSelectedIndex;
                
            }else if(iSelectedIndex >= aOptions.length){
                
                ndNode[0].selectedIndex = 0;
            }
            
        }catch(e){}
    }
    
    function disableInputs(aNodes, bResetValues){
        
        for(var i=0; i<aNodes.length; i++){
            if(aNodes[i][0] && aNodes[i][0].type != "hidden"){
                aNodes[i][0].disabled = true;
                if(bResetValues){
                    resetInput(aNodes[i]);
                }
            }
        }
    }
    
    function resetInput(ndInput){
        
        if(ndInput[0].selectedIndex >= -1){
            
            ndInput[0].selectedIndex = 0;
            
        }else if(ndInput[0].value && ndInput[0].type != "checkbox"){

            ndInput[0].value = "";
        
        }else if(ndInput[0].type == "checkbox"){
            
            ndInput[0].checked = false;
        }
    }
    
    function resetInputs(aInputs){
        
        for(var i=0; i<aInputs.length; i++)resetInput(aInputs[i]);
    }
    
    function enableInputs(aNodes){
        
        for(var i=0; i<aNodes.length; i++){
            if(aNodes[i][0] && aNodes[i][0].type != "hidden"){
                aNodes[i][0].disabled = false;
            }
        }
    }
    
    function getDropdownValues(ndNode, iIndex){
        
        if(ndNode){
            
            if(!(iIndex >= 0))iIndex = ndNode.selectedIndex;
            
            var ndOption = ndNode.childNodes[iIndex];
            
            return {value:ndOption.value, display:ndOption.innerHTML}
        }
    }
    
    function objectify(sQueryString){
        
        if(sQueryString.indexOf("?") >= 0 && sQueryString.indexOf("=") >= 0){
            
            var aParameters = sQueryString.replace("?", "").split("&"),
                aValuePair = [],
                oValuePairs = {};
            
            for(var i=0; i<aParameters.length; i++){
                
                aValuePair = aParameters[i].split("=");
                oValuePairs[aValuePair[0]] = aValuePair[1];
            }
            
            return oValuePairs;
        }
    }
    
    function objectToArray(oObj){
        
        var aOut = [];
        
        for(oVal in oObj){

            aOut.push(oObj[oVal]);
        }
        
        return aOut;
    }
    
    function parseOptDspVal(ndNode){
        
		if(ndNode[0].selectedIndex < 0)ndNode[0].selectedIndex = 0;
		
        return ndNode[0].childNodes[ndNode[0].selectedIndex].innerHTML;
    }
    
    function getQuoteFreqString(iIndex, sSecurityType){
        
        var aStrings;
        
        if(!sSecurityType)sSecurityType = "stock";
        
        sSecurityType = sSecurityType.toLowerCase();
        
        switch(sSecurityType){
            
            case "stock": return ["Real Time", "15 minute delay", "Closing Price", "Extended Hours - Real Time", "Pre-open - Real Time", "Extended Hours - Closing Price"][iIndex];
            case "option":return ["Real Time", "20 minute delay", "Closing Price", "Extended Hours - Real Time", "Pre-open - Real Time", "Extended Hours - Closing Price"][iIndex];
            case "index": return ["Real Time", "15 minute delay", "Closing Price", "Extended Hours - Real Time", "Pre-open - Real Time", "Extended Hours - Closing Price"][iIndex];
            case "multi": return ["Real Time", "15 minute delay", "Closing Price", "Extended Hours - Real Time", "Pre-open - Real Time", "Extended Hours - Closing Price"][iIndex];
        }
    }
    
    function getDeliverablesString(sSymbol, sExchangeCode, sTypeCode, fAcuteReaction){
        
        if(sSymbol && sExchangeCode && sTypeCode){
            
            $.getJSON("/e/t/invest/product_query.json", {"sym":sSymbol+":"+sExchangeCode+":"+sTypeCode}, function (oData, textStatus) {
                
                var sOut = "This option has been adjusted due to a corporate action. ";
                
                if(oData && oData.Deliverable){
                    
                    sOut += "The contract deliverable is: "+parseFloat(oData.Option.ContractSize)+" shares of "+oData.UnderlyingProductId.Symbol;
                    
                    if(!oData.Deliverable.length)oData.Deliverable = [oData.Deliverable];
                    
                    var i = 0, oD, iL = oData.Deliverable.length;
                    
                    for(i=0; i<iL; i++){
                        
                        oD = oData.Deliverable[i];
                        
                        sOut += ", "+((i > 0)?" ":"")+ oD.DeliverableWholeShares +" shares of "+ oD.DeliverableSymbol;
                    }
                    
                    if(oData.Option.CashDeliverable > 0)sOut += ", Cash of $"+ parseFloat(oData.Option.CashDeliverable).floatPrecision(2);
                    
                    sOut += ".";
                    
                    if(fAcuteReaction)fAcuteReaction({sDeliverables: sOut, sSymbol:sSymbol, sExchangeCode:sExchangeCode, sTypeCode:sTypeCode});
                }
            });
            
            return true;
            
        }else return false;
    };
    
    function translateOrderType(iPos, iEffect, bTrailStop){
        
        if(iEffect)iEffect = ""+iEffect.toUpperCase();
        
        if(bTrailStop){
            
            if(iPos == 2 && (iEffect == 1 || iEffect == "O"))return 1; //Buy Open
            if(iPos == 2 && (iEffect == 2 || iEffect == "C"))return 4; //Buy Close
            if(iPos == 3 && (iEffect == 1 || iEffect == "O"))return 3; //Sell Open
            if(iPos == 3 && (iEffect == 2 || iEffect == "C"))return 2; //Sell Close
            
        }else{
            
            if(iPos == 1 && (iEffect == 1 || iEffect == "O"))return 1; //Buy Open
            if(iPos == 1 && (iEffect == 2 || iEffect == "C"))return 3; //Buy Close
            if(iPos == 2 && (iEffect == 1 || iEffect == "O"))return 2; //Sell Open
            if(iPos == 2 && (iEffect == 2 || iEffect == "C"))return 4; //Sell Close
        }
    }
    
    function parseDisplaySymbol(sDisplaySymbol){
        
        var aDisplaySymbol = sDisplaySymbol.split(" "),
            oDisplaySymbol = {};
        
        oDisplaySymbol.underlyer = aDisplaySymbol[0];
        oDisplaySymbol.month = oOSI.oMonths[aDisplaySymbol[1]];
        oDisplaySymbol.day = aDisplaySymbol[2];
        oDisplaySymbol.year = aDisplaySymbol[3].replace("'", "20");
        oDisplaySymbol.strike = aDisplaySymbol[4].replace("$", "");
        oDisplaySymbol.type = aDisplaySymbol[5];
        
        return oDisplaySymbol;
    }
    
    function formatNumber(iNum, sSep, sCurr){
        
        var sNum = iNum.toString().reverse(),
            aPrec = sNum.split("."),
            sKSep = (sKSep)?sKSep:"",
            sCurr = (sCurr)?sCurr:"",
            iLen = sNum.length,
            sOut = "";        
        
        for(var i=0; i<iLen; i++){
            
            sOut += sNum.substr(i,1);
            if(i<iLen-1)sOut += (((i+1)%3 == 0)?sSep:"");
        }
        
        return sCurr+(sOut.reverse());
    }
    
    function fixPrec(iNumber){

        return parseFloat(parseFloat(iNumber).toFixed(3));
    }
    
    function reduceRatio(one, two){
        
        var i = 0,
        iOne = one,
        iTwo = two,
        aRatio = [];
        
        while(iOne >= 1 && iTwo >=1){
            
            i++;
            
            iOne = one/i;
            iTwo = two/i;
            
            if(iOne - parseInt(iOne) == 0 && iTwo - parseInt(iTwo) == 0){
    
                aRatio[0] = iOne;
                aRatio[1] = iTwo;
            }
        }
        
        return aRatio;
    }
    
    function convertIntegerToDate(iInt){
        
        var oDate = new Date(iInt),
            sDate = "";
        
        sDate += (oDate.getMonth()+1)+"/"+oDate.getDate()+"/"+oDate.getFullYear()+" ";
        sDate += ((oDate.getHours() > 12)?oDate.getHours()-12:oDate.getHours())+":"+padLeft(oDate.getMinutes())+":"+padLeft(oDate.getSeconds())+" "+((oDate.getHours() >= 12)?"PM":"AM")+" ET ";        
        
        function padLeft(iInt){return (iInt < 10)?"0"+iInt:iInt}
        
        return sDate;
    }
    
    
    function formatIntegerTimestamp(iTimeStamp, sFormatString, iOffsetHours){
 
         /* 
            m - integer month
            M - string month
            n - abbreviated string month
            d - integer date
            D - formal integer/string date (1st, 2nd, 3rd, 4th, etc...)
            y - 2 digit year
            Y - full, 4 digit year
            h - integer hour 12-hour format
            H - integer hour 24-hour format
            i - integer minutes
            s - integer seconds
            r - display meridiem (AM/PM)
            t - display Timezone
        */
        
        if(iTimeStamp >= 0){
            
            function applyTimezoneOffset(iTimeStamp, iOffsetHours){
                
                return iTimeStamp + (new Date(iTimeStamp).getTimezoneOffset()) + (3600000 * iOffsetHours);
            }
            
            function formalizeIntegerDate(iDate){
                
                var sDate = iDate.toString(),
                    sLastDigit = sDate.substr(-1,1);
                
                if(sLastDigit > 3 || (parseInt(sDate)%10) == 0 || (iDate > 10 && iDate < 14))return sDate+"th";
                if(sLastDigit == "1")return sDate+"st";
                if(sLastDigit == "2")return sDate+"nd";
                if(sLastDigit == "3")return sDate+"rd";
            }
            
            function replaceChar(sChar){
                
                if(aLookup[sChar])return aLookup[sChar]; else return sChar;
            }
            
            if(!iOffsetHours)iOffsetHours = (oOSI.bDST)?-4:-5; //EST with Daylight Savings Times switch
            
            iTimeStamp = applyTimezoneOffset(iTimeStamp, iOffsetHours);
            
            if(!sFormatString)sFormatString = "h:i:s r t m/d/y";
            
            var aMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                oTimeZones = {"":""}, 
                oDate = new Date(parseInt(iTimeStamp)),
                aLookup = [], aFormatString = sFormatString.split("");
            
            aLookup["m"] = oDate.getUTCMonth()+1;
            aLookup["M"] = aMonths[oDate.getUTCMonth()];
            aLookup["n"] = aMonths[oDate.getUTCMonth()].substr(0,3);
            aLookup["d"] = oDate.getUTCDate();
            aLookup["D"] = formalizeIntegerDate(oDate.getUTCDate());
            aLookup["y"] = oDate.getUTCFullYear().toString().substr(2,2);
            aLookup["Y"] = oDate.getUTCFullYear();
            aLookup["h"] = (oDate.getUTCHours() > 12)?oDate.getUTCHours()-12:(oDate.getUTCHours() == 0)?"12":oDate.getUTCHours();
            aLookup["H"] = oDate.getUTCHours();
            aLookup["i"] = (oDate.getUTCMinutes() < 10)?"0"+oDate.getMinutes():oDate.getUTCMinutes();
            aLookup["s"] = (oDate.getUTCSeconds() < 10)?"0"+oDate.getUTCSeconds():oDate.getUTCSeconds();
            aLookup["r"] = (oDate.getUTCHours() < 12)?"AM":"PM";
            aLookup["t"] = "ET";
            
            for(var i=0;i<aFormatString.length;i++){
                
                aFormatString[i] = replaceChar(aFormatString[i]);            
            }
            
            return aFormatString.join("");
        }
    }
    
    function formatFlashTimeString(sTimeStamp, sFormatString){
        
        /* 
            m - integer month
            M - string month
            n - abbreviated string month
            d - integer date
            D - formal integer/string date (1st, 2nd, 3rd, 4th, etc...)
            y - 2 digit year
            Y - full, 4 digit year
            h - integer hour 12-hour format
            H - integer hour 24-hour format
            i - integer minutes
            s - integer seconds
            r - display meridiem (AM/PM)
            t - display Timezone
        */
       
        if(sTimeStamp && sTimeStamp.length > 0){
    
            function replaceChar(sChar){
    
                if(aLookup[sChar])return aLookup[sChar]; else return sChar;
            }
            
            function getIntegerDate(){
    
                for(var i=0; i<12; i++){
                    if(aMonths[i] == aSplitTimeStamp[0])return ++i;
                }
            }
            
            function formalizeIntegerDate(){
     
                var sDate = aSplitDate[1],
                    iDate = parseInt(sDate),
                    sLastDigit = sDate.substr(-1,1);
                
                
                if(sLastDigit > 3 || (parseInt(sDate)%10) == 0 || (iDate > 10 && iDate < 14))return sDate+"th";
                if(sLastDigit == "1")return sDate+"st";
                if(sLastDigit == "2")return sDate+"nd";
                if(sLastDigit == "3")return sDate+"rd";
            }
            
            function convertHourTo24(){
                
                var iHour = parseInt(aSplitTime[0]);
                
                if(aSplitTimeStamp[4] == "PM"){
                    
                    if(iHour < 12)iHour += 12;
                    
                }else{
                    
                    if(iHour == 12)iHour = 0;
                }
                
                return iHour.toString();
            }
            
            if(!sFormatString)sFormatString = "";
            
            var aMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            aSplitTimeStamp = sTimeStamp.replace(",", "").split("-"),
            aSplitFullTime = aSplitTimeStamp[1].split(" "),
            sTimeZone = aSplitFullTime[1],        
            sMeridian = aSplitFullTime[0].substr((aSplitFullTime[0].length - 2),2),
            aSplitTime = aSplitFullTime[0].split(":"),
            aSplitDate = aSplitTimeStamp[0].split("/"),
            aLookup = [],
            aFormatString = sFormatString.split(""), 
            iFSLength = aFormatString.length;
            
            if(aSplitDate[0][0] == 0)aSplitDate[0] = aSplitDate[0].substr(1,1)
            if(aSplitDate[1][0] == 0)aSplitDate[1] = aSplitDate[1].substr(1,1)
            
            
            if(iFSLength > 0){
                
                // Build lookup array
                aLookup["m"] = aSplitDate[0];
                aLookup["M"] = aMonths[aSplitDate[0]-1];
                aLookup["n"] = aMonths[aSplitDate[0]-1].substr(0,3);
                aLookup["d"] = aSplitDate[1];
                aLookup["D"] = formalizeIntegerDate();
                aLookup["y"] = aSplitDate[2];
                aLookup["Y"] = aSplitDate[2];
                aLookup["h"] = aSplitTime[0];
                aLookup["H"] = convertHourTo24();
                aLookup["i"] = aSplitTime[1];
                aLookup["s"] = (aSplitTime[2])?aSplitTime[2].substr(0,2):"00";
                aLookup["r"] = sMeridian;
                aLookup["t"] = sTimeZone;
                                
                // Replace format string
                for(var i=0;i<iFSLength;i++){
                    
                    aFormatString[i] = replaceChar(aFormatString[i]);            
                }
                
                return aFormatString.join("");
            
            }else{
                
                return sTimeStamp;
            }
        }
    }
    

    
    function moveCursorToEnd(ndInput){
        
        ndInput.focus();
        
        if(ndInput[0].setSelectionRange){
    
            ndInput[0].setSelectionRange(100,100);
            
        }else if(ndInput[0].createTextRange){
    
            var iTR = ndInput[0].createTextRange();
            iTR.move("character", ndInput.val().length);
            iTR.select();
            
        }else{
    
            ndInput.val(ndInput.val());
        }
    }
    
	function hashOut(aDataArray, aHashArray){
		
		var oOut = {};
		
		if(aHashArray){
			
			var iLength = (aHashArray.length > aDataArray.length)?aHashArray.length:aDataArray.length;
			
			for(var i=0; i<iLength; i++){
				
				if(aHashArray[i] && aDataArray[i]){
					
					oOut[aHashArray[i]] = aDataArray[i];
				
				}else if(aHashArray[i] && !aDataArray[i]){
					
					oOut[aHashArray[i]] = "";
					
				}else if(!aHashArray[i] && aDataArray[i]){
					
					oOut[aDataArray[i]] = aDataArray[i];
				}
			}
		
		}else if(aDataArray){
			
			for(var i=0; i<aDataArray.length; i++){
				
				oOut[aDataArray[i]] = aDataArray[i];
			}
		}
		
		return oOut;
	}
	
	function arrayLeech(aArray, sProperty){
		
		var aOut = [];
		
		for(var i=0; i<aArray.length; i++){
			
			aOut.push(aArray[i][sProperty])
		}
		
		return aOut;
	}
	
	function checkDisplaySymbolForWeeklyFlag(sDisplaySymbol){
		
		if(sDisplaySymbol.reverse().substr(0,1) == "w")return true; else return false;
	}
	
	function applyWeeklyOptionsTooltip(oWrappedSet){
		
		oWrappedSet.each(function(i, ndDisplaySymbol){
			
			if(checkDisplaySymbolForWeeklyFlag($(ndDisplaySymbol).text())){
				
				ndDisplaySymbol.title = oOSI.sWeeklyOptionsTooltip;
			}
		});
	}
	
	function isOptionScreener(){
		
		return (document.URL.indexOf("strategyoptimizer") != -1 || document.URL.indexOf("optionsanalyzer") != -1 || document.URL.indexOf("probabilitycalculator") != -1 || document.URL.indexOf("optionsscreener") != -1);	
	}
	