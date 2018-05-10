var SRD = SRD || {};

(function (){

	SRD.socket = io.connect ('http://127.0.0.1:8000/'); // IP:PORT
	SRD.socket.on ('person-moved',function(x,y,id){
		
		console.log (id +':('+x +':'+y+')');
		
		if(SceneManager._scene.constructor !==Scene_Map) return;
		SceneManager._scene.updateOnlinePlayer(x,y,id);


	});
	Scene_Map.prototype.updateOnlinePlayer= function (x,y ,id){
		if(!this._onlinePlayers){
			this._onlinePlayers={};
			this._onlineSprites={};
		}
			if(!this._onlinePlayers[id]){
			this._onlinePlayers[id]=new Game_OnlinePlayer(1,x,y);
			this._onlineSprites[id]= new Sprite_Character (this._onlinePlayers[id]);
			this._spriteset._tilemap.addChild(this._onlineSprites[id]);

		}
		this._onlinePlayers[id].setPosition(x,y);

	};
	var bla = Scene_Map.prototype.updateMain;
	Scene_Map.prototype.updateMain = function()
	{		
		bla.apply(this,arguments);
		if(!this._onlinePlayers) return;
		var active = this.isActive();
		for(var key in this._onlinePlayers){
			this._onlinePlayers[key].update(active);
			
		}
	};
	Game_Player.prototype.executeMove = function(direction) {
	    this.moveStraight(direction);
			SRD.socket.emit ('move',this.x,this.y);
	};

	function Game_OnlinePlayer()
	{
		this.initialize.apply (this,arguments);
		console.log ('ok');
	}
	Game_OnlinePlayer.prototype= Object.create(Game_Character.prototype);
	Game_OnlinePlayer.prototype.constructor = Game_OnlinePlayer;
	Game_OnlinePlayer.prototype.initialize= function (actorId,x,y)
	{
		Game_Character.prototype.initialize.call (this);
		this._actorId=actorId;
		this.locate(x,y);
		this.setPosition(x,y);
		this.refresh();
		
	};
	Game_OnlinePlayer.prototype.refresh= function()
	{
		var actor = $gameActors.actor(this._actorId);
		var characterName = actor ? actor.characterName() : '';
		var characterIndex=actor ? actor.characterIndex() : 0;
		this.setImage(characterName,characterIndex);
	};

	Game_OnlinePlayer.prototype.setPosition = function (x,y)
	{
	this._onlinePos=[x,y]	;
	};
	Game_OnlinePlayer.prototype.moveByInput=function (x,y)
	{
		if(!this.isMoving() && (this._x !== this._onlinePos[0] || this._y !== this._onlinePos[1]))
		{
			var x = this._onlinePos[0];
			var y = this._onlinePos[1];
			var direction = this.findDirectionTo(x,y);
			if(direction >0)
			{
				console.log();
				this.moveStraight(direction);
			}
		}
		
	};

	Game_OnlinePlayer.prototype.update = function (scenActive)
	{

		if(scenActive) this.moveByInput();
		Game_Character.prototype.update.call(this);
		
	};


})();