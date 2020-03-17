

  
// Create the canvas
var canvas = document.createElement("canvas");
var ctx2 = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 625;
document.body.appendChild(canvas);

// Add sound
var jokerLaugh = new Audio("sounds/jokerLaugh.wav");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
  bgReady = true;
};
bgImage.src = "images/gothamCity.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
  heroReady = true;
};
heroImage.src = "images/batman.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
  monsterReady = true;
};
monsterImage.src = "images/joker.png";

// Bane image
var baneReady = false;
var baneImage = new Image();
baneImage.onload = function() {
	baneReady = true;
};
baneImage.src = "images/bane.png";


// Game objects
var hero = {
  speed: 300 // movement in pixels per second
};
var monster = {};
var bane = {};
var monstersCaught = 0;
var monstersCaughtHighScore = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener(
  "keydown",
  function(e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function(e) {
    delete keysDown[e.keyCode];
  },
  false
);

// Reset the game when the player catches a monster
var reset = function() {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + Math.random() * (canvas.width - 64);
  monster.y = 32 + Math.random() * (canvas.height - 64);
  bane.x = 24 + Math.random() * (canvas.width - 180);
  bane.y = 24 + Math.random() * (canvas.height - 180);
};

// Update game objects
var update = function(modifier) {
  if (38 in keysDown) {
    // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    // Player holding right
    hero.x += hero.speed * modifier;
  }

  // Are they touching?
  if (
    hero.x <= monster.x + 32 &&
    monster.x <= hero.x + 32 &&
    hero.y <= monster.y + 32 &&
    monster.y <= hero.y + 32
  ) {
	++monstersCaught;
    jokerLaugh.play();
    reset();
  }

  if (
    hero.x <= bane.x + 32 &&
    bane.x <= hero.x + 32 &&
    hero.y <= bane.y + 32 &&
    bane.y <= hero.y + 32
  ) {
	--monstersCaught;
    reset();
  }
};

// Draw everything
var render = function() {
  if (bgReady) {
    ctx2.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx2.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx2.drawImage(monsterImage, monster.x, monster.y);
  }

  if (baneReady) {
    ctx2.drawImage(baneImage, bane.x, bane.y);
  }

  

  monstersCaughtHighScore = monstersCaught > monstersCaughtHighScore ? monstersCaught : monstersCaughtHighScore;

  // Score
  ctx2.fillStyle = "rgb(250, 250, 250)";
  ctx2.font = "24px Helvetica";
  ctx2.textAlign = "left";
  ctx2.textBaseline = "top";
  ctx2.fillText("Jokers caught: " + monstersCaught, 32, 32);
  ctx2.fillText("High Score: " + monstersCaughtHighScore, 32,64);
  ctx2.fillText("Timer: " + count, 32,96);
};

var count = 20; // how many seconds the game lasts for - default 30
var finished = false;
var counter = function () {
  count = count - 1; // countown by 1 every second
  // when count reaches 0 clear the timer, hide monster and
  // hero and finish the game
  if (count <= 0) {
    // stop the timer
    clearInterval(counter);
    // set game to finished
    finished = true;
    count = 0;
    // hider monster and hero
	monstersCaught = 0;
	count = 20;
	
  }
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);  // see explanation below, only being used to count down the game seconds



// The main game loop
var main = function() {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  

  then = now;
  
 
  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();


/*=============================================================================*/  
/* Canvas Lightning v1
/*=============================================================================*/
var canvasLightning = function(c, cw, ch){
  
	/*=============================================================================*/  
	/* Initialize
	/*=============================================================================*/
	  this.init = function(){
		this.loop();
		main();
	  };    
	  
	/*=============================================================================*/  
	/* Variables
	/*=============================================================================*/
	  var _this = this;
	  this.c = c;
	  this.ctx = c.getContext('2d');
	  this.cw = cw;
	  this.ch = ch;
	  this.mx = 0;
	  this.my = 0;
	  
	  this.lightning = [];
	  this.lightTimeCurrent = 0;
	  this.lightTimeTotal = 50;
	  
	/*=============================================================================*/  
	/* Utility Functions
	/*=============================================================================*/        
	this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
	this.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);};
	  
	/*=============================================================================*/	
	/* Create Lightning
	/*=============================================================================*/
	  this.createL= function(x, y, canSpawn){					
		this.lightning.push({
		  x: x,
		  y: y,
		  xRange: this.rand(5, 30),
		  yRange: this.rand(5, 25),
		  path: [{
			x: x,
			y: y	
		  }],
		  pathLimit: this.rand(10, 35),
		  canSpawn: canSpawn,
		  hasFired: false
		});
	  };
	  
	/*=============================================================================*/	
	/* Update Lightning
	/*=============================================================================*/
	  this.updateL = function(){
		var i = this.lightning.length;
		while(i--){
		  var light = this.lightning[i];						
		  
		  
		  light.path.push({
			x: light.path[light.path.length-1].x + (this.rand(0, light.xRange)-(light.xRange/2)),
			y: light.path[light.path.length-1].y + (this.rand(0, light.yRange))
		  });
		  
		  if(light.path.length > light.pathLimit){
			this.lightning.splice(i, 1)
		  }
		  light.hasFired = true;
		};
	  };
	  
	/*=============================================================================*/	
	/* Render Lightning
	/*=============================================================================*/
	  this.renderL = function(){
		var i = this.lightning.length;
		while(i--){
		  var light = this.lightning[i];
		  
		  this.ctx.strokeStyle = 'hsla(0, 100%, 100%, '+this.rand(10, 100)/100+')';
		  this.ctx.lineWidth = 1;
		  if(this.rand(0, 30) == 0){
			this.ctx.lineWidth = 2;	
		  }
		  if(this.rand(0, 60) == 0){
			this.ctx.lineWidth = 3;	
		  }
		  if(this.rand(0, 90) == 0){
			this.ctx.lineWidth = 4;	
		  }
		  if(this.rand(0, 120) == 0){
			this.ctx.lineWidth = 5;	
		  }
		  if(this.rand(0, 150) == 0){
			this.ctx.lineWidth = 6;	
		  }	
		  
		  this.ctx.beginPath();
		  
		  var pathCount = light.path.length;
		  this.ctx.moveTo(light.x, light.y);
		  for(var pc = 0; pc < pathCount; pc++){	
			
			this.ctx.lineTo(light.path[pc].x, light.path[pc].y);
			
			if(light.canSpawn){
			  if(this.rand(0, 100) == 0){
				light.canSpawn = false;
				this.createL(light.path[pc].x, light.path[pc].y, false);
			  }	
			}
		  }
		  
		  if(!light.hasFired){
			this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(4, 12)/100+')';
			this.ctx.fillRect(0, 0, this.cw, this.ch);	
		  }
		  
		  if(this.rand(0, 30) == 0){
			this.ctx.fillStyle = 'rgba(255, 255, 255, '+this.rand(1, 3)/100+')';
			this.ctx.fillRect(0, 0, this.cw, this.ch);	
		  }	
		  
		  this.ctx.stroke();
		};
	  };
	  
	/*=============================================================================*/	
	/* Lightning Timer
	/*=============================================================================*/
	  this.lightningTimer = function(){
		this.lightTimeCurrent++;
		if(this.lightTimeCurrent >= this.lightTimeTotal){
		  var newX = this.rand(100, cw - 100);
		  var newY = this.rand(0, ch / 2); 
		  var createCount = this.rand(1, 3);
		  while(createCount--){							
			this.createL(newX, newY, true);
		  }
		  this.lightTimeCurrent = 0;
		  this.lightTimeTotal = this.rand(30, 100);
		}
	  }
		
	/*=============================================================================*/	
	/* Clear Canvas
	/*=============================================================================*/
		this.clearCanvas = function(){
		  this.ctx.globalCompositeOperation = 'destination-out';
		  this.ctx.fillStyle = 'rgba(0,0,0,'+this.rand(1, 30)/100+')';
		  this.ctx.fillRect(0,0,this.cw,this.ch);
		  this.ctx.globalCompositeOperation = 'source-over';
		};
	  
	/*=============================================================================*/	
	/* Resize on Canvas on Window Resize
	/*=============================================================================*/
	$(window).on('resize', function(){
	  _this.cw = _this.c.width = window.innerWidth;
	  _this.ch = _this.c.height = window.innerHeight;  
	});
		
	/*=============================================================================*/	
	/* Animation Loop
	/*=============================================================================*/
	  this.loop = function(){
			var loopIt = function(){
		  requestAnimationFrame(loopIt, _this.c);
		  _this.clearCanvas();
		  _this.updateL();
		  _this.lightningTimer();
		  _this.renderL();	
		};
		loopIt();					
	  };
	  
	};
	
	/*=============================================================================*/	
	/* Check Canvas Support
	/*=============================================================================*/
	var isCanvasSupported = function(){
	  var elem = document.createElement('canvas');
	  return !!(elem.getContext && elem.getContext('2d'));
	};
	
	/*=============================================================================*/	
	/* Setup requestAnimationFrame
	/*=============================================================================*/
	var setupRAF = function(){
	  var lastTime = 0;
	  var vendors = ['ms', 'moz', 'webkit', 'o'];
	  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	  };
	  
	  if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback, element){
		  var currTime = new Date().getTime();
		  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		  var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		  lastTime = currTime + timeToCall;
		  return id;
		};
	  };
	  
	  if (!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id){
		  clearTimeout(id);
		};
	  };
	};			
	
	/*=============================================================================*/	
	/* Define Canvas and Initialize
	/*=============================================================================*/
	window.onload = () => {	
	  if(isCanvasSupported){
		var c = document.getElementById('canvas');
		var cw = c.width = window.innerWidth;
		var ch = c.height = window.innerHeight;	
		var cl = new canvasLightning(c, cw, ch);				
		
		setupRAF();
		cl.init();
	  }
	};



///////////////////////////////////////////////////////////////////////////////