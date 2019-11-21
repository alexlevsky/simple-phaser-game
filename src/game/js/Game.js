var Game = function (game) {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    var add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    var camera;    //  a reference to the game camera (Phaser.Camera)
    var cache;     //  the game cache (Phaser.Cache)
    var input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    var load;      //  for preloading assets (Phaser.Loader)
    var math;      //  lots of useful common math operations (Phaser.Math)
    var sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    var stage;     //  the game stage (Phaser.Stage)
    var time;      //  the clock (Phaser.Time)
    var tweens;    //  the tween manager (Phaser.TweenManager)
    var state;     //  the state manager (Phaser.StateManager)
    var world;     //  the game world (Phaser.World)
    var particles; //  the particle manager (Phaser.Particles)
    var physics;   //  the physics manager (Phaser.Physics)
    var rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    var player;
    var gem2;
    var score;
    var back;
    var timer;
    var timeText;
    var bgScore;

var GEM_SIZE = 80;
var GEM_SPACING = 2;
var GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING;
var BOARD_COLS;
var BOARD_ROWS;
var SCORE = 0;
var MATCH_MIN = 3; // min number of same color gems required in a row to be considered a match

var THREE_IN_ROW_SCORE_AMOUNT = 60;
var FOUR_IN_ROW_SCORE_AMOUNT = 120;
var FIVE_IN_ROW_SCORE_AMOUNT =  180;

var TIMER_MINUTE = 0; // timer options
var TIMER_SECOND = 13;

var gemArray = [ { img: "gem1", color: "red" },
                 { img: "gem2", color: "blue" },
                 { img: "gem3", color: "green" }, 
                 { img: "gem4", color: "azure" },
                 { img: "gem5", color: "yellow" },
                 { img: "gem6", color: "pink" }          ];

var gems;
var selectedGem = null;
var selectedGemStartPos;
var selectedGemTween;
var tempShiftedGem = null;
var allowInput;
var scoreText;
    
	this.init = function(){
       var style = { font: "50px Arial", fill: "#fff", align: "center" };  //! score text
     scoreText = game.add.text( 200, 760, SCORE, style);
     scoreText.anchor.setTo(0.5, 0.5); 
        
	}
	
	this.create = function () {
       

      //  back = game.add.renderTexture(500, 500, 'background');
       back = game.add.sprite(0, 0, 'background');
       back.scale.setTo(0.52, 0.7);

       bgScore = game.add.sprite(230, 660, 'bgScore');

       backAudio = game.add.audio('backgroundAudio');
      // backAudio.autoplay = true;
       backAudio.loop = true;
       backAudio.play();

       kill = game.add.audio('kill');
       select1 = game.add.audio('select1');
       select2 = game.add.audio('select2');
       select3 = game.add.audio('select3');
       select4 = game.add.audio('select4');
       select5 = game.add.audio('select5');
       select6 = game.add.audio('select6');
       
       timer = game.time.create();
        
       // Create a delayed event 1m and 30s from now
       timerEvent = timer.add(Phaser.Timer.MINUTE * TIMER_MINUTE + Phaser.Timer.SECOND * TIMER_SECOND, this.endTimer, this);
       
       // Start the timer
       timer.start();
       timer.loop(1000, this.changeTimer, this);
        spawnBoard();
    
   
    // currently selected gem starting position. used to stop player form moving gems too far.
    selectedGemStartPos = { x: 0, y: 0 };
    
    // used to disable input while gems are dropping down and respawning
    allowInput = false; 

    game.input.addMoveCallback(slideGem, this);             
    
    
     hand = game.add.sprite(game.world.centerX, game.world.centerY, 'hand');
     hand.scale.setTo(0.7, 0.7);  // hand scale 
     game.physics.enable(hand, Phaser.Physics.ARCADE);
    
    
    
    };


    this.changeTimer = function () {
        var style = { font: "24px Arial", fill: "#fff", align: "center" };

        if (timer.running) {
          //  game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
          if(timeText)
            timeText.kill();
          timeText = game.add.text( 100, 760, this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), style);
          timeText.anchor.setTo(0.5, 0.5);
          
        }
        else {
          //  game.debug.text("time up !", 2, 14, "#0f0");
          timeText = game.add.text( 100, 760, "time up !", style);
          timeText.anchor.setTo(0.5, 0.5);
        }
    },

    this.formatTime = function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }

    this.endTimer = function() {
        // Stop the timer when the delayed event triggers
        timer.stop();
        game.add.sprite( game.world.centerX - 200, game.world.centerY - 100, 'textTimeup');
        allowInput = false;
    }

    this.update = function () {
      

         //!  If the sprite is > 8px away from the pointer then let's move to it
    if (game.physics.arcade.distanceToPointer(hand, game.input.activePointer) > 8)
    {
        //  Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(hand, 500);
    }
    else
    {
        //  Otherwise turn off velocity because we're close enough to the pointer
        hand.body.velocity.set(0);
    }

    };

    this.quitGame = function (pointer) {

       //! this.state.start('MainMenu');
    };
    
    function releaseGem() {
        console.log("releasegem")
        if (tempShiftedGem === null) {
            selectedGem = null;
            return;
        }
    
        // when the mouse is released with a gem selected
        // 1) check for matches
        // 2) remove matched gems
        // 3) drop down gems above removed gems
        // 4) refill the board
    
        var canKill = checkAndKillGemMatches(selectedGem);
        canKill = checkAndKillGemMatches(tempShiftedGem) || canKill;
    
        if (! canKill) // there are no matches so swap the gems back to the original positions
        {
            var gem = selectedGem;
    
            if (gem.posX !== selectedGemStartPos.x || gem.posY !== selectedGemStartPos.y)
            {
                if (selectedGemTween !== null)
                {
                    game.tweens.remove(selectedGemTween);
                }
    
                selectedGemTween = tweenGemPos(gem, selectedGemStartPos.x, selectedGemStartPos.y);
    
                if (tempShiftedGem !== null)
                {
                    tweenGemPos(tempShiftedGem, gem.posX, gem.posY);
                }
    
                swapGemPosition(gem, tempShiftedGem);
    
                tempShiftedGem = null;
    
            }
        }
    
        removeKilledGems();
    
        var dropGemDuration = dropGems();
    
        // delay board refilling until all existing gems have dropped down
        game.time.events.add(dropGemDuration * 100, refillBoard);
    
        allowInput = false;
    
        selectedGem = null;
        tempShiftedGem = null;
    
    }
    
    function slideGem(pointer, x, y) {
     console.log("slidegem")
        // check if a selected gem should be moved and do it
        if (selectedGem && pointer.isDown)
        {
            console.log("selectedGem");
            var cursorGemPosX = getGemPos(x);
            var cursorGemPosY = getGemPos(y);
    
            if (checkIfGemCanBeMovedHere(selectedGemStartPos.x, selectedGemStartPos.y, cursorGemPosX, cursorGemPosY))
            {
                if (cursorGemPosX !== selectedGem.posX || cursorGemPosY !== selectedGem.posY)
                {
                    // move currently selected gem
                    console.log("move currently selected gem")
                    if (selectedGemTween !== null)
                    {
                        game.tweens.remove(selectedGemTween);
                    }
    
                    selectedGemTween = tweenGemPos(selectedGem, cursorGemPosX, cursorGemPosY);
    
                    gems.bringToTop(selectedGem);
    
                    // if we moved a gem to make way for the selected gem earlier, move it back into its starting position
                    if (tempShiftedGem !== null)
                    {
                        console.log("swap position");
                        tweenGemPos(tempShiftedGem, selectedGem.posX , selectedGem.posY);
                        swapGemPosition(selectedGem, tempShiftedGem);
                    }
    
                    // when the player moves the selected gem, we need to swap the position of the selected gem with the gem currently in that position 
                    tempShiftedGem = getGem(cursorGemPosX, cursorGemPosY);
    
                    if (tempShiftedGem === selectedGem)
                    {
                        tempShiftedGem = null;
                    }
                    else
                    {
                        tweenGemPos(tempShiftedGem, selectedGem.posX, selectedGem.posY);
                        swapGemPosition(selectedGem, tempShiftedGem);
                    }
                }
            }
        }
    }
    
    // fill the screen with as many gems as possible
    function spawnBoard() {
        console.log("spawnBoard")
        BOARD_COLS = 8; //! Math.floor(game.world.width / GEM_SIZE_SPACED);
        BOARD_ROWS = 8;  //! Math.floor(game.world.height / GEM_SIZE_SPACED);
    
        gems = game.add.group();
        gems.inputEnableChildren = true;
        var rect = new Phaser.Rectangle(0, 0, 666, 820);

        for (var i = 0; i < BOARD_COLS; i++)
        {
            for (var j = 0; j < BOARD_ROWS; j++)
            {
               var gem = gems.create(i * GEM_SIZE_SPACED, j * GEM_SIZE_SPACED, "gem3");
             //   var gem = getRandomGem(i * GEM_SIZE_SPACED, j * GEM_SIZE_SPACED);
                gem.name = 'gem' + i.toString() + 'x' + j.toString();
                gem.inputEnabled = true;
                setGemPos(gem, i, j); // each gem has a position on the board
                gem.kill();  //! dsfddsfsdf
            }
        }
         gems.onChildInputDown.add(selectGem, this);
         gems.onChildInputUp.add(releaseGem, this);
       //!  gems.onChildInputOver.add(onHandMove, this);
       

        gems.forEach((gem)=>{
            console.log(gem.color);
        })
        removeKilledGems();
    
        var dropGemDuration = dropGems();
    
        // delay board refilling until all existing gems have dropped down
        game.time.events.add(dropGemDuration * 100, refillBoard);
    
        allowInput = false; //! false
    
        selectedGem = null;
        tempShiftedGem = null;
    
    }
    function onHandMove(){
        hand.x = game.input.x;
        hand.y = game.input.y;
    }

    function getRandomGem(Ypos, Xpos){
       var g = gemArray[getRandomInt(6)]; // 6 it`s amount of gems
       var c = gems.create(Xpos, Ypos, g.img );
       c.color = g.color;
       return c;
    }
    
    function getRandomInt(max) {
       // var numb = Math.floor(Math.random() * Math.floor(max));
       // game.rnd.sow(Date.now());
        var numb = game.rnd.between(0, 6);
        if(numb == max) 
            return max-1;
        return numb;    
      }

    // select a gem and remember its starting position
    function selectGem(gem) {
        switch(gem.color){
            case "red"    : select1.play();  break; 
            case "blue"   : select2.play();  break;
            case "green"  : select3.play();  break;
            case "azure"  : select4.play();  break;
            case "yellow" : select5.play();  break;
            case "pink"   : select6.play();  break;   
            default       : console.info("default selectGem");  
        }
        if (allowInput)
        {
           //! select song
            selectedGem = gem;
            selectedGemStartPos.x = gem.posX;
            selectedGemStartPos.y = gem.posY;
        }
    
    }
    
    // find a gem on the board according to its position on the board
    function getGem(posX, posY) {
    
        return gems.iterate("id", calcGemId(posX, posY), Phaser.Group.RETURN_CHILD);
    
    }
    
    // convert world coordinates to board position
    function getGemPos(coordinate) {
    
        return Math.floor(coordinate / GEM_SIZE_SPACED);
    
    }
    
    // set the position on the board for a gem
    function setGemPos(gem, posX, posY) {
    
        gem.posX = posX;
        gem.posY = posY;
        gem.id = calcGemId(posX, posY);
    
    }
    
    // the gem id is used by getGem() to find specific gems in the group
    // each position on the board has a unique id
    function calcGemId(posX, posY) {
    
        return posX + posY * BOARD_COLS;
    
    }
    
    // since the gems are a spritesheet, their color is the same as the current frame number
    function getGemColor(gem) {
        return gem.color;
    
    }
   
    
    // gems can only be moved 1 square up/down or left/right
    function checkIfGemCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY) {
        
        if (toPosX < 0 || toPosX >= BOARD_COLS || toPosY < 0 || toPosY >= BOARD_ROWS)
        {
            console.log("checkIfGemCanBeMovedHere false");
            return false;  
        }
    
        if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1)
        {
            console.log("checkIfGemCanBeMovedHere true");
            return true;
        }
    
        if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1)
        {
            console.log("checkIfGemCanBeMovedHere true");
            return true;
        }
        console.log("checkIfGemCanBeMovedHere false");
        return true; //! false
    }
    
    // count how many gems of the same color lie in a given direction
    // eg if moveX=1 and moveY=0, it will count how many gems of the same color lie to the right of the gem
    // stops counting as soon as a gem of a different color or the board end is encountered
    function countSameColorGems(startGem, moveX, moveY) {
        console.log("countSameColorGems")
        var curX = startGem.posX + moveX;
        var curY = startGem.posY + moveY;
        var count = 0;
    
        while (curX >= 0 && curY >= 0 && curX < BOARD_COLS && curY < BOARD_ROWS && getGemColor(getGem(curX, curY)) === getGemColor(startGem))
        {
            count++;
            curX += moveX;
            curY += moveY;
        }
        console.log("count gems" + count);
    
        return count;
    
    }
    
    // swap the position of 2 gems when the player drags the selected gem into a new location
    function swapGemPosition(gem1, gem2) {
    
        var tempPosX = gem1.posX;
        var tempPosY = gem1.posY;
        setGemPos(gem1, gem2.posX, gem2.posY);
        setGemPos(gem2, tempPosX, tempPosY);
    
    }
    
    // count how many gems of the same color are above, below, to the left and right
    // if there are more than 3 matched horizontally or vertically, kill those gems
    // if no match was made, move the gems back into their starting positions
    function checkAndKillGemMatches(gem) {
        console.log("checkAndKillGemMatches")
        if (gem === null) { return; }
    
        var canKill = false;
    
        // process the selected gem
    
        var countUp = countSameColorGems(gem, 0, -1);
        var countDown = countSameColorGems(gem, 0, 1);
        var countLeft = countSameColorGems(gem, -1, 0);
        var countRight = countSameColorGems(gem, 1, 0);
    
        var countHoriz = countLeft + countRight + 1;
        var countVert = countUp + countDown + 1;
    
        if (countVert >= MATCH_MIN)
        {
            killGemRange(gem.posX, gem.posY - countUp, gem.posX, gem.posY + countDown);
            canKill = true;
            addScore(countVert);
            kill.play();
        }
    
        if (countHoriz >= MATCH_MIN)
        {
            killGemRange(gem.posX - countLeft, gem.posY, gem.posX + countRight, gem.posY);
            canKill = true;
            addScore(countHoriz);
            kill.play();
        }
    
        return canKill;
    
    }

   function addScore(count){
        switch(count){
            case 3 :  SCORE += THREE_IN_ROW_SCORE_AMOUNT; break;
            case 4 : SCORE += FOUR_IN_ROW_SCORE_AMOUNT; break;
            case 5 : SCORE += FIVE_IN_ROW_SCORE_AMOUNT; break;
            default: console.log('default score break');
        }
       scoreText.setText('Points: '+ SCORE);
    }
    
    // kill all gems from a starting position to an end position
    function killGemRange(fromX, fromY, toX, toY) {
        console.log("killGemRange")
        fromX = Phaser.Math.clamp(fromX, 0, BOARD_COLS - 1);
        fromY = Phaser.Math.clamp(fromY , 0, BOARD_ROWS - 1);
        toX = Phaser.Math.clamp(toX, 0, BOARD_COLS - 1);
        toY = Phaser.Math.clamp(toY, 0, BOARD_ROWS - 1);
    
        for (var i = fromX; i <= toX; i++)
        {
            for (var j = fromY; j <= toY; j++)
            {
                var gem = getGem(i, j);
                gem.kill();
            }
        }
    
    }
    
    // move gems that have been killed off the board
    function removeKilledGems() {
        gems.forEach(function(gem) {
            if (!gem.alive) {
                setGemPos(gem, -1,-1);
            
            }
        });
    
    }
    
    // animated gem movement
    function tweenGemPos(gem, newPosX, newPosY, durationMultiplier) {
    
        console.log('Tween ',gem.name,' from ',gem.posX, ',', gem.posY, ' to ', newPosX, ',', newPosY);
        if (durationMultiplier === null || typeof durationMultiplier === 'undefined')
        {
            durationMultiplier = 1;
        }
    
        return game.add.tween(gem).to({x: newPosX  * GEM_SIZE_SPACED, y: newPosY * GEM_SIZE_SPACED}, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);
    
    }
    
    // look for gems with empty space beneath them and move them down
    function dropGems() {
        console.log("dropGems")
        var dropRowCountMax = 0;
    
        for (var i = 0; i < BOARD_COLS; i++)
        {
            var dropRowCount = 0;
    
            for (var j = BOARD_ROWS - 1; j >= 0; j--)
            {
                var gem = getGem(i, j);
    
                if (gem === null)
                {
                    dropRowCount++;
                }
                else if (dropRowCount > 0)
                {
                    gem.dirty = true;
                    setGemPos(gem, gem.posX, gem.posY + dropRowCount);
                    tweenGemPos(gem, gem.posX, gem.posY, dropRowCount);
                }
            }
    
            dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
        }
    
        return dropRowCountMax;
    
    }
    
    // look for any empty spots on the board and spawn new gems in their place that fall down from above
    function refillBoard() {
        console.log("refillBoard")
        var maxGemsMissingFromCol = 0;
    
        for (var i = 0; i < BOARD_COLS; i++)
        {
            var gemsMissingFromCol = 0;
    
            for (var j = BOARD_ROWS - 1; j >= 0; j--)
            {
                var gem = getGem(i, j);
    
                if (gem === null)
                {
                    gemsMissingFromCol++;
                     gem = gems.getFirstDead();
                   gem = getRandomGem(i, j);
                    gem.reset(i * GEM_SIZE_SPACED, -gemsMissingFromCol * GEM_SIZE_SPACED);
                    gem.dirty = true;
                 //! randomizeGemColor(gem);     
                    setGemPos(gem, i, j); 
                    tweenGemPos(gem, gem.posX, gem.posY, gemsMissingFromCol * 2);
                }
            }
            
            maxGemsMissingFromCol = Math.max(maxGemsMissingFromCol, gemsMissingFromCol);
        }
    
        game.time.events.add(maxGemsMissingFromCol * 2 * 100, boardRefilled);
    
    }
    
    // when the board has finished refilling, re-enable player input
    function boardRefilled() {
        console.log("boardRefilled")
        var canKill = false;
        for (var i = 0; i < BOARD_COLS; i++)
        {
            for (var j = BOARD_ROWS - 1; j >= 0; j--)
            {
                var gem = getGem(i, j);
    
                if (gem.dirty)
                {
                    gem.dirty = false;
                    canKill = checkAndKillGemMatches(gem) || canKill;
                }
            }
        }
    
        if(canKill){
            removeKilledGems();
            var dropGemDuration = dropGems();
            // delay board refilling until all existing gems have dropped down
            game.time.events.add(dropGemDuration * 100, refillBoard);
            allowInput = false; //! false
        } else {
            allowInput = true;
        }
    }

};