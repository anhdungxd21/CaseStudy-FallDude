let c = document.getElementById("myGame");
let ctx = c.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
let gravity = 1;
let jump = -100;
let speedPlayer = 20;
let timeLoop = 0;
let bulletTimeCount = 0;
class Player {
    constructor(hp, speed) {
        this.ammo = 4;
        this.hp = hp;
        this.speed = speed
        this.position = {
            x: GAME_WIDTH/2-16,
            y: 0
        }
    }

    getXPosition = function () {
        return this.position.x;
    }
    getYPosition = function () {
        return this.position.y;
    }

    moveHorizontal = function (speed) {
        this.position.x += speed;
    }

    moveVertical = function (speed) {
        this.position.y += speed;
    }

    draw = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.beginPath();
        this.ctx.fillStyle = "#f00";
        this.ctx.fillRect(this.position.x, this.position.y, 32, 32);
        this.ctx.closePath();
    }
} //Player
class Bullet {
    constructor(x, y, speed, ctx) {
        this.position = {
            x: x,
            y: y
        }
        this.ammo = 4;
        this.speed = speed;
        this.ctx = ctx;
    }
    decrease = function () {
        this.ammo -= 1;
    }

    bulletDown = function () {
        this.position.y += this.speed;
        this.draw();
    }

    draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#ff7171";
        this.ctx.fillRect(this.position.x,this.position.y,10,12);
        this.ctx.closePath();
    }
}
class Enemy {
    constructor(hp, size) {
        this.hp = hp;
        this.size = size;
        this.position = {
            x: Math.floor(Math.random()*380 + 100),
            y: 700
        }
    }
    move = function (ctx) {
        this.position.y -= 2;
        this.draw(ctx);
    }
    draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        ctx.closePath();
    }
}
function detectCollision(obj1, obj2) {
    let bo
}
let player = new Player(100, 5);
const bulletArr = [];
const enemyArr = [];


function input() {
    document.addEventListener("keydown", function (event) {
        switch (event.keyCode) {
            case 68:
                if(player.position.x > 444) {
                    player.position.x = 474-32;
                }
                player.moveHorizontal(speedPlayer);
                break;
            case 65:
                if(player.position.x < 100) {
                    player.position.x = 84+32;
                }
                player.moveHorizontal(-speedPlayer);
                break;
            case 32:
                if (player.position.y < 100 ) {
                    player.position.y = 110;
                }
                if (bulletTimeCount >=30) {
                    let bullet = new Bullet(player.position.x + 16, player.position.y, 10, ctx);
                    bulletArr.push(bullet);
                    bulletTimeCount = 0;
                }
                player.moveVertical(jump);
                console.log(player.position.y);
                console.log(bulletArr);
                break;
        }
    })
    // document.addEventListener("keyup", function (event){
    //     switch(event.keyCode) {
    //         case 68:
    //             player.moveHorizontal(0);
    //             console.log(player.position.x);
    //             break;
    //         case 65:
    //             player.moveHorizontal(0)
    //             console.log(player.position.x);
    //             break;
    //         case 32:
    //             console.log("space");
    //             break;
    //     }
    // })
}
function borderDraw() {
    ctx.beginPath()
    ctx.moveTo(84,0);
    ctx.lineTo(84, 600);
    ctx.stroke();
    ctx.moveTo(500,0);
    ctx.lineTo(500, 600);
    ctx.stroke();
    ctx.closePath();
}
input();
function clearCache() {
    if(bulletArr.length >= 20){
        bulletArr.shift();
    }
}
let enemy = new Enemy(1,32)
function gameStart() {
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    borderDraw();
    bulletArr.forEach(item => {
        item.bulletDown();
    });
    enemy.move(ctx);
    player.draw(c);
    player.moveVertical(gravity);
    //After 1 second
    clearCache();
    bulletTimeCount++;
}
setInterval(gameStart,1000/60);