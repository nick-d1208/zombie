
var previous = 0;
var frameDuration = 1000/60;
var lag = 0;

var localPlayer,	// Local player
	remotePlayers,	// Remote players
	socket;			// Socket connection


	function Loop(timestamp){
		g_Utilities.setprevious(g_Utilities.getcurrenttick());
		g_Utilities.setcurrenttick();
		g_Utilities.setdelta(timestamp);


		requestAnimationFrame(Loop);

	/*	//Calcuate the time that has elapsed since the last frame
		if (!timestamp) timestamp = 0;
		var elapsed = timestamp - previous;


		//Optionally correct any unexpected huge gaps in the elapsed time
		if (elapsed > 1000) elapsed = frameDuration;


		//Add the elapsed time to the lag counter
		lag += elapsed;

		//Update the frame if the lag counter is greater than or
		//equal to the frame duration



		while (lag >= frameDuration) {  
		//Update the logic
		Update();


		//Reduce the lag counter by the frame duration
		lag -= frameDuration;
		
		}


		//Calculate the lag offset. This tells us how far
		//we are into the next frame
		var lagOffset = lag / frameDuration;


		//Render the sprites using the `lagOffset` to
		//extrapolate the sprites' positions
		
		//render(lagOffset);
		Render();

		//Capture the current time to be used as the previous
		//time in the next frame
		previous = timestamp;
		*/

		Update();
		Render();

	}

	function Update(){
		switch(g_Gamestates.getcurrentstate()){
				case g_Gamestates.getexistingstates().MAINMENU:
			
					for(var i=0;i<players.length;i++)players[i].update();
						//console.log('PLAYER: ' + g_Player.velocity.x + ' ' + 'RANDOM BOT: '+  bots[0].velocity.x);
					
					g_Level.update();
					g_UI.update();

			
				break;

				case g_Gamestates.getexistingstates().PLAY:
				break;

				case g_Gamestates.getexistingstates().PAUSE:
				break;

				case g_Gamestates.getexistingstates().END:
				break;
			}	
	}

	function Render(lagOffset){
		switch(g_Gamestates.getcurrentstate()){
				case g_Gamestates.getexistingstates().MAINMENU:
					if(debug)ctx.clearRect(0,0,1024,512);
					g_Level.render();
					g_Player.render();

					for(var i = 0; i < bots.length; i++)bots[i].render();

					/*REMOTE PLAYERS */
					var i;
					for(i = 0; i < remotePlayers.length; i++){
						ctx.save();
						remotePlayers[i].render();
						ctx.restore();
					}
					/* END */


					g_UI.render();
				break;

				case g_Gamestates.getexistingstates().PLAY:
				break;

				case g_Gamestates.getexistingstates().PAUSE:
				break;

				case g_Gamestates.getexistingstates().END:
				break;
			}	
	}



/*internet stoof */
function onSocketConnected() {
    console.log("Connected to socket server");

    socket.emit("new player", {x: g_Player.pos.x, y: g_Player.pos.y});
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x,data.y);
	
	newPlayer.id = data.id; //put this in the g_Player constructor!!
	// Add new player to the remote players array

	//change the positions of players and broadcast them to do a starting line!!
	remotePlayers.push(newPlayer);

	//newPlayer.spritenumber = remotePlayers.length;
};

function onMovePlayer(data) {

	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.pos.x=data.x;
	movePlayer.pos.y=data.y;
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};