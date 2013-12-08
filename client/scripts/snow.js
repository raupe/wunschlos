/**
 *  snow
 *  ====
 *
 * Responsive snow animation and creation of a background-image.
 * 
 *	snow.init(); // to init snow animation and create background-image
 *                // currently inited in the last code line
 *  snow.stop();  // to stop animation and remove background-image
 */

$(document).ready(function(){ 
	
	var $bg_image = null; // background image
	var bg_source = "url(assets/img/xmas.png)"; // source for background image
	

	snow = {

		framerate: 20,
		flakeMinSize: 3,
		flakeMaxSize: 8,
		flakesMargin: 75,
		sinFrequency: 1,
		maxSinusPeak: 0.3,
		minSpeed: 1,
		maxSpeed: 2,
		canvas: null,
		flakes: [],

		init: function() {
			createBackgroundImage();
			snow.canvas = document.createElement('canvas');
			snow.canvas.width = $(window).width();
			snow.canvas.height = $(window).height();
			snow.canvas.id = 'snowCanvas';
			document.body.appendChild(snow.canvas);
			snow.createFlakeShape();
			snow.ctx = snow.canvas.getContext('2d'),
			snow.canvas.style.position = 'fixed';
			snow.canvas.style.bottom = 0;
			snow.canvas.style.left = 0;
			snow.canvas.style.zIndex = -1;			
			window.snowtimer = window.setInterval(snow.draw, 1000/snow.framerate);
			window.addEventListener('resize',snow.resize);
			snow.flakeAmount();
			snow.start();
		},		
		start: function() {
			var c = snow.count;
			snow.flakes = [];
			do {
				snow.flakes.push(new snow.flake());
			} while(--c);
		},
		stop: function() {
			window.clearInterval(window.snowtimer);
			var canvas = document.getElementById('snowCanvas');
			canvas.parentNode.removeChild(canvas);
			window.snowtimer = snow = null;
			$bg_image.remove();
		},		
		draw: function() {
			var ctx = snow.ctx, snowFlakes = snow.flakes, snowCount = snow.count;
			ctx.clearRect(0,0,snow.canvas.width,snow.canvas.height);

			do {
				if(snowFlakes[--snowCount].draw(ctx)) { };
			} while(snowCount);
		},
		flake: function() {
			this.draw = function(ctx) {
			
				ctx.drawImage(snow.flakeShape,this.x,this.y,this.size,this.size);		
				ctx.fill();
				this.animate();
			};
			this.animate = function() {
				this.y += this.speed;
				this.x += this.sinFrequency * Math.sin(snow.maxSinusPeak * snow.maxSinusPeak * this.y);
				if(this.y > innerHeight)
					this.init("resetY");
			};
			this.init = function(resetY) {
				this.speed = snow.minSpeed + (Math.random() * (snow.maxSpeed - snow.minSpeed));
				this.size = Math.floor(Math.random()*(snow.flakeMaxSize-snow.flakeMinSize+1)+snow.flakeMinSize);
				this.sinFrequency = Math.floor((Math.random()*snow.sinFrequency)+1);
				this.x = (Math.random() * snow.canvas.width ) - this.size;
				this.y = resetY ? -this.size : Math.random() * snow.canvas.height;
			};
			this.init();
		},
		createFlakeShape: function() {
			snow.flakeShape = document.createElement('canvas');
			snow.flakeShape.width = snow.flakeShape.height = snow.flakeMaxSize;
			var ctx = snow.flakeShape.getContext('2d');
			ctx.fillStyle = 'rgba(255,255,255,0.7)';
			ctx.arc(snow.flakeMaxSize/2,snow.flakeMaxSize/2,snow.flakeMaxSize/2,0,2*Math.PI);
			ctx.fill();	
		},
		flakeAmount: function() {
			var yRaster, xRaster, h, i;
			yRaster = Math.floor(snow.canvas.height/snow.flakesMargin);
			xRaster = Math.floor(snow.canvas.width/snow.flakesMargin);	
			snow.count = 0;
				// snow according to parent div dimension
			for(h = 0; h < yRaster; h++){
			
				for(i =0; i < xRaster; i++){
			
					snow.count++
				}
			}				
		},
		resize: function() {
			snow.canvas.width = $(window).width();
			snow.canvas.height = $(window).height();
			snow.flakeAmount();
			snow.start();
			positionBackgroundImage();
		}		
	};

	
			// creates background image 
	var createBackgroundImage = function(){		

		$('body').prepend(		

			$('<div>') 
				.css('background-image', bg_source)
				.css('background-position', "center bottom")
				.css('background-repeat', "no-repeat")
				.attr("id","bg_image")
				.css('position', 'absolute')
				.css('bottom', 0)
				.css('z-index', "-1")
				.css('width', '100%')
				.css('height', '100%')
			
			);
		$bg_image =	$("#bg_image");
		positionBackgroundImage();
	}

		// change background position according to scroll	
	$(document).scroll(function () {

		positionBackgroundImage();
	});

		// ensure that snowman stands on the ground
	function positionBackgroundImage(){
	
			var footerPos = $("#footer_pos").offset().top ;
			var scrollAmount = $(window).scrollTop() + $(window).height();

			if(scrollAmount > footerPos){
			
				var footerPosCurrent = ($(window).height() - (footerPos - $(window).scrollTop()));
				$bg_image.css("bottom", footerPosCurrent-($(window).scrollTop()));				
			
			}else{
				$bg_image.css("bottom", -($(window).scrollTop()));
			}		
	}

	snow.init();
});