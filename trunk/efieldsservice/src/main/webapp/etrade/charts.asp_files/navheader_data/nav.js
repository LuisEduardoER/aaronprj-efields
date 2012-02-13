var AkamaiURL = "https://cdn.etrade.net/1/20120207.0",
        ACTIVATE = "https://activation.etrade.com",
        BANKUS = "https://bankus.etrade.com",
        BOND = "https://www.bonddesk.com",
        EDOCS = "https://edoc.etrade.com",
        ETRADE = "https://us.etrade.com",
        EXPRESS = "https://express.etrade.com",
        OLINK = "https://optionslink.etrade.com",
        GLOBAL = "https://global.etrade.com",
        SEARCH = "https://search.etrade.com",
        OPTCHART = "https://optchart.etrade.com",
        LENDINGPROXY = "https://mortgage.etrade.com",
        PINGFEDERATE = "https://federation.etrade.com",
        HOMEDEPOSITPROXY = "https://homedeposit.etrade.com",
   COMMUNITY = "https://community.etrade.com",
   CHAT = "https://webchat.etrade.com";

GoToETURL.thirdParty = function(sParty) {
	switch(sParty) {
		case "activate": return ACTIVATE;
		case "bankus": return BANKUS;
		case "bond": return BOND;
		case "edocs": return EDOCS;
		case "etrade": return ETRADE;
		case "express": return EXPRESS;
		case "olink": return OLINK;
		case "search": return SEARCH; 
		case "global": return GLOBAL;
		case "optchart": return OPTCHART;
		case "lendingproxy": return LENDINGPROXY;
		case "pingfederate": return PINGFEDERATE;
		case "homedepositproxy": return HOMEDEPOSITPROXY;
        case "community": return COMMUNITY;
        case "chat": return CHAT;
	}
};

function GoToETURL(urlPath,thirdParty) {
        
	if(thirdParty == null) {
		thirdParty = "etrade";      
	}
        if(thirdParty == 'forex'){
                window.top.location.href = urlPath;
        }else{
	        window.top.location.href = etURL.parse(urlPath,thirdParty); 
        }
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



