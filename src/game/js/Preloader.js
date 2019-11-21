var Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	var ready = false;

	WebFontConfig = {

		//  'active' means all requested fonts have finished loading
		//  We set a 1 second delay before calling 'createText'.
		//  For some reason if we don't the browser cannot render the text the first time it's created.
	//	active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
	
		//  The Google Fonts we want to load (specify as many as you like in the array)
		google: {
		  families: ['Fredoka+One']
		}
	
	};

	this.preload = function() {

		// These are the assets we loaded in Boot.js
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		// Scale a sprite's width from 0 to 100%
		//this.load.setPreloadSprite(this.preloadBar);

		//Here we load the rest of the assets our game needs.
		//this.load.image('titlepage', 'images/title.jpg');
		//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		
		// font
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		// images
		this.load.image('bgScore', '.././images/bg-score.png');
		this.load.image('bigShadow', '.././images/big-shadow.png');
		this.load.image('btnPlay', '.././images/btn-play.png');
		this.load.image('btnSfx', '.././images/btn-sfx.png');
		this.load.image('donut', '.././images/donut.png');
		this.load.image('donutsLogo', '.././images/donuts_logo.png');
		this.load.image('textTimeup', '.././images/text-timeup.png');

	   // particles
		this.load.image('particleEx1', '.././images/particles/particle_ex1.png');
		this.load.image('particleEx2', '.././images/particles/particle_ex2.png');
		this.load.image('particleEx3', '.././images/particles/particle_ex3.png');
		this.load.image('particle1', '.././images/particles/particle-1.png');
		this.load.image('particle2', '.././images/particles/particle-2.png');
		this.load.image('particle3', '.././images/particles/particle-3.png');
		this.load.image('particle4', '.././images/particles/particle-4.png');
		this.load.image('particle5', '.././images/particles/particle-5.png');

	  // game
	   this.load.image('gem1', '.././images/game/gem-01.png');
	   this.load.image('gem2', '.././images/game/gem-02.png');
	   this.load.image('gem3', '.././images/game/gem-03.png');
	   this.load.image('gem4', '.././images/game/gem-04.png');
	   this.load.image('gem5', '.././images/game/gem-05.png');
	   this.load.image('gem6', '.././images/game/gem-06.png');
	   this.load.image('gem7', '.././images/game/gem-07.png');
	   this.load.image('gem8', '.././images/game/gem-08.png');
	   this.load.image('gem9', '.././images/game/gem-09.png');
	   this.load.image('gem10', '.././images/game/gem-10.png');
	   this.load.image('gem11', '.././images/game/gem-11.png');
	   this.load.image('gem12', '.././images/game/gem-12.png');
	   this.load.image('hand', '.././images/game/hand.png');
	   this.load.image('shadow', '.././images/game/shadow.png');
	  // backgrounds
	   this.load.image('background', '.././images/backgrounds/background.jpg');
	   
	// audio
	 this.load.audio('backgroundAudio', '.././audio/background.mp3');
	 this.load.audio('kill', '.././audio/kill.mp3');
	 this.load.audio('select1', '.././audio/select-1.mp3');
	 this.load.audio('select2', '.././audio/select-2.mp3');
	 this.load.audio('select3', '.././audio/select-3.mp3');
	 this.load.audio('select4', '.././audio/select-4.mp3');
	 this.load.audio('select5', '.././audio/select-5.mp3');
	 this.load.audio('select6', '.././audio/select-6.mp3');
	 this.load.audio('select7', '.././audio/select-7.mp3');
	 this.load.audio('select8', '.././audio/select-8.mp3');
	 this.load.audio('select9', '.././audio/select-9.mp3');


	};

	this.create = function() {

		// Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

		this.state.start('MainMenu');

	};

	this.update = function() {

		// You don't actually need to do this, but I find it gives a much smoother game experience.
		// Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		// You can jump right into the menu if you want and still play the music, but you'll have a few
		// seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		// it's best to wait for it to decode here first, then carry on.
		
		// If you don't have any music in your game then put the game.state.start line into the create function and delete
		// the update function completely.
		
		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
			//this.ready = true;
			//this.state.start('MainMenu');
		//}

	};

};