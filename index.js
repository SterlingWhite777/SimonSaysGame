//Initialize variables

var buttonArray = ["#green", "#red", "#yellow", "#blue"];
var letters = ["q","w","a","s"];
var simonArray = [];
var playerArray = [];
var newGame = true;
var gameRecord = 0;
var gameProgress = 0;

//Initialize Sounds
var blueSound = new Audio("sounds/blue.mp3");
var greenSound = new Audio("sounds/green.mp3");
var redSound = new Audio("sounds/red.mp3");
var yellowSound = new Audio("sounds/yellow.mp3");
var wrongSound = new Audio("sounds/wrong.mp3");



//timer to wait for each Simon click to occur
const timer = ms => new Promise(res => setTimeout(res, ms));



/*
Steps:
0. Set Any key press to start game
0.1 remove event listener
1. Simon takes a turn
2. Player presses a button/letter
3. Check if player correct
3A. If Player correct go to 4
3B. If Player wrong do Game Over
4. Check if Sequence is complete
4A. If sequence is NOT complete, wait for next input
4B. If sequence is complete, go to 5
5. Simon takes another turn AND plays all his previous presses

NOTES:
- Do I need to remove event listeners during Simon's turns?
*/



//buttons & letter click Listeners

var buttonClick = $(".btn").each(function () {
    $(this).bind("click", buttonPress)
});

var letterClick = $(document).keydown(keyClick);



//Click Functions

function keyClick(event) {
    
    var myKey = event.key.toLowerCase();
    if (newGame) {
        startGame();
    }
    else if (letters.includes(myKey)) {
        pressEvent(buttonArray[letters.indexOf(myKey)]);
    }
}

function buttonPress() {
    var myButton = this.id.toLowerCase();
    console.log(myButton);
    if (newGame) {
        startGame();
    }
    else {
        pressEvent(`#${myButton}`);
    }
    
}

function pressEvent(input) {
    lightButton(input);
    playerArray.push(input);
    checkAccuracy(playerArray);
}

function checkAccuracy(valPressed) {
    
    if (valPressed.slice(-1) == simonArray[valPressed.length - 1]) {
        
        if (valPressed.length == simonArray.length) {
            $("#level-title").html("Level " + (valPressed.length + 1));
            playerArray = [];
            gameProgress++;
            simonTurn();
        } else {
            return;
        }
    } 
    else {
        gameOver();
    }
}



//Game Conditions

function startGame() {
    $("#level-title").html("Level 1");
    setTimeout(() => {
        simonTurn();
    }, 500); 
    newGame = false;
}

function gameOver() {
    gameSound("#wrong");
    $("body").toggleClass("game-over");
    setTimeout(() => {
        $("body").toggleClass("game-over");
    }, 200)
    $("#level-title").html("Game Over, Press Any Key to Restart");
    
    if (gameProgress >= gameRecord) {
        gameRecord = gameProgress;
    }
    
    $("#level-progress").html("Highest Level this Session: " + gameRecord);
    
    playerArray = [];
    simonArray = [];
    gameProgress = 0;   
    newGame = true;
}

function lightButton(color) {
    gameSound(color);
    $(color).toggleClass("pressed");
    setTimeout(() => {
        $(color).toggleClass("pressed");
    }, 200)
}

function gameSound(button) {
    eval(button.slice(1) + "Sound.play()");
}



//Simon functions

async function simonTurn() {
    setTimeout(async () => {
        //check if previous plays
        //if so replay them first before new turn
        if (simonArray.length > 0) {
            await simonPlayPrev();
        }
        
        //randomly pick new button
        var simonColor = buttonArray[Math.floor(Math.random() * 4)];
        lightButton(simonColor);
        
        //add new turn to simonArray
        simonArray.push(simonColor);

    }, 800); 
}

async function simonPlayPrev() {
    for (let i = 0; i < simonArray.length; i++) {
        lightButton(simonArray[i]);
        await timer(500);
    }    
}