var JOGAR = 1;
var ENCERRAR = 0;
var estados = JOGAR;
var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var imagemnuvem;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var pontuacao;
var grupoobstaculos, gruponuvens;
var fimdejogo, reiniciar, gameover, restart;
var somSalto, somMorte, checkPoint;

function preload(){
  trex_correndo =loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemnuvem = loadImage("cloud2.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameover = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  
  checkPoint = loadSound("checkpoint.mp3");
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  

}

function setup() {

  createCanvas(windowWidth,windowHeight);
  
  //criar texto da pontuação
  
  
  //criar um sprite do trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  
  //criar um sprite do solo
  solo = createSprite(width/2,height-20,width,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  //cria um solo invisível
  soloinvisivel = createSprite(width/2,height-10,width,10);
  soloinvisivel.visible = false;
  
  grupoobstaculos = new Group();
  gruponuvens = new Group();
  
  pontuacao = 0;
  
  
  trex.setCollider("circle", 0, 0, 40);
  
  fimdejogo = createSprite(width/2,height/2);
  fimdejogo.addImage(gameover);
  fimdejogo.visible = false;
  
  reiniciar = createSprite(width/2,height/2 + 50);
  reiniciar.addImage(restart);
  reiniciar.visible = false;
  
  fimdejogo.scale = 0.5;
  reiniciar.scale = 0.5;
  
 
}

function draw() {
  
  //definir cor de fundo
  background(240);
  
  //mostra a pontuação na tela
   text("Pontuacao: "+ pontuacao, width/2 -50,height-500);
  
    if(pontuacao > 0 && pontuacao%100 == 0){

      checkPoint.play();
    }
  
   //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  
  if(estados == JOGAR){
    //faz o solo de mover
    solo.velocityX = -(4+3*pontuacao/100);
    
    //atualiza a pontuação
    pontuacao = pontuacao + Math.round((frameRate()/20));
    
   
    
    // pular quando a tecla espaço é acionada
    if(touches.length > 0 && trex.y > height- 60) {
      trex.velocityY = -10;
      somSalto.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.5

    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
      //gerador de nuvens e obstáculos 
      GerarNuvens();
      GerarObstaculos();
    
      if(grupoobstaculos.isTouching(trex)){
        somMorte.play();
        estados = ENCERRAR;
       // somSalto.play();
       // trex.velocityY = -12;
      }
    
  }
  else if(estados == ENCERRAR){
    solo.velocityX = 0;
    grupoobstaculos.setVelocityXEach(0);
    gruponuvens.setVelocityXEach(0);
    
    trex.changeAnimation("collided");
    trex.velocityY = 0;
    
    //define o tempo de vida dos objetos do jogo após o fim
    grupoobstaculos.setLifetimeEach(-1);
    gruponuvens.setLifetimeEach(-1);
    
    fimdejogo.visible = true;
    reiniciar.visible = true;
    
    if(touches.length > 0){
    
    reset();
    touches= [];
    }
    
  }
  
 
  
  drawSprites();
  
}

function GerarNuvens(){
  
  if(frameCount % 60 == 0){
  var nuvem = createSprite(600,100,40,10);
  nuvem.velocityX = -3;
  nuvem.addImage(imagemnuvem);
  nuvem.scale = 0.6;
  nuvem.y = Math.round(random(height-100,height-300));
    
  nuvem.depth = trex.depth;
  trex.depth = trex.depth+1;
    
  nuvem.lifetime = 200;
    
    gruponuvens.add(nuvem);
  }
  
}

function GerarObstaculos(){
  
  if(frameCount %60 == 0){
    
    var obstaculo = createSprite(width,height-30,10,40);
    obstaculo.velocityX = -(6+ pontuacao/100);
    
    var rand = Math.round(random(1,6));
    
    switch(rand){
        case 1: obstaculo.addImage(obstaculo1);
                break;
        case 2: obstaculo.addImage(obstaculo2);
                break;
        case 3: obstaculo.addImage(obstaculo3);
                break;
        case 4: obstaculo.addImage(obstaculo4);
                break;
        case 5: obstaculo.addImage(obstaculo5);
                break;
        case 6: obstaculo.addImage(obstaculo6);
                break;
                default: break;
    }
    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    
    grupoobstaculos.add(obstaculo);
  }
  
}
function reset(){
  
  estados = JOGAR;
  reiniciar.visible = false;
  fimdejogo.visible = false;
  grupoobstaculos.destroyEach();
  gruponuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao =  0;
}


