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
controllerTest();
pointTest();
pointerTest();
quickTest();
rectTest();
sceneTest();
spriteTest();
textTest();

// tests
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

  // partial args constructor
  subject = new quick.Point(3);
  assert.equal(3, subject.x);
  assert.equal(0, subject.y);

  // getters & setters
  subject.setX(8);
  assert.equal(8, subject.x);
  subject.setY(9);
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
  let rect;

  // no args constructor
  rect = new quick.Rect();
  assert.equal(0, rect.height);
  assert.equal(0, rect.width);
  assert.equal(0, rect.x);
  assert.equal(0, rect.y);

  // all args constructor
  rect = new quick.Rect(1, 2, 3, 4);
  assert.equal(1, rect.x);
  assert.equal(2, rect.y);
  assert.equal(3, rect.width);
  assert.equal(4, rect.height);

  // partial args constructor
  rect = new quick.Rect(5);
  assert.equal(5, rect.x);
  assert.equal(0, rect.y);
  assert.equal(0, rect.width);
  assert.equal(0, rect.height);

  rect = new quick.Rect(6, 7);
  assert.equal(6, rect.x);
  assert.equal(7, rect.y);
  assert.equal(0, rect.width);
  assert.equal(0, rect.height);

  rect = new quick.Rect(8, 9, 10);
  assert.equal(8, rect.x);
  assert.equal(9, rect.y);
  assert.equal(10, rect.width);
  assert.equal(0, rect.height);

  // getters & setters
  rect = new quick.Rect(0, 0, 5, 5);
  assert.equal(2, rect.centerX);
  assert.equal(2, rect.centerY);

  rect = new quick.Rect(0, 0, 6, 6);
  assert.equal(3, rect.centerX);
  assert.equal(3, rect.centerY);

  rect.setBottom(11);
  assert.equal(11, rect.bottom);

  rect.bottom = 10;
  assert.equal(10, rect.bottom);

  rect.setCenter(new quick.Point(12, 13));
  let point = rect.center;
  assert.equal(12, point.x);
  assert.equal(13, point.y);

  rect.center = new quick.Point(11, 12);
  point = rect.center;
  assert.equal(11, point.x);
  assert.equal(12, point.y);

  rect.setCenterX(14);
  assert.equal(14, rect.centerX);

  rect.centerX = 13;
  assert.equal(13, rect.centerX);

  rect.setCenterY(15);
  assert.equal(15, rect.centerY);

  rect.centerY = 14;
  assert.equal(14, rect.centerY);

  rect.setHeight(16);
  assert.equal(16, rect.height);

  rect.height = 15;
  assert.equal(15, rect.height);

  rect.setLeft(17);
  assert.equal(17, rect.left);

  rect.left = 16;
  assert.equal(16, rect.left);

  rect.setRight(18);
  assert.equal(18, rect.right);

  rect.right = 17;
  assert.equal(17, rect.right);

  rect.setTop(19);
  assert.equal(19, rect.top);

  rect.top = 18;
  assert.equal(18, rect.top);

  // metrics
  rect = new quick.Rect(0, 0, 1, 1);
  assert.equal(0, rect.right);
  assert.equal(0, rect.bottom);

  rect = new quick.Rect(0, 0, 2, 2);
  assert.equal(1, rect.right);
  assert.equal(1, rect.bottom);

  rect = new quick.Rect(0, 0, 3, 3);
  assert.equal(2, rect.right);
  assert.equal(2, rect.bottom);

  rect = new quick.Rect(0, 0, 4, 4);
  assert.equal(3, rect.right);
  assert.equal(3, rect.bottom);

  rect.setRight(rect.right);
  rect.setBottom(rect.bottom);
  assert.equal(0, rect.x);
  assert.equal(0, rect.y);

  // multiple objects
  let rect1 = new quick.Rect(0, 1, 2, 3);
  assert.equal(0, rect1.x);
  assert.equal(1, rect1.y);
  assert.equal(2, rect1.width);
  assert.equal(3, rect1.height);

  let rect2 = new quick.Rect(4, 5, 6, 7);
  assert.equal(4, rect2.x);
  assert.equal(5, rect2.y);
  assert.equal(6, rect2.width);
  assert.equal(7, rect2.height);
}

function sceneTest() {
  let subject = new quick.Scene();

  // build empty tiles
  subject.build([["a", "b", "c"], ["d", "e", "f"]], () => { return null; });
}

function spriteTest() {
  let subject;
  let offBoundaryCalled;

  // no args constructor
  subject = new quick.Sprite();
  assert.equal(0, subject.accelerationX);
  assert.equal(0, subject.accelerationY);
  assert.equal(0, subject.left);
  assert.equal(0, subject.top);
  assert.equal(0, subject.speedX);
  assert.equal(0, subject.speedY);
  assert.equal(0, subject.height);
  assert.equal(0, subject.width);
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);
  assert.equal(null, subject.color);
  assert.equal(0, subject.layerIndex);
  assert.equal(false, subject.essential);
  assert.equal(false, subject.solid);
  assert.equal(true, subject.visible);

  // getters & setters
  subject = new quick.Sprite();
  subject.setAccelerationX(4);
  assert.equal(4, subject.accelerationX);
  subject.setAccelerationY(5);
  assert.equal(5, subject.accelerationY);
  subject.setSpeedX(6);
  assert.equal(6, subject.speedX);
  subject.setSpeedY(7);
  assert.equal(7, subject.speedY);
  subject.setPosition(new quick.Point(10, 11));
  assert.equal(10, subject.x);
  assert.equal(11, subject.y);
  subject.setPosition(10, 11);
  assert.equal(10, subject.x);
  assert.equal(11, subject.y);
  subject.setPosition(0, 0);
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);
  subject.setSize(19, 19);
  assert.equal(19, subject.width);
  assert.equal(19, subject.height);
  subject.setSize(0, 0);
  assert.equal(0, subject.width);
  assert.equal(0, subject.height);
  subject.setSize(new quick.Rect(0, 0, 20, 21));
  assert.equal(20, subject.width);
  assert.equal(21, subject.height);


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
  subject = new quick.Sprite();
  subject.setSize(16, 16);
  offBoundaryCalled = false;

  subject.offBoundary = () => {
    offBoundaryCalled = true;
  };

  subject.setBoundary(new quick.Rect(20, 20, 100, 100));
  subject.sync();
  assert.equal(true, offBoundaryCalled);

  // expiration
  subject = new quick.Sprite();
  subject.setExpiration(5);

  for (let i = 0; i < 5; ++i) {
    assert.equal(false, subject.expired);
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

function textTest() {
  let text;

  // no args constructor
  new quick.FontSprite();

  // all args constructor
  text = new quick.FontSprite("whatever");

  // setText
  text.setText("test");

  // getString
  assert.equal("test", text.text);
}
