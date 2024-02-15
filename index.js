function startGame(){
    gameArea.start();
}

minHeight = 20;
maxHeight = 50;
minWidth = 10;
maxWidth = 20;
minGap = 100;
maxGap = 500;
gap = randGap();
var myObstacle = [];
var jumpSound = document.getElementById("jump-sound");
var gameOverSound = document.getElementById("game-over-sound");

var scoreText = {
    x: 900,
    y:50,
    update: function(text){
        gameArea.context.font = "30px Consolas";
        gameArea.context.fillText(text,this.x , this.y);
    }
}



var player ={
    x: 20,
    y: 470,
    gravity: 0.1,
    speedY: 0,
    update : function(){
        gameArea.context.fillRect(this.x , this.y, 30 , 30);
    },
    newPos: function(){
        if(this.y < 280){
            this.speedY = 2;
        }
        this.y = this.y+this.speedY;
        if(this.speedY ==2 && this.y ==470){
            this.speedY = 0;
        }
    },

    crashWith : function(obs){
        if(this.x+30 > obs.x && this.x < obs.x + obs.width  && this.y + 30 > obs.y){
            return true;
        }
        return false;
    }
}
function everyInterval(n){
    if(gameArea.frame%n == 0){
        return true;
    } 
    return false

}

function jump(){
    player.speedY = -3;
    jumpSound.play();
}

// genertating a random gap between obstacles
function randGap(){
    return Math.floor(minGap + Math.random()*(maxGap - minGap+1));
}


// generating a random obstacle
function obstacle(){
    this.height = Math.floor(minHeight+Math.random()*(maxHeight - minHeight+1));
    this.width = Math.floor(minWidth+Math.random()*(maxWidth - minWidth+1));
    this.x = 1200;
    this.y = gameArea.canvas.height - this.height;
    this.draw = function(){
        gameArea.context.fillRect(this.x , this.y , this.width, this.height)
    }
}

var gameArea = {
    canvas:document.createElement("canvas"),
    start: function(){
        this.canvas.height = 500;
        this.canvas.width = 1200;
        document.body.insertBefore(this.canvas,document.body.childNodes[0])
        this.context = this.canvas.getContext("2d");
        this.frame = 0;
        this.score =0;
        scoreText.update("Score: 0");
        this.interval = setInterval(this.updateGameArea,5)
        window.addEventListener("keydown", jump)
    },
    updateGameArea : function(){
        for(i=0 ; i<myObstacle.length; i++){
            if(player.crashWith(myObstacle[i])){
                gameArea.stop();
                return;
            }
        }
        gameArea.clear();
        // pushing an obstacle every 150 frames 
        if(everyInterval(gap)){
            myObstacle.push(new obstacle());
            gap = randGap();
            gameArea.frame = 0;
        }
        for(i=0 ; i < myObstacle.length; i++){
            myObstacle[i].x-=1;
            myObstacle[i].draw();
        }
        player.newPos();
        player.update();
        gameArea.frame+=1;
        gameArea.score+= 0.01;
        scoreText.update("Score:" +Math.floor(gameArea.score));
    },
    clear: function(){
        gameArea.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
        gameOverSound.play();
    }
}