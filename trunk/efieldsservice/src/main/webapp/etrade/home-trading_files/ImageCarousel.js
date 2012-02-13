
var ImgCarousel_move_px = 0;
var ImgCarouselouterDivWidth = 0;
function generateCarousel(img_array,image_tomove_No,outerDiv_width){
		var nodes ="";
		var i=0;
    img_array = img_array || [
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_bullish_011912.jpg',text:'',link:'/top-5/lists?tableType=TopBullish',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_divyieldstocks_011912.jpg',text:'',link:'/top-5/lists?tableType=TopDivYieldStocks',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_etfAS_011912.jpg',text:'',link:'/top-5/lists?tableType=ETFAllStars',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_etfs_012012.jpg',text:'',link:'/top-5/lists?tableType=TopETFs',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_intlAS_011912.jpg',text:'',link:'/top-5/lists?tableType=TopInternational',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_largecap_012012.jpg',text:'',link:'/top-5/lists?tableType=TopLargeCapAllStars',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_stockincdiv_011912.jpg',text:'',link:'/top-5/lists?tableType=TopIncreasingDivStocks',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_oversold_012012.jpg',text:'',link:'/top-5/lists?tableType=TopOversoldStocks',color:'#fff'},
          {img_path:'https://cdn.etrade.net/1/20120202.0/prospect/images/slides/carousel_searchedMFs_011912.jpg',text:'',link:'/top-5/lists?tableType=MostSearchedMFs',color:'#fff'}
          ];

			for( i=0; i < img_array.length; i++){
				nodes += "<li><a href=\""+img_array[i].link+"\"><div class='myImgClass' style=\"background-color:" + img_array[i].color +";background-image:"+"url(\'" +img_array[i].img_path+"')\"><p class='light'>" +img_array[i].text+"</p></div></a></li>";
			}

		document.getElementById('ImgCarouselmainDiv').innerHTML = "<ul id='carousel_ul'>"+nodes+"</li>";
		$('#ImgCarouselOuterDiv').width(outerDiv_width);
		setPxtoMove(image_tomove_No);
		ImgCarouselouterDivWidth = outerDiv_width;
	}

function setPxtoMove(image_tomove_No){

	var i=0;
	var Px_tomove=0;
   	var $this = $('.myImgClass').slice(0,image_tomove_No);
   	$this.each(function(index){
   		Px_tomove += parseInt($(this).width() + parseInt($(this).css('marginRight'), 10));
   	});

   	ImgCarousel_move_px = Px_tomove;

 }

 function get_movePx(){
	 return ImgCarousel_move_px;

 }

 function move_right(lastClick){

 	var move_px=get_movePx();

	        if(!$('#carousel_ul:animated').size()){
	            //get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '
	            var item_width = $('#carousel_ul li').outerWidth() + 14;
	            if(lastClick=='left'){
	            	item_width += 44;
	            }

	            //calculae the new left indent of the unordered list
	            var left_indent = parseInt($('#carousel_ul').css('margin-left')) - item_width;

	            $('#carousel_ul li:first').clone().insertAfter('#carousel_ul li:last');

	            //make the sliding effect using jquery's anumate function '
	            $('#carousel_ul:not(:animated)').animate({'margin-left' : left_indent},500,function(){

	                //get the first list item and put it after the last list item (that's how the infinite effects is made) '
	                //$('#carousel_ul li:last').after($('#carousel_ul li:first'));
	                $('#carousel_ul li:first').remove();
	                //and get the left indent to the default -210px
	                $('#carousel_ul').css({'margin-left' : '-'+move_px+'px'});
	                  s.linkTrackVars='prop45';
					  s.prop45=s.pageName+' Carousel_Right_Arrow';
					  s.tl(this, 'o', 'Carousel_Right_Arrow');
	            });

	        }
 }

 function move_left(lastClick){
 	var move_px=get_movePx();
            if(!$('#carousel_ul:animated').size()){
	            var item_width = $('#carousel_ul li').outerWidth() + 14;
	            if(lastClick=='right'){
	            	item_width += 44;
	            }

	            /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */
	            var left_indent = parseInt($('#carousel_ul').css('margin-left')) + item_width;

	            $('#carousel_ul li:last').clone().insertBefore($('#carousel_ul li:first')).css('margin-left','-'+move_px+'px');

	            $('#carousel_ul:not(:animated)').animate({'margin-left' : left_indent},500,function(){

		            $('#carousel_ul li:first').remove();
		            /* when sliding to left we are moving the last item before the first list item */
		            $('#carousel_ul li:first').before($('#carousel_ul li:last'));
		            /* and again, when we make that change we are setting the left indent of our unordered list to the default -210px */
		            $('#carousel_ul').css({'margin-left' : '-'+(move_px-44)+'px'});
		              s.linkTrackVars='prop45';
					  s.prop45=s.pageName+' Carousel_Left_Arrow';
					  s.tl(this, 'o', 'Carousel_Left_Arrow');
	            });
            }
 }


  	var lastClick='right';
  	var startX;
	var moveX;
  $(document).ready(function() {
      if(navigator.platform.toLowerCase() === "ipad")
      {
     	$('body').append("<script SRC='https://cdn.etrade.net/1/20120202.0/prospect/js/ipadCode.js' TYPE='text/javascript' />");
     	ipadCarouselSwipe();
  	  }
        //move he last list item before the first item. The purpose of this is if the user clicks to slide left he will be able to see the last item.
        $('#carousel_ul li:first').before($('#carousel_ul li:last'));

        //when user clicks the image for sliding right
        $('#RightArrowImg').click(function(){
        	move_right(lastClick);
        	lastClick='right';
        });

        //when user clicks the image for sliding left
        $('#LeftArrowImg').click(function(){
        	move_left(lastClick);
	        lastClick='left';
       });


  });
