'use strict';

// imports
const CommandEnum = quick.CommandEnum;
const Controllable = quickPlugins.respond.Controllable;
const Quick = quick.Quick;
const Sprite = quick.Sprite;
const Scene = quick.Scene;

// classes
class GameScene extends Scene {
  constructor() {
    super();
    this.add(new Background());
    this.add(new Player());
  }
}

class Background extends Sprite {
  constructor() {
    super();
    this.setColor('Black');
  }

  init() {
    this.setSize(this.getScene());
  }
}

class Player extends Controllable {
  constructor() {
    super();
    this.controller = Quick.getController();
    this.setColor('White');
    this.setSize(32, 32);
    this.step = 2;
  }
}

Quick.setName('Skel');
Quick.init(function () { return new GameScene() });
