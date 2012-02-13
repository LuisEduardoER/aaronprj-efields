//disable text selection
$.extend($.fn.disableTextSelect = function() {
	return this.each(function(){
		if($.browser.mozilla){//Firefox
			$(this).css('MozUserSelect','none');
		}else if($.browser.msie){//IE
			$(this).bind('selectstart',function(){return false;});
		}else{//Opera, etc.
			$(this).mousedown(function(){return false;});
		}
	});
});

//  ---------------------------------------------------------
//  module_navigation - class for module navigation
//  ---------------------------------------------------------
module_navigation = function(obj) {		

	this.containerId = obj.container;
	this.list = $('#' + obj.container).find("td");
//	log(this.list);
	this.source = false;
	this.init();
}

//  ---------------------------------------------------------
//  init - init for the module navigation class
//  ---------------------------------------------------------
module_navigation.prototype.init = function() {

	this.setModuleNavSize();
	this.controls = $(this.list[(this.list.length - 1)]).find("span");
	this.initControls();
	this.attachEvents();
}

//  ---------------------------------------------------------
//  attachEvents - attach  all module navigation events
//  ---------------------------------------------------------
module_navigation.prototype.attachEvents = function() {
	
	this.leftControl = this.controls[0];
	this.rightControl = this.controls[1];			
	
	var self = this;
	
	this.leftControlEvent = this.leftControlEvent || $(this.leftControl).click(function() {
		self.controlClick(-1);
	}).disableTextSelect();

	this.rightControlEvent = this.rightControlEvent || $(this.rightControl).click(function() {
		self.controlClick(1);
	}).disableTextSelect();
}

//  ---------------------------------------------------------
//  controlClick - action when right or left arrow clicked 
//  ---------------------------------------------------------
module_navigation.prototype.controlClick = function(shiftAmount) {
	//log(shiftAmount)
	
	var active = this.getActiveIndex(this.list);
	active += shiftAmount;
	$(this.list[active]).trigger("click");
}


//  ---------------------------------------------------------
//  getActiveIndex - Finds which navigation cell is active
//  ---------------------------------------------------------
module_navigation.prototype.getActiveIndex = function(list) {

	//init the active index
	var active = 0;

	$(list).each(function(index) {

		if ($(this).hasClass("active")) {										
			active = index;
				
		}

	});

	return active;
}

//  ---------------------------------------------------------
//  setActiveIndex - Sets the active navigation box.
//  ---------------------------------------------------------
module_navigation.prototype.setActiveIndex = function(elem) {
	var active = this.getActiveIndex(this.list);
	var parent = $(elem).parent();
	var childrenOfParent = $(parent).children();

	//console.log(childrenOfParent);
	
	var oldActive = active;
	
	$(this.list[active]).removeClass("active");

	$(childrenOfParent).each(function(num) {
		if (this == elem) {
			active = num;
		}

	});
	
	$(this.list[active]).addClass("active");
			
	if($(this.list[active]).hasClass("hidden")) {
		this.shiftModuleNav(active, oldActive);
	}
	
	//show/hide appropriate controls
	$(this.controls).show();
	this.initControls();
}

//  ---------------------------------------------------------
//  initControls - Sets the initial state of controls
//  ---------------------------------------------------------
module_navigation.prototype.initControls = function() {

	var index = this.getActiveIndex(this.list);

	var hasLabel = $(this.list[0]).hasClass("moduleNavLabel");

	if(!hasLabel) {
		if (index >= this.list.length - 3) {
			$(this.controls[1]).hide();
		} else if(index <= 0) {
			$(this.controls[0]).hide();
		}
	} else {
		if (index >= this.list.length - 3) {
			$(this.controls[1]).hide();
		} else if(index <= 1) {
			$(this.controls[0]).hide();
		}
	}
}		

//  ---------------------------------------------------------
//  setModuleNavSize - sets the size of cells
//  ---------------------------------------------------------

module_navigation.prototype.setModuleNavSize = function() {

	
	var containerWidth = $("#" + this.containerId).width();
	var labelSize = 0;
	var largestSize = 0;
	var controlsSize = 0;
	var sumSize = 0;
	var hasModuleNavLabel = false;
	var hasModuleNavControls = false;
	var hasSpacer = false;

	var totalLabelsShown = 0;
	
	//check to see if anything has a src attribute of fundamentals
	var isFundamentalPage = $("*[src*='fundamentals']").length != 0 ? true : false;
	var isCommissionFreePage = $("#providers").length != 0 ? true : false;
	var isAllStarPage = $("*[src*='allstarfunds']").length != 0 ? true : false;


	$(this.list).each(function(index) {
		
		if(!hasModuleNavLabel) {
			hasModuleNavLabel = $(this).hasClass("moduleNavLabel") ? true : false;
		}
		
		if($(this).hasClass("moduleNavLabel")) {
			labelSize = $(this).find("span").width() + 140;
		} else if($(this).hasClass("moduleNavControls")) {
			controlsSize = $(this).width() + 35;
		} else if($(this).hasClass("moduleNavControls") && $("*[src*='fundamentals']")) {
			controlsSize = $(this).width() + 60;
		} else {
			if ($(this).width() > largestSize) {
				largestSize = $(this).width();
			}
		}
		
		if ($(this).hasClass("moduleNavLabel")) {
			sumSize = sumSize + labelSize;
		} else if ($(this).hasClass("moduleNavControls")) {
			sumSize = sumSize + controlsSize;
		} else if ($(this).hasClass("spacer")) {
			sumSize = sumSize + $(this).width() + 16;
		} else {
			if(!hasModuleNavLabel) {
				sumSize = sumSize + largestSize + 32;
			} else {
				sumSize = sumSize + largestSize + 16;
			}
			$(this).width(largestSize);
		}
		
		if (sumSize + controlsSize > containerWidth && !$(this).hasClass("moduleNavControls") && !$(this).hasClass("spacer")) {
			$(this).addClass("hidden");
		} else if(!$(this).hasClass("moduleNavLabel") && !$(this).hasClass("moduleNavControls") && !$(this).hasClass("spacer")) {
			totalLabelsShown++; //for shiftModuleNav()
		}
		
		if(!$(this).hasClass("moduleNavLabel") && !$(this).hasClass("moduleNavControls") && !$(this).hasClass("spacer")) {
			if(isFundamentalPage) {
				$(this).css("width", 24);
			} 
			else if (isCommissionFreePage) {
				$(this).css("width", 175);	
			}
			else {
				$(this).css("width", 50);
				
				if (isAllStarPage) {
					$(this).css({
						'width': 115,
						'font-size': 12
						});	
				}
			}
			
		}
	
	});
	//adjusts the DomesticMid & Small menu item
	if (isAllStarPage) {
		$(this.list).next().first().next().css("width", 140);
	}
	this.totalLabelsShown = totalLabelsShown;
	
}

//  ---------------------------------------------------------
//  shiftModuleNav - shifts the navigation when there are
//  more cells than fit within the container.
//  ---------------------------------------------------------
module_navigation.prototype.shiftModuleNav = function(shiftAmount, startValue) {
	var active = this.getActiveIndex(this.list);
	startValue = startValue || 0;
	
	var $e = $(this.list[active]);
	
	//hide all besides spacer, controls and label
	$(this.list).each(function() {
		if(!$(this).hasClass("spacer") && !$(this).hasClass("moduleNavControls") && !$(this).hasClass("moduleNavLabel")) {
			$(this).addClass("hidden");
		}
	});
	//show only what needs to be shown
	if(shiftAmount < this.totalLabelsShown) {
		for(var i=shiftAmount; i<shiftAmount + this.totalLabelsShown; i++) {
			$(this.list[i]).removeClass("hidden");
		}
	} else {
		for(var i=shiftAmount; i>shiftAmount - this.totalLabelsShown; i--) {
			$(this.list[i]).removeClass("hidden");
		}
	}
}