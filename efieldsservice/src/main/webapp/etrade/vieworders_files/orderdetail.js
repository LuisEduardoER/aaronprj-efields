if (typeof MakeXML == "undefined") {
   MakeXML = function () {}

   MakeXML.prototype.parseFromString = function (str, contentType) {
      if (typeof ActiveXObject != "undefined") {
         var d = new ActiveXObject("MSXML.DomDocument");
         d.loadXML(str);
         return d;
      } else if (typeof XMLHttpRequest != "undefined") {
         var req = new XMLHttpRequest;
         req.open("GET", "data:" + (contentType || "application/xml") +
                         ";charset=utf-8," + encodeURIComponent(str), false);
         if (req.overrideMimeType) {
            req.overrideMimeType(contentType);
         }
         req.send(null);
         return req.responseXML;
      }
   }
}



var delimeter="<br>";

// code for AJAX
var rownumber="";
var req = "";
var url = "";

function showOrderDetails(rownum,loadurl,typecode){
    rownumber = rownum;
    url = loadurl;

try{

    if(window.ActiveXObject){    // IE

        req = new ActiveXObject("Msxml2.XMLHTTP");
    }

    else if(window.XMLHttpRequest){         //mozilla & safari
        req = new XMLHttpRequest();
        req.overrideMimeType('text/xml');
    }

    if(req){ //only if the req object available
        if (document.getElementById("order" + rownumber).innerHTML != "") {
            document.getElementById("order" + rownumber).innerHTML = "";
        }
        else{
            clearAllDivs();
            document.getElementById("order" + rownumber).innerHTML = '<div align="center" style="text-align:center" style="background-color:#999999;padding:2px;" class="rev"><b>Loading....</b></div><br/>';

            req.open('GET', url, true);
            req.onreadystatechange = processReqChange; //process function if req state change
            req.send(null);
        }
    }
    else{
        popupOrderDetails();
    }
}catch(e){
    $("a[href]").unbind('click', showOrderDetails);
    showOrderDetails(rownum,loadurl);
    /*popupOrderDetails();*/
}

}

function popupOrderDetails(){
    //remove .raw in the url to do a popup
    var orddetailurl = url.substring(0,(url.indexOf("XML"))) + url.substring(url.indexOf("?"),url.length);
    etWin(orddetailurl,'E*TRADE',640,400,'no','no','no','no','no',5,5,'');
}

function clearAllDivs(){
    var maxRows = 50;
//  if(document.viewForm.results_perpage) maxRows = document.viewForm.results_perpage.value;
    for(var i=0;i<maxRows;i++){
        if(document.getElementById("order"+i))  document.getElementById("order"+i).innerHTML = "";
    }
}

function processReqChange() {
    if(req.readyState == 4) { // process complete
        if(req.status == 200) { // if http return code is OK
            var responsexml = req.responseXML;

            if(!responsexml || responsexml.childNodes.length==0) {
                responsexml = (new MakeXML()).parseFromString(req.responseText, "text/xml");
            }

            try {
                var pagereturned = responsexml.getElementsByTagName("root")[0].getElementsByTagName("pagename")[0].firstChild.nodeValue;
                var instVal = responsexml.getElementsByTagName("root")[0].getElementsByTagName("invest.trading.OrderResult")[0].getElementsByTagName("Order")[0].getElementsByTagName("LegDetails")[0].getElementsByTagName("ProductId")[0].getElementsByTagName("TypeCode")[0].firstChild.nodeValue;

                if(pagereturned.indexOf("orderdetail") > -1) {
                    if (instVal == 'BOND') {
                        parseBondOrderDetailXML(responsexml);
                    }
                    else {
                        parseOrderDetailXML(responsexml);
                    }
                }
                else if(pagereturned=='login') {
                    document.getElementById("order"+rownumber).innerHTML = '<div align="center" class="e2"  style="background-color:#ffffff;padding:2px;text-align:center;"><b>Your Session has expired, please <a href="/e/t/invest/vieworders">click here</a> to login again...</b></div><br/>';
                }
                else {
                    document.getElementById("order"+rownumber).innerHTML = '<div align="center" class="e2"  style="background-color:#ffffff;padding:2px;text-align:center;"><b>Error processing the request, please try again...</b></div><br/>';
                }
            }
            catch(e) {
                popupOrderDetails();
            }
        }
        else {
            document.getElementById("order"+rownumber).innerHTML = '<div align="center" class="e2"  style="background-color:#ffffff;padding:2px;text-align:center;"><b>Error processing the request, please try again...</b></div><br/>';
        }
    }
}

function parseBondOrderDetailXML(responsexml){
    var orderresultnode = responsexml.getElementsByTagName("root")[0].getElementsByTagName("invest.trading.OrderResult")[0];
    var ordernumber = responsexml.getElementsByTagName("root")[0].getElementsByTagName("invest.trading.OrderRequest")[0].getElementsByTagName("OrderNumber")[0].firstChild.nodeValue;
    var ordernode = orderresultnode.getElementsByTagName("Order")[0];
    var headernode = ordernode.getElementsByTagName("Header")[0];
    var eventsheadernode = orderresultnode.getElementsByTagName("Events")[0].getElementsByTagName("Header")[0];
    var legdetails = ordernode.getElementsByTagName("LegDetails")[0];
    var bondheadernode = ordernode.getElementsByTagName("BondHeader")[0];
    var bondstatusnode = ordernode.getElementsByTagName("BondStatus");

    if(legdetails.getElementsByTagName("BondDetail")[0]){
        var orderdetailrow = writeBondHeading(ordernumber);// start building the order details rows
        orderdetailrow = orderdetailrow + writeBondOrderDetails(ordernode,headernode,legdetails,bondheadernode,eventsheadernode);
        orderdetailrow = orderdetailrow + writeBondYieldDetails(orderresultnode,headernode,legdetails,bondheadernode);
        orderdetailrow = orderdetailrow + writeBondStatusDetail(ordernode,bondstatusnode,bondheadernode);
        document.getElementById("order"+rownumber).innerHTML = orderdetailrow;
    } else {
        parseOrderDetailXML(responsexml);
        // bonddetailerror = '<div align="center" class="e2"  style="background-color:#ffffff;padding:2px;text-align:center;"><b>Error processing the request, please try again...</b></div><br/>';
        // document.getElementById("order"+rownumber).innerHTML = bonddetailerror;
    }

}

function parseOrderDetailXML(responsexml){
try{


    var orderresultnode = responsexml.getElementsByTagName("root")[0].getElementsByTagName("invest.trading.OrderResult")[0];
    var ordernumber = responsexml.getElementsByTagName("root")[0].getElementsByTagName("invest.trading.OrderRequest")[0].getElementsByTagName("OrderNumber")[0].firstChild.nodeValue;

    var orderdetailrow = writeHeading(ordernumber);// start building the order details rows

    var ordernode = orderresultnode.getElementsByTagName("Order")[0];
    var events = responsexml.getElementsByTagName("Events");
    var headernode = "";
    var DisplayLegDetailNode = "";
    var searchHeader= ordernode.childNodes;
    for(var i=0; i<searchHeader.length-1; i++)
    {
        if (searchHeader[i].nodeName == "Header")
            {
                headernode = searchHeader[i];
            }

                if (searchHeader[i].nodeName == "LegDetails")
            {

                DisplayLegDetailNode = searchHeader[i];

            }


    }
    var legdetails = ordernode.getElementsByTagName("LegDetails");
    var advancedordernode = ordernode.getElementsByTagName("AdvancedOrder")[0];
    var execnode = ordernode.getElementsByTagName("ExecGuarantee")[0];
    var orderidnode = ordernode.getElementsByTagName("OrderId")[0];
    var ordertype = headernode.getElementsByTagName("OrderType")[0].firstChild.nodeValue;
    ordertype = parseInt(ordertype);
    var ordercount = 1; //default 0 for all orders; this will be > 1 for OTA,OCA,OTOCO
    if(ordertype==26 || ordertype==27 || ordertype==28){ //grouporders with mutliple orders
        ordercount = ordernode.getElementsByTagName("GroupOrderCount")[0].firstChild.nodeValue;
    }

    var order_info_array = new Array(ordercount); //array of array

    if(ordertype >= 25 && ordertype <= 28){//get the grouporder nodes for grouporders


        var ordernodes = ordernode.getElementsByTagName("GroupOrders");
        for(var i=0; i<ordernodes.length; i++){
            var groupordernode = ordernodes[i];
            headernode = groupordernode.getElementsByTagName("Header")[0];
            legdetails = groupordernode.getElementsByTagName("LegDetails"); // can be multiple nodes
            advancedordernode = groupordernode.getElementsByTagName("AdvancedOrder")[0];
       //assuming the grouporders in the order node are ordered by the grouporderno 1,2,3 etc
            order_info_array[i] = getOrderDetailsArray(ordertype,advancedordernode,headernode,legdetails,execnode,orderidnode);
        }
    }
    else order_info_array[0] = getOrderDetailsArray(ordertype,advancedordernode,headernode,legdetails,execnode,orderidnode);
    //write all order details one order per row
    for(var i=0; i<order_info_array.length; i++){
        orderdetailrow = orderdetailrow + writeOrderDetails(order_info_array[i]);
    }

    orderdetailrow = orderdetailrow + writeEventHeading();


  //get pricetype & term for all orders except for (group order legs)
    var otherorderdesc = order_info_array[0][3] + order_info_array[0][4];

    for(var i=0; i<events.length; i++){             //for every Events node
        var eventnode = events[i];
        var cell1='',cell2='',cell3='--',cell4='--',cell5='--',cell6=0;

        var grouporderno=0;
        try{grouporderno = eventnode.getElementsByTagName("Header")[0].getElementsByTagName("GroupOrderNo")[0].firstChild.nodeValue;
        }catch(e){};

        //get pricetype & term for group order legs
        if(grouporderno!= null && grouporderno > 0){
            var orderarrayindex = grouporderno-1;
            otherorderdesc = order_info_array[orderarrayindex][3] + order_info_array[orderarrayindex][4];
        }
        var eventheadernode = eventnode.getElementsByTagName("Header")[0];
        var orderstatus = eventheadernode.getElementsByTagName("EventType")[0].firstChild.nodeValue;
        var mktsess = eventheadernode.getElementsByTagName("MarketSession")[0].firstChild.nodeValue;
        var filledprice = eventheadernode.getElementsByTagName("Price")[0].firstChild.nodeValue;
        cell1 = writeFillOrderStatus(orderstatus);
        cell3 = eventheadernode.getElementsByTagName("EventTimeEST")[0].firstChild.nodeValue;


        var eventlegs = eventnode.getElementsByTagName("EventLegDetails");
        for(var k=0; k<eventlegs.length; k++){
            var legdetailnode = eventlegs[k].getElementsByTagName("LegDetail")[0];
            var typecode = legdetailnode.getElementsByTagName("ProductId")[0].getElementsByTagName("TypeCode")[0].firstChild.nodeValue;
            var sym = legdetailnode.getElementsByTagName("DisplaySymbol")[0].firstChild.nodeValue;
            var poseff = legdetailnode.getElementsByTagName("PositionEffect")[0].firstChild.nodeValue;
            var qtytype = legdetailnode.getElementsByTagName("QuantityType")[0].firstChild.nodeValue;
            var qty = legdetailnode.getElementsByTagName("QuantityValue")[0].firstChild.nodeValue;
            var reserveqty = legdetailnode.getElementsByTagName("QtyReserveShow")[0].firstChild.nodeValue;
            var orderaction = legdetailnode.getElementsByTagName("OrderAction")[0].firstChild.nodeValue;
            // to show Order Description of Order Details for Order # table
            //  Buy Open 1 MSQ Dec 19 '09 $27 Put
            // writeOrderType : Buy Open
            // writeQuantity: 1
            // sym: MSQ Dec 19 '09 $27 Put

            if (ordertype>=14 && ordertype<=17 && (cell1 == "Order Placed" || cell1 == "Cancel Requested" || cell1 == "Expired"))
            {
                var callPutSeparator = sym.lastIndexOf(" ");

                var dollarSeparator = sym.indexOf("$");
                var dateSeparator = sym.indexOf(" ");
                var optionSymbol = sym.substring(0, callPutSeparator);

                var callPut = sym.substring(callPutSeparator+1, callPutSeparator+2);
                var dollarAmt = sym.substring(dollarSeparator+1, callPutSeparator);
                var optionDate = sym.substring(dateSeparator+1, dollarSeparator-1);

                if (k == 0)
                {
                    var firstLegQty = writeQuantity(qtytype,qty,reserveqty,0,ordertype,(k+1));
                    var multiLegOrderType = writeOrderType(mktsess,typecode,orderaction,poseff);
                    multiLegOrderType = multiLegOrderType.split(" ");
                    cell2 = cell2 + multiLegOrderType[0] + " " + firstLegQty + " " + optionDate + " " + dollarAmt + callPut;
                }
                else {
                    cell2 = cell2 + "/" + dollarAmt+callPut;
                }

            } else {
                cell2 = cell2 + ' ' + writeOrderType(mktsess,typecode,orderaction,poseff) + ' ' + writeQuantity(qtytype,qty,reserveqty,0,ordertype,(k+1)) + ' ' + sym ;
            }

            cell4 = legdetailnode.getElementsByTagName("QuantityValue")[0].firstChild.nodeValue;
            cell4 = formatMoney(cell4,false);
            if(ordertype==9 || ordertype==10)
            {
                cell4 = formatMoney(cell4,false);
            }

            //show commission only for event types 1, 13,18,21,24,25
            if(orderstatus==1 || orderstatus==13 || orderstatus==18 || orderstatus==21 || orderstatus==24  || orderstatus==25 || orderstatus==27) {
                var commamt=0;
                if(ordertype==9 || ordertype==10){//for MFs, commission is OtherFee
                    commamt = legdetailnode.getElementsByTagName("Charges")[0].getElementsByTagName("OtherFee")[0].firstChild.nodeValue;
                }
                //else commamt = legdetailnode.getElementsByTagName("Charges")[0].getElementsByTagName("CommissionAmount")[0].firstChild.nodeValue;
                // iTrack: OTM-29 - Begin
                else{
                    var comm = legdetailnode.getElementsByTagName("Charges")[0].getElementsByTagName("CommissionAmount")[0].firstChild.nodeValue;
                    var otherFee = legdetailnode.getElementsByTagName("Charges")[0].getElementsByTagName("OtherFee")[0].firstChild.nodeValue;
                    var otherFeeCode = legdetailnode.getElementsByTagName("Charges")[0].getElementsByTagName("OtherFeeCode")[0].firstChild.nodeValue;
                    if( otherFeeCode==2 || otherFeeCode==3 ) commamt = parseFloat(comm) + parseFloat(otherFee);
                    else commamt = parseFloat(comm);
                }
                // iTrack: OTM-29 - End
                if(orderstatus==1) cell6 = parseFloat(cell6) + parseFloat(commamt);
                else cell6 = parseFloat(commamt);

                cell6 = formatMoney(cell6);
            }
        }
              //  CTS Modification iTrack: TRDODC-20


            if (ordertype>=14 && ordertype<=17 && (cell1 == "Order Placed" || cell1 == "Cancel Requested" || cell1 == "Expired"))
            {
                var optionType = "";
                switch(parseInt(ordertype))
                {
                    case 14:
                        optionType = "Butterfly";
                        break;
                    case 15:
                        optionType = "Condor";
                        break;
                    case 16:
                        optionType = "Iron Condor";
                        break;
                    case 17:
                        optionType = "Iron Butterfly";
                        break;
                    default:
                        optionType = " ";
                }

                cell2 = cell2 + ' ' + optionType + " " + "@" + globalPrice;
            } else (!((orderstatus==1 ||orderstatus==8 || orderstatus==9) && ordertype==13))
            {
                cell2 = cell2 + ' ' + otherorderdesc;
            }


        // show price only for order executed event
        if(orderstatus==13 || orderstatus==18 || orderstatus==21 || orderstatus==24 || orderstatus==25 || orderstatus==27){
            if(filledprice != '' && filledprice != 0) cell5 = formatMoney(filledprice);
        }
        orderdetailrow = orderdetailrow + writeEventRow(cell1,cell2,cell3,cell4,cell5,cell6);

    }

    orderdetailrow = orderdetailrow + '</table>';

    document.getElementById("order"+rownumber).innerHTML = orderdetailrow;
  }
  catch(e) {
    popupOrderDetails();
  }
}

// To write Order Details for Order #.. table
function writeEventRow(cell1,cell2,cell3,cell4,cell5,cell6){
    var orderdetailrow = '<tr valign="top" bgcolor="#ffffff">';
    orderdetailrow = orderdetailrow + '<td>' + cell1 + '</td>'; // Transaction Status
    orderdetailrow = orderdetailrow + '<td>' + cell2 + '</td>'; // Order Description
    orderdetailrow = orderdetailrow + '<td>' + cell3 + '</td>'; // Date & Time
    orderdetailrow = orderdetailrow + '<td>' + cell4 + '</td>'; // Quantity
    orderdetailrow = orderdetailrow + '<td>' + cell5 + '</td>'; // Price/Executed
    orderdetailrow = orderdetailrow + '<td>' + cell6 + '</td>'; // Commission/Fee
    orderdetailrow = orderdetailrow + '</tr>';
    return orderdetailrow;
}


function getAndWriteAOPriceType(orderaction,advancedordernode,ordertrigger,ordergrouptype,grouporderno){
    var aoordertype = advancedordernode.getElementsByTagName("AoOrderType")[0].firstChild.nodeValue;
    var offsettype = advancedordernode.getElementsByTagName("OffsetType")[0].firstChild.nodeValue;
    return writeAOPriceType(aoordertype,offsettype,orderaction,ordertrigger,grouporderno,ordergrouptype);
}

function getAndWriteAOpriceEntered(orderaction,advancedordernode,ordertrigger,limitprice,overallordertype){
    var aoordertype = advancedordernode.getElementsByTagName("AoOrderType")[0].firstChild.nodeValue;
    var offsettype = advancedordernode.getElementsByTagName("OffsetType")[0].firstChild.nodeValue;
    var brklmtprice = advancedordernode.getElementsByTagName("PriceBrkLimit")[0].firstChild.nodeValue;
    var stopprice = advancedordernode.getElementsByTagName("InitialStopPrice")[0].firstChild.nodeValue;
    var pricetrail = advancedordernode.getElementsByTagName("PriceTrail")[0].firstChild.nodeValue;
    return writeAOPriceEntered(aoordertype,offsettype,orderaction,brklmtprice,stopprice,pricetrail,ordertrigger,limitprice,overallordertype);
}

function writeEventHeading(){
    var orderdetailrow = '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom">';
    orderdetailrow = orderdetailrow + '<th>Transaction Status</th>';
    orderdetailrow = orderdetailrow + '<th>Order Description</th>';
    orderdetailrow = orderdetailrow + '<th>Date & Time</th>';
    orderdetailrow = orderdetailrow + '<th>Quantity</th>';
    orderdetailrow = orderdetailrow + '<th>Price<br/>Executed</th>';
    orderdetailrow = orderdetailrow + '<th>Commission<br/>/Fee</th>';
    orderdetailrow = orderdetailrow + '</tr>';
    return orderdetailrow;
}

function writeBondHeading(ordernumber){
    var orderdetailrow = '<table cellpadding="3" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#cccccc">';
    orderdetailrow = orderdetailrow + '<th colspan="6" align="center">Order Details for Order # ' + ordernumber + '</th>';
    orderdetailrow = orderdetailrow + '<th align="right" width="60"><a href="javascript:clearAllDivs();"><img src="/images/b_close_13x13.gif" width="13" height="13" border="0" alt="Close"/></a></th>';
    orderdetailrow = orderdetailrow + '</tr>';
    orderdetailrow = orderdetailrow + '</table>';
    orderdetailrow = orderdetailrow + '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom" align="center">';
    orderdetailrow = orderdetailrow + '<th>Time (ET)</th>';
    orderdetailrow = orderdetailrow + '<th>Order Type</th>';
    orderdetailrow = orderdetailrow + '<th>Quantity</th>';
    orderdetailrow = orderdetailrow + '<th width="300">Issue</th>';
    orderdetailrow = orderdetailrow + '<th>Exec Type</th>';
    orderdetailrow = orderdetailrow + '<th>Coupon</th>';
    orderdetailrow = orderdetailrow + '</tr>';
    return orderdetailrow;
}

function writeHeading(ordernumber){
    var orderdetailrow = '<table cellpadding="3" cellspacing="0" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#cccccc">';
    orderdetailrow = orderdetailrow + '<th colspan="6" align="center">Order Details for Order # ' + ordernumber + '</th>';
    orderdetailrow = orderdetailrow + '<th align="right" width="60"><a href="javascript:clearAllDivs();"><img src="/images/b_close_13x13.gif" width="13" height="13" border="0" alt="Close"/></a></th>';
    orderdetailrow = orderdetailrow + '</tr>';
    orderdetailrow = orderdetailrow + '</table>';
    orderdetailrow = orderdetailrow + '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom">';
    orderdetailrow = orderdetailrow + '<th>Order Type</th>';
    orderdetailrow = orderdetailrow + '<th>Quantity</th>';
    orderdetailrow = orderdetailrow + '<th>Security</th>';
    orderdetailrow = orderdetailrow + '<th>Price Type</th>';
    orderdetailrow = orderdetailrow + '<th>Term</th>';
    orderdetailrow = orderdetailrow + '<th>Price</th>';
    orderdetailrow = orderdetailrow + '<th>Other Order Details</th>';
    orderdetailrow = orderdetailrow + '</tr>';
    return orderdetailrow;
}

function writeOrderDetails(order_info_array){

    globalPrice = order_info_array[5];
    var orderdetailrow = '<tr bgcolor="#ffffff" valign="top">';
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[0] + '</td>'; // Order Type
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[1] + '</td>'; // Quantity
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[6] + '</td>'; // Security
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[3] + '</td>'; // Price Type
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[4] + '</td>'; // Term
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[5] + '</td>'; // Price
    orderdetailrow = orderdetailrow + '<td>' + order_info_array[7] + '</td>'; // Other Order Details
    orderdetailrow = orderdetailrow + '</tr>';
    return orderdetailrow;
}

function writeLotSelectionDetails(lottrackingpref,ordertype,typecode,orderaction,poseff,orderstatus,accountid,ordernum,legnum){
        var lotselectiondetails="";
    if(orderstatus<10) {
        if(poseff==2) {
            if(lottrackingpref==3 || ordertype==11 || ordertype==3 || ordertype==9 || ordertype==10) {
                lotselectiondetails="Lot Selection: FIFO <br/>";
            }
            if(lottrackingpref==4) {
                lotselectiondetails="Lot Selection: LIFO <br/>";
            }
            else if(lottrackingpref==5) {
                lotselectiondetails="Lot Selection: HIPO <br/>";
            }
            else if(lottrackingpref==11 || lottrackingpref==12) {
                var popUrl ="<a href=javascript:etWin('/e/t/invest/viewlotselection?skinname=none&ViewLotsRequest.accountId="+accountid+"&ViewLotsRequest.orderId="+ordernum+"&ViewLotsRequest.legNo="+legnum+"','E*TRADE',640,400,'no','no','no','no','no',5,5,'');>Click here</a>";
                lotselectiondetails="Lot Selection: " + popUrl + "<br/>";
            }
        }
    }
    return lotselectiondetails;
}

function writeOtherAODetails(orderaction,advancedordernode){
    var otherdetails="";
    var aoordertype = advancedordernode.getElementsByTagName("AoOrderType")[0].firstChild.nodeValue;
    if(aoordertype==1 || aoordertype==2 || aoordertype==4){ //bracketed & t-stop
        otherdetails = "Initial Stop Price: " + advancedordernode.getElementsByTagName("InitialStopPrice")[0].firstChild.nodeValue + "<br/>";
        if(aoordertype==2 || aoordertype==4){
            otherdetails = otherdetails + "Trailing Stop Parameter: " + advancedordernode.getElementsByTagName("OffsetValue")[0].firstChild.nodeValue;
            var offsettype = advancedordernode.getElementsByTagName("OffsetType")[0].firstChild.nodeValue;
            if(offsettype==1) otherdetails = otherdetails + " point(s)";
            else if(offsettype==2) otherdetails = otherdetails + " percent";
            if(orderaction==2) otherdetails = otherdetails + " above";
            else if(orderaction==3) otherdetails = otherdetails + " below";
            var pricetofollow = advancedordernode.getElementsByTagName("FollowPrice")[0].firstChild.nodeValue;
            if(pricetofollow==1) otherdetails = otherdetails + " ask";
            else if(pricetofollow==2) otherdetails = otherdetails + " bid";
            else if(pricetofollow==3) otherdetails = otherdetails + " last";
            else if(pricetofollow==4) otherdetails = otherdetails + " ";
        }
    }
    return otherdetails;
}

function getOrderDetailsArray(overallordertype,advancedordernode,headernode,legdetails,execnode,orderidnode){
    // array of 8 : ordertype,qty,sym,pricetype,term,price,symdesc,otherdetails
    var order_info_array = new Array('','','','','','','','');
    var mktsess = headernode.getElementsByTagName("MarketSession")[0].firstChild.nodeValue;
        var orderstatus = headernode.getElementsByTagName("OrderStatus")[0].firstChild.nodeValue;
    var ordertrigger = headernode.getElementsByTagName("OrderTrigger")[0].firstChild.nodeValue;
    var ordertype = headernode.getElementsByTagName("OrderType")[0].firstChild.nodeValue;
    var aon = headernode.getElementsByTagName("ExecInstruction")[0].getElementsByTagName("AonFlag")[0].firstChild.nodeValue;
    var limitprice = headernode.getElementsByTagName("LimitPrice")[0].firstChild.nodeValue;
    var stopprice = headernode.getElementsByTagName("StopPrice")[0].firstChild.nodeValue;
    var lottrackingpref = headernode.getElementsByTagName("LotTrackingPref")[0].firstChild.nodeValue;
    var accountid = orderidnode.getElementsByTagName("AccountId")[0].firstChild.nodeValue;
    var ordernum = orderidnode.getElementsByTagName("OrderNumber")[0].firstChild.nodeValue;
    try{var grouporderno = headernode.getElementsByTagName("GroupOrderNo")[0].firstChild.nodeValue;}catch(e){}
    var isAO=false;
    if(ordertype==2 || ordertype==12) isAO=true;

    var term;
    if(isAO) term = advancedordernode.getElementsByTagName("AoTerm")[0].firstChild.nodeValue;
    else term = headernode.getElementsByTagName("OrderTerm")[0].firstChild.nodeValue;

    for(var i=0;i<legdetails.length;i++){
        var legdetailnode;
        legdetailnode = legdetails[i];
        var orderdbquotenode = legdetailnode.getElementsByTagName("OrderDbQuote")[0];
        var typecode = legdetailnode.getElementsByTagName("ProductId")[0].getElementsByTagName("TypeCode")[0].firstChild.nodeValue;
        var sym = legdetailnode.getElementsByTagName("ProductId")[0].getElementsByTagName("Symbol")[0].firstChild.nodeValue;
        var poseff = legdetailnode.getElementsByTagName("PositionEffect")[0].firstChild.nodeValue;
        var qtytype = legdetailnode.getElementsByTagName("QuantityType")[0].firstChild.nodeValue;
        var qty = legdetailnode.getElementsByTagName("QuantityValue")[0].firstChild.nodeValue;
        var reserveqty = legdetailnode.getElementsByTagName("QtyReserveShow")[0].firstChild.nodeValue;
        var orderaction = legdetailnode.getElementsByTagName("OrderAction")[0].firstChild.nodeValue;
        var legnum = legdetailnode.getElementsByTagName("LegNumber")[0].firstChild.nodeValue;
        var symdesc='';
        if(typecode=='OPTN'){ //get symdesc only for order details not for events
            var underlyingsymbol = orderdbquotenode.getElementsByTagName("UnderlyingProductId")[0].getElementsByTagName("Symbol")[0].firstChild.nodeValue;
            var expymm = orderdbquotenode.getElementsByTagName("OptExpireYearMonth")[0].firstChild.nodeValue;
            var expireDate= orderdbquotenode.getElementsByTagName("OptExpireDate")[0].firstChild.nodeValue;
            var strikeprice = orderdbquotenode.getElementsByTagName("OptStrikePrice")[0].firstChild.nodeValue;
            var callput = orderdbquotenode.getElementsByTagName("OptCallPut")[0].firstChild.nodeValue;
            symdesc = writeOptionSymbolDesc(underlyingsymbol,expymm,strikeprice,callput,sym,expireDate);
			var displaySym = orderdbquotenode.getElementsByTagName("DisplaySymbol")[0].firstChild.nodeValue;
			
			if ((displaySym.length > 0) && (displaySym.slice(displaySym.length-1).toLowerCase() === 'w')) {
				symdesc += ' w';
			}				
        }
        else try{symdesc = orderdbquotenode.getElementsByTagName("InstrumentName")[0].firstChild.nodeValue + ' (' + sym + ')';}catch(e){symdesc = sym;}
        var temp='';	
        order_info_array[0] = order_info_array[0] + writeOrderType(mktsess,typecode,orderaction,poseff) + delimeter;
        order_info_array[1] = order_info_array[1] + writeQuantity(qtytype,qty,reserveqty,aon,ordertype,(i+1)) + delimeter;
        order_info_array[2] = order_info_array[2] + sym + delimeter;
        if(isAO) temp = temp + getAndWriteAOPriceType(orderaction,advancedordernode,ordertrigger,overallordertype,grouporderno) + ' ';
        else temp = temp + writePriceType(typecode,ordertrigger,overallordertype) + ' ';
        order_info_array[3] = temp;
        temp='';
        if(isAO) temp = temp + getAndWriteAOpriceEntered(orderaction,advancedordernode,ordertrigger,limitprice,overallordertype) + ' ';
        else temp = temp + writePriceEntered(typecode,ordertrigger,limitprice,stopprice,overallordertype) + ' ';
       //  CTS Modification Start iTrack: TRDODC-20
                if(ordertype==13)
                    temp=parseInt(temp).toFixed(2);
       //  CTS Modification End iTrack: TRDODC-20
        order_info_array[5] = temp;

        order_info_array[6] = order_info_array[6] + symdesc + delimeter;
        order_info_array[7] = '';
        order_info_array[7] = order_info_array[7] + writeLotSelectionDetails(lottrackingpref,ordertype,typecode,orderaction,poseff,orderstatus,accountid,ordernum,legnum);
        order_info_array[7] = order_info_array[7] + writeOtherAODetails(orderaction,advancedordernode);

        if(execnode){
            var egqual = execnode.getElementsByTagName("EgQual")[0].firstChild.nodeValue;
            if(egqual==1){
                var egoverride = execnode.getElementsByTagName("EgOverride")[0].firstChild.nodeValue;
                var egstat = execnode.getElementsByTagName("EgStatus")[0].firstChild.nodeValue;
                order_info_array[7] = order_info_array[7] + showExecComment(egqual,egstat,egoverride);
            }
        }
        if(overallordertype==25) order_info_array[7] = order_info_array[7] + getContingentCondition(advancedordernode);
    }
    order_info_array[4] = order_info_array[4] + getOrderTermText(term,overallordertype);
    return order_info_array;
}

function showExecComment(egqual,egstat,egoverride){
    var egcomment="";
    var helpid="";
    if(egstat==4){
        egcomment="Disqualified/cancelled";
        helpid='201150150';
    }
    if(egqual==1 && egstat==5 && egoverride==0){
        egcomment="Disqualified/rejected";
        helpid='201011500';
    }
    if(egstat==3 || egstat==2){
        if(egoverride=='-'){
            egcomment="Free commission credited";
            helpid='201151600';
        }
        else if(egoverride==0){
            egcomment="Under review";
            helpid='201151800';
        }
    }
    if(egstat==2){
        switch(egoverride){
            case 6:{
                egcomment="Disqualified/changed or cancelled";
                helpid='201150150';
                break;
            }
            case 7:{
                egcomment="Disqualified/crossed market";
                helpid='201150700';
                break;
            }
            case 8:{
                egcomment="Disqualified/locked market";
                helpid='201150700';
                break;
            }
            case 9:{
                egcomment="Disqualified/halted market";
                helpid='201150700';
                break;
            }
            case 10:{
                egcomment="Disqualified/fast market";
                helpid='201150900';
                break;
            }
            case 3:{
                egcomment="Disqualified/time frame";
                helpid='201150150';
                break;
            }
            case 5:{
                egcomment="Disqualified/short options";
                helpid='201150600';
                break;
            }
            case 'U':{
                egcomment="Disqualified/systems interruption";
                helpid='201151200';
                break;
            }
            case 'S':{
                egcomment="Disqualified/order stopped";
                helpid='201150800';
                break;
            }
            case 'M':{
                egcomment="Disqualified/manual review";
                helpid='201151100';
                break;
            }
            case 4:{
                egcomment="Disqualified/duplicate";
                helpid='201151000';
                break;
            }
        }
    }
    if(egcomment!="") egcomment = "<a href=javascript:openHelp('/e/t/estation/contexthelp?id="+helpid+"')>"+egcomment+"</a>";
  return egcomment;
}

function getContingentCondition(advancedordernode){
    var sym = advancedordernode.getElementsByTagName("AoCondDisplaySymbol")[0].firstChild.nodeValue;
    var pricetype = advancedordernode.getElementsByTagName("FollowPrice")[0].firstChild.nodeValue;
    var offtype = advancedordernode.getElementsByTagName("OffsetType")[0].firstChild.nodeValue;
    var offval = advancedordernode.getElementsByTagName("OffsetValue")[0].firstChild.nodeValue;
    var cond = "Condition: " + sym;
    if(pricetype==1) cond = cond + " Ask Price";
    if(pricetype==2) cond = cond + " Bid Price";
    if(pricetype==3) cond = cond + " Last Price";
    if(offtype==3)  cond = cond + " Greater than or equal to ";
    if(offtype==4)  cond = cond + " Less than or equal to ";
    cond = cond + formatMoney(offval);
    return cond;
}

function writeBondOrderDetails(ordernode,headernode,legdetails,bondheadernode,eventsheadernode){
 var timeplaced,
     bondordertype,
     bondquantity,
     bondissue,
     bondexectype,
     bondcoupon,
     bondmaturity,
     bondmaturitynode,
     bondcusip,
     bondsettlement,
     bondsettlementnode,
     bondsolicited,
     bondfactor,
     bondtradetype,
     bondtradedate,
     bondreference,
     orderdetailrow;

    timeplaced = headernode.getElementsByTagName("TimePlacedEST")[0].firstChild.nodeValue.substring(9,20);

    bondordertype = legdetails.getElementsByTagName("OrderAction")[0].firstChild.nodeValue;

    bondquantity = parseInt(legdetails.getElementsByTagName("QuantityValue")[0].firstChild.nodeValue, 10);

    bondissue = legdetails.getElementsByTagName("OrderDbQuote")[0].getElementsByTagName("InstrumentName")[0].firstChild.nodeValue;

    bondexectype = headernode.getElementsByTagName("OrderTrigger")[0].firstChild.nodeValue;

    bondcoupon = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("Bond")[0].getElementsByTagName("CouponRate")[0].firstChild.nodeValue;

    bondmaturitynode = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("Bond")[0].getElementsByTagName("MaturityDate")[0];

    bondmaturity = bondmaturitynode.getElementsByTagName("Month")[0].firstChild.nodeValue + '/' + bondmaturitynode.getElementsByTagName("Day")[0].firstChild.nodeValue + '/' + bondmaturitynode.getElementsByTagName("Year")[0].firstChild.nodeValue;

if (bondmaturitynode.getElementsByTagName("Year")[0] && bondmaturitynode.getElementsByTagName("Year")[0].firstChild.nodeValue == "1970")
  {
  bondmaturity = "-";
  }

    bondtradedate = headernode.getElementsByTagName("TimePlacedEST")[0].firstChild.nodeValue.substr(0,8);

    bondcusip = legdetails.getElementsByTagName("OrderDbQuote")[0].getElementsByTagName("DisplaySymbol")[0].firstChild.nodeValue;

    if(legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("SettlementDate")[0].hasChildNodes()){
        bondsettlementnode = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("SettlementDate")[0];

  bondsettlement = bondsettlementnode.getElementsByTagName("Month")[0].firstChild.nodeValue + '/' + bondsettlementnode.getElementsByTagName("Day")[0].firstChild.nodeValue + '/' + bondsettlementnode.getElementsByTagName("Year")[0].firstChild.nodeValue;
    } else {
        bondsettlementnode = ' ';
        bondsettlement = ' ';
    }

    bondsolicited = headernode.getElementsByTagName("Solicited")[0].firstChild.nodeValue;
    if(legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("Factor")[0]){
        bondfactor = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("Factor")[0].firstChild.nodeValue;
    } else { bondfactor='0'; }

    bondtradetype = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("TradeType")[0].firstChild.nodeValue;
    // if(bondheadernode.getElementsByTagName("ReferenceOrderId")[0].hasChildNodes()) {
    //  bondreference = bondheadernode.getElementsByTagName("ReferenceOrderId")[0].firstChild.nodeValue;
    // } else { bondreference = ''; }
    if(ordernode.getElementsByTagName("ExtOrderId")[0].hasChildNodes()){
                bondreference = ordernode.getElementsByTagName("ExtOrderId")[0].firstChild.nodeValue;
        } else { bondreference = "-"; }

    orderdetailrow = '<tr bgcolor="#ffffff" valign="top" align="center">';
    orderdetailrow = orderdetailrow + '<td>' + timeplaced + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + writeBondOrderType(bondordertype) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondquantity + '</td>';
 orderdetailrow = orderdetailrow + "<td width=\"300\" align=\"left\"><a href=\"javascript:gotoBondLink('issue','"+bondcusip+"','"+p_magic+"','"+p_bridge+"');\">" + bondissue + "</a></td>";
    orderdetailrow = orderdetailrow + '<td>' + writeBondExecType(bondexectype) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondcoupon + '</td>';
    orderdetailrow = orderdetailrow + '</tr></table>';
    orderdetailrow = orderdetailrow + '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom" align="center">';
    orderdetailrow = orderdetailrow + '<th>Maturity<br/>Date</th>';
    orderdetailrow = orderdetailrow + '<th>Trade<br/>Date</th>';
    orderdetailrow = orderdetailrow + '<th>Settlement Date</th>';
    orderdetailrow = orderdetailrow + '<th>Solicited</th>';
    orderdetailrow = orderdetailrow + '<th>Factor</th>';
    orderdetailrow = orderdetailrow + '<th>Trade Type</th>';
    orderdetailrow = orderdetailrow + '<th>Reference</th>';
    orderdetailrow = orderdetailrow + '</tr>';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#ffffff" valign="top" align="center">';
    orderdetailrow = orderdetailrow + '<td>' + bondmaturity + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondtradedate + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondsettlement + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + writeBondSolicited(bondsolicited) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondfactor + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + writeBondTradeType(bondtradetype) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondreference + '</td>';
    orderdetailrow = orderdetailrow + '</tr></table>';
    return orderdetailrow;
}

function writeBondYieldDetails(orderresultnode, headernode, legdetails, bondheadernode){
var bondprice,
    bonddetails,
    bondytc,
    bondytcflag,
    bondytp,
    bondytpflag,
    bondytm,
    bondytmflag,
    bondytw,
    bondytwflag,
    bondytwdatenode,
    bondytwdate,
    bondaccinterest,
    bonddaysaccrued,
    bondtradetype,
    bondcommission,
    bondprincipal,
    bondnetmoney,
    bondmessage,
    bondaction,
    orderdetailrow;

    if(orderresultnode.getElementsByTagName("LimitPrice")[0]){
        bondprice = orderresultnode.getElementsByTagName("LimitPrice")[0].textContent || orderresultnode.getElementsByTagName("LimitPrice")[0].text;
    } else { bondprice = ''; }

    bonddetails = legdetails.getElementsByTagName("BondDetail")[0];

    bondytmflag = +bonddetails.getElementsByTagName("YieldToMaturityFlag")[0].firstChild.nodeValue;
    if (bondytmflag === 0) { bondytm = "-"; }
    else { bondytm = bonddetails.getElementsByTagName("YieldToMaturity")[0].firstChild.nodeValue; }

    bondytcflag = +bonddetails.getElementsByTagName("YieldToCallFlag")[0].firstChild.nodeValue;
    if(bondytcflag === 0) { bondytc = "-"; }
    else { bondytc = bonddetails.getElementsByTagName("Yield")[0].firstChild.nodeValue; }

    bondytpflag = +bonddetails.getElementsByTagName("YieldToPutFlag")[0].firstChild.nodeValue;
    if(bondytpflag === 0) { bondytp = "-"; }
    else { bondytp = bonddetails.getElementsByTagName("YieldToPut")[0].firstChild.nodeValue; }

    bondytwflag = +bonddetails.getElementsByTagName("YieldToWorstFlag")[0].firstChild.nodeValue;
    if(bondytwflag === 0) { bondytw = "-"; }
    else { bondytw = bonddetails.getElementsByTagName("YieldToWorst")[0].firstChild.nodeValue; }

    if(bondytw !== "-")
    {
        if(legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("YieldToWorstDate")[0].hasChildNodes()) {
            bondytwdatenode = legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("YieldToWorstDate")[0];
            bondytwdate = bondytwdatenode.getElementsByTagName("Month")[0].firstChild.nodeValue + '/' + bondytwdatenode.getElementsByTagName("Day")[0].firstChild.nodeValue + '/' + bondytwdatenode.getElementsByTagName("Year")[0].firstChild.nodeValue;
        }
        else {
            bondytwdatenode = ' ';
            bondytwdate = ' ';
        }
    }
    else
    {
        bondytwdate = '';
    }

    bondprincipal = bonddetails.getElementsByTagName("PrincipalAmt")[0].firstChild.nodeValue;

    bondaccinterest = bonddetails.getElementsByTagName("AccruedInterest")[0].firstChild.nodeValue;

    bonddaysaccrued = bonddetails.getElementsByTagName("DaysAccrued")[0].firstChild.nodeValue;

    bondtradetype = +legdetails.getElementsByTagName("BondDetail")[0].getElementsByTagName("TradeType")[0].firstChild.nodeValue;

    if(bondtradetype === 2) { bondcommission = "-"; }
    else { bondcommission = legdetails.getElementsByTagName("Charges")[0].getElementsByTagName("CommissionAmount")[0].firstChild.nodeValue; }

    bondnetmoney = bondheadernode.getElementsByTagName("NetMoney")[0].firstChild.nodeValue;

    orderdetailrow = '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom" align="center">';
    orderdetailrow = orderdetailrow + '<th></th>';
    orderdetailrow = orderdetailrow + '<th>Price</th>';
    orderdetailrow = orderdetailrow + '<th>Yield to<br/>Maturity</th>';
    orderdetailrow = orderdetailrow + '<th>Yield to<br/>Call</th>';
    orderdetailrow = orderdetailrow + '<th>Yield to<br/>Par Call</th>';
    orderdetailrow = orderdetailrow + '<th>Yield to<br/>Worst</th>';
    orderdetailrow = orderdetailrow + '<th>Principal</th>';
    orderdetailrow = orderdetailrow + '<th>Accrued<br/>Interest</th>';
    orderdetailrow = orderdetailrow + '<th>Commission/<br/>Fee</th>';
    orderdetailrow = orderdetailrow + '<th>Net Money</th>';
    orderdetailrow = orderdetailrow + '</tr>';
    orderdetailrow = orderdetailrow + '<tr bgcolor="#ffffff" valign="top" align="center">';
    orderdetailrow = orderdetailrow + '<td align="center"><strong>Order</strong></td>';
    orderdetailrow = orderdetailrow + '<td>' + formatCurrency(bondprice) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondytm + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondytc + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondytp + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondytw + '<br/>' + bondytwdate + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + formatCurrency(bondprincipal) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + bondaccinterest + '<br/>(' + bonddaysaccrued + ' days)</td>';
    orderdetailrow = orderdetailrow + '<td>' + formatCurrency(bondcommission) + '</td>';
    orderdetailrow = orderdetailrow + '<td>' + formatCurrency(bondnetmoney) + '</td>';
    orderdetailrow = orderdetailrow + '</tr></table>';
    return orderdetailrow;
}


function writeBondStatusDetail(ordernode,bondstatusnode,bondheadernode){
     var statuscount,
     orderdetailrow,
     bondtransaction,
     bondmessage,
     bondaction,
     bondstatusdate,
     bondreference,
     i;

    statuscount = ordernode.getElementsByTagName("BondStatusCount")[0].firstChild.nodeValue;
    if(statuscount > 0) {
        orderdetailrow = '<table cellpadding="2" cellspacing="1" border="0" width="100%" bgcolor="#999999">';
        orderdetailrow = orderdetailrow + '<tr bgcolor="#eeeeee" valign="bottom">';
        orderdetailrow = orderdetailrow + '<th width="20%">Transaction Status</th>';
        orderdetailrow = orderdetailrow + '<th width="30%">Date &amp; Time</th>';
        orderdetailrow = orderdetailrow + '<th width="50%">Message</th>';
        orderdetailrow = orderdetailrow + '<th width="50%">Action</th>';
        orderdetailrow = orderdetailrow + '</tr>';
        for (i = 0; i < statuscount; i++) {
            bondtransaction = bondstatusnode[i].getElementsByTagName("TransactionStatus")[0].firstChild.nodeValue;
            bondstatusdate = bondstatusnode[i].getElementsByTagName("StatusUpdateUtc")[0].firstChild.nodeValue;
            bondmessage = bondstatusnode[i].getElementsByTagName("StatusDesc")[0].firstChild.nodeValue;
   bondreference = bondstatusnode[i].getElementsByTagName("BondOrderId")[0].firstChild.nodeValue;
            // need data point
            if(bondmessage.indexOf('Accept')>-1){
                bondaction = 'Accept';
            } else { bondaction = 'View'; }


            switch(bondtransaction){
                case '1': bondtransaction = 'Acknowledged'; break;
                case '2': bondtransaction = 'Pending Cancel';   break;
                case '3': bondtransaction = 'Cancelled'; break;
                case '4': bondtransaction = 'Status Update'; break;
    case '5': bondtransaction = 'Cancel Trade'; break;
    case '6': bondtransaction = 'Executed'; break;
    case '7': bondtransaction = 'Rejected'; break;
            }

            orderdetailrow = orderdetailrow + '<tr>';
            orderdetailrow = orderdetailrow + '<td>' + bondtransaction + '</td>';
            orderdetailrow = orderdetailrow + '<td>' + getDateString(bondstatusdate,'full') + '</td>';
            orderdetailrow = orderdetailrow + '<td>' + bondmessage + '</td>';
            orderdetailrow = orderdetailrow + "<td><a href=\"javascript:gotoBondLink('blotter','"+bondreference+"','"+p_magic+"','"+p_bridge+"');\">" + bondaction + "</a></td>";
            orderdetailrow = orderdetailrow + '</tr>';
        }
        orderdetailrow = orderdetailrow + '</table>';
        return orderdetailrow;
    } else {
        orderdetailrow = '';
        return orderdetailrow;
    }

}

function convertMonth(monthText){
   var monthNum;

    switch(monthText){ case 'Jan': monthNum = 1; break; case 'Feb': monthNum = 2; break; case 'Mar': monthNum = 3; break; case 'Apr': monthNum = 4; break; case 'May': monthNum = 5; break; case 'Jun': monthNum = 6; break; case 'Jul': monthNum = 7; break; case 'Aug': monthNum = 8; break;  case 'Sep': monthNum = 9; break; case 'Oct': monthNum = 10; break; case 'Nov': monthNum = 11; break; case 'Dec': monthNum = 12; break; }

 return monthNum;
}

function getDateString(mEpoch, datetype){
    var bonddatestring,
     dDate,
     umonth,
     uday,
     uyear,
     utime,
     uhour,
     umin,
     usec,
     est,
     edt,
     ampm;

    mEpoch = parseInt(mEpoch, 10);
    if (mEpoch < 10000000000)
   { mEpoch *= 1000; }
    dDate = new Date();
    dDate.setTime(mEpoch);
 est = 5;
 edt = 4;
 umonth = (dDate.getMonth() + 1) + "/";
 uday = dDate.getDate() + "/";
 uyear = dDate.getUTCFullYear() + " ";
 uhour = dDate.getUTCHours();
 uhour = +uhour - edt;
 ampm = (uhour >= 12) ? "PM" : "AM";
 uhour = (uhour === 0) ? 24 : uhour;
 uhour = (uhour > 12) ? (uhour - 12) : uhour;
 uhour = uhour + ":";
 umin = dDate.getUTCMinutes() + ":";
 umin = (umin.length < 3) ? "0" + umin : umin;
 usec = dDate.getUTCSeconds() + " ";
 usec = (usec.length < 3) ? "0" + usec : usec;
 utime = uhour + umin + usec + ampm + " EDT";
 bonddatestring = umonth + uday + uyear + utime;

    return bonddatestring;
}

function formatCurrency(num) {
    if(num == "-") { return num; }
        num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
            num.substring(num.length-(4*i+3));
            return (((sign)?'':'-') + num + '.' + cents);
}

function writeBondOrderType(bondordertype){
    switch(bondordertype){
        case '2': bondordertype = 'Buy'; break;
        case '3': bondordertype = 'Sell'; break;
    }
    return bondordertype;
}

function writeBondExecType(bondexectype){
    switch(bondexectype){
        case '1': bondexectype = 'Market'; break;
        case '2': bondexectype = 'Limit'; break;
        case '16': bondexectype = 'Firm'; break;
        case '17': bondexectype = 'Subject'; break;
    }
    return bondexectype;
}

function writeBondSolicited(bondsolicited){
    switch(bondsolicited){
        case '0': bondsolicited = 'No'; break;
        case '1': bondsolicited = 'Yes'; break;
    }
    return bondsolicited;
}

function writeBondTradeType(bondtradetype){
    switch(bondtradetype){
        case '1': bondtradetype = 'Agency'; break;
        case '2': bondtradetype = 'Principal'; break;
    }
    return bondtradetype;
}

function gotoBondLink(linkType, bNumber, bMagic, bUrl){
    var bdomain, bLink, p_auto_bridge_url;
 p_auto_bridge_url = bUrl ? "&p_auto_bridge_url=" : "";
 bUrl = (typeof bUrl == "string") ? bUrl : "";
 bNumber = bNumber || "";

    winloc = window.location.href;
    if(winloc.indexOf('sit')>-1 || winloc.indexOf('lxd')>-1){
        bdomain = 'https:/\/www.tst1.bonddesk.com/etrade/owa/';
    } else if (winloc.indexOf('uat')>-1) {
        bdomain = 'https:/\/www.qa.bonddesk.com/etrade/owa/';
    } else if (winloc.indexOf('us.etrade.com')>-1) {
        bdomain = 'https:/\/www.bonddesk.com/etrade/owa/';
    }
    if (linkType=='orderdetail'){
        bLink = bdomain + 'pkg_etrade.order_detail?p_order_no=' + bNumber + '&p_magic=' + bMagic + p_auto_bridge_url + bUrl;
    } else if (linkType=='issue'){
        bLink = bdomain + 'pkg_etrade.issue?p_cusip=' + bNumber +'&p_magic=' + bMagic + p_auto_bridge_url + bUrl;
    } else if (linkType=='sell'){
        bLink = bdomain + 'pkg_etrade.sell_quote?p_quote_id=' + bNumber +'&p_magic=' + bMagic + p_auto_bridge_url + bUrl;
    } else if (linkType=='buy'){
        bLink = bdomain + 'pkg_etrade.buy_quote?p_quote_id=' + bNumber +'&p_magic=' + bMagic + p_auto_bridge_url + bUrl;
 } else if (linkType=='bondsearch'){
        bLink = bdomain + 'pkg_etrade.bond_advanced_search?p_magic=' + bMagic + p_auto_bridge_url + bUrl;
 } else if (linkType=='blotter'){
        bLink = bdomain + 'pkg_etrade.blotter?p_magic=' + bMagic + p_auto_bridge_url + bUrl;
 }

    window.location = bLink;
}
