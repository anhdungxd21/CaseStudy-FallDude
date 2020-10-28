let c = document.getElementById("myGame");
let ctx = c.getContext("2d");
let themesong = document.getElementById("themesong");
let getHit = document.getElementById("getHit");
let thunderSound = document.getElementById("thunder");
const GAME_STATE = {
    MENU:0,
    START:1,
    OVER:2
}
let gameState = GAME_STATE.MENU;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
let gravity = 1;
let jump = -100;
let speedPlayer = 20;
let score = 0;
let timeLoop = 0;
let difficult = 60;
let bulletTimeCount = 0;
let shoot = true;
class Player {
    constructor(ctx) {
        this.ammo = 4;
        this.hp = 4;
        this.speed = 5;
        this.position = {
            x: GAME_WIDTH/2-16,
            y: 0
        }
        this.size = {
            w: 32,
            h:32
        }
        this.ctx = ctx;
        this.src = "images/left-player.png";
    }
    setLoseHp = function () {
        this.hp--;
    }
    getHp = function(){
        return this.hp
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
    setChangeSource = function (newSrc){
        this.src = newSrc;
    }
    loadPersonImage = function (src) {
        this.background = new Image();
        this.background.src = this.src;
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        )
    }

    draw = function () {
        this.loadPersonImage();
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
    constructor(ctx, size, speed) {
        this.ctx = ctx;
        this.speed = speed;
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
        this.position.y -= this.speed;
        this.draw();
    }
    loadPersonImage = function (src) {
        this.background = new Image();
        this.background.src = "images/Enemy.png";
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        )
    }
    draw = function () {
        this.loadPersonImage()
    }
}
class ImgGame {
    constructor(ctx, img,x,y) {
        this.ctx = ctx;
        this.img = img;
        this.move = -5;
        this.position = {
            x: x,
            y:y
        }
    }
    imageMove = function () {
        this.position.y += this.move
    }
    loadImage = function () {
        this.background = new Image();
        this.background.src = this.img;
        this.drawStatic()
        this.imageMove()
    }
    loadPersonImage = function () {
        this.background = new Image();
        this.background.src = this.img;
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        )
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
let player = new Player(ctx);
const bulletArr = [];
const enemyArr = [];
const backgroundArr = [];
const heartArr = [];
let sizeHeart = 0;
for (let i = 0; i < 4; i++) {
    let heart = new ImgGame(ctx,"images/heart.png", 10+sizeHeart, 10);
    heartArr.push(heart);
    sizeHeart +=20;
}
function input() {
    document.addEventListener("keydown", function (event) {
        switch (event.keyCode) {
            case 68:
                if(player.position.x > 444) {
                    player.position.x = 474-32;
                }
                player.setChangeSource("images/right-player.png");
                player.moveHorizontal(speedPlayer);
                break;
            case 65:
                if(player.position.x < 100) {
                    player.position.x = 84+32;
                }
                player.setChangeSource("images/left-player.png");
                player.moveHorizontal(-speedPlayer);
                break;
            case 32:
                if (player.position.y < 100 ) {
                    player.position.y = 110;
                }
                if (bulletTimeCount >=15 && shoot) {
                    let bullet = new Bullet(player.position.x + 16, player.position.y-100, 10, ctx);
                    bulletArr.push(bullet);
                    bulletTimeCount = 0;
                    player.shootBullet();
                    player.moveVertical(jump);
                    shoot = false;
                }

                if(gameState == GAME_STATE.MENU) gameState = GAME_STATE.START;
                break;
        }
    })
    document.addEventListener("keyup", function (event){
        if(event.keyCode == 32) {
            shoot = true;
        }
    })
}
input();
function borderDraw() {
    ctx.beginPath()
    ctx.moveTo(84,0);
    ctx.lineTo(84, 600);
    ctx.stroke();
    ctx.moveTo(500,0);
    ctx.lineTo(500, 600);
    ctx.stroke();
    ctx.closePath();
}///<-------------------------- drop
function clearCache() {
    if(bulletArr.length >= 20){
        bulletArr.shift();
    }

}
function spawnEnemy () {
    if (enemyArr.length <= 20 && timeLoop >= difficult){
        let enemy = new Enemy(ctx,32,3)
        enemyArr.push(enemy);
        timeLoop = 0;
    }
    enemyArr.forEach((enemy, index) => {
        enemy.move();
        if (detectCollision(player,enemy)){
            enemyArr.splice(index,1);
            getHit.play();
            player.setLoseHp();
            heartArr.pop();
        }
        if (enemy.position.y < -300) {
            enemyArr.splice(index,1);
        }
        bulletArr.forEach((bullet, bulletCount)=>{
            if (detectCollision(bullet,enemy) ){
                getHit.play();
                enemyArr.splice(index,1);
                bulletArr.splice(bulletCount,1);
            }
        })
    })
}////<-----------------------------------Enemy
function gameDifficult() {
    if(score % 360 == 0) {
        if (difficult <= 25) {
            difficult = 15;
        } else {
            difficult-=5;
        }
    }
}
function backgroundScroll() {
    if (backgroundArr.length == 0) {
        let background = new ImgGame(ctx, "images/Background.png",0, 0);
        backgroundArr.push(background);
    }else if (backgroundArr.length < 3){
        let background = new ImgGame(ctx, "images/Background.png",0, 695);
        backgroundArr.push(background);
    }
    backgroundArr.forEach((item,index) => {
        item.loadImage();
        if(item.position.y <-695){
            backgroundArr.splice(0,1);
            thunderSound.play();
        }
    })
}
function displayHeart(){
    heartArr.forEach(item =>{
        item.loadPersonImage();
    })
}
function gameStart () {
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    borderDraw();
    backgroundScroll();
    displayHeart();
    bulletArr.forEach(item => {
        item.bulletDown();
    });
    spawnEnemy();
    //console.log(enemyArr);
    player.draw(c);
    player.moveVertical(gravity);
    //console.log(detectCollision(player,enemy));
    clearCache();
    bulletTimeCount++;
    timeLoop++;
    score++;
    gameDifficult();
    if(player.getHp() <=0 || player.position.y >= 700){
        gameState = GAME_STATE.OVER;
    }
}

function gameInit() {
    //Draw the game
    switch (gameState){
        case GAME_STATE.MENU:
            ctx.rect(0,0,GAME_WIDTH,GAME_HEIGHT);
            ctx.fillStyle = "#000";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Press SPACE To Start",GAME_WIDTH/2,GAME_HEIGHT/2)
            break;
        case GAME_STATE.START:
            gameStart();
            themesong.play();
            break;
        case GAME_STATE.OVER:
            ctx.rect(0,0,GAME_WIDTH,GAME_HEIGHT);
            ctx.fillStyle = "#000";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",GAME_WIDTH/2,GAME_HEIGHT/2)
            ctx.fillText(`Sore: ${score}`,GAME_WIDTH/2,GAME_HEIGHT/2+50);
            break;
    }


}
setInterval(gameInit,1000/60);