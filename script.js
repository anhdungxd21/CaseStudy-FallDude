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
        this.size = {
            w: 32,
            h:32
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
    shootBullet = function() {
        this.ammo -=1;
    }
    getAmmoInfo = function() {
        return this.ammo;
    }
    setFullAmmo = function () {
        this.ammo = 4;
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
        this.size = {
            w:10,
            h:12
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
        this.ctx.fillRect(this.position.x,this.position.y,this.size.w,this.size.h);
        this.ctx.closePath();
    }
}
class Enemy {
    constructor(ctx, size) {
        this.ctx = ctx;
        this.size = {
            w: size,
            h:size
        };
        this.position = {
            x: Math.floor(Math.random()*380 + 100),
            y: 700
        }

    }
    move = function () {
        this.position.y -= 2;
        this.draw();
    }
    draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
        this.ctx.closePath();
    }
}
function detectCollision(obj1, obj2) {
    let topObj1 = obj1.position.y;
    let bottomObj1 = obj1.position.y + obj1.size.h;
    let leftObj1 = obj1.position.x;
    let rightObj1 = obj1.position.x + obj1.size.w;

    let topObj2 = obj2.position.y;
    let bottomObj2 = obj2.position.y + obj2.size.h;
    let leftObj2 = obj2.position.x;
    let rightObj2 = obj2.position.x + obj2.size.w;

    let leftCheck = leftObj1 > leftObj2 && leftObj1 < rightObj2;
    let rightCheck = rightObj1 > leftObj2 && rightObj1 < rightObj2;

    let horizontalCheck = leftCheck || rightCheck;

    return bottomObj1 >= topObj2 &&
        bottomObj2 >= topObj1 &&
        horizontalCheck;




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
                    let bullet = new Bullet(player.position.x + 16, player.position.y-100, 10, ctx);
                    bulletArr.push(bullet);
                    bulletTimeCount = 0;
                    player.shootBullet();
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
function spawnEnemy () {
    if (enemyArr.length <= 20 && timeLoop == 60){
        let enemy = new Enemy(ctx,32)
        enemyArr.push(enemy);
        timeLoop = 0;
    }
    enemyArr.forEach((item, index) => {
        item.move();
        if (item.position.y < -300) {
            enemyArr.splice(index,1);
        }
    })
}

function gameStart () {
    borderDraw();
    bulletArr.forEach(item => {
        item.bulletDown();
    });
    spawnEnemy();
    console.log(enemyArr);
    player.draw(c);
    player.moveVertical(gravity);
    //console.log(detectCollision(player,enemy));
    clearCache();
    bulletTimeCount++;
    timeLoop++;
}
function gameInit() {
    //Draw the game
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    gameStart();

}
setInterval(gameInit,1000/60);