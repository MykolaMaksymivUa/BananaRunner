let game;
let user;
let map = new Map();
/**
 * Global game setting
 * Describe player stats, global settings
 */
let gameAssets = {

  environment: {
    speedRange: [300, 300],
    spawn: [50, 250],
    sizeRange: [200, 300],
    heightRange: [-5, 5],
    verticalLimit: [0.4, 0.8],
    heightScale: 15,
    treeSpeed: 100,
  },
  player: {
    gravity: 1000,
    jumpLenght: 400,
    jumpCount: 2,
    startPos: 100,
  },
  bounties: {
    coinPercent: 25,
    jmpCoinPercent: 10,
    extraLifePercent: 1,
  },
  mokeyPercent: 15,
  score: 0,
};

  window.onload = function() {

    let gameConfig  = {
      type: Phaser.AUTO,
      width: 1200,
      height: 700,
      scene: [preloadGame, menuScene, optionsScene, playGame],
      backgroundColor: 0x4ab9e6,

      physics: {
        default: "arcade"
      }
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
  }

  /**
   * @class 
   * contains PreloadGame scene, loading all assets
   */

  class preloadGame extends Phaser.Scene{
    constructor(){
      super("PreloadGame");
    }
    preload(){
      this.load.image("platform", './img/sand.png');
      this.load.image("sun", './img/sun.png');
      this.load.image("playBtn", "./img/playBtn.png");
      this.load.image("infoBtn", "./img/infoBtn.png");
      this.load.image("menuBG", "./img/menuBG.png");
      this.load.image("logo", "./img/logo.png");
      this.load.image("backBtn", "./img/back.png");
      this.load.spritesheet("player", "/img/css_sprites1.png", {
        frameWidth: 30,
        frameHeight: 45
      });
  
      this.load.spritesheet("coin", "/img/coins_sprites.png", {
      frameWidth: 40,
      frameHeight: 46
      });
      // this.load.spritesheet("coinYellow", "/img/yellowcoin.png", {
      //   frameWidth: 20,
      //   frameHeight: 20
      // });
    
      this.load.spritesheet("monkey", "/img/monkey_sprite.png", {
      frameWidth: 76,
      frameHeight: 83
      });
    
      this.load.spritesheet("trees", "/img/trees.png", {
      frameWidth: 400,
      frameHeight: 522
      });
    }
    create() {
    
      // setting player animation.
      this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player", {
          start: 0,
          end: 3
        }),
        frameRate: 15,
        repeat: -1
      });
      this.anims.create({
        key: "rotateYellow",
        frames: this.anims.generateFrameNumbers("coin", {
          start: 0,
          end: 2
        }),
        frameRate: 15,
        yoyo: true,
        repeat: -1
      });
      this.anims.create({
        key: "rotateRed",
        frames: this.anims.generateFrameNumbers("coin", {
          start: 3,
          end: 5
        }),
        frameRate: 15,
        yoyo: true,
        repeat: -1
      });
      this.anims.create({
        key: "rotateGreen",
        frames: this.anims.generateFrameNumbers("coin", {
          start: 6,
          end: 8
        }),
        frameRate: 15,
        yoyo: true,
        repeat: -1
      });
      this.anims.create({
        key: "enemy",
        frames: this.anims.generateFrameNumbers("monkey", {
          start: 0,
          end: 6
        }),
        frameRate: 15,
        repeat: -1
      });

      this.scene.start("MenuScene");
    }
  }
  /**
   * @class MenuScene
   * contains Menu interface. 
   */
  class menuScene extends Phaser.Scene {
    constructor () {
      super('MenuScene');
    }

    create() {
      this.add.image(0, 400, "menuBG").setOrigin(0, 0);
      this.add.image(game.config.width / 2 + 25, game.config.height / 2 - 260, "logo");
      let playBtn = this.add.image(
        this.game.renderer.width / 2, this.game.renderer.height / 2 - 50, "playBtn").setDepth(1);
      let infoBtn = this.add.image(
        this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, "infoBtn").setDepth(1);
      this.add.text(game.config.width - 350, 350, "TOP SCORE", 
      {fontSize: "40px", fill: "1f1b1b", fontStyle: "bold"});  
      this.add.text(
        game.config.width - 350, 400,
        getHighScore(),
        { fontSize: "40px", fill: "1f1b1b"});
      infoBtn.setInteractive();
      playBtn.setInteractive();
      playBtn.on("pointerup", () => {
        this.scene.start("PlayGame");
      });
      infoBtn.on("pointerup", () => {
        this.scene.start("OptionsScene");
      });
    }
  }
  /**
   * @class OptionsScene
   * contains interface after pressing on Info button. 
   */
  class optionsScene extends Phaser.Scene {
    constructor () {
      super("OptionsScene");
    }
    create() {
      //let closeBtn = this.add.text();
      let closeBtn = this.add.image(
        this.game.renderer.width / 2, this.game.renderer.height / 2 + 300, "backBtn").setDepth(1);
      this.monkey = this.physics.add.sprite(350, game.config.height / 2 - 100, "monkey");
      this.monkey.anims.play("enemy");
      this.add.text(420, game.config.height / 2 - 120, "Enemy, can eat Banana", { fontSize: "40px", fill: "#000", fontStyle: "bold" });

      this.player = this.physics.add.sprite(350, game.config.height / 2 - 200, "player").setScale(1.8);
      this.player.anims.play("run");
      this.add.text(420, game.config.height / 2 - 220, "Banana, double tap to jump", { fontSize: "40px", fill: "#000", fontStyle: "bold" });

      this.yellow = this.physics.add.sprite(350, game.config.height / 2 , "coin").setScale(1.5);
      this.yellow.anims.play("rotateYellow");
      this.add.text(420, game.config.height / 2 - 20 , "Add additional points to score", { fontSize: "40px", fill: "#000", fontStyle: "bold" }); 

      this.green = this.physics.add.sprite(350, game.config.height / 2 + 100, "coin").setScale(1.5);
      this.green.anims.play("rotateGreen"); 
      this.add.text(420, game.config.height / 2 + 80 , "Increase Banana jump", { fontSize: "40px", fill: "#000", fontStyle: "bold" });

      this.red = this.physics.add.sprite(350, game.config.height / 2 + 200, "coin").setScale(1.5);
      this.red.anims.play("rotateRed"); 
      this.add.text(420, game.config.height / 2 + 180 , "Extra life PS:Doesn't work", { fontSize: "40px", fill: "#000", fontStyle: "bold" });
      closeBtn.setInteractive();
      closeBtn.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  /**
   * @class PlayGame
   * contains game logic, start after pressing play button.
   */
  class playGame extends Phaser.Scene{
    constructor() {
      super('PlayGame');
    }
    create() {
      this.activeJumps = 0;
      this.addedPlatforms = 0;
      this.dying = false;

      this.scoreTxt = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
      this.add.image(game.config.width - 200, game.config.height - 600, "sun");

      /**
       * Static group with all active platforms, after platform go out from the screen, 
       *  will add it to deleted platform array.
       * ------------------------------------------------------------------------------------
       */

      this.activePlatformArray = this.add.group({
        removeCallback: (platform) => {
          platform.scene.passivePlatformArray.add(platform);
        }
      });
      this.passivePlatformArray = this.add.group({
        removeCallback: (platform) => {
          platform.scene.activePlatformArray.add(platform);
        }
      });
      /**
       * Static group with all active coins, after coin go out from the screen, 
       *  will add it to deleted coin array.
      */
     this.activeCoinsYellowArray = this.add.group({
      removeCallback: function (coin) {
        coin.scene.passiveCoinsYellowArray.add(coin);
      }
    });
    this.passiveCoinsYellowArray = this.add.group({
      removeCallback: function (coin) {
        coin.scene.activeCoinsYellowArray.add(coin);
      }
    });
    this.activeCoinsGreenArray = this.add.group({
      removeCallback: function (coin) {
        coin.scene.passiveCoinsGreenArray.add(coin);
      }
    });
    this.passiveCoinsGreenArray = this.add.group({
      removeCallback: function (coin) {
        coin.scene.activeCoinsGreenArray.add(coin);
      }
    });

      /**
       * Static group with all active monkeys, after monkeys go out from the screen, 
       *  will add it to deleted monkeys array.
      */
     this.activeMonkeysArray = this.add.group({
      removeCallback: function(monkeys) {
        monkeys.scene.passiveMonkeysArray.add(monkeys);
      }
    });
    this.passiveMonkeysArray = this.add.group({
      removeCallback: function(monkeys){
        monkeys.scene.activeMonkeysArray.add(monkeys);
      }
    });
      /**
       * ------------------------------------------------------------------------------------
       */

      this.treesGroup = this.add.group();
      this.addTrees();

      this.addPlatform(game.config.width, game.config.width / 2, 
        game.config.height * gameAssets.environment.verticalLimit[1]);

      this.player = this.physics.add.sprite(gameAssets.player.startPos, game.config.height / 2, "player");
      this.player.setScale(1.8);
      this.player.setGravityY(gameAssets.player.gravity);
      this.player.setDepth(2);

      /**
       * Setting collisions between the player and static elements.
       * ------------------------------------------------------------------------------------
      */ 
      // 1) Between player and platform
      this.platformCollider = this.physics.add.collider(this.player, this.activePlatformArray, function () {
        if(!this.player.anims.isPlaying) {
          this.player.anims.play("run");
        }
      }, null, this);
      // 2 - a) Between player and yellow coin
      this.physics.add.overlap(this.player, this.activeCoinsYellowArray, function(player, coin) {
        gameAssets.score += 200;
        this.tweens.add({
          targets: coin,
          y: coin.y - 200,
          alpha: 0,
          duration: 800,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function() {
            this.activeCoinsYellowArray.remove(coin);
          }
        });
      }, null, this);

      // 2 - b) Between player and green coin
      this.physics.add.overlap(this.player, this.activeCoinsGreenArray, function(player, coin) {
        this.tweens.add({
          targets: coin,
          y: coin.y - 600,
          alpha: 0,
          duration: 400,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function() {
            this.activeCoinsGreenArray.remove(coin);
          }
        });
        if(gameAssets.player.jumpLenght < 860) {
          gameAssets.player.jumpLenght += 20;
        }
        console.log(gameAssets.player.jumpLenght);
      }, null, this);
      // 3) Between player and monkey
      this.physics.add.overlap(this.player, this.activeMonkeysArray, function(player, monkey) {
        this.dying = true;
        this.player.anims.stop();
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);
      }, null, this);
    /**
     * ------------------------------------------------------------------------------------
     */
    this.input.on("pointerdown", this.jump, this);
  }

  addTrees(){
    let rightmostTree = this.getRightmostTree();
    if(rightmostTree < game.config.width * 2){
      let tree = this.physics.add.sprite(
        rightmostTree + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "trees");
      tree.setOrigin(0.5, 1);
      tree.body.setVelocityX(gameAssets.environment.treeSpeed * -1)
      this.treesGroup.add(tree);
      if(Phaser.Math.Between(0, 1)){
        tree.setDepth(1);
      }
      tree.setFrame(Phaser.Math.Between(0, 2));
      this.addTrees();
    }
  }

  getRightmostTree(){
    let rightmostTree = -200;
    this.treesGroup.getChildren().forEach(function(tree){
      rightmostTree = Math.max(rightmostTree, tree.x);
    })
    return rightmostTree;
  }

  // addCoins (animationName, posX, posY, platform, platformWidth) {
  //   if(this.passiveCoinsArray.getLength()){
  //     let coin = this.passiveCoinsArray.getFirst();
  //     coin.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
  //     coin.y = posY - 80;
  //     coin.alpha = 1;
  //     coin.active = true;
  //     coin.visible = true;
  //     this.passiveCoinsArray.remove(coin);
  //   }
  //   else{
  //     let coin = this.physics.add.sprite(posX, posY - 50, "coin");
  //     coin.setImmovable(true);
  //     coin.setVelocityX(platform.body.velocity.x);
  //     coin.anims.play(animationName);
  //     coin.setDepth(2);
  //     this.activeCoinsArray.add(coin);
  //   }
  // }
  addPlatform(platformWidth, posX, posY){
    this.addedPlatforms ++;
    let platform;
    if(this.passivePlatformArray.getLength()){
      platform = this.passivePlatformArray.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.passivePlatformArray.remove(platform);
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    }
    else{
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(
        gameAssets.environment.speedRange[0], gameAssets.environment.speedRange[1]) * -1);
      this.activePlatformArray.add(platform);
      platform.setDepth(2);
    }
    this.nextPlatformDistance = Phaser.Math.Between(
      gameAssets.environment.spawn[0], gameAssets.environment.spawn[1]);

    if(this.addedPlatforms > 1) {

      /**
       * Generate new coins
       * ------------------------------------------------------------------------------------
       */
      if(Phaser.Math.Between(1, 100) <= gameAssets.bounties.coinPercent) {
        if(this.passiveCoinsYellowArray.getLength()){
          let coin = this.passiveCoinsYellowArray.getFirst();
          coin.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          coin.y = posY - 80;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.passiveCoinsYellowArray.remove(coin);
        }
        else{
          let coin = this.physics.add.sprite(posX, posY - 50, "coin");
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play("rotateYellow");
          coin.setDepth(2);
          this.activeCoinsYellowArray.add(coin);
        }
      } 
      if(Phaser.Math.Between(1, 100) <= gameAssets.bounties.jmpCoinPercent) {
        if(this.passiveCoinsGreenArray.getLength()){
          let coin = this.passiveCoinsGreenArray.getFirst();
          coin.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          coin.y = posY - 80;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.passiveCoinsGreenArray.remove(coin);
        }
        else{
          let coin = this.physics.add.sprite(posX, posY - 50, "coin");
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play("rotateGreen");
          coin.setDepth(2);
          this.activeCoinsGreenArray.add(coin);
        }
      } 
      /**
       * ------------------------------------------------------------------------------------
       */
      
      // is there a monkey over the platform?
      if(Phaser.Math.Between(1, 100) <= gameAssets.mokeyPercent){
        if(this.passiveMonkeysArray.getLength()){
          let monkey = this.passiveMonkeysArray.getFirst();
          monkey.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          monkey.y = posY - 44;
          monkey.alpha = 1;
          monkey.active = true;
          monkey.visible = true;
          this.passiveMonkeysArray.remove(monkey);
        }
        else{
          let monkey = this.physics.add.sprite(
            posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 44, "monkey");
          monkey.setImmovable(true);
          monkey.setVelocityX(platform.body.velocity.x);
          monkey.setSize(5, 2, true);
          monkey.anims.play("enemy");
          monkey.setDepth(2);
          this.activeMonkeysArray.add(monkey);
        }
      }
    }

}
  jump(){
    if((!this.dying) && this.player.body.touching.down || 
    (this.activeJumps > 0 && this.activeJumps < gameAssets.player.jumpCount)){
      if(this.player.body.touching.down){
        this.activeJumps = 0;
      }
      this.player.setVelocityY(gameAssets.player.jumpLenght * -1);
      this.activeJumps ++;
      this.player.anims.stop();
    }
  }
  update(){
    gameAssets.score += 1;
    this.scoreTxt.setText("score:" + gameAssets.score);
    let minDistance = game.config.width;
    let rightmostPlatformHeight = 0;
    this.player.x = gameAssets.player.startPos;

    // End game.
    if(this.player.y > game.config.height) {
      if (localStorage.getItem(user) < gameAssets.score ) {
        user = prompt("Enter your nickname");
        localStorage.setItem(user, gameAssets.score);
      }
      gameAssets.score = 0;
      this.scene.start("MenuScene");
    }
    
    this.treesGroup.getChildren().forEach(function(Tree){
      if(Tree.x < - Tree.displayWidth){
        let rightmostTree = this.getRightmostTree();
        Tree.x = rightmostTree + Phaser.Math.Between(100, 350);
        Tree.y = game.config.height + Phaser.Math.Between(0, 100);
        Tree.setFrame(Phaser.Math.Between(0, 2))
        if(Phaser.Math.Between(0, 1)){
          Tree.setDepth(1);
        }
      }
    }, this);
    /**
     * Reusing static components, remove them from screen and add to passiveArray
     * --------------------------------------------------------------------------------------------------------
     */
    this.activePlatformArray.getChildren().forEach(function(platform) {
      let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
      if(platformDistance < minDistance){
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if(platform.x < - platform.displayWidth / 2){
        this.activePlatformArray.killAndHide(platform);
        this.activePlatformArray.remove(platform);
      }
    }, this);

    this.activeCoinsYellowArray.getChildren().forEach(function(coin){
      if(coin.x < - coin.displayWidth / 2){
        this.activeCoinsYellowArray.killAndHide(coin);
        this.activeCoinsYellowArray.remove(coin);
      }
    }, this);
    this.activeCoinsGreenArray.getChildren().forEach(function(coin){
      if(coin.x < - coin.displayWidth / 2){
        this.activeCoinsGreenArray.killAndHide(coin);
        this.activeCoinsGreenArray.remove(coin);
      }
    }, this);
    /**
     * --------------------------------------------------------------------------------------------------------
     */
    // adding new platforms.
    if(minDistance > this.nextPlatformDistance){
      let nextPlatformWidth = Phaser.Math.Between(
        gameAssets.environment.sizeRange[0], gameAssets.environment.sizeRange[1]);
      let platformRandomHeight = gameAssets.environment.heightScale * Phaser.Math.Between(
        gameAssets.environment.heightRange[0], gameAssets.environment.heightRange[1]);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = game.config.height * gameAssets.environment.verticalLimit[0];
      let maxPlatformHeight = game.config.height * gameAssets.environment.verticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
}
/**
 * @return string - sorted map
 * 1) Put all data from localStorage to map
 * 2) Sort map by values
 */
function getHighScore() {
  for(let i = 0; localStorage.length > i; i++) {
    let key = localStorage.key(i);
    let value = localStorage[key];
    map.set(key, value);
  }
  map[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  };

  return [...map];
}
/**
 * @function resize(){}
 * Make optimal resolution to fix some lags 
 */
function resize(){
  let canvas = document.querySelector("canvas");
  let windowRatio = window.innerWidth / window.innerHeight;
  let gameRatio = game.config.width / game.config.height;
  if(windowRatio < gameRatio){
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = (window.innerWidth / gameRatio) + "px";
  }
  else{
    canvas.style.width = (window.innerHeight * gameRatio) + "px";
    canvas.style.height = window.innerHeight + "px";
  }
}

