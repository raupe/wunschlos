$(document).ready(function(){    

	var contentHeight;
	var contentWidth;
	var snowflakeMargin = 150;
	var SnowflakesCounter = 0;
	var slowSpeed = 4;
	var maxPeak = 10;
	var fastSpeed = 10;
	var minimunFlake = 3;
	var smallFlake = 5;
	var bigFlake = 8;
	var snowStorage = {};
	var designDiv = $("#design");
	

	
	var snowflake = function Snowflake(x, y, id, speed, peak, flakeSize) {
	
		this.id = id;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.peak = peak;
		this.flakeSize = flakeSize;
	}
	
	function init(){
	
		contentHeight =  designDiv.height();
		contentWidth = designDiv.width();
		generateInitSnow();
	}
 
	
	//if height of wishlist grows, more snowflakes
	/*designDiv.click(function(){
		designDiv.css("height", 300);
			designDiv.trigger('change');
	});*/
 
	designDiv.bind('change', function() {

		contentHeight =  designDiv.height();
		contentWidth = designDiv.width();
		
		var yRaster =Math.floor(contentHeight/snowflakeMargin);
		var xRaster =Math.floor(contentWidth/snowflakeMargin);
		var snowflakesAmount = yRaster * xRaster;
		
		// reduce or extend amount of snowflakes according to parent div
		if(snowflakesAmount < SnowflakesCounter){
		
			var reduceIndex = SnowflakesCounter - snowflakesAmount;
			var counter = 0;
			
			for (key in snowStorage) {
				delete snowStorage[key];
				$("#"+snowStorage[key].id).remove();
				counter++;
				SnowflakesCounter--;
				if(counter === SnowflakesCounter) return;
			}			
		}
		
		if(snowflakesAmount > SnowflakesCounter){
		
			for(var i =0; i < xRaster; i++){
		
				createSnowflake(i);
			}			
		}
		
	});
	
	$( window ).resize(function() {
	
		if(this.resizeTO){
						
			clearTimeout(this.resizeTO);
		}
		
		this.resizeTO = setTimeout(function() {
		
			$(this).trigger('resizeEnd');
		}, 300);
						
		contentHeight =  designDiv.height();
		contentWidth = designDiv.width();
	});

	$(window).bind('resizeEnd', function() {

					for(var key in snowStorage) {

			$("#"+snowStorage[key].id).remove();
		}
		generateInitSnow();
	});
	
	function generateInitSnow() {
		
		var yRaster = Math.floor(contentHeight/snowflakeMargin);
		var xRaster = Math.floor(contentWidth/snowflakeMargin);
		var h;
		var i;
	
		// snow according to parent div dimension
		for(h = 0; h < yRaster; h++){
		
			for(i =0; i < xRaster; i++){
		
				createSnowflake(i);
			}
		}	
	}

	function createSnowflake(count){
	
		// randomize the top position of the snow
		var snowTop = Math.floor(Math.random()* contentHeight );		
		
		// randomize the left position of the snow
		var snowLeft = Math.floor(Math.random()* contentWidth  );	
		
		var newId = "flake_"+SnowflakesCounter;
		
		var speed, peak, flakeSize;
		
		if( count % 2 == 0){

			speed = slowSpeed;
			peak = Math.floor((Math.random()*maxPeak)+1); 
			flakeSize = Math.floor(Math.random()*(bigFlake-smallFlake+1)+smallFlake);

		}else{
			speed = fastSpeed;
			peak = Math.floor((Math.random()*maxPeak)+1); 
			flakeSize = Math.floor(Math.random()*(smallFlake-minimunFlake+1)+minimunFlake);
		}
		
		snowStorage[SnowflakesCounter] = new snowflake(snowLeft, snowTop, newId, speed, peak, flakeSize);

		designDiv.prepend(			
				$('<div />')
					.addClass('snow')
					.css('width', flakeSize)
					.css('height', flakeSize)
					.css('top', snowTop)
					.css('left', snowLeft)
					.css('position','absolute')
					.attr("id",newId)
		);
		
		SnowflakesCounter++;		
	}
	
    function snowFalling(){
	
		var x_current;
		var y_current;
		var id_flake;
		var counter;
		var speed;
		var peak;
		var flakeSize;
		var x; 
		var y; 
		var flake_current;
		
		for(var key in snowStorage) {

			x_current = snowStorage[key].x;
			y_current = snowStorage[key].y;
			id_flake = snowStorage[key].id;
			speed = snowStorage[key].speed;
			peak = snowStorage[key].peak;
			flakeSize = snowStorage[key].flakeSize;
			flake_current = $("#"+id_flake);
			
			x = Math.sin((y_current+1)/peak)*peak + x_current;
			y = y_current + speed;

			// check if the snow has reached the bottom of the parent
			if( y > contentHeight - flakeSize ) {
				x = Math.floor(Math.random()* contentWidth );
				y = 0;
				snowStorage[key].x = x;
				snowStorage[key].y = y;				
				flake_current.css({'top': y,'left': x}).fadeIn();		
				
			}else{
			
				snowStorage[key].x = x;
				snowStorage[key].y = y;
				flake_current.css({top: y+ "px", left: x + "px"});
			}
			
			if((x > contentWidth - flakeSize) | (x < 0) ){
				flake_current.hide()
			}else{
				flake_current.show();
			}				

	}
		window.setTimeout(snowFalling, 160); 		
		
    }        

    init();
	snowFalling(); 
});