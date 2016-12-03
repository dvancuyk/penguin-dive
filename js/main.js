enchant();
var penguindive = {
  resources: {
    wallpaper: 'res/BG.png',
    penguin: 'res/penguinSheet.png',
    ice: 'res/Ice.png'
  },
  convertToSeconds: function(time){
    return time * 0.001;
  }
};

window.onload = function(){
  var game = new Game(320, 440);
  for (var resource in penguindive.resources) {
      if (penguindive.resources.hasOwnProperty(resource)) {
        console.log('loading ' + penguindive.resources[resource]);
          game.preload(penguindive.resources[resource]);
      }
  }

  // 5 - Game settings
  game.fps = 30;
  game.scale = 1;
  game.onload = () => {
    console.log('Hi Ocean');
    var scene = new SceneGame();
    game.pushScene(scene);
  }

  game.start();
};

var SceneGame = Class.create(Scene, {
  initialize: function(){
    Scene.apply(this);
    this.addEventListener(Event.TOUCH_START, this.handleTouchControl);
    this.addEventListener(Event.ENTER_FRAME, this.update);

    var game = Game.instance,
      label = new Label('Hi, Ocean (take 2)!'),
      bg = new Sprite(320, 440);

    bg.image = game.assets[penguindive.resources.wallpaper];
    var penguin = new Penguin();
    penguin.x = game.width/2 - penguin.width/2;
    penguin.y = 280;
    this.penguin = penguin;

    this.addChild(bg);
    this.addChild(label);
    this.addChild(penguin);
  },
  handleTouchControl: function(e){
    var laneWidth = 320/3;
    var lane = Math.floor(e.x/laneWidth);
    lane = Math.max(Math.min(2, lane), 0);
    this.penguin.switchToLaneNumber(lane);
  }
});

var Penguin = Class.create(Sprite, {
  initialize: function(){
    Sprite.apply(this, [30, 43]);
    this.image = Game.instance.assets[penguindive.resources.penguin];
    this.animationDuration = 0;
    this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
  },
  updateAnimation: function(e){
    this.animationDuration += penguindive.convertToSeconds(e.elapsed);
    const threshold = .25;
    if(this.animationDuration >= threshold){
      this.frame = (this.frame + 1) % 2;
      this.animationDuration -= threshold;
    }
  },
  switchToLaneNumber: function(lane){
    var targetX = 160 - this.width / 2 + (lane - 1) * 90;
    this.x = targetX;
  }
});

var Ice = Class.create(Sprite, {
  initialize: function(lane){
    Sprite.apply(this, [48, 49]);
    this.rotationSpeed = 0;
    this.setLane(lane);
    this.addEventListener(Event.ENTER_FRAME, this.update);
  },
  setLane: function(lane) {
	  var game = Game.instance;
	  const distance = 90;

	  this.rotationSpeed = Math.random() * 100 - 50;

    this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
    this.y = -this.height;
  },
  update: function(e){
    var speed = 300;

    this.y += speed * penguindive.convertToSeconds(e.elapsed);
	  this.rotation += this.rotationSpeed * penguindive.convertToSeconds(e.elapsed);
    if (this.y > game.height) {
        this.parentNode.removeChild(this);
    }
  }
});
