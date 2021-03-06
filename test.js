'use strict';

// environment mocks
global.addEventListener = () => {};

global.document = {
  getElementById: (id) => {
    if (id == 'game') {
      return {
        focus: () => {},

        getContext: () => {
          return {};
        },

        height: 400,
        offsetLeft: 0,
        offsetTop: 0,
        style: {},
        width: 640,
      };
    } else {
      return {};
    }
  }
};

// imports
const assert = require('assert');
const quick = require('./quick.js');

// additional mocks
global.localStorage = {};
global.navigator = {};
global.window = {};

// run tests
animationTest();
controllerTest();
fontSpriteTest();
frameTest();
pointTest();
pointerTest();
quickTest();
rectTest();
sceneTest();
spriteTest();

// tests
function animationTest() {
  let subject;

  const IMAGE1 = {
    width: 1,
    height: 2,
  };

  const IMAGE2 = {
    width: 3,
    height: 4,
  };

  const FRAMES = [
    new quick.Frame(IMAGE1, 1),
    new quick.Frame(IMAGE2, 2),
  ];

  // constructor
  subject = new quick.Animation(FRAMES);
  assert.equal(IMAGE1, subject.image);
  assert.equal(IMAGE1.width, subject.width);
  assert.equal(IMAGE1.height, subject.height);
  assert.equal(false, subject.sync());
  assert.equal(IMAGE2, subject.image);
  assert.equal(IMAGE2.width, subject.width);
  assert.equal(IMAGE2.height, subject.height);
  assert.equal(false, subject.sync());
  assert.equal(IMAGE2, subject.image);
  assert.equal(IMAGE2.width, subject.width);
  assert.equal(IMAGE2.height, subject.height);
  assert.equal(true, subject.sync());
  assert.equal(IMAGE1, subject.image);
  assert.equal(IMAGE1.width, subject.width);
  assert.equal(IMAGE1.height, subject.height);
  assert.equal(false, subject.sync());
  assert.equal(IMAGE2, subject.image);
  assert.equal(IMAGE2.width, subject.width);
  assert.equal(IMAGE2.height, subject.height);
  assert.equal(false, subject.sync());
  assert.equal(IMAGE2, subject.image);
  assert.equal(IMAGE2.width, subject.width);
  assert.equal(IMAGE2.height, subject.height);
  assert.equal(true, subject.sync());
  assert.equal(IMAGE1, subject.image);
  assert.equal(IMAGE1.width, subject.width);
  assert.equal(IMAGE1.height, subject.height);
}

function controllerTest() {
  let controller;

  // mock
  const deviceMock = {
    commands: (() => {
      let result = {};

      for (let key in quick.CommandEnum) if (quick.CommandEnum.hasOwnProperty(key)) {
        result[quick.CommandEnum[key]] = true;
      }

      return result;
    })()
  };

  // no args constructor
  controller = quick.Quick.getController();

  for (let i in quick.CommandEnum) if (quick.CommandEnum.hasOwnProperty(i)) {
    let value = quick.CommandEnum[i];
    assert.equal(undefined, controller.keyDown(value));
    assert.equal(undefined, controller.keyPush(value));
  }

  // with all commands, first update
  controller.setDevice(deviceMock);
  assert.equal(undefined, controller.update());

  for (let j in quick.CommandEnum) if (quick.CommandEnum.hasOwnProperty(j)) {
    assert.equal(true, controller.keyDown(quick.CommandEnum[j]));
    assert.equal(true, controller.keyPush(quick.CommandEnum[j]));
  }

  // with all commands, second update
  assert.equal(undefined, controller.update());

  for (let k in quick.CommandEnum) if (quick.CommandEnum.hasOwnProperty(k)) {
    assert.equal(true, controller.keyDown(quick.CommandEnum[k]));
    assert.equal(false, controller.keyPush(quick.CommandEnum[k]));
  }
}

function fontSpriteTest() {
  let text;

  // no args constructor
  new quick.FontSprite();

  // all args constructor
  text = new quick.FontSprite('whatever');

  // setText
  text.setText('test');

  // getString
  assert.equal('test', text.text);
}

function frameTest() {
  const IMAGE = {
    width: 1,
    height: 2,
  };

  let subject;

  // constructor
  subject = new quick.Frame(IMAGE, 1);
  assert.equal(IMAGE, subject.image);
  assert.equal(1, subject.duration);
  assert.equal(IMAGE.width, subject.width);
  assert.equal(IMAGE.height, subject.height);
}

function pointTest() {
  let subject;

  // no args constructor
  subject = new quick.Point();
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);

  // all args constructor
  subject = new quick.Point(1, 2);
  assert.equal(1, subject.x);
  assert.equal(2, subject.y);

  // setters
  assert.equal(subject, subject.setX(8));
  assert.equal(8, subject.x);
  assert.equal(subject, subject.setY(9));
  assert.equal(9, subject.y);
}

function pointerTest() {
  let pointer;

  // mock
  const deviceMock = {
    command: true,
    x: 100,
    y: 200,
  };

  // without device
  pointer = quick.Quick.getPointer();
  pointer.update();
  assert.equal(0, pointer.x);
  assert.equal(0, pointer.y);
  assert.equal(false, pointer.down);

  // with device
  pointer.setDevice(deviceMock);
  pointer.update();
  assert.equal(100, pointer.x);
  assert.equal(200, pointer.y);
  assert.equal(true, pointer.down);
}

function quickTest() {
  // load / save
  assert.equal(undefined, quick.Quick.load());
  let game = { level: 1, lives: 2 };
  assert.equal(undefined, quick.Quick.save(game));
  game = quick.Quick.load();
  assert.equal(JSON.stringify({ level: 1, lives: 2 }), JSON.stringify(game));
}

function rectTest() {
  let subject;

  // no args constructor
  subject = new quick.Rect();
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);
  assert.equal(0, subject.width);
  assert.equal(0, subject.height);

  // all args constructor
  subject = new quick.Rect(1, 2, 3, 4);
  assert.equal(1, subject.x);
  assert.equal(2, subject.y);
  assert.equal(3, subject.width);
  assert.equal(4, subject.height);

  // setters
  assert.equal(subject, subject.setWidth(7));
  assert.equal(7, subject.width);

  assert.equal(subject, subject.setHeight(8));
  assert.equal(8, subject.height);

  assert.equal(subject, subject.setHeight(9));
  assert.equal(9, subject.height);

  assert.equal(subject, subject.setLeft(17));
  assert.equal(17, subject.left);

  subject.left = 16;
  assert.equal(16, subject.left);

  assert.equal(subject, subject.setRight(18));
  assert.equal(18, subject.right);

  subject.right = 17;
  assert.equal(17, subject.right);

  assert.equal(subject, subject.setTop(19));
  assert.equal(19, subject.top);

  subject.top = 18;
  assert.equal(18, subject.top);

  assert.equal(subject, subject.setBottom(11));
  assert.equal(11, subject.bottom);

  subject.bottom = 10;
  assert.equal(10, subject.bottom);

  assert.equal(subject, subject.setCenterX(14));
  assert.equal(14, subject.centerX);

  subject.centerX = 13;
  assert.equal(13, subject.centerX);

  subject.setCenterY(15);
  assert.equal(15, subject.centerY);

  subject.centerY = 14;
  assert.equal(14, subject.centerY);

  assert.equal(subject, subject.setCenter(new quick.Point(12, 13)));
  assert.equal(12, subject.center.x);
  assert.equal(13, subject.center.y);

  subject.center = new quick.Point(11, 12);
  assert.equal(11, subject.center.x);
  assert.equal(12, subject.center.y);

  // metrics
  subject = new quick.Rect(0, 0, 1, 1);
  assert.equal(0, subject.right);
  assert.equal(0, subject.bottom);

  subject = new quick.Rect(0, 0, 2, 2);
  assert.equal(1, subject.right);
  assert.equal(1, subject.bottom);

  subject = new quick.Rect(0, 0, 3, 3);
  assert.equal(2, subject.right);
  assert.equal(2, subject.bottom);

  subject = new quick.Rect(0, 0, 4, 4);
  assert.equal(3, subject.right);
  assert.equal(3, subject.bottom);

  subject.setRight(subject.right);
  subject.setBottom(subject.bottom);
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);

  subject = new quick.Rect(0, 0, 5, 5);
  assert.equal(2, subject.centerX);
  assert.equal(2, subject.centerY);

  subject = new quick.Rect(0, 0, 6, 6);
  assert.equal(3, subject.centerX);
  assert.equal(3, subject.centerY);

  // union
  const RECT1 = new quick.Rect(10, 20, 30, 40);
  const RECT2 = new quick.Rect(50, 60, 70, 80);
  subject = RECT1.union(RECT2);
  assert.equal(RECT1.left, subject.left);
  assert.equal(RECT1.top, subject.top);
  assert.equal(RECT2.right, subject.right);
  assert.equal(RECT2.bottom, subject.bottom);
}

function sceneTest() {
  let subject = new quick.Scene();

  // build empty tiles
  subject.build([['a', 'b', 'c'], ['d', 'e', 'f']], () => { return null; });
}

function spriteTest() {
  const SCENE = new quick.Scene();
  let subject;
  let offBoundaryCalled;

  // no args constructor
  subject = new quick.Sprite(SCENE);
  assert.equal(0, subject.accelerationX);
  assert.equal(0, subject.accelerationY);
  assert.equal(null, subject.boundary);
  assert.equal(null, subject.color);
  assert.equal(false, subject.essential);
  assert.equal(0, subject.expiration);
  assert.equal(false, subject.expired);
  assert.equal(0, subject.layerIndex);
  assert.equal(0, subject.maxSpeedX);
  assert.equal(0, subject.maxSpeedY);
  assert.equal(SCENE, subject.scene);
  assert.equal(false, subject.solid);
  assert.equal(0, subject.speedX);
  assert.equal(0, subject.speedY);
  assert.equal(true, subject.visible);
  assert.equal(0, subject.angle);
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  assert.equal(null, subject.image);
  assert.equal(0, subject.tick);

  // setters
  subject = new quick.Sprite();
  assert.equal(subject, subject.setAccelerationX(4));
  assert.equal(4, subject.accelerationX);
  assert.equal(subject, subject.setAccelerationY(5));
  assert.equal(5, subject.accelerationY);
  assert.equal(subject, subject.setSpeedX(6));
  assert.equal(6, subject.speedX);
  assert.equal(subject, subject.setSpeedY(7));
  assert.equal(7, subject.speedY);
  assert.equal(subject, subject.setPosition(new quick.Point(8, 9)));
  assert.equal(8, subject.x);
  assert.equal(9, subject.y);
  assert.equal(subject, subject.setPosition(10, 11));
  assert.equal(10, subject.x);
  assert.equal(11, subject.y);
  assert.equal(subject, subject.setPosition(0, 0));
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);
  assert.equal(subject, subject.setSize(new quick.Rect(0, 0, 20, 21)));
  assert.equal(20, subject.width);
  assert.equal(21, subject.height);
  assert.equal(subject, subject.setSize(19, 19));
  assert.equal(19, subject.width);
  assert.equal(19, subject.height);
  assert.equal(subject, subject.setSize(0, 0));
  assert.equal(0, subject.width);
  assert.equal(0, subject.height);

  // collision detection
  let subject1 = new quick.Sprite().setWidth(2).setHeight(2);
  let subject2 = new quick.Sprite().setX(1).setY(1).setWidth(2).setHeight(2);
  let subject3 = new quick.Sprite().setX(2).setY(2).setWidth(2).setHeight(2);
  assert.equal(true, subject1.hasCollision(subject2));
  assert.equal(false, subject1.hasCollision(subject3));
  let collision = subject1.getCollision(subject2);
  assert.equal(true, collision.right);
  assert.equal(true, collision.bottom);

  // on boundary
  subject = new quick.Sprite();
  subject.setSize(16, 16);
  offBoundaryCalled = false;

  subject.offBoundary = () => {
    offBoundaryCalled = true;
  };

  subject.setBoundary(new quick.Rect(0, 0, 200, 200));
  subject.sync();
  assert.equal(false, offBoundaryCalled);

  // off boundary
  subject.setBoundary(new quick.Rect(20, 20, 100, 100));
  subject.sync();
  assert.equal(true, offBoundaryCalled);

  // expiration
  subject = new quick.Sprite().setExpiration(5);

  for (let i = 0; i < 5; ++i) {
    assert.equal(false, subject.expired);
    assert.equal(i, subject.tick);
    assert.equal(false, subject.sync());
  }

  assert.equal(true, subject.expired);
  assert.equal(true, subject.sync());

  // visibility
  subject.setVisible();
  assert.equal(true, subject.visible);
  subject.setVisible(true);
  assert.equal(true, subject.visible);
  subject.setVisible(false);
  assert.equal(false, subject.visible);

  // speed to angle
  subject = new quick.Sprite();
  subject.setSpeedToAngle(1, 0);
  assert.equal(1, Math.round(subject.speedX));
  assert.equal(0, Math.round(subject.speedY));
  subject.setSpeedToAngle(1, 90);
  assert.equal(0, Math.round(subject.speedX));
  assert.equal(1, Math.round(subject.speedY));
  subject.setSpeedToAngle(1, 180);
  assert.equal(-1, Math.round(subject.speedX));
  assert.equal(0, Math.round(subject.speedY));
  subject.setSpeedToAngle(1, 270);
  assert.equal(0, Math.round(subject.speedX));
  assert.equal(-1, Math.round(subject.speedY));

  // get angle
  subject = new quick.Sprite();
  assert.equal(0, subject.angle);
  subject.setSpeedX(1);
  subject.setSpeedY(1);
  assert.equal(45, subject.angle);
  subject.setSpeedX(-1);
  subject.setSpeedY(1);
  assert.equal(135, subject.angle);
  subject.setSpeedX(-1);
  subject.setSpeedY(-1);
  assert.equal(-135, subject.angle);
  subject.setSpeedX(1);
  subject.setSpeedY(-1);
  assert.equal(-45, subject.angle);

  // speed to subject
  subject1 = new quick.Sprite();
  subject2 = new quick.Sprite().setX(100).setY(50);
  subject1.setSpeedToPoint(2, subject2);
  subject2.setSpeedToPoint(2, subject1);
  assert.equal(100 / 150 * 2, subject1.speedX);
  assert.equal(50 / 150 * 2, subject1.speedY);
  assert.equal(-100 / 150 * 2, subject2.speedX);
  assert.equal(-50 / 150 * 2, subject2.speedY);

  // max speed
  subject = new quick.Sprite();
  subject.setMaxSpeedX(2);
  subject.setMaxSpeedY(4);
  subject.setAccelerationX(1);
  subject.setAccelerationY(2);
  subject.sync();
  assert.equal(1, subject.speedX);
  assert.equal(2, subject.speedY);
  subject.sync();
  assert.equal(2, subject.speedX);
  assert.equal(4, subject.speedY);
  subject.sync();
  assert.equal(2, subject.speedX);
  assert.equal(4, subject.speedY);
  subject.stop();
  subject.setAccelerationX(-1);
  subject.setAccelerationY(-2);
  subject.sync();
  assert.equal(-1, subject.speedX);
  assert.equal(-2, subject.speedY);
  subject.sync();
  assert.equal(-2, subject.speedX);
  assert.equal(-4, subject.speedY);
  subject.sync();
  assert.equal(-2, subject.speedX);
  assert.equal(-4, subject.speedY);

  // direction
  subject = new quick.Sprite();
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  subject.sync()
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  subject.sync()
  subject.x += 1;
  assert.equal(false, subject.direction.left);
  assert.equal(true, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  subject.sync();
  subject.y += 1;
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(true, subject.direction.bottom);
  subject.sync();
  subject.x -= 1;
  assert.equal(true, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  subject.sync();
  subject.y -= 1;
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(true, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
  subject.sync()
  assert.equal(false, subject.direction.left);
  assert.equal(false, subject.direction.right);
  assert.equal(false, subject.direction.top);
  assert.equal(false, subject.direction.bottom);
}

function textSpriteTest() {
  let text;

  // no args constructor
  new quick.TextSprite();

  // all args constructor
  text = new quick.TextSprite('whatever');

  // setFontColor
  text.setFontColor(quick.Color.Black);
  assert.equal(quick.Color.Black, text.fontColor);

  // setText
  text.setText('test');

  // getText
  assert.equal('test', text.text);
}
