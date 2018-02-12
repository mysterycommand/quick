'use strict';

// imports
const CommandEnum = quick.CommandEnum;
const Quick = quick.Quick;
const Sprite = quick.Sprite;
const Scene = quick.Scene;

// constants
const SPEED = 2;

const GAME_SCENE = new Scene();
Quick.setName('Skel');
Quick.init(function () { return GAME_SCENE });
const BACKGROUND = new Sprite();
BACKGROUND.setColor('Black');
BACKGROUND.setHeight(Quick.getHeight());
BACKGROUND.setWidth(Quick.getWidth());
GAME_SCENE.add(BACKGROUND);
const PLAYER = new Sprite();
PLAYER.controller = Quick.getController();
PLAYER.setColor('White');
PLAYER.setSize(32);

PLAYER.setDelegate({
  'update' : function() {
    if (PLAYER.controller.keyDown(CommandEnum.LEFT) && PLAYER.getLeft() > 0) {
      PLAYER.moveX(-SPEED);
    } else if (PLAYER.controller.keyDown(CommandEnum.RIGHT) && PLAYER.getRight() < Quick.getWidth()) {
      PLAYER.moveX(SPEED);
    }

    if (PLAYER.controller.keyDown(CommandEnum.UP) && PLAYER.getTop() > 0) {
      PLAYER.moveY(-SPEED);
    } else if (PLAYER.controller.keyDown(CommandEnum.DOWN) && PLAYER.getBottom() < Quick.getHeight()) {
      PLAYER.moveY(SPEED);
    }
  }
});

GAME_SCENE.add(PLAYER);
