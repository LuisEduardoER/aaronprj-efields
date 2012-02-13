    
    function OSIStockOrder(sID, ndForm, sSQW_ID){
        
        var oThis = this;
        
        oThis.ndForm = ndForm;
        oThis.ndContainer = $("#"+sID);
        oThis.ndPreviewBtn = $(".osi-preview-btn");
        oThis.ndSummary = $(".osi-summary");
        oThis.ndSummaryCont = $(".osi-summary-cont");
        oThis.ndPriceEntry = oThis.ndContainer.find(".osi-price-entry");
        oThis.ndPriceLabel = oThis.ndContainer.find(".osi-price-label");
        oThis.ndPrice2Entry = oThis.ndContainer.find(".osi-price2-entry");
        oThis.ndPrice2Label = oThis.ndContainer.find(".osi-price2-label");
        oThis.ndAONCont = oThis.ndContainer.find(".osi-aon");
        oThis.ndTermCont1 = oThis.ndContainer.find(".so-term-cont1");
        oThis.ndTermCont2 = oThis.ndContainer.find(".so-term-cont2");
        oThis.ndTermGroup = oThis.ndContainer.find(".so-term-group");
        oThis.ndOffsetType = $(oThis.ndForm.trailingOffsetType);
        oThis.ndFormTarget = $(oThis.ndForm._formtarget);
        
        // Stock Form
        oThis.ndTransaction = $(oThis.ndForm.transaction);
        oThis.ndShares = $(oThis.ndForm.quantity);
        oThis.ndSymbol = $(oThis.ndForm.symbol);
        
        // Price Form
        oThis.ndAON = $(oThis.ndForm.execInst);
        oThis.ndPriceType = $(oThis.ndForm.priceType);
        oThis.ndPrice = $(oThis.ndForm.price);
        oThis.ndPrice2 = $(oThis.ndForm.price2);
        oThis.ndTerm = $(oThis.ndForm.orderTerm);
        oThis.ndTempTerm = $(oThis.ndForm.tempterm);
        
        oThis.aInputs = [
            oThis.ndTransaction,
            oThis.ndShares,
            oThis.ndSymbol,
            oThis.ndSymbolButton,
            oThis.ndPriceType,
            oThis.ndPrice,
            oThis.ndPrice2,
            oThis.ndTerm,
            oThis.ndAON
        ];
        
        oThis.oInputs = {
            OrderType: oThis.ndTransaction,
            Shares: oThis.ndShares,
            Symbol: oThis.ndSymbol,
            PriceType: oThis.ndPriceType,
            Price: oThis.ndPrice,
            Price2: oThis.ndPrice2,
            Term: oThis.ndTerm,
            AON: oThis.ndAON
        };
        
        oThis.oImages = {
            
            PreviewGreen: AkamaiURL+"/images/osi/preview_order_entry_green.gif",
            PreviewGray: AkamaiURL+"/images/osi/preview_order_gray.gif"
        };
        
        oThis.oOSISQW = new OSIQuoteWidget(sSQW_ID, "", "stock");
        oThis.oOSISSC = new OSIStockSelectionController(oThis.ndTransaction, oThis.ndShares, oThis.ndSymbol);
        oThis.oOSIPSC = new OSIPriceSelectionController(oThis.ndPriceType, oThis.ndPrice, oThis.ndTerm, oThis.ndAON, oThis.ndPriceEntry, oThis.ndPriceLabel, oThis.ndAONCont, oThis.ndPrice2,  oThis.ndPrice2Label,  oThis.ndPrice2Entry);
        
        oThis.bFormComplete = false;
        
        oThis.sSymbol;
        
        
        
        
        oThis.start = function(){
            
            oThis.ndForm.onsubmit = oThis.onSubmit;
            
            oThis.oOSIPSC.criteriaForAON = function(){
                var iVal = oThis.oInputs.Term.val();
                return (iVal == 5 || iVal == 6)?false:true;
            };
            
            oThis.oInputs.Shares.blur(function(){oThis.oInputs.PriceType.change()});
            
            oThis.ndSymbol.blur(function(){
                
                if(oThis.sSymbol != oThis.ndSymbol.val().toUpperCase()){
                    
                    oThis.sSymbol = oThis.ndSymbol.val().toUpperCase();
                    
                    oThis.oOSISQW.getSymbolData(oThis.sSymbol);
                    
                    oThis.validate();
                }
            });
            
            oThis.ndSymbol.keypress(function(e){
                
                if(e.keyCode == 13){
                    
                    oThis.ndSymbol.blur();
                    return false;
                }
                return e.keyCode;
            });
            
            oThis.oInputs.Shares.keyup(function(e){
                
                if(parseInt(this.value) >= 300){
                    oThis.ndAONCont.removeClass("so-aon-disabled");
                    oThis.ndAON[0].disabled = false;
                }else{
                    oThis.ndAONCont.removeClass("so-aon-disabled").addClass("so-aon-disabled");
                    oThis.ndAON[0].disabled = true;
                    oThis.ndAON[0].checked = false;
                }
                
                return e.keyCode;
            });
            
            var oDropDownChain = oThis.oOSIPSC.oDropDownChain;
            
            oThis.oOSIPSC.aTermGroups = [
                [{id:"3", name:"Good For The Day"}],
                [{id:"3", name:"Good For The Day"}, {id:"2", name:"Good For 60 Days"}],
                [{id:"3", name:"Good For The Day"}, {id:"7", name:"Extended Hours (Good For The Day)"}],
                [{id:"3", name:"Good For The Day"}, {id:"2", name:"Good For 60 Days"}, {id:"5", name:"Immediate or Cancel"}, {id:"6", name:"Fill or Kill"}, {id:"7", name:"Extended Hours (Good For The Day)"}, {id:"8", name:"Extended Hours (Immediate or Cancel)"}],
                [{id:"1", name:"Good For The Day"}, {id:"2", name:"Good For 60 Days"}],
                [{id:"1", name:"Good For The Day"}]
            ];
            
            var aTermGroups = oThis.oOSIPSC.aTermGroups;
            
            oThis.oOSIPSC.oDropDownChain = {
                "0":{id:"0", name:"- -",               terms:aTermGroups[0], aon:{showDefault:true}},
                "1":{id:"1", name:"Market",            terms:aTermGroups[0]},
                "2":{id:"2", name:"Limit",             terms:aTermGroups[3], aon:{showDefault:true}, price:{name:"price",               label:"Limit Price"}},
                "3":{id:"3", name:"Stop",              terms:aTermGroups[1],                         price:{name:"stopPrice",           label:"Stop Price"}},
                "4":{id:"4", name:"Stop Limit",        terms:aTermGroups[1], aon:{showDefault:true}, price:{name:"price",               label:"Limit Price"}, price2:{name:"stopPrice",      label:"Stop Price"}},
                "6":{id:"6", name:"Trailing Stop $",   terms:aTermGroups[4],                         price:{name:"trailingOffsetValue", label:"Stop Value $"}},
                "7":{id:"7", name:"Trailing Stop %",   terms:aTermGroups[4],                         price:{name:"trailingOffsetValue", label:"Stop Value %"}},
                "13":{id:"13", name:"Market On Close", terms:aTermGroups[0]}
            };
            
            oThis.oOSISSC.oInputs.OrderType.change(function(e){
                
                var oDropDownChain = oThis.oOSIPSC.oDropDownChain,
                    aTermGroups = oThis.oOSIPSC.aTermGroups;
                
                switch(this.value){
                    
                    case "3":
                        
                        oDropDownChain["0"].terms = aTermGroups[0];
                        oDropDownChain["1"].terms = aTermGroups[0];
                        oDropDownChain["2"].terms = aTermGroups[2];
                        oDropDownChain["3"].terms = aTermGroups[0];
                        oDropDownChain["4"].terms = aTermGroups[0];
                        oDropDownChain["6"].terms = aTermGroups[5];
                        oDropDownChain["7"].terms = aTermGroups[5];
                        oDropDownChain["13"].terms = aTermGroups[0];
                        break;
                        
                    default:
                        
                        oDropDownChain["0"].terms = aTermGroups[0];
                        oDropDownChain["1"].terms = aTermGroups[0];
                        oDropDownChain["2"].terms = aTermGroups[3];
                        oDropDownChain["3"].terms = aTermGroups[1];
                        oDropDownChain["4"].terms = aTermGroups[1];
                        oDropDownChain["6"].terms = aTermGroups[4];
                        oDropDownChain["7"].terms = aTermGroups[4];
                        oDropDownChain["13"].terms = aTermGroups[0];
                }
                
                oThis.oOSIPSC.oDropDownChain = oDropDownChain;
                oThis.oOSIPSC.aTermGroups = aTermGroups;
                
                oThis.oInputs.Shares.change(function(){oThis.oInputs.PriceType.change()})
                
                oThis.oInputs.PriceType.change();
            });
            
            oThis.oOSIPSC.oInputs.PriceType.change(function(){
                
                switch(this.value){
                    case "6":
                        oThis.ndOffsetType.val("C");
                        oThis.ndFormTarget.val("trailingstoporderentry");
                        oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/trailingstoporderentry";
                        break;
                    case "7":
                        oThis.ndOffsetType.val("P");
                        oThis.ndFormTarget.val("trailingstoporderentry");
                        oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/trailingstoporderentry";
                        break;
                    default:
                        oThis.ndOffsetType.val("");
                        oThis.ndFormTarget.val("socreateentry");
                        oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/socreateentry";
                }
                
                if(this.value == "2" || this.value == "4"){
                    
                    if(this.value == "2")oThis.ndTerm.css({width:250});
                    else oThis.ndTerm.css({width:128});
                    
                }else if(this.value != "2" && this.value != "4"){
                    
                    oThis.ndTerm.css({width:128});
                    oThis.ndTermCont1.slideDown(350);
                }
                
                if(this.value == "2")oThis.oInputs.Term.change();
            });
            
            oThis.oOSIPSC.oInputs.Term.change(function(){

                switch(this.value){
                    
                    case "7":
                        oThis.ndTempTerm.val(this.value);
                        oThis.ndFormTarget.val("ehcreateentry");
                        oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/ehcreateentry";
                        if(oThis.oOSISQW.bExtendedHours == false){
                            oThis.oOSISQW.bExtendedHours = true;
                            oThis.oOSISQW.refresh();
                        }
                        break;
                    
                    case "8":
                    	oThis.ndTempTerm.val(this.value);
                        oThis.ndFormTarget.val("ehcreateentry");
                        oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/ehcreateentry";
                        if(oThis.oOSISQW.bExtendedHours == false){
                            oThis.oOSISQW.bExtendedHours = true;
                            oThis.oOSISQW.refresh();
                        }
                        break;
                        
                    default:
                        switch(oThis.oInputs.PriceType.val()){
                            case "6":
                                oThis.ndOffsetType.val("C");
                                oThis.ndFormTarget.val("trailingstoporderentry");
                                oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/trailingstoporderentry";
                                break;
                            case "7":
                                oThis.ndOffsetType.val("P");
                                oThis.ndFormTarget.val("trailingstoporderentry");
                                oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/trailingstoporderentry";
                                break;
                            default:
                                oThis.ndOffsetType.val("");
                                oThis.ndFormTarget.val("socreateentry");
                                oThis.ndForm.action = "/e/t/"+oOSI.sApplicationName+"/socreateentry";
                        }
                        oThis.ndTempTerm.val("");
                        if(oThis.oOSISQW.bExtendedHours == true){
                            oThis.oOSISQW.bExtendedHours = false;
                            oThis.oOSISQW.refresh();
                        }
                }
                
                oThis.oOSIPSC.changePriceType();
            });
            
            oThis.oOSIPSC.oInputs.PriceType.change();
            
            oThis.oOSISSC.onFormIncomplete = oThis.validate;
            oThis.oOSISSC.onFormComplete = oThis.validate;
            oThis.oOSIPSC.onFormIncomplete = oThis.validate;
            oThis.oOSIPSC.onFormComplete = oThis.validate;
            
            oThis.oOSISQW.start();
            oThis.oOSISSC.start();
            oThis.oOSIPSC.start();
            
            oThis.oOSISSC.onBlur();
            
            var oPairs = objectify(window.location.search);
            
            if(oPairs){
                
                var o = oThis.oInputs;
                
                if(oPairs["quantity"] || oPairs["numshares"]){
                    o.Shares.val((oPairs["numshares"])?oPairs["numshares"]:oPairs["quantity"]);
                    o.Shares.blur();
                }
                
                if(oPairs["pricetype"]){
                    o.PriceType.val(oPairs["pricetype"]);
                    o.PriceType.change();
                }
                
                if(oPairs["param"] == "1" || oPairs["param"] == "2"){
                    o.PriceType.val(parseInt(oPairs["param"]) + 5);
                    o.PriceType.change();
                    o.Price.val(oPairs["stopprice"]);
                    
                    if(oPairs["ordertype"]){
                        var iOrderType = oPairs["ordertype"],
                            iOrderEffect = oPairs["positioneffect"],
                            iTransaction;
                        if(iOrderType == 2 && iOrderEffect == 1)iTransaction = 1;
                		if(iOrderType == 3 && iOrderEffect == 2)iTransaction = 2;
                		if(iOrderType == 3 && iOrderEffect == 1)iTransaction = 3;
                		if(iOrderType == 2 && iOrderEffect == 2)iTransaction = 4;
                        o.OrderType.val(iTransaction);
                        o.OrderType.change();
                    }
                    
                }else if(oPairs["ordertype"]){
                    o.OrderType.val(oPairs["ordertype"]);
                    o.OrderType.change();
                }
                
                if(oPairs["pricetype"] == "2"){
                    o.Price.val(oPairs["limitprice"]);
                }else if(oPairs["pricetype"] == "4"){
                    oThis.ndPrice.val(oPairs["limitprice"]);
                    oThis.ndPrice2.val(oPairs["stopprice"]);
                }
                
                
                
                if(oPairs["term"]){
                    if(window.location.toString().indexOf("ehcreateentry") > -1){
                        switch(oPairs["term"]){
                            case "3":o.Term.val(7);break;
                            case "5":o.Term.val(8);break;
                        }
                    }else{
                        o.Term.val(oPairs["term"]);
                    }
                    o.Term.change();
                }
                if(oPairs["aon"] == 1)o.AON[0].checked = true;
                if(oPairs["sym"]){
                    o.Symbol.val(oPairs["sym"]);
                    o.Symbol.blur();
                }
                if(oPairs["symbol"]){
                    o.Symbol.val(oPairs["symbol"]);
                    o.Symbol.blur();
                }else if(oPairs["Symbol"]){
                    o.Symbol.val(oPairs["Symbol"]);
                    o.Symbol.blur();
                }
                oThis.oOSISSC.validate();
                oThis.oOSIPSC.validate();
                
                if(!(oPairs["quantity"] || oPairs["numshares"]) && (oPairs["pricetype"] == "2" || oPairs["pricetype"] == "4")){
                    oThis.ndAONCont.show();
                }else if(!(oPairs["quantity"] || oPairs["numshares"]) && (!oPairs["pricetype"] || oPairs["pricetype"] == "")){
                    oThis.ndAONCont.show();
                }else if((oPairs["quantity"] >= 300 || oPairs["numshares"] >= 300) && (oPairs["pricetype"] == "2" || oPairs["pricetype"] == "4")){
                    oThis.ndAONCont.show();
                }else if((oPairs["quantity"] >= 300 || oPairs["numshares"] >= 300) && (!oPairs["pricetype"] || oPairs["pricetype"] == "")){
                    oThis.ndAONCont.show();
                }
                
            }else{
                
                oThis.ndAONCont.show();
            }
            
            oThis.oInputs.Shares.keyup();
        };
        
        oThis.generateOrderSummary = function(sText){
            
            if(sText){
                
                oThis.ndSummary.html(sText);
                
            }else{
                
                var o = oThis.oInputs,
                    sOut = "",
                    sPrefix = "$", sSuffix = "%",
                    sPriceType = o.PriceType.val();
                
                if(sPriceType == "7")sPrefix = ""; else sSuffix = "";
                
                sOut += parseOptDspVal(o.OrderType)+" "+o.Shares.val()+" share(s) <span class='summary-symbol'>"+oThis.sSymbol+"</span> at ";
                
                if(sPriceType == "4"){
                    
                    sOut += "Stop Limit (Limit Price: $"+o.Price.val()+" and Stop Price: $"+o.Price2.val()+")";
                    
                }else{
                    
                    sOut += ( (oThis.ndPriceEntry.css("display") != "none")?sPrefix+o.Price.val()+sSuffix:"" ) +" "+parseOptDspVal(o.PriceType);
                }
                
                oThis.ndSummary.html(sOut);
                
                if(oThis.ndSummaryCont.css("height") != "42px")oThis.ndSummaryCont.animate({height:42}, 500);
            }
        };
        
        oThis.updateSymbol = function(sSymbol){
            
            oThis.sSymbol = sSymbol;
        };
        
        oThis.validate = function(){
            
            if(oThis.oOSISSC.bFormComplete && oThis.oOSIPSC.bFormComplete && !(oThis.oInputs.PriceType.val() == "4" && oThis.oInputs.Price2.val() == "")){
                
                oThis.bFormComplete = true;
                oThis.onFormComplete();
                return true;
            }
            
            oThis.bFormComplete = false;
            oThis.onFormIncomplete();
            if(oThis.ndSummaryCont.css("height") != "0px")oThis.ndSummaryCont.animate({height:1}, 500);
            return false;
        };
        
        oThis.onFormIncomplete = function(){
            
            oThis.generateOrderSummary(" ");
            
            // Disabling Validation for now
            //oThis.ndPreviewBtn[0].src = oThis.oImages.PreviewGray;
            //oThis.ndPreviewBtn[0].title = "Please enter your stock order information";
            //oThis.ndPreviewBtn[0].disabled = true;
            //oThis.ndPreviewBtn.addClass("disabled");
            
            oThis.ndPreviewBtn[0].src = oThis.oImages.PreviewGreen;
            oThis.ndPreviewBtn[0].title = "";
            oThis.ndPreviewBtn[0].disabled = false;
            oThis.ndPreviewBtn.removeClass("disabled");
        };
        
        oThis.onFormComplete = function(){
            
            oThis.generateOrderSummary();
            
            oThis.ndPreviewBtn[0].src = oThis.oImages.PreviewGreen;
            oThis.ndPreviewBtn[0].title = "";
            oThis.ndPreviewBtn[0].disabled = false;
            oThis.ndPreviewBtn.removeClass("disabled");
        };
        
        oThis.onSubmit = function(){
            
            oThis.ndTempTerm.val(oThis.oInputs.Term.val());
            
            switch(oThis.oInputs.Term.val()){
                
                case "7":
                    oThis.oInputs.Term.val(3)
                    break;
                    
                case "8":
                    oThis.oInputs.Term.val(5)
                    break;
            }
        };
        
        oThis.applyPresets = function(oPresets){
            
            var o = oThis.oInputs;
            
            oThis.ndTransaction.val(oPresets.OrderType);
            oThis.ndTransaction.change();
            oThis.ndShares.val(oPresets.Shares);
            oThis.ndShares.blur();
            
            oThis.ndPriceType.val(oPresets.PriceType);
            oThis.ndPriceType.change();
            oThis.ndPrice.val((oPresets.Price1)?oPresets.Price1:oPresets.Price2);
            oThis.ndPrice2.val((oPresets.Price2)?oPresets.Price2:"");
            
            if(window.location.toString().indexOf("ehcreateentry") > -1){
                switch(oPresets.Term){
                    case "3":oThis.ndTerm.val(7);break;
                    case "5":oThis.ndTerm.val(8);break;
                }
            }else{
                oThis.ndTerm.val(oPresets.Term);
            }
            oThis.ndTerm.change();
            
            oThis.ndSymbol.val(oPresets.Symbol);
            oThis.ndSymbol.blur();
            
            if(oPresets.AON == 1)o.AON[0].checked = true;
            
            oThis.oOSISSC.validate();
            oThis.oOSIPSC.validate();
        }
    }
