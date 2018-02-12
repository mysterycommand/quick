'use strict';

// imports
const CommandEnum = quick.CommandEnum;
const Quick = quick.Quick;
const Sprite = quick.Sprite;
const Scene = quick.Scene;

// constants
const SPEED = 2;

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

class Player extends Sprite {
  constructor() {
    super();
    this.controller = Quick.getController();
    this.setColor('White');
    this.setSize(32, 32);
  }

  // override
  update() {
    if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
      this.moveX(-SPEED);
    } else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
      this.moveX(SPEED);
    }

    if (this.controller.keyDown(CommandEnum.UP) && this.getTop() > 0) {
      this.moveY(-SPEED);
    } else if (this.controller.keyDown(CommandEnum.DOWN) && this.getBottom() < Quick.getHeight()) {
      this.moveY(SPEED);
    }
  }
}

Quick.setName('Skel');
Quick.init(function () { return new GameScene() });
