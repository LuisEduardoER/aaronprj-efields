// Declaring valid date character, minimum year and maximum year
var dtCh= "/";
var minYear=2003;
var maxYear=2100;

function getTodaysDate() {
    var d = new Date();
    var today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    return today;
}
 
function isInteger(s){
    var i;
    for (i = 0; i < s.length; i++){   
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function stripCharsInBag(s, bag){
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++){   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

var daysInMonth = DaysArray(12);
var monthDays = DaysArray(12);
var cDate=new Date();
var cYear=cDate.getFullYear();
monthDays[2] =daysInFebruary(cYear);

function invalidMonthDay(max, increment, month, day){
    for (var ii=0; ii<max; ++ii) {
	if (day > monthDays[month])
	    return "Transfers starting " + month + '/' + day + " will not occur on the same date for each occurance. Please specify a date between 1 and " + monthDays[month] + " in order for your transfer to be sent consistently on the same date.";
	month = (month+increment)%12;
    }
    return "";
}

function isValidFrequency(frequency, month, day)
{
    if (frequency == "6") // bi-monthly
	return invalidMonthDay(6,2,month,day);
    else if (frequency == "8") // quarterly
	return invalidMonthDay(4,3,month,day);
    else if (frequency == "9") // semiannual
	return invalidMonthDay(2,6,month,day);
    else
	return "";
}

function daysInFebruary (year){
    // February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
function DaysArray(n) {
    for (var i = 1; i <= n; i++) {
 	this[i] = 31;
	if (i==4 || i==6 || i==9 || i==11) {this[i] = 30;}
 	if (i==2) {this[i] = 29;}
    } 
    return this;
}

function isValidDate(dtStr, obj, pflag){
   
    var ns6 = ((document.getElementById)&&(!document.all))?true:false;
    
    if (dtStr != null && dtStr.indexOf(":") != -1)
	return true;

    var pos1=dtStr.indexOf(dtCh);
    var pos2=dtStr.indexOf(dtCh,pos1+1);
    var strMonth=dtStr.substring(0,pos1);
    var strDay=dtStr.substring(pos1+1,pos2);
    var strYear=dtStr.substring(pos2+1);
    strYr=strYear;
    if(obj.transfer_freq){
	var frequency = obj.transfer_freq.options[obj.transfer_freq.selectedIndex].value;
	}
	
    if (strDay.charAt(0)=="0" && strDay.length>2) {
        selectAlertType('Please enter a valid day for the month between 1 to 31.');
	return false;
    } 
	
   if (strDay.charAt(0)!="0" && strDay.length<2) {
         selectAlertType('Please enter the date in the following format: MM/DD/YY.');
       return false;
  }


    if (strMonth.charAt(0)=="0" && strMonth.length>2) {
	selectAlertType('Please enter a month less than or equal to 12.');
	return false;
    } 

   if (strMonth.charAt(0)!="0" && strMonth.length<2) {
       selectAlertType('Please enter the date in the following format: MM/DD/YY.');
      return false;
  }

	
    if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1);
    if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1);
    for (var i = 1; i <= 3; i++) {
	if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
    }
    month=parseInt(strMonth);
    day=parseInt(strDay);
    var currDate = new Date();
    var currYear = currDate.getFullYear().toString().substring(0,2);
    if (strYear.length==2) year= currYear + strYear; else year= parseInt(strYr); 
    var inputDate = new Date(year, month-1, day);
    var today = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());
    if ( dtStr == ""){
	selectAlertType('Please specify the date.');
	return false;
    }
    if (pos1==-1 || pos2==-1){
	selectAlertType('Please enter the date in the following format: MM/DD/YY');
	return false;
    }
    if (strMonth.length<1 || month<1 || month>12){
	selectAlertType('Please enter a month less than or equal to 12');
	return false;
    }
    if (strDay.length<1 || day<1 || day>31){
 	selectAlertType('Please enter a valid day for the month between 1 to 31.');
	return false;
    }
    if(!ns6 && (day > daysInMonth[month])||(month==2 && day>daysInFebruary(year))) 
    { 
	selectAlertType('Invalid day for the month. Please enter a valid day.');
	return false;
    }
    if(ns6 && (day > 31 )) 
    { 
	selectAlertType('Please enter a day less than or equal to 31');
	return false;
    }
    if (day > 28  && frequency == "5") {
        selectAlertType('Scheduling a monthly recurring transfer is not allowed on the 29th, 30th or 31st.');
        return false;
    }
    if (day > 28 && (frequency == "6" || frequency == "8" || frequency == "9")) {
        var msg = isValidFrequency(frequency,month,day);
        if (msg != "") {
            selectAlertType(msg);
            return false;
        }
    }
    if (strYear.length < 2 || strYear.length == 3 || strYear.length > 4 || year==0){
	selectAlertType('Please enter a valid year.');
	return false;
    }
    if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
	selectAlertType('Please enter a valid date.');
	return false;
    }
	
return true;
}

function selectAlertType(str){
if(errBoxFlag)ErrorBox(str);
else alert(str);
}
