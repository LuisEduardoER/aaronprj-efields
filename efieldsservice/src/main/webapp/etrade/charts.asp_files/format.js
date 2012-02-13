
function Format(value,style) {
	return format_data.FormatVal(value,style);
}

// js number formatting for etrade
format_data = function() {

	this.error = [];
	this.error["-32768"] = "--";
	this.error["NA"] = "--";
	this.error["--"] = "--";
	this.error["NaN"] = "--";

	this.magnitudes = {
		shortcap : ["", "K", "M", "B", "T"],
		longspace : ["", " thousand", " million", " billion", " trillion"],
		longcap : ["", "Thousand", "Million", "Billion", "Trillion"],
		longcapspace : ["", " Thousand", " Million", " Billion", " Trillion"]
	};
}

format_data.prototype.FormatVal = function(value,style) 
{
	var valueOrig = value;
	if (this.error[value]) {
		return this.error[value]; // return error
	}
	try {
		return this[style](value, valueOrig);
	} catch (e) {
		return '--';
	}
}

// :: Basic Number Formatting ::
format_data.prototype.Price = function(value,valueOrig) 
{
	value = value.toFixed(this.SigDigitsAll(valueOrig));
	value = this.comma(value);
	return value;
}
format_data.prototype.FullVolume = function(value,valueOrig) 
{
	value = value.toFixed(0);
	value = this.comma(value);
	return value;
}
format_data.prototype.ShortMagnitude = function(value,valueOrig) 
{
	value = this.getMagnitude(1,valueOrig,"shortcap");
	return value;
}

format_data.prototype.PriceColor = function(value,valueOrig) 
{
	value = value.toFixed(this.SigDigits(valueOrig));
	value = this.comma(value);
	value = this.showSign(value,valueOrig);
	value = this.color(value,valueOrig);
	return value;
}
format_data.prototype.PercentParensColor = function(value,valueOrig) {
	value = value.toFixed(this.SigDigits(valueOrig));
	value = this.comma(value);
	value = value+"%";
	value = this.showSign(value,valueOrig);
	value = this.colorParens(value,valueOrig);
	return value;
}
format_data.prototype.bid_ask = function(value,valueOrig) 
{
	value = value * 100;
	value = value.toFixed(0);
	value = 'x'+this.comma(value);
	return value;
}
format_data.prototype.SliderValue = function(value,valueOrig) 
{
	value = value.toFixed(this.SigDigits(valueOrig));
	value = this.comma(value);
	return value;
}
// :: Basic DateTime Formatting ::
format_data.prototype.timestamp = function(value,valueOrig) 
{
	var t =  new Date(value);
	var day = t.getDate();
	var mon = t.getMonth();
	var year = t.getFullYear();
	var h = t.getHours();
	var minute = t.getMinutes() + '';
	var utc = t.getTimezoneOffset() / 60;
	var utcHour = h + utc;
	if (utcHour > 11) {
		if (utcHour == 12) {
			utcHour = 12;
		} else {
			utcHour = (utcHour - 12);
		}
		var ampm = 'PM';
	} else { var ampm = 'AM'; }
	if (minute.length == 1) {minute = '0'+minute;}
	
	return utcHour+':'+minute+ ' '+ampm+' ET '+(mon+1)+'/'+day+'/'+year;
}

// :: Helper Functions ::
format_data.prototype.color = function(value,valueOrig) 
{
	if (valueOrig > 0) {
		value = '<span class="pos">'+value+'</span>';
	} else if (valueOrig < 0) {
		value = '<span class="neg">'+value+'</span>';
	} else {
		value = '<span class="unch">'+value+'</span>';
	}
	return value;
}
format_data.prototype.colorParens = function(value,valueOrig) 
{
	if (valueOrig > 0) {
		value = '<span class="pos">('+value+')</span>';
	} else if (valueOrig < 0) {
		value = '<span class="neg">('+value+')</span>';
	} else {
		value = '<span class="unch">('+value+')</span>';
	}
	return value;
}
format_data.prototype.showSign = function(value,valueOrig) 
{
	if (valueOrig > 0.0001) {
		value = '+'+value;
	}
	return value;
}
format_data.prototype.SigDigits = function(valueOrig) 
{
	valueOrig = Math.abs(valueOrig);
	if (valueOrig > 999) {
		return 0;
	} else if (valueOrig < .01 && valueOrig > 0) {
		return 4;
	} else {
		return 2;
	}
}
format_data.prototype.SigDigitsAll = function(valueOrig) 
{
	valueOrig = String(valueOrig.toFixed(4)) + '';
	x = valueOrig.split('.');
	x1 = x[1];
	var len = Number(x1.length);

	var testString = String(x[1]);
	if (testString.charAt(len - 1) == '0') {
		len--;
		if (testString.charAt(len - 1) == '0') {
			len--;
		}
	}
	
	if (len > 3) {
		return 4;
	} else if (len > 2) {
		return 3;
	} else {
		return 2;
	}
}
format_data.prototype.getMagnitude = function(numDigits,valueOrig,type) {
	valueOrig = Math.abs(valueOrig);
	var c = 0;
	while (valueOrig >= 1000 && c < 4) {
		valueOrig /= 1000;
		c++;
	}
	value = valueOrig.toFixed(numDigits);
	return value + this.magnitudes[type][c];
}
format_data.prototype.comma = function(value) {
	value = String(value);
	if (value.length < 6 && value.indexOf(".") > -1) {
		return value;
	} else {
		x = value.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
}