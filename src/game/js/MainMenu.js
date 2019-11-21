var MainMenu = function(game) {

	this.music = null;
	this.playButton = null;
	this.btnBackgroundColor = 0xffff88; // when over in button
	this.background = null;

	this.create = function() {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		//this.music = this.add.audio('titleMusic');
		//this.music.play();
/*
		var text = "mainMenu";
        var style = { font: "24px Arial", fill: "#fff", align: "center" };
        var t = game.add.text(this.world.centerX, this.world.centerY, text, style);
		t.anchor.setTo(0.5, 0.5);
	*/	
		//this.add.sprite(0, 0, 'titlepage');

	this.playButton = this.add.button( game.world.centerX - 160, game.world.centerY - 100, 'btnPlay', this.startGame, this, 2, 1, 0);
	this.playButton.onInputOver.add(this.buttonOver, this);
    this.playButton.onInputOut.add(this.buttonOut, this);
    this.playButton.onInputUp.add(this.buttonUp, this);
	
	};

	this.update = function() {

		//	Do some nice funky main menu effect here

	};

	this.buttonOver = function(){
		console.log("buttonOver");
		this.playButton.scale.setTo(0.95, 0.95);
		this.playButton.tint = this.btnBackgroundColor;
	}

	this.buttonOut = function(){
		console.log("buttonOut");
		this.playButton.scale.setTo(1, 1);
		this.playButton.tint = 0xffffff;
	}

	this.buttonUp = function(){
		console.log("buttonUp");

	}

	this.startGame = function(pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		 this.state.start('Game');

	}

};