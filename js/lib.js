var canvas = document.getElementById('gamecanvas');
var ctx = canvas.getContext('2d');

var g_Player;
var g_Utilities = new Utilities();
var g_Gamestates = new Gamestates();
var g_Level = new Level();
var g_UI = new UI();
var g_Spells = new Spell();

var traps = [];
var tiles = [];
var coins = [];
var staticitems = [];
var mysteryboxes = [];
var slopes = [];
var statictiles = [];
var debug = false;
var lines;
var bots = [];
var players = [];
var isMobile = false;
var map;
var g_ActiveSpells = [];
var mapwidth = (300*96);
var mapheight = (30*96);

var isBots = false;

function start(){

	remotePlayers = [];
	localPlayer = g_Player;

	socket = io.connect('http://localhost:8000');

	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);

		var generatemap=function(){

			map = TileMaps.map2.layers[0].data;
	
				var y = 0;
				var x2 = 0;

				for(var x = 0; x < map.length; x++)
				{	
					x2++;
					if(x % 300 === 0){y++; x2 = 0}


					if(map[x] === 1 || map[x] === 2 || map[x] === 4 || map[x] === 5 || map[x] === 6 || map[x] === 7 || map[x] === 9 ||
					   map[x] === 10 || map[x] === 11 || map[x] === 12 || map[x] === 13 || map[x] === 14 || map[x] === 15 ||
					   map[x] === 18 || map[x] === 21 || map[x] === 22 || map[x] === 23 || map[x] === 24 || map[x] === 25 ||
					   map[x] === 26)
					{

						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'wall';
						tiles.push(tile); 
						statictiles.push(tile);
						continue;
					}

			

					if(map[x] === 3 || map[x] === 8 || map[x] === 16 || map[x] === 17 || map[x] === 19 || map[x] === 20){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'slope';
						tile.sloped = true;
						if(map[x] === 17 || map[x] === 19){tile.tileoffset.y=64; tile.boundingbox.y /= 2; tile.boundingboxoffset.y = 48;}
						
						if(map[x] === 3){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96); tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+96;}
						if(map[x] === 8){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+96; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96);}

						

						if(map[x] === 19){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+96; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+48;}
						if(map[x] === 20){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+48; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96);}


						if(map[x] === 16){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96); tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+48;}
						if(map[x] === 17){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+48; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+96;}

 						tiles.push(tile);
						slopes.push(tile);
						continue;
					}

					if(map[x] === 27 || map[x] === 28 || map[x] === 29){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'platform';
						tile.boundingbox.y = 42;
						tile.boundingboxoffset.y = 49;
						tile.tileoffset.y = 32;
						tiles.push(tile);
						statictiles.push(tile);
						continue;
					}

					if(map[x] === 30){
						mysteryboxes.push(new MysteryBox(x2*96,y*96,map[x]-1));
						continue;
					}

					if(map[x] === 31){
						traps.push(new Trap(x2*96,y*96));
						continue;
					}
					if(map[x] === 32){
						coins.push(new Coin((x2*96)+64,(y*96)+64));
						continue;
					}
					if(map[x] === 33){
						traps.push(new LaserTrap(x2*96,y*96,(x2*96)+100,(y*96)+100));
						continue;
					}

					if(map[x] === 37 || map[x] === 34 || map[x] === 35 || map[x] === 36 || map[x] === 51 || map[x] === 52 || map[x] === 53 || map[x] === 54 || map[x] === 55){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'item';

						tiles.push(tile); 
						statictiles.push(tile);
						if(map[x]==37){tile.boundingbox.y=48;tile.boundingboxoffset.y=48; continue;}
						if(map[x]==51){tile.boundingboxoffset.x=32;tile.boundingboxoffset.y=64;tile.boundingbox.x=32;tile.boundingbox.y=32; continue;}
						if(map[x]==52){tile.boundingboxoffset.x=28;tile.boundingboxoffset.y=52;tile.boundingbox.x=44;tile.boundingbox.y=44; continue;}
						if(map[x]==53){tile.boundingboxoffset.x=44;tile.boundingboxoffset.y=72;tile.boundingbox.x=16;tile.boundingbox.y=22; continue;}
						if(map[x]==54){tile.boundingboxoffset.x=34;tile.boundingboxoffset.y=68;tile.boundingbox.x=30;tile.boundingbox.y=30; continue;}
						if(map[x]==55){tile.boundingboxoffset.x=34;tile.boundingboxoffset.y=60;tile.boundingbox.x=36;tile.boundingbox.y=36; continue;}
						continue;
					}

					//staticitems
					if(map[x] === 38 || map[x] === 39 || map[x] === 40 || map[x] === 41 || map[x] === 44){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'staticitem';
						staticitems.push(tile);
					}

				}
		};


		generatemap();
		

		
		//bots
		if(isBots){
			bots.push(new Bot(64,306));
			bots.push(new Bot(128,306));
			bots.push(new Bot(196,306));
		}
		//player
		g_Player = new Player(260,306);

		//put all players/bots together
		players.push(g_Player);

		for(var i = 0; i < bots.length; i++)players.push(bots[i]);

		if(debug)for(var i = 0; i < 10; i++){g_Player.addSpell(g_Spells.randomSpell());}


		/*INITFUNCTIONS*/

		init();

	 	Loop();
	 }
	 

window.onload=function(){

	start();
	/*(function(){

		var generatemap=function(){

			map = TileMaps.map2.layers[0].data;
	
				var y = 0;
				var x2 = 0;

				for(var x = 0; x < map.length; x++)
				{	
					x2++;
					if(x % 300 === 0){y++; x2 = 0}


					if(map[x] === 1 || map[x] === 2 || map[x] === 4 || map[x] === 5 || map[x] === 6 || map[x] === 7 || map[x] === 9 ||
					   map[x] === 10 || map[x] === 11 || map[x] === 12 || map[x] === 13 || map[x] === 14 || map[x] === 15 ||
					   map[x] === 18 || map[x] === 21 || map[x] === 22 || map[x] === 23 || map[x] === 24 || map[x] === 25 ||
					   map[x] === 26)
					{

						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'wall';
						tiles.push(tile); 
						statictiles.push(tile);
						continue;
					}

			

					if(map[x] === 3 || map[x] === 8 || map[x] === 16 || map[x] === 17 || map[x] === 19 || map[x] === 20){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'slope';
						tile.sloped = true;
						if(map[x] === 17 || map[x] === 19){tile.tileoffset.y=64; tile.boundingbox.y /= 2; tile.boundingboxoffset.y = 48;}
						
						if(map[x] === 3){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96); tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+96;}
						if(map[x] === 8){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+96; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96);}

						

						if(map[x] === 19){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+96; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+48;}
						if(map[x] === 20){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+48; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96);}


						if(map[x] === 16){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96); tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+48;}
						if(map[x] === 17){tile.slopeline1.x=(x2*96); tile.slopeline1.y=(y*96)+48; tile.slopeline2.x=(x2*96)+96; tile.slopeline2.y=(y*96)+96;}

 						tiles.push(tile);
						slopes.push(tile);
						continue;
					}

					if(map[x] === 27 || map[x] === 28 || map[x] === 29){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'platform';
						tile.boundingbox.y = 42;
						tile.boundingboxoffset.y = 49;
						tile.tileoffset.y = 32;
						tiles.push(tile);
						statictiles.push(tile);
						continue;
					}

					if(map[x] === 30){
						mysteryboxes.push(new MysteryBox(x2*96,y*96,map[x]-1));
						continue;
					}

					if(map[x] === 31){
						traps.push(new Trap(x2*96,y*96));
						continue;
					}
					if(map[x] === 32){
						coins.push(new Coin((x2*96)+64,(y*96)+64));
						continue;
					}
					if(map[x] === 33){
						traps.push(new LaserTrap(x2*96,y*96,(x2*96)+100,(y*96)+100));
						continue;
					}

					if(map[x] === 37 || map[x] === 34 || map[x] === 35 || map[x] === 36 || map[x] === 51 || map[x] === 52 || map[x] === 53 || map[x] === 54 || map[x] === 55){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'item';

						tiles.push(tile); 
						statictiles.push(tile);
						if(map[x]==37){tile.boundingbox.y=48;tile.boundingboxoffset.y=48; continue;}
						if(map[x]==51){tile.boundingboxoffset.x=32;tile.boundingboxoffset.y=64;tile.boundingbox.x=32;tile.boundingbox.y=32; continue;}
						if(map[x]==52){tile.boundingboxoffset.x=28;tile.boundingboxoffset.y=52;tile.boundingbox.x=44;tile.boundingbox.y=44; continue;}
						if(map[x]==53){tile.boundingboxoffset.x=44;tile.boundingboxoffset.y=72;tile.boundingbox.x=16;tile.boundingbox.y=22; continue;}
						if(map[x]==54){tile.boundingboxoffset.x=34;tile.boundingboxoffset.y=68;tile.boundingbox.x=30;tile.boundingbox.y=30; continue;}
						if(map[x]==55){tile.boundingboxoffset.x=34;tile.boundingboxoffset.y=60;tile.boundingbox.x=36;tile.boundingbox.y=36; continue;}
						continue;
					}

					//staticitems
					if(map[x] === 38 || map[x] === 39 || map[x] === 40 || map[x] === 41 || map[x] === 44){
						var tile = new Tile(x2*96,(y*96),map[x]-1);
						tile.tag = 'staticitem';
						staticitems.push(tile);
					}

				}
		};


		generatemap();
		

		
		//bots
		if(isBots){
			bots.push(new Bot(64,306));
			bots.push(new Bot(128,306));
			bots.push(new Bot(196,306));
		}
		//player
		g_Player = new Player(260,306);

		//put all players/bots together
		players.push(g_Player);

		for(var i = 0; i < bots.length; i++)players.push(bots[i]);

		if(debug)for(var i = 0; i < 10; i++){g_Player.addSpell(g_Spells.randomSpell());}


		

		init();

	 	Loop();
	})();
*/
}


function Level(){ 
	var self = this;

	var bg = new Image();
	bg.src='img/bg.jpg';

	var tileimg = new Image();
	tileimg.src='img/tiles_96_2.png';

	var saw = new Image();
	saw.src='img/saw.png';

	var coinimage = new Image();
	coinimage.src='img/coin.png';

	var mysteryimage = new Image();
	mysteryimage.src = 'img/mysterybox.png';

	var trapindex = 0;
	var oldtrapindex = 0;

	var viewport = new Vector(0,0);
	var tileport = new Vector(0,0);

	this.getviewport=function(){
		return viewport;
	}



	this.viewUp=function(){
		if(viewport.y > 0)
			viewport.y --;
	}
	this.viewDown=function(){
		if(((viewport.y) + canvas.height) <= mapheight+96)
			viewport.y ++;
	}
	this.viewLeft=function(){
		if(viewport.x > 0)
			viewport.x --;
	}
	this.viewRight=function(){
		if(((viewport.x) + canvas.width) <= mapwidth-1)
			viewport.x ++;
	}


	this.gettileport=function(){
		return tileport;
	}
	this.updatetileport=function(){
		if(!g_Player.dead && !g_Player.rise)tileport.x++;
	}


	this.render=function(){
		ctx.drawImage(bg,0,0,canvas.width,canvas.height);

		for(var i = 0; i < tiles.length; i++){
			tiles[i].render(tileimg);
		}

		for(var i = 0; i < traps.length; i++){
			traps[i].render(saw);
		}

		for(var i = 0; i < coins.length; i++){
			coins[i].render(coinimage);
		}

		for(var i = 0; i < mysteryboxes.length; i++){
			mysteryboxes[i].render(tileimg);
		}

		for(var i = 0; i < g_ActiveSpells.length; i++){
			g_ActiveSpells[i].render(mysteryimage);
		}
		for(var i=0;i<staticitems.length;i++){
			staticitems[i].render(tileimg);
		}
		
	}
	this.update=function(){
		self.updateTraps();
		self.collision();
	//	self.updateCoins();
		self.updateMysteryBox();
		self.updateSpells();
	}
	
	//var generatedcoin = false;
	/*var generateCoinStructure={
		step:function(){
			coins[0].position.x = Math.floor(Math.random() * (canvas.width*2)) + canvas.width;
			coins[0].position.x += g_Level.getviewport().x;
			coins[0].position.y = Math.floor(Math.random() * (canvas.height-(99*4)));
			coins[0].position.y += g_Level.getviewport().y;

			var step = 0;
			for(var i = 1; i < 20; i++){ //step structure
				coins[i].position.x = coins[i-1].position.x + 45;
				coins[i].position.y = coins[0].position.y + step;

				if(i % 5 == 0){step+=45};
			}
		},
		trapeze:function(){
			coins[0].position.x = Math.floor(Math.random() * (canvas.width*2)) + canvas.width;
			coins[0].position.x += g_Level.getviewport().x;
			coins[0].position.y = Math.floor(Math.random() * (canvas.height-(99*4)));
			coins[0].position.y += g_Level.getviewport().y

			var step = 0;
			var redostep = 1;
			for(var i = 1; i < 20; i++){ //step structure
				coins[i].position.x = (coins[i-redostep].position.x + 45);
				coins[i].position.y = coins[0].position.y + step;

				if(i % 5 == 0){redostep=5;step+=45};
			}
		},
		rectangle:function(){
			coins[0].position.x = Math.floor(Math.random() * (canvas.width*2)) + canvas.width;
			coins[0].position.x += g_Level.getviewport().x;
			coins[0].position.y = Math.floor(Math.random() * (canvas.height-(99*4)));
			coins[0].position.y += g_Level.getviewport().y;


			var step = 0;
			var index = 0;
			for(var i = 0; i < 21; i++){ //step structure
				
				if(i == 0){
					coins[i].position.x = Math.floor(Math.random() * (canvas.width*2)) + canvas.width;
					coins[i].position.x += g_Level.getviewport().x;
					coins[i].position.y = Math.floor(Math.random() * (canvas.height-(99*4)));
					coins[i].position.y += g_Level.getviewport().y;
					continue;
				}

				coins[i].position.x = (coins[index].position.x + 45);
				coins[i].position.y = coins[0].position.y + step;
				index++;

				if(i % 5 == 0){step+=45; index = 0;};
			}
			coins[0].position.x = -1000;
		}
	};*/

	this.updateSpells=function(){
		for(var i = 0; i < g_ActiveSpells.length; i++){
			g_ActiveSpells[i].update();
		}
	}

	this.updateMysteryBox=function(){
		for(var i = 0; i < mysteryboxes.length; i++){
			mysteryboxes[i].update();
		}
	}
	
	/*var randomstruct = 0;
	this.updateCoins=function(){
		
		if(generatedcoin){coinmiss(); return;}

		randomstruct = Math.floor((Math.random() * 3) + 0);

		generatedcoin = true;

		if(randomstruct == 0){
				generateCoinStructure.step();
			}
			else if(randomstruct == 1){
				generateCoinStructure.trapeze();
			}
			else if(randomstruct == 2){
					generateCoinStructure.rectangle();
				}
		
		//for(var i = 0; i < coins.length; i++){coins[i].missed();}
	}*/

	/*var coinmiss=function(){
		var total = 0;
		for(var i = 0; i < 21; i++){ 
			if((((coins[i].position.x + coins[i].dimensions.x)+35)-g_Level.getviewport().x) <= 0){
				total ++;
			}
		}
		if(total >= 20)generatedcoin = false;
	};*/

	this.updateTraps=function(){
		
		/*if(!traps[oldtrapindex].circle && traps[oldtrapindex].position.x - g_Level.getviewport().x <= (canvas.width/2)){
       		self.reuseTraps();
       		return;
   		}*/



   		/*if(traps[oldtrapindex].circle && traps[oldtrapindex].circle.x - g_Level.getviewport().x <= (canvas.width/2)){
       		self.reuseTraps();
   		}*/

		for(var i = 0; i < traps.length; i++)
			traps[i].update();


	}
	/*this.reuseTraps=function(){
		oldtrapindex = trapindex;

		if(traps[trapindex].circle == undefined && traps[trapindex].circle == null){
			traps[trapindex].position.x = (canvas.width + g_Level.getviewport().x);
			traps[trapindex].position.y = Math.random() * ((canvas.height-traps[0].dimensions.y)) >> 0;
			traps[trapindex].position.y -= g_Level.getviewport().y;

		}else{
			traps[trapindex].circle.x = canvas.width + g_Level.getviewport().x;
			traps[trapindex].circle.y = Math.random() * ((canvas.height-traps[0].dimensions.y)-0)+0 >> 0;
			traps[trapindex].circle.y -= g_Level.getviewport().y;


			traps[trapindex].spawnpoints();
		}


		trapindex ++;

		
		if(trapindex >= traps.length-1) trapindex = 0;
	}*/

	/*this.updateTiles=function(){
		for(var i = 0; i < tiles.length; i++){
			if(((tiles[i].position.x - viewport.x)+tiles[i].dimensions.x) <= 0){tiles[i].position.x = canvas.width + tileport.x; }
		}
	}*/


	this.collision=function(){
		if(debug)return;

		for(var i = 0; i < traps.length; i++){

			if(((traps[i].position.x+traps[i].dimensions.x) - g_Level.getviewport().x) <= 0 ||
					((traps[i].position.x) - g_Level.getviewport().x) > canvas.width || !traps[i].collisioncheck) {continue;}

			for(var j = 0; j < players.length; j++){
				
				if((traps[i].position.x+traps[i].offset) < (players[j].pos.x+players[j].offset) + players[j].boundingbox.x &&
				(traps[i].position.x+traps[i].offset) + traps[i].boundingbox.x > (players[j].pos.x+players[j].offset) &&
				(traps[i].position.y+traps[i].offset) < (players[j].pos.y+players[j].offset) + players[j].boundingbox.y &&
				traps[i].boundingbox.y + (traps[i].position.y+traps[i].offset) > (players[j].pos.y+players[j].offset)) {
					// collision detected!
					
					//players[j].checkdead();
					players[j].receiveDamage();
				}

				if(traps[i].position2 == undefined || traps[i].position2 == null || !traps[i].collisioncheck)continue;

				if((traps[i].position2.x+traps[i].offset) < (players[j].pos.x+players[j].offset) + players[j].boundingbox.x &&
				(traps[i].position2.x+traps[i].offset) + traps[i].boundingbox.x > (players[j].pos.x+players[j].offset) &&
				(traps[i].position2.y+traps[i].offset) < (players[j].pos.y+players[j].offset) + players[j].boundingbox.y &&
				traps[i].boundingbox.y + (traps[i].position2.y+traps[i].offset) > (players[j].pos.y+players[j].offset)) {
					// collision detected!
					
					//players[j].checkdead();
					players[j].receiveDamage();
				}
			}

		}

		for(var i = 0; i < coins.length; i++){
			if(((coins[i].position.x+coins[i].dimensions.x) - g_Level.getviewport().x) <= 0 ||
			((coins[i].position.x) - g_Level.getviewport().x) > canvas.width || !coins[i].collisioncheck ) {continue;}

			if((coins[i].position.x) < (g_Player.pos.x+g_Player.offset) + g_Player.boundingbox.x &&
			(coins[i].position.x) + coins[i].dimensions.x > (g_Player.pos.x+g_Player.offset) &&
			(coins[i].position.y) < (g_Player.pos.y+g_Player.offset) + g_Player.boundingbox.y &&
			coins[i].dimensions.y + (coins[i].position.y) > (g_Player.pos.y+g_Player.offset)) {
				// collision detected!
				g_Player.incrementscore();
				//coins[i].respawn();
				coins[i].move();
				continue;
			}
		}

		//mysterybox collision
		for(var i = 0; i < mysteryboxes.length; i++){	
			if(((mysteryboxes[i].position.x+mysteryboxes[i].boundingbox.x) - g_Level.getviewport().x) <= 0 ||
				((mysteryboxes[i].position.x) - g_Level.getviewport().x) > canvas.width || !mysteryboxes[i].collisioncheck || mysteryboxes[i].disabled) { continue;}

			for(var j = 0; j < players.length; j++){

				if((mysteryboxes[i].position.x) < (players[j].pos.x+players[j].offset) + players[j].boundingbox.x &&
				(mysteryboxes[i].position.x) + mysteryboxes[i].boundingbox.x > (players[j].pos.x+players[j].offset) &&
				(mysteryboxes[i].position.y) < (players[j].pos.y+players[j].offset) + players[j].boundingbox.y &&
				mysteryboxes[i].boundingbox.y + (mysteryboxes[i].position.y) > (players[j].pos.y+players[j].offset)) {
					// collision detected!
					if(mysteryboxes[i].disabled)continue;
					players[j].addSpell(g_Spells.randomSpell());
					mysteryboxes[i].previousTick = g_Utilities.getcurrenttick();
					mysteryboxes[i].disabled = true;
					continue;
				}
			}
		}

		if(g_ActiveSpells.length <= 0)return;

		for(var i = 0; i < g_ActiveSpells.length; i++){	
			if(((g_ActiveSpells[i].position.x+g_ActiveSpells[i].boundingbox.x) - g_Level.getviewport().x) <= 0 ||
				((g_ActiveSpells[i].position.x) - g_Level.getviewport().x) > canvas.width /*|| !g_ActiveSpells[i].collisioncheck*/) { continue;}

			for(var j = 0; j < players.length; j++){

				if((g_ActiveSpells[i].position.x) < (players[j].pos.x+players[j].offset) + players[j].boundingbox.x &&
				(g_ActiveSpells[i].position.x) + g_ActiveSpells[i].boundingbox.x > (players[j].pos.x+players[j].offset) &&
				(g_ActiveSpells[i].position.y) < (players[j].pos.y+players[j].offset) + players[j].boundingbox.y &&
				g_ActiveSpells[i].boundingbox.y + (g_ActiveSpells[i].position.y) > (players[j].pos.y+players[j].offset)) {
					// collision detected!
					if(g_ActiveSpells[i].invincible == players[j])continue;

					g_ActiveSpells[i].attack(players[j]);


					continue;
				}
			}
		}

	}

	this.centerPlayer=function(x,y){
		viewport.x = x - (canvas.width / 2);
		viewport.y = y - (canvas.height / 2);
		if(viewport.x < 0)
		{
			viewport.x = 0;
		}
		if(viewport.x > canvas.width - 1)
		{
			viewport.x = canvas.width - 1;
		}
		if(viewport.y < 0)
		{
			viewport.y = 0;
		}
		if(viewport.y > canvas.height - 96 - 1)
		{
			viewport.y = canvas.height - 96 - 1;
		}
	}

	this.isXCenter=function(x){
		if(x == viewport.x +  (canvas.width / 2) || x == viewport.x - (canvas.width / 2))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	this.isYCenter=function(y){
		if(y == viewport.y +  (canvas.height / 2) || y == viewport.y - (canvas.height / 2))
		{
			return true;
		}
		else
		{
			return false;
		}
	}


	this.restart=function(){
		trapindex = 0;
		oldtrapindex = 0;
		viewport.x = 0;
		viewport.y = 0;
		tileport.x = 0;
		tileport.y = 0;
	}
}

function Trap(x,y){
	var self = this;
	this.position = new Vector(x,y);
	this.dimensions = new Vector(156,156);
	this.boundingbox = new Vector(125,130);
	this.offset = 16;
	this.isNormal = true;
	this.collisioncheck = false;

	this.render=function(tile){
		if(self.position.x >= (canvas.width+g_Level.getviewport().x) || ((self.position.x+self.dimensions.x) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return;}
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }

		self.collisioncheck = true;
		ctx.drawImage(tile,self.position.x - g_Level.getviewport().x,self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);

		//if(debug)ctx.save();
		//if(debug)ctx.rect((self.position.x+self.offset) - g_Level.getviewport().x,(self.position.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
		//if(debug)ctx.stroke();
		//if(debug)ctx.restore();

	}
	this.update=function(){}
	return this;
}

function RestartTrap(){
	for(var i = 0; i < traps.length; i++){
		if(traps[i].circle == undefined && traps[i].circle == null){
			traps[i].position.x = -1000;
			traps[i].position.y = 0;
		}else{
			traps[i].circle.x = -1000;
			traps[i].circle.y = 0;
		}
	}
}



function LaserTrap(x,y,x2,y2){
	var self = this;
	this.position = new Vector(x,y);
	this.position2 = new Vector(x2,y2);
	this.dimensions = new Vector(100,100);
	this.line = new Vector(0,0);
	this.line2 = new Vector(0,0);
	this.center = new Vector(0,0);
	this.center2 = new Vector(0,0);
	this.angle = 0;
	this.rotateby = 0;
	this.circle = new Vector(-100,-100);
	this.offset = 10;
	this.boundingbox = new Vector(80,80);
	this.isNormal = false;
	this.collisioncheck = false;
	function rotatePoint(x,y , cx,cy, angle){
	  self.angle = angle;

	  self.angle = (self.angle) * (Math.PI/180); // Convert to radians
	  var rotatedX = Math.cos(self.angle) * (x - cx) - Math.sin(self.angle) * (y- cy) + cx;
	  var rotatedY = Math.sin(self.angle) * (x - cx) + Math.cos(self.angle) * (y - cy) + cy;

	  self.center.x = rotatedX;
	  self.center.y = rotatedY;
	  return;
	}

  	function rotatePoint2(x,y , cx,cy, angle){
		self.angle = angle;

		self.angle = (self.angle) * (Math.PI/180); // Convert to radians
		var rotatedX = Math.cos(self.angle) * (x - cx) - Math.sin(self.angle) * (y- cy) + cx;
		var rotatedY = Math.sin(self.angle) * (x - cx) + Math.cos(self.angle) * (y - cy) + cy;

		self.center2.x = rotatedX;
		self.center2.y = rotatedY;
		return;
  	}

  	this.spawnpoints=function(){
		var radius =  (Math.random() * (120 - 100)+100) >> 0;

		self.position.x = (canvas.width + g_Level.getviewport().x);
		self.position.y = Math.random() * ((canvas.height-traps[0].dimensions.y)) >> 0;
		self.position.y -= g_Level.getviewport().y;

		self.position2.x = self.position.x + radius;
		self.position2.y = self.position.y + radius;
		
  }

	this.update=function(){
		var delta = 0.03;

		self.rotateby = 90 * delta;

		rotatePoint(self.position.x,self.position.y,(self.position.x+self.position2.x)/2,(self.position.y+self.position2.y)/2,self.rotateby);
		rotatePoint2(self.position2.x,self.position2.y,(self.position.x+self.position2.x)/2,(self.position.y+self.position2.y)/2,self.rotateby);

		self.position.x = self.center.x;
		self.position.y = self.center.y;

		self.position2.x = self.center2.x;
		self.position2.y = self.center2.y;

		self.line.x = (self.position.x+32);
	    self.line.y = (self.position.y+32);
	    self.line2.x = (self.position2.x+32);
	    self.line2.y = (self.position2.y+32);

  	}

  	this.render=function(image){
		if(self.position.x >= ((canvas.width+g_Level.getviewport().x)+300) || (((self.position.x+self.dimensions.x)+300) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return;}
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)+300) || (((self.position.y+self.dimensions.y)+300) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }
		
		self.collisioncheck = true;
		//laser
		ctx.save();
		ctx.lineWidth = 4;
	      ctx.beginPath();
	      ctx.moveTo(self.position.x+50 - g_Level.getviewport().x,self.position.y+50 - g_Level.getviewport().y);
	      ctx.lineTo(self.position2.x+50 - g_Level.getviewport().x,self.position2.y+50 - g_Level.getviewport().y);
	      ctx.strokeStyle="silver";
	      ctx.stroke();
    	ctx.restore();

		 ctx.save();
		  ctx.translate(
		    self.position.x + (self.dimensions.x / 2),
		    self.position.y + (self.dimensions.y / 2)
		 );



		ctx.drawImage(image,(-self.dimensions.x / 2) - g_Level.getviewport().x, -self.dimensions.y / 2 - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
		ctx.restore();

		//if(debug){
		//	ctx.save();
		//	ctx.rect((self.position.x+self.offset) - g_Level.getviewport().x,(self.position.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
		//	ctx.stroke();
		//	ctx.restore();
		//}
		


		 ctx.save();
		 ctx.translate(
		    self.position2.x + (self.dimensions.x / 2),
		    self.position2.y + (self.dimensions.y / 2)
		 );

		ctx.drawImage(image,(-self.dimensions.x / 2) - g_Level.getviewport().x, -self.dimensions.y / 2 - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
		ctx.restore();


		//if(debug){
		//	ctx.save();
		//	ctx.rect((self.position2.x+self.offset) - g_Level.getviewport().x,(self.position2.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
		//	ctx.stroke();
		//	ctx.restore();
		//}


  }

  return this;

}


function Tile(x,y,_offset){
	var self = this;
	this.position = new Vector(x,y);
	this.dimensions = new Vector(96,96);
	this.boundingbox = new Vector(96,96);
	this.boundingboxoffset = new Vector(0,0);
	this.offsetimg = new Vector(128,128);
	this.sloped = false;
	this.collisioncheck = false;
	this.offset = _offset || 0;
	this.tag = 'undefined';
	this.tileoffset=new Vector(0,0);

	this.slopeline1 = new Vector(0,0);
	this.slopeline2 = new Vector(0,0);


	this.render=function(img){
		if(self.position.x >= ((canvas.width+g_Level.getviewport().x)) || (((self.position.x+self.dimensions.x)) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return; }
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }

		self.collisioncheck = true;

		ctx.drawImage(img,self.offsetimg.x*self.offset,0,self.offsetimg.x,self.offsetimg.y,self.position.x - g_Level.getviewport().x,self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
		
		if(debug && self.tag =='item'){
			ctx.save();
			ctx.rect((self.position.x+self.boundingboxoffset.x) - g_Level.getviewport().x,(self.position.y+self.boundingboxoffset.y) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
			ctx.stroke();
			ctx.restore();
		}


	}
	return this;
}

function RestartTile(){
	for(var i = 0; i < Math.floor(canvas.width/128)+1; i++){
		tiles[i].position.x = i*128;
	}
}


function Spell(){
	var self = this;
	this.position = new Vector(0,0);
	this.dimensions = new Vector(32,32);
	this.boundingbox = new Vector(32,32);
	this.offset = 0;

	var damage={
		brainthrow:function(player){g_ActiveSpells.push(new BrainThrow(player));},
		floorspikes:function(player){for(var i=0;i<players.length;i++){if(players[i]==player){continue;}g_ActiveSpells.push(new FloorSpikes(player,players[i]));}},
		brainmines:function(player){g_ActiveSpells.push(new BrainMines(player));},
	}
	this.attack=function(player,spellid,target){
		if(spellid == 'brainthrow'){console.log('Chosen spell to attack...BT');damage.brainthrow(player); player.removeSpell();}
		if(spellid == 'floorspikes'){console.log('Choosen spell to attack...FS');damage.floorspikes(player); player.removeSpell();}
		if(spellid == 'brainmines'){console.log('Choosen spell to attack...BM'); damage.brainmines(player); player.removeSpell();}
	};

	var spelllist={
		brainthrow:'brainthrow',
		floorspikes:'floorspikes',
		brainmines:'brainmines'
	};
	this.randomSpell=function(){
		var rand = Math.random() * (5-1)+1 >> 0;
		if(rand <= 0)rand = 1;

		if(debug)rand = 3;



		if(rand == 1){return spelllist.brainthrow;}
		if(rand == 2){return spelllist.floorspikes;}
		if(rand == 3){return spelllist.brainmines;}
		if(rand == 4){return spelllist.floorspikes;}
		if(rand == 5){return spelllist.brainthrow;}
	}
}
function removeSpells(){
	g_ActiveSpells = [];
}

function BrainThrow(player){
	var self = this;
	this.position = new Vector(player.pos.x,player.pos.y);
	this.dimensions = new Vector(32,32);
	this.boundingbox = new Vector(32,32);
	this.offset = 0;
	this.collisioncheck = false;
	this.invincible = player;

	var velocity = new Vector(player.velocity.x+10,1);
	var offset = new Vector(0.05,0.3);
	var timeoffset = 5;
	this.previousTick = g_Utilities.getcurrenttick();
	var vdirection = new Vector(1,0);

	this.attack=function(target){
		target.receiveDamage();
	}

	this.render=function(image){
		if(self.position.x >= ((canvas.width+g_Level.getviewport().x)) || (((self.position.x+self.dimensions.x)) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return; }
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }

		self.collisioncheck = true;
		ctx.drawImage(image,self.position.x - g_Level.getviewport().x, self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
	}
	this.update=function(){
		
		if((self.previousTick+timeoffset) <= g_Utilities.getcurrenttick()){console.log('REMOVE'); /*g_ActiveSpells.pop();*/var index=g_ActiveSpells.indexOf(self); g_ActiveSpells.splice(index,1); return;}


		velocity.x -= offset.x;
		self.position.x += (velocity.x)*vdirection.x;

		if(!tilecollision(self.position.x,self.position.y-velocity.y,function(){ })){velocity.y -= offset.y; self.position.y -= (velocity.y);}

		var ray = new Ray(self.position.x,self.position.y,1,1,2,0);
		if(ray.raycast()){vdirection.x = -1;}
	}

	var tilecollision=function(xpos,ypos,callback){

		for(var i = 0; i < statictiles.length; i++){

			if(!statictiles[i].collisioncheck)continue;

			if((statictiles[i].position.x+statictiles[i].boundingboxoffset.x) < (xpos+self.offset) + self.boundingbox.x &&
				(statictiles[i].position.x+statictiles[i].boundingboxoffset.x) + statictiles[i].boundingbox.x > (xpos+self.offset) &&
				(statictiles[i].position.y+statictiles[i].boundingboxoffset.y) < (ypos+(self.offset)) + self.boundingbox.y &&
				statictiles[i].boundingbox.y + (statictiles[i].position.y+statictiles[i].boundingboxoffset.y) > (ypos+(self.offset))) {
					// collision detected!

					if(statictiles[i].tag == 'wall'){if(callback)callback();}
					return true;
			}
		}

		return false;
	}

	return this;

}
function FloorSpikes(player,target){
	var self = this;
	this.position = new Vector(target.pos.x,target.pos.y+target.boundingbox.y);
	this.dimensions = new Vector(32,32);
	this.boundingbox = new Vector(32,32);
	this.offset = 0;
	this.collisioncheck = false;
	this.invincible = player;
	this.previousTick = this.previousTick = g_Utilities.getcurrenttick();
	var timeoffset = 5;

	this.attack=function(_target){
		_target.receiveDamage();
	}
	this.update=function(){if((self.previousTick+timeoffset) <= g_Utilities.getcurrenttick()){console.log('REMOVE'); /*g_ActiveSpells.pop();*/var index=g_ActiveSpells.indexOf(self); g_ActiveSpells.splice(index,1); return;}}
	this.render=function(image){
		if(self.position.x >= ((canvas.width+g_Level.getviewport().x)) || (((self.position.x+self.dimensions.x)) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return; }
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }
		self.collisioncheck = true;
		ctx.drawImage(image,self.position.x - g_Level.getviewport().x, self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
	}
}

//brainmines
function BrainMines(player){
	var self = this;
	this.position = new Vector(player.pos.x,player.pos.y);
	this.dimensions = new Vector(32,32);
	this.boundingbox = new Vector(32,32);
	this.offset = 0;
	this.collisioncheck = false;
	this.invincible = player;
	var timeoffset = 120;
	this.previousTick = g_Utilities.getcurrenttick();
	var velocity = new Vector(0,5);
	var gravity = 0.2;
	this.finished = false;

	this.attack=function(target){
		console.log('BRAIN MINE');
		target.receiveDamage();
	}

	this.render=function(image){
		if(self.position.x >= ((canvas.width+g_Level.getviewport().x)) || (((self.position.x+self.dimensions.x)) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return; }
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }

		self.collisioncheck = true;
		ctx.drawImage(image,self.position.x - g_Level.getviewport().x, self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
	}
	this.update=function(){
		if((self.previousTick+timeoffset) <= g_Utilities.getcurrenttick()){console.log('REMOVE'); var index=g_ActiveSpells.indexOf(self); g_ActiveSpells.splice(index,1);/*g_ActiveSpells.pop();*/ return;}

		if(self.finished)return;

		if(!tilecollision(self.position.x,self.position.y-velocity.y,function(){})){slopecollision(self.position.x,self.position.y);}

		velocity.y -= gravity; self.position.y -= (velocity.y);
	}

	var tilecollision=function(xpos,ypos,callback){

		for(var i = 0; i < statictiles.length; i++){

			if(!statictiles[i].collisioncheck)continue;

			if((statictiles[i].position.x+statictiles[i].boundingboxoffset.x) < (xpos+self.offset) + self.boundingbox.x &&
			(statictiles[i].position.x+statictiles[i].boundingboxoffset.x) + statictiles[i].boundingbox.x > (xpos+self.offset) &&
			(statictiles[i].position.y+statictiles[i].boundingboxoffset.y) < (ypos+(self.offset)) + self.boundingbox.y &&
			statictiles[i].boundingbox.y + (statictiles[i].position.y+statictiles[i].boundingboxoffset.y) > (ypos+(self.offset))) {
					// collision detected!

					if(statictiles[i].tag == 'wall'){if(callback)callback();}
					self.finished = true;
					return true;
			}
		}

		return false;
	}

	var slopecollision=function(xpos,ypos,dir){

		var playerline1 = new Vector(self.position.x,self.position.y);
		var playerline2 = new Vector((self.position.x)+self.boundingbox.x,self.position.y);
		var playerline3 = new Vector(self.position.x,(self.position.y)+self.boundingbox.y);
		var playerline4 = new Vector((self.position.x)+self.boundingbox.x,(self.position.y)+self.boundingbox.y);


		for(var i = 0; i < slopes.length; i++){

			if(!slopes[i].collisioncheck)continue;

			if((slopes[i].position.y+slopes[i].boundingboxoffset.y) < (ypos) + (self.boundingbox.y) &&
					slopes[i].boundingbox.y + (slopes[i].position.y+slopes[i].boundingboxoffset.y) > (ypos)&&
				(slopes[i].position.x+slopes[i].boundingboxoffset.x) < (xpos) + self.boundingbox.x &&
					(slopes[i].position.x+slopes[i].boundingboxoffset.x) + slopes[i].boundingbox.x > (xpos) 

					){
						if(isOutside(slopes[i].slopeline1.x,slopes[i].slopeline1.y,slopes[i].slopeline2.x,slopes[i].slopeline2.y,
							[[playerline1.x,playerline1.y],[playerline2.x,playerline2.y],[playerline3.x,playerline3.y],[playerline4.x,playerline4.y]])){
							self.finished = true;
						 	return true;
						}
						return false;
			}
		}
		return false;
	};

	var isOutside=function(ax,ay,bx,by,prr){
		for(var l=prr.length,i=0,s,t;i<l;i++){
			t=((prr[i][0]-ax)*(by-ay)/(bx-ax)+ay-prr[i][1]);
		if(!t) return !0; t=t>0?1:-1; if(i&&t!=s) return !0; s=t;
		}return !1;
	}

	return this;
}







function Player(_x,_y){
	var self = this;
	this.pos = new Vector(_x,_y);
	this.temp = new Vector(100,100);
	this.dimensions = new Vector(80,80);//(96,96);
	this.boundingbox = new Vector(44,60);//(50,68);
	this.id = 0;
	g_Level.centerPlayer(this.pos.x,this.pos.y);
	
	var spells = [];
	this.tag = 'Player';
	

	this.image = new Image();
	this.image.src='img/zombie5.png';

	this.image2 = new Image();
	this.image2.src = 'img/zombie3.png';

	this.image3 = new Image();
	this.image3.src = 'img/zombie2.png';

	this.image4 = new Image();
	this.image4.src = 'img/zombie4.png';

	this.image5 = new Image();
	this.image5.src = 'img/zombie1.png';




	var score = 0;

	this.velocity = new Vector(7,0);
	this.frame = [];
	this.dead = false;
	this.rise = true;
	this.isjump = false;
	this.frameduration = 2;
	this.stopanimation = false;
	var updatevel = 0;
	this.offset = 17;//23;
	this.slope = false;
	var character = parseInt(Math.random() * (3-0)+0);
	this.collisioncheck = true;

	this.invulnerable = false;
	this.hit = false;

	var hittimer = 0;
	var hitcount = 1;

	var invulnerabletimer = 0;
	var invulnerablecount = 3;

	var clicks = 0;
	var clickamount = debug?99999:2;

	this.setcharacter=function(_char){
		character = 0;
	}
	this.getcharacter=function(){
		return character;
	}

	this.addSpell=function(_spell){
		console.log('Adding spell...');
		spells.push(_spell);
	};
	this.removeSpell=function(){
		spells.pop();
		console.log('Removing the spells, you now have: ' + spells.length);
	}
	this.castSpell=function(){
		if(spells.length <= 0 || self.dead || self.hit)return;
		console.log('Casting spell...');
		g_Spells.attack(this,spells[0]);
	}

	this.receiveDamage=function(){
		if(self.invulnerable) return;
		console.log('hit2');
		self.hit = true;
		self.invulnerable = true;
		hittimer = g_Utilities.getcurrenttick()+hitcount;
		invulnerabletimer = g_Utilities.getcurrenttick()+invulnerablecount;
	}

	this.animatestates=[{
		attack:'0 1 2 3 4 5 6 7',
		dead:'8 9 10 11 12',
		idle:'13 14 15 16 17 18',
		rise:'19 20 21 22 23 24 25 26',
		walk:'27 28 29 30 31 32 33 34 35 36 37 38 39',
		hit:'8 9 10 11 12',
		image:self.image,
		size:150
	},
	{
		attack:'0 1 2 3 4 5 6',
		dead:'7 8 9 10 11',
		idle:'12 13 14 15 16 17',
		rise:'18 19 20 21 22 23 24 25',
		walk:'26 27 28 29 30 31 32 33 34 35 36 37 38 39',
		image:self.image2,
		size:160
	},
	{
		attack:'0 1 2 3 4 5 6 7',
		dead:'8 9 10 11 12',
		idle:'17 18 19 20 21 22',
		rise:'23 24 25 26 27 28 29 30',
		walk:'31 32 33 34 35 36 37 38 39 40 41 42 43 44',
		image:self.image3,
		size:160
	},
	{

	}];

	
	self.frame = self.animatestates[character].rise.split(' ');
	this.currentframe = self.frame[0];
	this.framedelay = 0;

	this.update=function(){

		if(!debug){self.move();}else{self.manualmove();}

		if(self.invulnerable && (invulnerabletimer) <= g_Utilities.getcurrenttick()){self.invulnerable = false;}
		if(self.hit && (hittimer) <= g_Utilities.getcurrenttick()){self.hit = false;}

		self.gravity();

		socket.emit('move player', {x: self.pos.x, y: self.pos.y, id:self.id});
		//slopecollision(self.pos.x,self.pos.y);
	}

	var rotateamount = 0;

	this.render=function(){
		self.updateanimate();
		if(!self.slope)lerp(0);
		
	    ctx.save();
	   
	   	if(debug)ctx.strokeStyle = 'red';
		if(debug)ctx.rect((self.pos.x+self.offset) - g_Level.getviewport().x,(self.pos.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
		if(debug)ctx.stroke();

	    if(self.invulnerable){ctx.globalAlpha = 0.3;}else{ctx.globalAlpha = 1.0;}
	    
	    ctx.translate((self.pos.x+(self.dimensions.x/2)) - g_Level.getviewport().x,(self.pos.y+(self.dimensions.y/2)) - g_Level.getviewport().y);
	    ctx.rotate(rotateamount*Math.PI/180);
	    ctx.drawImage(self.animatestates[character].image,self.animatestates[character].size*self.currentframe,0,self.animatestates[character].size,self.animatestates[character].size,-self.dimensions.x/2,-self.dimensions.y/2,self.dimensions.x,self.dimensions.y);
	   
	    ctx.restore();


	}

	this.checkdead=function(){
		if(!self.dead){
			self.frame = self.animatestates[character].dead.split(' ');
			self.frameduration = 1;
			self.currentframe = self.frame[0];
			g_Player.dead = true;
			self.isjump = false;
		}
	}
	this.updateanimate=function(){ 
		if(self.framedelay++ > self.frameduration && !self.stopanimation && !self.isjump)
		{
			self.framedelay = 0;
			self.currentframe++;

			if(self.currentframe >= self.frame[self.frame.length-1])
			{	
				if(self.rise){self.rise = false; self.frame = self.animatestates[character].walk.split(' ');
					self.frameduration = 1;
					self.currentframe = self.frame[0];
				}
				if(self.dead){self.stopanimation = true; g_Gamestates.setcurrentstate(g_Gamestates.getexistingstates().END); return;}
				self.currentframe = self.frame[0];
			}
		}
	}

	var gravityvalue = 0.5;

	this.gravity=function(){
		
		self.velocity.y -= gravityvalue;

		if(self.velocity.y <= 0){
		self.down(self.velocity.y*-1);
		}else{
			if(self.hit)return;
			self.up(self.velocity.y);
		}
	}

	this.down=function(velocity){
		//if(self.slope)return;
		
		for(var i=0;i<velocity;i++){

			if(!tilecollision(self.pos.x,(self.pos.y+1),function(){clickamount = debug?99999:2;})){

				if(!slopecollision(self.pos.x,self.pos.y)){

					if(g_Level.isYCenter(g_Player.pos.y)){g_Level.viewDown();}

					self.pos.y ++; 
				
					if(self.slope){
						self.isjump = false;
					}
				}
			}else{
				clicks = 0;
				self.velocity.y = 0;
				self.isjump = false;
			}
		}
	}


	this.up=function(velocity){

		for(var i=0;i<velocity;i++){
			
			if(!tilecollision(self.pos.x,(self.pos.y-1))){

				if(((self.pos.y-1)) > 0){
					if(g_Level.isYCenter(g_Player.pos.y)){g_Level.viewUp();}
					self.pos.y --;	
				}else{
					self.velocity.y = 0;
				}
			}else{
				self.velocity.y = 0;
			}
		}
	}

	this.jump=function(){

		if(self.dead || self.rise || self.hit || clicks >= clickamount) return;
		self.isjump = true;
		self.velocity.y = 10;
		clicks++;
	}

	this.move=function(){
		if(self.rise || self.dead || self.hit) return;
		
		//updateSpeed();

		if(self.isjump){
			if(self.velocity.x > 6.5)self.velocity.x-= 0.05;
		}else
			if(!self.slope){
				self.velocity.x = 7;
			}
		
		for(var i=0;i<self.velocity.x;i++){

			if(!tilecollision(self.pos.x+1,(self.pos.y),function(){clickamount=999999;})){
				slopecollision(self.pos.x,self.pos.y);

					clickamount=2;
					if(g_Level.isXCenter(g_Player.pos.x)){g_Level.viewRight();}
					self.pos.x ++;
			}
		}
	}

	/**** DEBUG OBJECTS ****/
	this.movestate = 0;
	this.manualmove=function(){
		if(self.movestate == 2){

			for(var i = 0; i < 3; i++){
				if(!tilecollision(self.pos.x+1,(self.pos.y))){
					slopecollision(self.pos.x,self.pos.y);
					if(g_Level.isXCenter(g_Player.pos.x)){g_Level.viewRight();}
					self.pos.x ++;
				}
			}
			return;
		}
		if(self.movestate == 1){
			for(var i = 0; i < 3; i++){
				if(!tilecollision(self.pos.x-1,(self.pos.y))){
					if(g_Level.isXCenter(g_Player.pos.x)){g_Level.viewRight();}
					self.pos.x --;
				}
			}
		}
		if(self.movestate == 4){
			if(!tilecollision(self.pos.x,(self.pos.y+3))){
				self.pos.y +=3;
				return;
			}
		}
		if(self.movestate == 3){
			if(!tilecollision(self.pos.x,(self.pos.y-3))){
				self.pos.y -=3;
				return;
			}
		}
	}

	/*************************/

	this.getscore=function(){
		return score;
	}
	this.incrementscore=function(){
		score++;
	}

	var updateSpeed=function(){
		if(g_Utilities.getcurrenttick() % 10 == 0 && updatevel != g_Utilities.getcurrenttick()){
			//self.velocity.x ++;

			updatevel = g_Utilities.getcurrenttick();
		}
	}

	
	

	var slopecollision=function(xpos,ypos,dir){

		var playerline1 = new Vector(self.pos.x+self.offset,self.pos.y+self.offset);
		var playerline2 = new Vector((self.pos.x+self.offset)+self.boundingbox.x,self.pos.y+self.offset);
		var playerline3 = new Vector(self.pos.x+self.offset,(self.pos.y+self.offset)+self.boundingbox.y);
		var playerline4 = new Vector((self.pos.x+self.offset)+self.boundingbox.x,(self.pos.y+self.offset)+self.boundingbox.y);


		for(var i = 0; i < slopes.length; i++){

			if(!slopes[i].collisioncheck)continue;


			if((slopes[i].position.y+slopes[i].boundingboxoffset.y) < (ypos+self.offset) + (self.boundingbox.y) &&
					slopes[i].boundingbox.y + (slopes[i].position.y+slopes[i].boundingboxoffset.y) > (ypos+self.offset)&&
				(slopes[i].position.x+slopes[i].boundingboxoffset.x) < (xpos+self.offset) + self.boundingbox.x &&
					(slopes[i].position.x+slopes[i].boundingboxoffset.x) + slopes[i].boundingbox.x > (xpos+self.offset) 

					){

						if(isOutside(slopes[i].slopeline1.x,slopes[i].slopeline1.y,slopes[i].slopeline2.x,slopes[i].slopeline2.y,
							[[playerline1.x,playerline1.y],[playerline2.x,playerline2.y],[playerline3.x,playerline3.y],[playerline4.x,playerline4.y]])){
							 self.slope=true; 

							if(slopes[i].offset === 7 || slopes[i].offset === 18 || slopes[i].offset === 19){
								if(self.velocity.x > 6)self.velocity.x-= 0.05;
				 				if(slopes[i].offset === 18 || slopes[i].offset === 19){lerp(30*-1);}else{lerp(45*-1);} 
				 				self.up(1); 
						 	}else{
						 		if(self.velocity.x < 8)self.velocity.x+= 0.05;
						 		if(slopes[i].offset === 16 || slopes[i].offset === 15){lerp(30);}else{lerp(45);}
						 	}

						 	if(!self.isjump)self.velocity.y = -10;
						 	return true;
						}
						return false;

			}
		}
		if(self.slope && !self.isjump)self.velocity.x = 7;
		self.slope = false;
		return false;
	};





var isOutside=function(ax,ay,bx,by,prr){
	for(var l=prr.length,i=0,s,t;i<l;i++){
		t=((prr[i][0]-ax)*(by-ay)/(bx-ax)+ay-prr[i][1]);
	if(!t) return !0; t=t>0?1:-1; if(i&&t!=s) return !0; s=t;
	}return !1;
}








	var lerp = function(target){
		if(rotateamount == target)return;
 		rotateamount += ( target - rotateamount ) * 0.1;
	}
	var lerpmove=function(target){
		if(g_Player.pos.y == target)return;
 		g_Player.pos.y += ( target - g_Player.pos.y ) * 0.5;
	};

	var tilecollision=function(xpos,ypos,callback){
		if(self.dead || self.slope)return;

		for(var i = 0; i < statictiles.length; i++){

			if(!statictiles[i].collisioncheck)continue;


			if((statictiles[i].position.x+statictiles[i].boundingboxoffset.x) < (xpos+g_Player.offset) + g_Player.boundingbox.x &&
				(statictiles[i].position.x+statictiles[i].boundingboxoffset.x) + statictiles[i].boundingbox.x > (xpos+g_Player.offset) &&
				(statictiles[i].position.y+statictiles[i].boundingboxoffset.y) < (ypos+(g_Player.offset)) + g_Player.boundingbox.y &&
				statictiles[i].boundingbox.y + (statictiles[i].position.y+statictiles[i].boundingboxoffset.y) > (ypos+(g_Player.offset))) {
					// collision detected!
					if(statictiles[i].tag == 'platform'){
						if(((g_Player.pos.y) + g_Player.boundingbox.y) <= statictiles[i].position.y+statictiles[i].tileoffset.y){return true;}else{continue;}
					}
					if(statictiles[i].tag == 'wall'){if(callback)callback();}

					return true;
			}
		}
		return false;
	}

	this.restart=function(){
		self.pos.x=_x;
		score = 0;
		self.pos.y = _y;
		self.temp.x = 100;
		self.temp.y = 100;
		self.velocity.x = 7;
		self.velocity.y = 0;
		self.dead = false;
		self.rise = true;
		self.isjump = false;
		self.frameduration = 2;
		self.stopanimation = false;
		updatevel = 0;
		self.frame = self.animatestates[character].rise.split(' ');
		self.currentframe = self.frame[0];
		self.framedelay = 0;
		self.slope = false;
		spells = [];
		self.collisioncheck = true;
		self.invulnerable = false;
		self.hit = false;
		hittimer = 0;
		hitcount = 1;
		invulnerabletimer = 0;
		invulnerablecount = 3;
		clicks = 0;
	}


}

function Coin(x,y){
	this.position = new Vector(x,y);
	this.dimensions = new Vector(15,15);
	var self = this;

	this.currentframe = 0;
	this.maxframe = 4;
	this.framedelay = 0;
	this.frameduration = 4;
	this.collisioncheck = false;

	this.update=function(){

	}
	this.missed=function(){
		if(((self.position.x + self.dimensions.x)-g_Level.getviewport().x) <= 0){
			self.respawn();
		}
	}
	this.respawn=function(){
		self.position.x = Math.floor(Math.random() * (canvas.width*2)) + canvas.width;
		self.position.x += g_Level.getviewport().x;
		self.position.y = Math.floor(Math.random() * (canvas.height-(self.dimensions.y*4)));
		self.position.y += g_Level.getviewport().y

		console.log('respawn');
	}
	this.move=function(){
		self.position.x = -1000;
	}
	this.render=function(image){
		if(self.position.x >= (canvas.width+g_Level.getviewport().x) || ((self.position.x+self.dimensions.x) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return; }
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }

		self.collisioncheck = true;

		self.updateanimate();
		ctx.drawImage(image,35*self.currentframe,0,35,35,self.position.x - g_Level.getviewport().x,self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
	}
	this.updateanimate=function(){ 
		if(self.framedelay++ > self.frameduration)
		{
			self.framedelay = 0;
			self.currentframe++;

			if(self.currentframe >= self.maxframe)
			{	
				self.currentframe = 0;
			}
		}
	}
}
function restartCoin(){
	for(var i = 0; i < coins.length; i++){
		coins[i].position.x = -1000; 
	}
	//coins[0].respawn();
}

function Utilities(){
	var fps = 60,
    previous = 0,
    frameDuration = 1000 / fps,
    lag = 0,
    currenttick = 0,
    previoustick = 0;

    this.getfps=function(){
    	return fps;
    }
    this.getprevious=function(){
    	return previous;
    }
    this.setprevious=function(_previous){
    	previous = _previous;
    }
    this.getframeduration=function(){
    	return frameDuration;
    }
    this.getlag=function(){
    	return lag;
    }
    this.setlag=function(_lag){
    	lag += _lag;
    }
    this.decreaselag=function(){
    	lag--;
    }
    this.getcurrenttick=function(){
    	return currenttick/60 | 0;
    }
    this.setcurrenttick=function(){
    	currenttick++;
    }
    this.overridecurrenttick=function(num){
    	currenttick = num*60;
    }
    this.setprevioustick=function(num){
    	previoustick = num;
    }
    this.getprevioustick=function(){
    	return previoustick;
    }

    var deltathen = Date.now();
    var deltanow = 0;

    this.setdelta=function(ts){
    	deltathen = deltanow;
    	deltanow = ts;
    }
    this.getdelta=function(){
    	return (deltanow-deltathen)/1000;
    }

   


    this.restart=function(){
		fps = 60;
		previous = 0;
		frameDuration = 1000 / fps;
		lag = 0;
		currenttick = 0;
    }

    return this;
}

function Gamestates(){
	var existingstates={
		MAINMENU: 0,
		PLAY: 1,
		PAUSE: 2,
		END: 3
	}

	var currentstate = existingstates.MAINMENU;

	this.setcurrentstate=function(_state){
		currentstate = _state;
	}
	this.getcurrentstate=function(){
		return currentstate;
	}
	this.getexistingstates=function(){
		return existingstates;
	}

	this.restart=function(){
		currentstate = existingstates.MAINMENU;
	}

}

function Tick(){

	var now = Date.now();
    var dt = g_Utilities.getcurrenttick() - g_Utilities.getprevious()/1000;
    g_Utilities.setprevious(now)

    return dt;
}

function UI(){

	var pauseimage = new Image();
	pauseimage.src = 'img/pause.svg';

	var button = new Image();
	button.src = 'img/mysterybox.png';

	
	var charindi = new Image();
	charindi.src = 'img/charindi.png';

	var charindi2 = new Image();
	charindi2.src = 'img/charindi2.png';

	var charindi3 = new Image();
	charindi3.src = 'img/charindi3.png';


	var indistates=[{
		image:charindi
	},
	{
		image:charindi2
	},
	{
		image:charindi3
	}]



	var uielements=[{ //pause
		image:pauseimage,
		text:'no',
		position:new Vector(canvas.width-64,16),
		dimensions:new Vector(64,32),
		callback:function(){if(g_Gamestates.getcurrentstate() != g_Gamestates.getexistingstates().PAUSE){
			g_Utilities.setprevioustick(g_Utilities.getcurrenttick());
			g_Gamestates.setcurrentstate(g_Gamestates.getexistingstates().PAUSE);
		}else{
			g_Utilities.overridecurrenttick(g_Utilities.getprevioustick());
			g_Gamestates.setcurrentstate(g_Gamestates.getexistingstates().MAINMENU);
		}},
		update:function(i){
			
		},
		render:function(i){
			ctx.drawImage(uielements[i].image,uielements[i].position.x,uielements[i].position.y,uielements[i].dimensions.x,uielements[i].dimensions.y);
		},
		collideable:true
	},
	{
		image:'',
		text:'yes',
		fontsize:'50px',
		fontfamily:'Georgia',
		color:'green',
		position:new Vector(10,40),
		dimensions:new Vector(64,32),
		callback:function(){return g_Utilities.getcurrenttick();},
		update:function(i){
			
		},
		render:function(i){
			ctx.font=uielements[i].fontsize+' '+uielements[i].fontfamily;
			ctx.fillStyle=uielements[i].color;
			ctx.fillText(uielements[i].callback(),uielements[i].position.x,uielements[i].position.y);
		},
		collideable:false
	},
	{
		image:'',
		text:'yes',
		fontsize:'50px',
		fontfamily:'Georgia',
		color:'red',
		position:new Vector(10,90),
		dimensions:new Vector(64,32),
		callback:function(){return g_Player.getscore();},
		update:function(i){
			
		},
		render:function(i){
			ctx.font=uielements[i].fontsize+' '+uielements[i].fontfamily;
			ctx.fillStyle=uielements[i].color;
			ctx.fillText(uielements[i].callback(),uielements[i].position.x,uielements[i].position.y);
		},
		collideable:false
	},
	{   // SPELLS
		image:button,
		text:'no',
		position:new Vector(16,canvas.height-80),
		dimensions:new Vector(64,64),
		callback:function(){console.log('User wants to cast spell'); g_Player.castSpell();},
		update:function(i){
			
		},
		render:function(i){
			ctx.drawImage(uielements[i].image,uielements[i].position.x,uielements[i].position.y,uielements[i].dimensions.x,uielements[i].dimensions.y);
		},
		collideable:true
	},
	{   // JUMP
		image:button,
		text:'no',
		position:new Vector(canvas.width-80,canvas.height-80),
		dimensions:new Vector(64,64),
		callback:function(){
			if(!isMobile)return; g_Player.jump();Restart();
		},
		update:function(i){
			
		},
		render:function(i){
			ctx.drawImage(uielements[i].image,uielements[i].position.x,uielements[i].position.y,uielements[i].dimensions.x,uielements[i].dimensions.y);
		},
		collideable:true
	},
	{  //chars
		text:'no',
		dimensions:new Vector(64,64),
		callback:function(){
			
		},
		update:function(i){
		},
		render:function(j){
			for(var i = 0; i < remotePlayers.length; i++){
				var x = remotePlayers[i].pos.x+16;
				var y = remotePlayers[i].pos.y-64;
				var rotateamount = 0;

				if(remotePlayers[i] !== g_Player){
					if(remotePlayers[i].pos.x - g_Level.getviewport().x < 0){
						x = 0 + g_Level.getviewport().x;
						rotateamount = 90;
					}
					if(remotePlayers[i].pos.x+(remotePlayers[i].boundingbox.x) - g_Level.getviewport().x >= canvas.width){
						x = (canvas.width-64) + g_Level.getviewport().x;
						rotateamount = -90;
					}
					if(remotePlayers[i].pos.y - g_Level.getviewport().y >= canvas.height){
						y = (canvas.height-64) + g_Level.getviewport().y;
						rotateamount = 0;
					}
					if(remotePlayers[i].pos.y-remotePlayers[i].boundingbox.y - g_Level.getviewport().y <= 0){
						y = 0 + g_Level.getviewport().y;
						rotateamount = 180;
					}
				}
				
				ctx.save();
				ctx.translate((x+(uielements[j].dimensions.x/2)) - g_Level.getviewport().x,(y+(uielements[j].dimensions.y/2)) - g_Level.getviewport().y);
	    		ctx.rotate(rotateamount*Math.PI/180);
	    		ctx.drawImage(indistates[remotePlayers[i].getcharacter()].image,-uielements[j].dimensions.x/2,-uielements[j].dimensions.y/2,uielements[j].dimensions.x,uielements[j].dimensions.y);
	  			ctx.restore();
				//ctx.drawImage(uielements[j].image,(x)-g_Level.getviewport().x,(y)-g_Level.getviewport().y,uielements[j].dimensions.x,uielements[j].dimensions.y);
			}

			ctx.save();
				ctx.translate(((g_Player.pos.x+16)+(uielements[j].dimensions.x/2)) - g_Level.getviewport().x,((g_Player.pos.y-64)+(uielements[j].dimensions.y/2)) - g_Level.getviewport().y);
	    		ctx.rotate(0*Math.PI/180);
	    		ctx.drawImage(indistates[g_Player.getcharacter()].image,-uielements[j].dimensions.x/2,-uielements[j].dimensions.y/2,uielements[j].dimensions.x,uielements[j].dimensions.y);
  			ctx.restore();

		},
		collideable:false
	}];


	




	this.update=function(){
		for(var i = 0; i < uielements.length; i++){
			uielements[i].update(i);
		}
	}
	this.render=function(){
		for(var i = 0; i < uielements.length; i++){
			ctx.save();
			uielements[i].render(i);
			ctx.restore();
		}
	}


	this.collision=function(x,y){
		for(var i = 0; i < uielements.length; i++){
			if(!uielements[i].collideable) continue;

			if(uielements[i].position.x < (x) + 64 &&
			uielements[i].position.x + uielements[i].dimensions.x > (x) &&
			uielements[i].position.y < y + 64 &&
			uielements[i].dimensions.x + uielements[i].position.y > y) {
				//HIT UI ELEMENT
				uielements[i].callback();
			}
		}
	}

}

function MysteryBox(x,y,_imageoffset){
	this.position = new Vector(x,y);
	this.dimensions = new Vector(128,128);
	this.offset = 0;
	this.boundingbox = new Vector(96,96);
	this.collisioncheck = false;
	var self = this;
	var imageoffset = _imageoffset

	this.previousTick = 0;
	this.disabled = false;

	this.update=function(){
		if(!self.disabled) return;

		if((self.previousTick+2) <= g_Utilities.getcurrenttick()){
			self.disabled = false;
		}
	}
	this.render=function(box){
		if(self.position.x >= (canvas.width+g_Level.getviewport().x) || ((self.position.x+self.dimensions.x) - g_Level.getviewport().x) <= 0){self.collisioncheck = false; return;}
		if(self.position.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.position.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){self.collisioncheck = false; return; }
		self.collisioncheck = true;

		//ctx.drawImage(box,self.position.x - g_Level.getviewport().x,self.position.y - g_Level.getviewport().y,self.dimensions.x,self.dimensions.y);
		ctx.drawImage(box,128*imageoffset,0,128,128,self.position.x - g_Level.getviewport().x,self.position.y - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
	   

		if(debug)ctx.save();
		if(debug)ctx.rect((self.position.x+self.offset) - g_Level.getviewport().x,(self.position.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
		if(debug)ctx.stroke();
		if(debug)ctx.restore();

	}
} 



function Vector(x,y){
	this.x = x || 0;
	this.y = y || 0;

	this.add=function(vec1,vec2){
		return new Vector(vec1.x+vec2.x,vec1.y+vec2.y);
	}
	this.sub=function(vec1,vec2){
		return new Vector(vec2.x-vec1.x,vec2.y-vec1.y);
	}
	this.magnitude=function(vec1){
		 return Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
	}
	this.dot=function(vec1,vec2){
		return Math.sqrt((vec1.x*vec2.x)+(vec1.y*vec2.y));
	}

}

function Restart(){
	if(g_Gamestates.getcurrentstate() != g_Gamestates.getexistingstates().END) return;
	g_Player.restart();
	restartBots();
	g_Level.restart();
	//RestartTrap();
	g_Utilities.restart();
	g_Gamestates.restart();
	//restartCoin();
	removeSpells();
}

document.onkeydown=function(e){
	if(g_Gamestates.getcurrentstate() == g_Gamestates.getexistingstates().END) return;

	switch(e.which){
		case 32:
		if(g_Player.dead)return; 
		if(g_Gamestates.getcurrentstate() == g_Gamestates.getexistingstates().MAINMENU){
			g_Utilities.setprevioustick(g_Utilities.getcurrenttick());
			g_Gamestates.setcurrentstate(g_Gamestates.getexistingstates().PAUSE);
		}else
		{	
			g_Utilities.overridecurrenttick(g_Utilities.getprevioustick());
			g_Gamestates.setcurrentstate(g_Gamestates.getexistingstates().MAINMENU);
		}
		break;

		case 87://w
		{
			g_Player.movestate = 3;
			break;
		}
		case 83://s
		{
			g_Player.movestate = 4;
			break;
		}
		case 68://d
		{
			g_Player.movestate = 2;
			break;
		}
		case 65://a
		{
			g_Player.movestate = 1;
			break;
		}


	}
}

document.onkeyup=function(e){
	if(!debug)return;

	switch(e.which){
		case 87://w
		{
			g_Player.movestate = 0;
			break;
		}
		case 83://s
		{
			g_Player.movestate = 0;
			break;
		}
		case 68://d
		{
			g_Player.movestate = 0;
			break;
		}
		case 65://a
		{
			g_Player.movestate = 0;
			break;
		}
	}
}



/**** CODE FOR BOTS ****/
function Bot(_x,_y){
	var self = this;
	this.pos = new Vector(_x,_y);
	this.temp = new Vector(100,100);
	this.dimensions = new Vector(80,80);//(96,96);
	this.boundingbox = new Vector(44,60);//(50,68);
	var spells = [];

	var score = 0;

	this.tag = 'Bot';

	this.velocity = new Vector(7,0);
	this.frame = [];
	this.dead = false;
	this.rise = true;
	this.isjump = false;
	this.frameduration = 2;
	this.stopanimation = false;
	var updatevel = 0;
	this.offset = 17;//23;
	this.slope = false;
	var character = parseInt(Math.random() * (3-0)+0);
	this.collisioncheck = true;

	this.invulnerable = false;
	var invulnerabletimer = 0;
	var invulnerablecount = 3;

	this.hit = false;
	var hittimer = 0;
	var hitcount = 1;

	this.addSpell=function(_spell){
		console.log('Adding spell...');
		spells.push(_spell);
	};
	this.removeSpell=function(){
		spells.pop();
		console.log('Removing the spells, you now have: ' + spells.length);
	}
	this.castSpell=function(){
		if(spells.length <= 0 || self.dead || self.hit)return;
		console.log('Casting spell...');
		g_Spells.attack(this,spells[0]);
	}
	
	this.setcharacter=function(_char){
		character = _char;
	}
	this.getcharacter=function(){
		return character;
	}

	this.receiveDamage=function(){
		if(self.invulnerable) return;

		self.hit = true;
		self.invulnerable = true;
		hittimer = g_Utilities.getcurrenttick()+hitcount;
		invulnerabletimer = g_Utilities.getcurrenttick()+invulnerablecount;
	}

	this.animatestates=[{
		attack:'0 1 2 3 4 5 6 7',
		dead:'8 9 10 11 12',
		idle:'13 14 15 16 17 18',
		rise:'19 20 21 22 23 24 25 26',
		walk:'27 28 29 30 31 32 33 34 35 36 37 38 39',
		hit:'8 9 10 11 12',
		size:150
	},
	{
		attack:'0 1 2 3 4 5 6',
		dead:'7 8 9 10 11',
		idle:'12 13 14 15 16 17',
		rise:'18 19 20 21 22 23 24 25',
		walk:'26 27 28 29 30 31 32 33 34 35 36 37 38 39',
		size:160
	},
	{
		attack:'0 1 2 3 4 5 6 7',
		dead:'8 9 10 11 12',
		idle:'17 18 19 20 21 22',
		rise:'23 24 25 26 27 28 29 30',
		walk:'31 32 33 34 35 36 37 38 39 40 41 42 43 44',
		size:160
	},
	{

	}];


	
	self.frame = self.animatestates[character].rise.split(' ');
	this.currentframe = self.frame[0];
	this.framedelay = 0;
	this.previousTick = g_Utilities.getcurrenttick();
	var timeoffset = 3;
	this.update=function(){
	
		if((self.previousTick+timeoffset) <= g_Utilities.getcurrenttick()){self.previousTick=g_Utilities.getcurrenttick(); botlogic.box(); if(parseInt((Math.random() * (3-1)+1)) === 2)botlogic.randomjump();}
		if(self.invulnerable && (invulnerabletimer) <= g_Utilities.getcurrenttick()){self.invulnerable = false;}
		if(self.hit && (hittimer) <= g_Utilities.getcurrenttick()){self.hit = false;}


		if(!debug){self.move();}else{self.manualmove();}

		self.gravity();
	}

	var rotateamount = 0;

	this.render=function(){

		if(self.pos.x >= (canvas.width+g_Level.getviewport().x) || ((self.pos.x+self.dimensions.x) - g_Level.getviewport().x) <= 0){return;}
		if(self.pos.y >= ((canvas.height+g_Level.getviewport().y)) || (((self.pos.y+self.dimensions.y)) - g_Level.getviewport().y) <= 0){return;}

		self.updateanimate();
		if(!self.slope)lerp(0);

		//rotate char if needed
	    ctx.save();
	    if(self.invulnerable){ctx.globalAlpha = 0.3;}else{ctx.globalAlpha = 1.0;}
	    ctx.translate((self.pos.x+(self.dimensions.x/2)) - g_Level.getviewport().x,(self.pos.y+(self.dimensions.y/2)) - g_Level.getviewport().y);
	    ctx.rotate(rotateamount*Math.PI/180);
	    ctx.drawImage(g_Player.animatestates[character].image,self.animatestates[character].size*self.currentframe,0,self.animatestates[character].size,self.animatestates[character].size,-self.dimensions.x/2,-self.dimensions.y/2,self.dimensions.x,self.dimensions.y);
	    ctx.restore();


	//	if(debug)ctx.save();
	//	if(debug)ctx.rect((self.pos.x+self.offset) - g_Level.getviewport().x,(self.pos.y+self.offset) - g_Level.getviewport().y,self.boundingbox.x,self.boundingbox.y);
	//	if(debug)ctx.stroke();
	//	if(debug)ctx.restore();
	}

	this.checkdead=function(){
		if(!self.dead){
			self.frame = self.animatestates[character].dead.split(' ');
			self.frameduration = 1;
			self.currentframe = self.frame[0];
			self.dead = true;
			self.isjump = false;
		}
	}
	this.updateanimate=function(){ 

		if(self.framedelay++ > self.frameduration && !self.stopanimation && !self.isjump)
		{
			self.framedelay = 0;
			self.currentframe++;

			if(self.currentframe >= self.frame[self.frame.length-1])
			{	
				if(self.rise){self.rise = false; self.frame = self.animatestates[character].walk.split(' ');
					self.frameduration = 1;
					self.currentframe = self.frame[0];
				}
				if(self.dead){self.stopanimation = true; return;}
				self.currentframe = self.frame[0];
			}
		}
	}

	var gravityvalue = 0.5;

	this.gravity=function(){
		
		self.velocity.y -= gravityvalue;

		if(self.velocity.y <= 0){
			self.down(self.velocity.y*-1);
		}else{
			if(self.hit)return;
			self.up(self.velocity.y);
		}
	}

	this.down=function(velocity){
		//if(self.slope)return;
		
		for(var i=0;i<velocity;i++){

			if(!tilecollision(self.pos.x,(self.pos.y+1))){

				if(!slopecollision(self.pos.x,self.pos.y)){

					self.pos.y ++; 
				
					if(self.slope){
						self.isjump = false;
					}
				}
			}else{
				clicks = 0;
				self.velocity.y = 0;
				self.isjump = false;
			}
		}
	}


	this.up=function(velocity){
		
		for(var i=0;i<velocity;i++){
			
			if(!tilecollision(self.pos.x,(self.pos.y-1))){

				if(((self.pos.y-1)) > 0){
					self.pos.y --;	
				}else{
					self.velocity.y = 0;
				}
			}else{
				self.velocity.y = 0;
			}
		}
	}

	this.jump=function(){
		if(self.dead || self.rise || self.hit) return;
		self.isjump = true;
		self.velocity.y = 10;
	}

	this.move=function(){
		if(self.rise || self.dead || self.hit) return;
		//updateSpeed();

		if(self.isjump){
			if(self.velocity.x > 6.5)self.velocity.x-= 0.05;
		}else
			if(!self.slope){
				self.velocity.x = 7;
			}

		for(var i=0;i<self.velocity.x;i++){
			
			if(!tilecollision(self.pos.x+1,(self.pos.y),function(){botlogic.wall();})){
				slopecollision(self.pos.x,self.pos.y);
				self.pos.x ++;
			}
		}
	}



	/**** DEBUG OBJECTS ****/
	this.movestate = 0;
	this.manualmove=function(){
		slopecollision(self.pos.x,self.pos.y);
		if(self.movestate == 2){
			self.pos.x += 3;
			return;
		}
		if(self.movestate == 1){
			self.pos.x -= 3;
			return;
		}
		if(self.movestate == 4){
			self.pos.y +=3;
			return;
		}
		if(self.movestate == 3){
			self.pos.y -=3;
			return;
		}
	}

	/*************************/

	this.getscore=function(){
		return score;
	}
	this.incrementscore=function(){
		score++;
	}

	var updateSpeed=function(){
		if(g_Utilities.getcurrenttick() % 10 == 0 && updatevel != g_Utilities.getcurrenttick()){
			//self.velocity.x ++;

			updatevel = g_Utilities.getcurrenttick();
		}
	}

	
var slopecollision=function(xpos,ypos,dir){
		var playerline1 = new Vector(self.pos.x+self.offset,self.pos.y+self.offset);
		var playerline2 = new Vector((self.pos.x+self.offset)+self.boundingbox.x,self.pos.y+self.offset);
		var playerline3 = new Vector(self.pos.x+self.offset,(self.pos.y+self.offset)+self.boundingbox.y);
		var playerline4 = new Vector((self.pos.x+self.offset)+self.boundingbox.x,(self.pos.y+self.offset)+self.boundingbox.y);

		for(var i = 0; i < slopes.length; i++){

			if(!slopes[i].collisioncheck)continue;

			if((slopes[i].position.y+slopes[i].boundingboxoffset.y) < (ypos+self.offset) + (self.boundingbox.y) &&
					slopes[i].boundingbox.y + (slopes[i].position.y+slopes[i].boundingboxoffset.y) > (ypos+self.offset)&&
				(slopes[i].position.x+slopes[i].boundingboxoffset.x) < (xpos+self.offset) + self.boundingbox.x &&
					(slopes[i].position.x+slopes[i].boundingboxoffset.x) + slopes[i].boundingbox.x > (xpos+self.offset) 

					){

			
						if(isOutside(slopes[i].slopeline1.x,slopes[i].slopeline1.y,slopes[i].slopeline2.x,slopes[i].slopeline2.y,
							[[playerline1.x,playerline1.y],[playerline2.x,playerline2.y],[playerline3.x,playerline3.y],[playerline4.x,playerline4.y]])){
							 self.slope=true; 

							if(slopes[i].offset === 7 || slopes[i].offset === 18 || slopes[i].offset === 19){
								if(self.velocity.x > 6)self.velocity.x-= 0.05;
				 				if(slopes[i].offset === 18 || slopes[i].offset === 19){lerp(30*-1);}else{lerp(45*-1);} 
				 				self.up(1); 
						 	}else{
						 		if(self.velocity.x < 8)self.velocity.x+= 0.05;
						 		if(slopes[i].offset === 16 || slopes[i].offset === 15){lerp(30);}else{lerp(45);}
						 	} 
						 	if(!self.isjump)self.velocity.y = -10;
						 	return true;
						}
						return false;

			}
		}
		if(self.slope && !self.isjump)self.velocity.x = 7;

		self.slope = false;
		return false;
	};

	var isOutside=function(ax,ay,bx,by,prr){
		for(var l=prr.length,i=0,s,t;i<l;i++){
			t=((prr[i][0]-ax)*(by-ay)/(bx-ax)+ay-prr[i][1]);
		if(!t) return !0; t=t>0?1:-1; if(i&&t!=s) return !0; s=t;
		}return !1;
	}


	var lerp = function(target){
		if(rotateamount == target)return;
 		rotateamount += ( target - rotateamount ) * 0.1;
	}
	var lerpmove=function(target){
		if(self.pos.y == target)return;
 		self.pos.y += ( target - self.pos.y ) * 0.5;
	};

	var tilecollision=function(xpos,ypos,callback){
		if(self.dead || self.slope)return;

		for(var i = 0; i < statictiles.length; i++){

		//	if(!statictiles[i].collisioncheck)continue;

			if((statictiles[i].position.x+statictiles[i].boundingboxoffset.x) < (xpos+self.offset) + self.boundingbox.x &&
				(statictiles[i].position.x+statictiles[i].boundingboxoffset.x) + statictiles[i].boundingbox.x > (xpos+self.offset) &&
				(statictiles[i].position.y+statictiles[i].boundingboxoffset.y) < (ypos+(self.offset)) + self.boundingbox.y &&
				statictiles[i].boundingbox.y + (statictiles[i].position.y+statictiles[i].boundingboxoffset.y) > (ypos+(self.offset))) {
					// collision detected!
					if(statictiles[i].tag == 'platform'){
						if(((self.pos.y) + self.boundingbox.y) <= statictiles[i].position.y+statictiles[i].tileoffset.y){return true;}else{continue;}
					}
					if(callback != undefined)callback();
					return true;
			}
		}

		return false;
	}

	this.restart=function(){
		self.pos.x=_x;
		score = 0;
		self.pos.y = _y;
		self.temp.x = 100;
		self.temp.y = 100;
		self.velocity.x = 7;
		self.velocity.y = 0;
		self.dead = false;
		self.rise = true;
		self.isjump = false;
		self.frameduration = 2;
		self.stopanimation = false;
		updatevel = 0;
		self.frame = self.animatestates[character].rise.split(' ');
		self.currentframe = self.frame[0];
		self.framedelay = 0;
		self.slope = false;
		self.collisioncheck = true;
		self.invulnerable = false;
		self.hit = false;
		hittimer = 0;
		hitcount = 1;
		invulnerabletimer = 0;
		invulnerablecount = 3;
		spells = [];
		self.previousTick=g_Utilities.getcurrenttick();
	}

	var randindex = Math.random() * (100-16)+20;

	var botlogic={
		wall:function(){self.jump();},
		box:function(){self.castSpell();},
		randomjump:function(){self.jump();}
	};


}

function restartBots(){
	for(var i = 0; i < bots.length; i++){
		bots[i].restart(); 
	}
}


function Ray(x,y,dx,dy,lx,ly){
	var self = this;
	this.origin = new Vector(x,y);
	this.direction = new Vector(dx,dy);
	this.length = new Vector(lx,ly);

	this.raycast=function(){

		//console.log(((self.origin.x*self.direction.x)+self.length));

		for(var i = 0; i < statictiles.length; i++){

			if(!statictiles[i].collisioncheck)continue;

			if((statictiles[i].position.x+statictiles[i].boundingboxoffset.x) < ((self.origin.x*self.direction.x)+self.length.x) &&
				(statictiles[i].position.x+statictiles[i].boundingboxoffset.x) + statictiles[i].boundingbox.x > (self.origin.x*self.direction.x) &&
				(statictiles[i].position.y+statictiles[i].boundingboxoffset.y) < ((self.origin.y*self.direction.y)+self.length.y)&&
				statictiles[i].boundingbox.y + (statictiles[i].position.y+statictiles[i].boundingboxoffset.y) > (self.origin.y*self.direction.y)) {
					// collision detected!

					//if(statictiles[i].tag == 'wall'){if(callback)callback();}
					console.log('hit! RAY!');
					return true;
			}
		}

		return false;

	}
}

/*******Helper functions **********/

function init(){
	var tmpvct = new Vector(0,0);

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		canvas.addEventListener('touchstart',function(evt) {
			var mousePos = getTouchPos(canvas, evt);
			tmpvct.x = mousePos.x
			tmpvct.y = mousePos.y;
		 	g_UI.collision(tmpvct.x,tmpvct.y);
		},false);
		isMobile = true;
	}else{
		canvas.addEventListener("click", function(evt){
			var mousePos = getMousePos(canvas, evt);
			tmpvct.x = mousePos.x;
			tmpvct.y = mousePos.y;
			g_UI.collision(tmpvct.x,tmpvct.y); g_Player.jump();Restart();
		});
	}

	var getMousePos=function(canvas, evt) {
		var rect = canvas.getBoundingClientRect();

		var canvasW = canvas.offsetWidth;
		var canvasH = canvas.offsetHeight;

		return {
		  x: (evt.clientX - rect.left) + (1024-canvasW),
		  y: (evt.clientY - rect.top) + (512-canvasH)
		};
	};

	var getTouchPos=function(canvas,evt){
		var rect = canvas.getBoundingClientRect();

		var canvasW = canvas.offsetWidth;
		var canvasH = canvas.offsetHeight;

		return {
		  x: (evt.targetTouches[0].pageX - rect.left) + (1024-canvasW),
		  y: (evt.targetTouches[0].pageY  - rect.top) + (512-canvasH)
		};
	};
}

