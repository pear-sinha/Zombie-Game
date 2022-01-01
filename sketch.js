//Gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground,player;
var invisible_ground,zombie;
var zombie_image,bg,bg2,girl;
var parrot1_img, parrot2_img, parrot;

var handImg,coinImg,skull_img;
var gameOver_img,restart_img;
var score=0;
var HandGroup,CoinsGroup,SkullGroup;
var bgm, point, point2, growl;
function preload(){

  zombie_image=loadAnimation("images/zombie1.png","images/zombie2.png","images/zombie3.png",
                            "images/zombie4.png","images/zombie5.png","images/zombie6.png");
  girl=loadAnimation("images/girl1.png","images/girl2.png");
  bg=loadImage("images/bg.png");
  bg2=loadImage("images/bg2.png");
  handImg=loadImage("images/grave.png");
  coinImg=loadImage("images/coin.png");
  skull_img=loadImage("images/skull.png");
  parrot1=loadAnimation("images/parrot1.jpg","images/parrot2.jpg");

  gameOver_img=loadImage("images/game-over.png");
  restart_img=loadImage("images/restore.png");

  bgm=loadSound("sounds/bgm.wav");
  point=loadSound("sounds/point.wav");
  point2=loadSound("sounds/point2.wav");
  growl=loadSound("sounds/zombiegrowl.wav");
}
function setup() {

  createCanvas(800, 500);
  ground=createSprite(500,-120,0,0);
  ground.scale=1.7;
  ground.x = ground.width /2;
  ground.velocityX = -4;
  ground.addImage(bg)

  bgm.loop();

  invisible_ground=createSprite(400,470,800,10);
  invisible_ground.visible=false;

  player=createSprite(300,420,20,100);
  player.addAnimation("a",girl);
  player.scale=0.3;

  zombie=createSprite(150,410,20,100);
  zombie.scale=0.4;
  zombie.addAnimation("zom",zombie_image);

  gameOver = createSprite(400,80);
  gameOver.addImage(gameOver_img);
  gameOver.scale=0.15;

  restart = createSprite(400,200);
  restart.addImage(restart_img);
  restart.scale=0.2;

  
  
  //groups
  HandGroup=new Group();
  CoinsGroup=new Group();
  SkullGroup=new Group();
}

function draw() {
  background("black");

  if (gameState===PLAY){

  //in playstate these aren't required
  gameOver.visible=false;
  restart.visible=false;

  //to increase speed with score
  ground.velocityX = -(4 + score/50);

  player.collide(invisible_ground);
  zombie.collide(invisible_ground);

  // infinite scrolling of ground
  if (ground.x < 0){
    ground.x = ground.width/2;
  }

// gravity for player and movements
  if(keyDown("space")&& player.y >= 220) {
    player.velocityY = -10;  
   }  
   if(keyDown("left")) {
    player.x-=2;
   }  
   if(keyDown("right")) {
    player.x+=2;
   }

  player.velocityY = player.velocityY + 0.8;

  spawnhands();
  spawnCoins();

   // for level 1
   if(score>200){
    Level1();
  }
  
   //for level 2
   if(score>400){
    level2();
  }

   
  if(score===200){
    point2.play();
    point2.loop = false;
  }
  if(score===400){
    point2.play();
    point2.loop = false;
  }
  if(score===500){
    point2.play();
    point2.loop =false;
  }

//scoring 
  if(player.isTouching(CoinsGroup)){
    player.velocityY=3;
    score=score+5;
    point.play();
    CoinsGroup.setVisibleEach(false);
  }

  if (player.isTouching(HandGroup)){
    gameState=END;
    growl.play();
  }

  if (player.isTouching(SkullGroup)){
    gameState=END;
    growl.play();
  }
}
else if ( gameState===END) {
  bgm.stop();
  //we need them in endstate 
  gameOver.visible=true;
  restart.visible=true;

  ground.velocityX = 0;
  player.velocityY = 0;

  console.log("gameover");
  //CAPTURED
  zombie.x=player.x;
  player.y=zombie.y;

    //set lifetime of the game objects so that they are never destroyed
    HandGroup.setLifetimeEach(-1);
    HandGroup.setVelocityXEach(0);

    CoinsGroup.destroyEach();
    CoinsGroup.setVelocityXEach(0);

    SkullGroup.destroyEach();
    SkullGroup.setVelocityYEach(0);

    //to restart game
    if(mousePressedOver(restart)) {
      reset();
    }
}

  drawSprites();
  fill("white");
  text("SCORE : "+score,700,100);
 
}


// to spawn hands on ground
function spawnhands() {
  if (frameCount % 120 === 0){
    var hand = createSprite(800,450,10,40);
    hand.addImage("hand",handImg);
    hand.scale=0.14
    hand.velocityX = -(4 + score/50);
    hand.lifetime=200;
    HandGroup.add(hand);
    hand.setCollider("circle",0,0,1);
    } 
  }

  //to spaw coins for score
function spawnCoins() {
  if (frameCount % 100 === 0){
    var coin = createSprite(800,random(200,350),10,40);
    coin.velocityX = -6;
    coin.addImage(coinImg)
    coin.scale=0.06;
    coin.lifetime=130;
    CoinsGroup.add(coin);
    coin.setCollider("circle",0,0,1);
    }
  }
  

  // to resey the game and play again
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  HandGroup.destroyEach();
  score=0;
  zombie.x=150;
  ground.addImage(bg);  
  bgm.play();
  }

  // LEVEL 1
function Level1(){
  
  if (frameCount % 120 === 0){
    var skull = createSprite(random(200,800),50,10,40);
    skull.velocityY = 6 ;
    skull.addImage(skull_img);
    skull.scale = 0.1;
    skull.lifetime = 200;
    SkullGroup.add(skull);
    skull.setCollider("circle",0,0,1);
  
  }
  }
  
  // LEVEL 2
  function level2(){
    ground.addImage(bg2);
    SkullGroup.collide(invisible_ground);
  }

    