var bg;
var PLAY = 0;
var END = 1
var gameState = PLAY;
var score = 0;
function preload() {
  bgImage = loadImage("bg.png");
  groundi = loadImage("grass.png");
  trexi = loadAnimation("trex1.png", "trex2.png", "trex3.png")
  suni = loadImage("sun.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  cloudi = loadImage("cloud.png");
  gameOveri = loadImage("gameover.png");
  restarti = loadImage("restart.png");
  trex_collided = loadAnimation("trex_collided.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
//   bg = createSprite(10,10, width,height);
//   bg.addImage();
//   bg.scale = 1.5;
  
  sun = createSprite(width-50,100,10,10);
  sun.addImage(suni);
  sun.scale = 0.1;
  sun.velocityX = -0.1;
  
  ground = createSprite(width/2, height+300, width, 2);
  ground.addImage(groundi);
  ground.scale = 1;
  ground.velocityX = -3;
  ground.x = width/2;
  
  trex =createSprite(100,height-100,20,50);
  trex.addAnimation("run", trexi);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  
  
  invisibleGround = createSprite(width/2, height-50, width, 10);
  invisibleGround.visible = false;
 
  gameOver = createSprite(width/2, (height/2)-100);
  gameOver.addImage(gameOveri);
  gameOver.scale = 0.3;
  gameOver.depth = 10;   
  restart = createSprite(width/2, (height/2)+50);
  restart.addImage(restarti);
  restart.scale = 0.5;
}

function draw() {
  background(bgImage)
  text("Score: "+ score,30,50);
  
  if (gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    trex.velocityY +=0.8;
    if (ground.x < 0){
      ground.x = ground.width/2;
  }
    if (keyDown("up") && trex.y>height-100 || keyDown("SPACE") && trex.y>height-100 || touches.length>0 && trex.y>height-100){
      trex.velocityY =-17;
      touches=[];
    }
    if (trex.isTouching(obstaclesGroup)){
      gameState=END;
    }
    spawnObstacles();
  spawnClouds();
  }
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
    
  }
  trex.collide(invisibleGround);
  
  

  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-95,20,30);
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(3,4))
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    switch(rand) {
      case 1: obstacle.setCollider("rectangle", 0,0,600,950);
              break;
      case 2: obstacle.setCollider("rectangle", -100,0,900,950);
              break;
      case 3: obstacle.setCollider("rectangle", -100,0,900,950);
              break;
      case 4: obstacle.setCollider("rectangle", -100,0,900,950);
              break;
      default: break;
    }
    console.log(rand)
    obstacle.scale = 0.1 ;
    obstacle.lifetime = width/(6 + 3*score/100);
    obstacle.depth = trex.depth;
    trex.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (frameCount % 100 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudi);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("run", trexi);
  
  score = 0;
}