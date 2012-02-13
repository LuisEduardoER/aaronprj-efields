    
    function OSIInfoStation(sID){
        
        var oThis = this;
        oThis.ndContainer = $("#"+sID);
        
        oThis.ndActiveLink = false;
        
        oThis.ndPosItem = oThis.ndContainer.find(".osi-infstn-positions");
        oThis.ndOrderItem = oThis.ndContainer.find(".osi-infstn-orders");
        oThis.ndAlertItem = oThis.ndContainer.find(".osi-infstn-alerts");
        
        oThis.ndPosLink = oThis.ndPosItem.find("#positions_popup_link");
        oThis.ndOrderLink = oThis.ndOrderItem.find("#orders_popup_link");
        oThis.ndAlertLink = oThis.ndAlertItem.find("#alerts_popup_link");
        
        oThis.ndPositions = oThis.ndContainer.find("#positions_popup");
        oThis.ndOrders = oThis.ndContainer.find("#orders_popup");
        oThis.ndAlerts = oThis.ndContainer.find("#alerts_popup");
        
        oThis.ndAccountCont = $("#osi-infstn-account-cont");
        oThis.ndAccountDetails;
        oThis.ndAccountID;
        oThis.ndAccountList;
        
        oThis.ndBalanceLink;
        oThis.ndOptionLevel = oThis.ndContainer.find("#optionLevel");
        
        oThis.ndClickArea = $(".osi-modal-click-area");
        oThis.ndBalanceError = $(".osi-balances-error");
        
        oThis.ndExpand;
        oThis.ndExpandImg;
        
        oThis.oLastOpen = false;
        oThis.oCurrOpen = false;
        
        oThis.sAccountNo;
        oThis.sAccountName = "";
        oThis.sAppName = (oOSI.sApplicationName == "ria")?"ria":"invest";
       
		oThis.iOptionTradingLevel = false;
 
        oThis.bPreloading = true;
        oThis.bLoadingAccounts = false;
        oThis.bOpen = true;
        oThis.bPostInit = false;
        
        oThis.aDataURLs = [
            
            "/e/t/"+oThis.sAppName+"/osipositions",
            "/e/t/"+oThis.sAppName+"/osiorders",
            "/e/t/"+oThis.sAppName+"/osialerts",
            "/e/t/"+oThis.sAppName+"/osibalances"
        ];
        
        oThis.oAccounts;
        
        oThis.oMenus = {};
        
        oThis.bOptionsScreener = isOptionScreener();
        
		
        
		
        oThis.start = function(){
            
            oThis.ndAccountID = oThis.ndContainer.find("#account_id");
            
            if(oThis.ndAccountID.length > 0){
                
                oThis.ndAccountDetails = oThis.ndContainer.find("#account_details");
                oThis.ndAccountList = oThis.ndContainer.find("#account_list");
                
                oThis.oAccounts = new OSIInfoStationAccounts(oThis.ndContainer.find(".osi-infstn-accounts"));
                
                oThis.oMenus = {
                    
                    Positions: new OSIInfoStationMenu("positions_popup", oThis.ndPosLink, oThis.aDataURLs[0], oThis.oAccounts.iAccount, oThis.oAccounts.sAccount),
                    Balances: new OSIInfoStationMenu("orders_popup", oThis.ndOrderLink, oThis.aDataURLs[1], oThis.oAccounts.iAccount, oThis.oAccounts.sAccount),
                    Alerts: new OSIInfoStationMenu("alerts_popup", oThis.ndAlertLink, oThis.aDataURLs[2], oThis.oAccounts.iAccount, oThis.oAccounts.sAccount)
                }
                
                oThis.ndPosLink.click(function(){oThis.setActiveMenu(oThis.oMenus.Positions)});
                oThis.ndOrderLink.click(function(){oThis.setActiveMenu(oThis.oMenus.Balances)});
                oThis.ndAlertLink.click(function(){oThis.setActiveMenu(oThis.oMenus.Alerts)});
                oThis.oAccounts.ndLink.click(function(){oThis.setActiveMenu(oThis.oAccounts)});
                
                oThis.oAccounts.onSelect = oThis.accountChange;
                
                oThis.bPreloading = false;
                
                oThis.ndClickArea.click(function(){
                    
                    oThis.oCurrOpen.close();
                    oThis.oCurrOpen = false;
                    oThis.oLastOpen = false;
                    oThis.ndClickArea.hide();
                });
                
                oThis.ndBalanceError.find("a").click(oThis.accountChange);
                
                if(!oThis.loadBalanceState())oThis.ndAccountDetails.html("<br/>");
                
                $(function(){oThis.accountChange()});
                
            }else if(oThis.bLoadingAccounts == false){
                
                oThis.bLoadingAccounts = true;
                oThis.ndAccountCont.load("/e/t/invest/AccountDropDownSwitch", {}, oThis.start);
            }
        };
        
        oThis.setActiveMenu = function(oMenu){
            
            if(oThis.oCurrOpen == oMenu){
                
                oThis.oCurrOpen.close();
                oThis.oCurrOpen = false;
                oThis.ndActiveLink = false;
                oThis.ndClickArea.hide();
                
            }else{
                
                oThis.ndClickArea.show();
                
                if(oThis.oCurrOpen)oThis.oLastOpen = oThis.oCurrOpen
                if(oThis.oLastOpen)oThis.oLastOpen.close();                
                oThis.oCurrOpen = oMenu;
                oThis.oCurrOpen.open();
                
                oThis.ndActiveLink = oMenu.ndLink;
            }
        };
        
        oThis.accountChange = function(){
            
            oThis.ndAccountDetails.show();
            oThis.ndBalanceError.hide();
            
            oThis.oMenus.Positions.clear();
            oThis.oMenus.Balances.clear();
            oThis.oMenus.Alerts.clear();
            
            oThis.oMenus.Positions.sAccountDesc = oThis.oAccounts.sAccount;
            oThis.oMenus.Balances.sAccountDesc = oThis.oAccounts.sAccount;
            oThis.oMenus.Alerts.sAccountDesc = oThis.oAccounts.sAccount;
            
            oThis.oMenus.Positions.sAccountID = oThis.oAccounts.iAccount;
            oThis.oMenus.Balances.sAccountID = oThis.oAccounts.iAccount;
            oThis.oMenus.Alerts.sAccountID = oThis.oAccounts.iAccount;
			
            oThis.ndAccountID.val(oThis.oAccounts.iAccount);
            
            oThis.getBalanceInfo();
			
            return false;
        };
        
		oThis.getBalanceInfo = function(){
			
			oThis.showBalanceLoading(oThis.ndAccountDetails);
			
			$.get(oThis.aDataURLs[3]+"?accountNo=" + oThis.oAccounts.iAccount, {}, oThis.initBalanceInfo);
		};
		
        oThis.initBalanceInfo = function(sResponse){
            
			if(oThis.bPostInit)oThis.onAccountChange();
            
			oThis.onOptionsScreenerBalance(oThis.bPostInit);
			
			//if(bOptionsScreener)return false;
			
            if(sResponse.indexOf("<html") == -1){
                
                oThis.ndAccountDetails.html(sResponse);
               
				oThis.iOptionTradingLevel = parseInt(oThis.ndAccountDetails.find("#optLevel").val());
				
                oThis.ndOptionLevel[0].src = AkamaiURL+"/images/osi/i_options_level_"+oThis.iOptionTradingLevel+".gif";
                
                oThis.ndOptionLevel.show();
 
                var ndLinks = $(".osi-account-links");
                
                oThis.ndBalanceLink = $(ndLinks.find("a")[1]);
                if (oThis.ndBalanceLink[0]) oThis.ndBalanceLink[0].href = (oOSI.sApplicationName == "ria")?"/e/t/ria/AcctBalanceDetails":"/e/t/accounts/AcctBalanceDetails";
                
                oThis.ndAccountDetails.find(".osi-account-refresh").click(oThis.accountChange);
                
                oThis.ndExpand = oThis.ndAccountDetails.find(".osi-account-expand");
                oThis.ndExpandImg = oThis.ndExpand.find("img");
                
                if(!oThis.loadBalanceState()){
                    
                    oThis.ndAccountDetails.find(".osi-account-links").hide();
                    oThis.ndAccountDetails.find(".osi-account-time").hide();
                    oThis.ndAccountDetails.find(".osi-account-details").hide();
                    if(oThis.ndExpandImg[0])oThis.ndExpandImg[0].src = AkamaiURL+"/images/osi/buttonExpand.gif";
                    oThis.bOpen = false;
                }
                
                oThis.ndExpand.click(function(){
                    
                    if(oThis.bOpen)oThis.collapseBalances(); else oThis.expandBalances();
                    
                    oThis.saveBalanceState();
                    
                    return false;
                });
                
            }else{
                
                oThis.ndAccountDetails.hide();
                oThis.ndBalanceError.fadeIn();
                return false;
            }
            
            oThis.bPostInit = true;
            
            oThis.loadBalanceState();
        };
        
        oThis.expandBalances = function(){
            
            oThis.ndAccountDetails.find(".osi-account-links").fadeIn();
            oThis.ndAccountDetails.find(".osi-account-time").fadeIn();
            oThis.ndAccountDetails.find(".osi-account-details").slideDown();
            if(oThis.ndExpandImg)oThis.ndExpandImg[0].src = AkamaiURL+"/images/osi/buttonCollapse.gif";
            oThis.bOpen = true;
        };
        
        oThis.collapseBalances = function(){
            
            oThis.ndAccountDetails.find(".osi-account-links").fadeOut();
            oThis.ndAccountDetails.find(".osi-account-time").fadeOut();
            oThis.ndAccountDetails.find(".osi-account-details").slideUp();
            if(oThis.ndExpandImg)oThis.ndExpandImg[0].src = AkamaiURL+"/images/osi/buttonExpand.gif";
            oThis.bOpen = false;
        };
        
        oThis.saveBalanceState = function(){
            
            document.cookie = "OSI.bBalanceOpen="+oThis.bOpen+"; path=/";
        };
        
        oThis.loadBalanceState = function(){
            
            var aCookies = document.cookie.split(";");
            
            for(var i=0; i<aCookies.length; i++){
                
                if(aCookies[i].split("=")[0].replace(" ", "") == "OSI.bBalanceOpen"){
                    
                    return (aCookies[i].split("=")[1] == "true")?true:false;
                }
            }
        };
        
        oThis.showLoading = function(ndNode){
            
            ndNode.find(".loading").fadeIn();
        };
        
        oThis.hideLoading = function(){
            
            ndNode.find(".loading").fadeOut();
        };
        
        oThis.showBalanceLoading = function(ndNode){
            
            ndNode.append('<div class="loading"><img src="'+AkamaiURL+'/images/osi/wait_anim.gif"/></div>');

        };
        
        oThis.hideBalanceLoading = function(){
            
            $(ndNode).find(".loading").remove();
        };
        
        oThis.onAccountChange = function(){};
		
		oThis.onOptionsScreenerBalance = function(){};
    }
    
    
    
    
    
    
    
    
    function OSIInfoStationMenu(sID, ndLink, sDataURL, sAccountID, sAccountDesc, bPreload){
    
        var oThis = this;
        
        oThis.ndContainer = $("#"+sID);
        oThis.ndLink = ndLink;
        
        oThis.sAccountID = sAccountID;
        oThis.sAccountDesc = sAccountDesc;
        oThis.sDataURL = sDataURL;
        
        oThis.bActive = false;
        oThis.bLoaded = false;
        oThis.bError = false;
        
        
                
        
        oThis.start = function(bPreload){
            
            if(bPreload)oThis.getMenu(oThis.sAccountID);
        };
        
        oThis.getMenu = function(sAccountID){
            
            oThis.bError = false;
            
            if(sAccountID)oThis.sAccountID = sAccountID;
            $.get(oThis.sDataURL, {accountNo:oThis.sAccountID}, oThis.initMenu);
        };
        
        oThis.refresh = function(){
            
            oThis.getMenu();
            oThis.showLoading();
            
            return false;
        };
        
        oThis.initMenu = function(sResponse){
            
            if(sResponse.indexOf("<html") == -1){
                
                oThis.ndContainer.html(sResponse);
                
                oThis.bLoaded = true;
                
                var ndAccountName,
                    ndError = oThis.ndContainer.find(".osi-infstn-error");
                
                oThis.ndContainer.find(".osi-infstn-refresh").click(oThis.refresh);
                oThis.ndContainer.find(".osi-infstn-popup-close").click(oThis.close);
                oThis.ndContainer.find(".account-name").html(oThis.sAccountDesc);
                oThis.onLoad();
                
                if(ndError.length > 0)oThis.bError = true;
                else{
                    if(oThis.ndContainer.find(".osi-infstn-tbody a").length > 0){
                        oThis.ndContainer.find(".osi-infstn-tbody a")[0].focus();
                    }
                }
                
            }else{
                
                oThis.showError(false, "An error has occured");
                oThis.bError = true;
            }
            
            oThis.hideLoading();
        };
        
        oThis.open = function(){
            
            if(!oThis.bLoaded || oThis.bError){
                
                oThis.getMenu();
                oThis.ndContainer.html('<img src="'+AkamaiURL+'/images/osi/wait_anim.gif"/>');
            }
            oThis.ndLink.addClass("active");
            oThis.ndContainer.show();
            oThis.bActive = true;
            oThis.onOpen();
        };
        
        oThis.close = function(){
            
            oThis.ndLink.removeClass("active");
            oThis.ndContainer.hide();
            oThis.bActive = false;
            oThis.onClose();
            return false;
        };
        
        oThis.showError = function(errorID, sError){
            
            oThis.ndContainer.html(sError);
        };
        
        oThis.showLoading = function(ndNode){
            
            oThis.ndContainer.find(".loading").fadeIn();
        };
        
        oThis.hideLoading = function(){
            
            //oThis.ndContainer.find(".loading").hide();
        };
        
        oThis.clear = function(){
            
            oThis.ndContainer.html("");
            oThis.bLoaded = false;
        };
        
        oThis.onOpen = function(){};
        oThis.onClose = function(){};
        oThis.onLoad = function(){};
        
        oThis.start(bPreload);
    }
    
    
    
    
    
    
    function OSIInfoStationAccounts(ndContainer){
        
        var oThis = this;
        
        oThis.ndContainer = ndContainer;
        oThis.ndLink = ndContainer.find(".infstn-menu-link");
        oThis.ndAccountsDropdown = ndContainer.find(".osi-infstn-accounts-dropdown");
        
        oThis.ndSelected = oThis.ndAccountsDropdown.find(".selected");
        
        oThis.sAccount = oThis.ndSelected.html();
        
        oThis.iAccount = oThis.ndSelected.find("span").html().replace("-", "");
        
        oThis.aImages = [
            
            AkamaiURL+"/images/osi/arrow_down.gif",
            AkamaiURL+"/images/osi/arrow_down_black.gif",
            AkamaiURL+"/images/osi/arrow_up.gif"
        ];
        
        oThis.bActive = false;
        oThis.bSingleAccount = false;
        
        
        
        
        oThis.start = function(){
            
            if(oThis.ndAccountsDropdown.find("a").length <= 1){
                
                oThis.bSingleAccount = true;
                
            }else{
                
                oThis.ndAccountsDropdown.find("a").each(function(){
                    
                    var ndNode = $(this);
                    
                    ndNode.click(function(){
                        
                        oThis.ndLink.html(ndNode.html());
                        oThis.close();
                        oThis.ndAccountsDropdown.find(".selected").removeClass("selected");
                        ndNode.addClass("selected");
                        
                        oThis.sAccount = ndNode.html();
                        oThis.iAccount = ndNode.find("span").html().replace("-", "");
                        
                        oThis.onSelect();
                    })
                });
            }
        };
        
        oThis.open = function(){
            
            if(!oThis.bSingleAccount){

                oThis.ndLink.addClass("active");
                oThis.ndAccountsDropdown.show();
                oThis.bActive = true;
                oThis.onOpen();
            }
        };
        
        oThis.close = function(){
            
            oThis.ndLink.removeClass("active");
            oThis.ndAccountsDropdown.hide();
            oThis.bActive = false;
            oThis.onClose();
            return false;
        };
        
        oThis.onOpen = function(){};
        oThis.onClose = function(){};
        oThis.onSelect = function(){};
        
        oThis.start();
    }
