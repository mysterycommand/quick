'use strict';

// imports
const assert = require('assert');
const quick = require('../src/quick.js');

// mocks
global.addEventListener = () => {};

global.document = {
  getElementById: () => {
    return {};
  }
};

global.localStorage = {};

const deviceMock = {
  getCommands: () => {
    let result = {};

    for (let key in quick.CommandEnum) if (quick.CommandEnum.hasOwnProperty(key)) {
      result[quick.CommandEnum[key]] = true;
    }

    return result;
  }
};

const event = {
  preventDefault: () => {}
}

// run tests
controllerTest();
mouseTest();
pointTest();
quickTest();
rectTest();
sceneTest();
spriteTest();
textTest();

// tests
function controllerTest() {
  let controller;

  // no args constructor
  controller = new quick.Controller();

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

function mouseTest() {
  let mouse;

  // no args constructor
  mouse = new quick.Mouse(event);
  assert.equal(0, mouse.x);
  assert.equal(0, mouse.y);
  assert.equal(true, mouse.getCommand());

  // updateCoordinates
  mouse.updateCoordinates({ x: 1, y: 2 });
  assert.equal(1, mouse.x);
  assert.equal(2, mouse.y);

  // updateCoordinates on Firefox
  mouse.updateCoordinates({ clientX: 3, clientY: 4 });
  assert.equal(3, mouse.x);
  assert.equal(4, mouse.y);
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
  assert.equal(0, subject.getAccelerationX());
  assert.equal(0, subject.getAccelerationY());
  assert.equal(0, subject.left);
  assert.equal(0, subject.top);
  assert.equal(0, subject.getSpeedX());
  assert.equal(0, subject.getSpeedY());
  assert.equal(0, subject.height);
  assert.equal(0, subject.width);
  assert.equal(0, subject.x);
  assert.equal(0, subject.y);
  assert.equal(null, subject.getColor());
  assert.equal(0, subject.getLayerIndex());
  assert.equal(false, subject.getEssential());
  assert.equal(false, subject.getSolid());
  assert.equal(true, subject.getVisible());

  // all args constructor
  subject = new quick.Sprite(2, 4, 8, 16);
  assert.equal(2, subject.left);
  assert.equal(4, subject.top);
  assert.equal(8, subject.width);
  assert.equal(16, subject.height);
  assert.equal(subject.x, subject.getPosition().x);
  assert.equal(subject.y, subject.getPosition().y);

  // getters & setters
  subject.setAccelerationX(4);
  assert.equal(4, subject.getAccelerationX());
  subject.setAccelerationY(5);
  assert.equal(5, subject.getAccelerationY());
  subject.setSpeedX(6);
  assert.equal(6, subject.getSpeedX());
  subject.setSpeedY(7);
  assert.equal(7, subject.getSpeedY());
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
  let subject1 = new quick.Sprite(0, 0, 2, 2);
  let subject2 = new quick.Sprite(1, 1, 2, 2);
  let subject3 = new quick.Sprite(2, 2, 2, 2);
  assert.equal(true, subject1.hasCollision(subject2));
  assert.equal(false, subject1.hasCollision(subject3));
  let collision = subject1.getCollision(subject2);
  assert.equal(true, collision.right);
  assert.equal(true, collision.bottom);

  // on boundary
  subject = new quick.Sprite();
  subject.setSize(16, 16);
  offBoundaryCalled = false;

  subject.setDelegate({
    offBoundary: function () {
      offBoundaryCalled = true;
    }
  });

  subject.setBoundary(new quick.Rect(0, 0, 200, 200));
  subject.sync();
  assert.equal(false, offBoundaryCalled);

  // off boundary
  subject = new quick.Sprite();
  subject.setSize(16, 16);
  offBoundaryCalled = false;

  subject.setDelegate({
    offBoundary: function () {
      offBoundaryCalled = true;
    }
  });

  subject.setBoundary(new quick.Rect(20, 20, 100, 100));
  subject.sync();
  assert.equal(true, offBoundaryCalled);

  // expiration
  subject = new quick.Sprite();
  subject.setExpiration(5);

  for (let i = 0; i < 5; ++i) {
    assert.equal(false, subject.getExpired());
    assert.equal(false, subject.sync());
  }

  assert.equal(true, subject.getExpired());
  assert.equal(true, subject.sync());

  // visibility
  subject.setVisible();
  assert.equal(true, subject.getVisible());
  subject.setVisible(true);
  assert.equal(true, subject.getVisible());
  subject.setVisible(false);
  assert.equal(false, subject.getVisible());

  // speed to angle
  subject = new quick.Sprite();
  subject.setSpeedToAngle(1, 0);
  assert.equal(1, Math.round(subject.getSpeedX()));
  assert.equal(0, Math.round(subject.getSpeedY()));
  subject.setSpeedToAngle(1, 90);
  assert.equal(0, Math.round(subject.getSpeedX()));
  assert.equal(1, Math.round(subject.getSpeedY()));
  subject.setSpeedToAngle(1, 180);
  assert.equal(-1, Math.round(subject.getSpeedX()));
  assert.equal(0, Math.round(subject.getSpeedY()));
  subject.setSpeedToAngle(1, 270);
  assert.equal(0, Math.round(subject.getSpeedX()));
  assert.equal(-1, Math.round(subject.getSpeedY()));

  // get angle
  subject = new quick.Sprite();
  subject.setSpeedX(1);
  subject.setSpeedY(1);
  assert.equal(45, subject.getAngle());
  subject.setSpeedX(-1);
  subject.setSpeedY(1);
  assert.equal(135, subject.getAngle());
  subject.setSpeedX(-1);
  subject.setSpeedY(-1);
  assert.equal(-135, subject.getAngle());
  subject.setSpeedX(1);
  subject.setSpeedY(-1);
  assert.equal(-45, subject.getAngle());

  // speed to subject
  subject1 = new quick.Sprite();
  subject2 = new quick.Sprite(100, 50);
  subject1.setSpeedToPoint(2, subject2);
  subject2.setSpeedToPoint(2, subject1);
  assert.equal(100 / 150 * 2, subject1.getSpeedX());
  assert.equal(50 / 150 * 2, subject1.getSpeedY());
  assert.equal(-100 / 150 * 2, subject2.getSpeedX());
  assert.equal(-50 / 150 * 2, subject2.getSpeedY());

  // max speed
  subject = new quick.Sprite();
  subject.setMaxSpeedX(2);
  subject.setMaxSpeedY(4);
  subject.setAccelerationX(1);
  subject.setAccelerationY(2);
  subject.sync();
  assert.equal(1, subject.getSpeedX());
  assert.equal(2, subject.getSpeedY());
  subject.sync();
  assert.equal(2, subject.getSpeedX());
  assert.equal(4, subject.getSpeedY());
  subject.sync();
  assert.equal(2, subject.getSpeedX());
  assert.equal(4, subject.getSpeedY());
  subject.stop();
  subject.setAccelerationX(-1);
  subject.setAccelerationY(-2);
  subject.sync();
  assert.equal(-1, subject.getSpeedX());
  assert.equal(-2, subject.getSpeedY());
  subject.sync();
  assert.equal(-2, subject.getSpeedX());
  assert.equal(-4, subject.getSpeedY());
  subject.sync();
  assert.equal(-2, subject.getSpeedX());
  assert.equal(-4, subject.getSpeedY());

  // direction
  subject = new quick.Sprite();
  assert.equal(false, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
  subject.sync()
  assert.equal(false, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
  subject.sync()
  subject.moveX(1);
  assert.equal(false, subject.getDirection().left);
  assert.equal(true, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
  subject.sync();
  subject.moveY(1);
  assert.equal(false, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(true, subject.getDirection().bottom);
  subject.sync();
  subject.moveX(-1);
  assert.equal(true, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
  subject.sync();
  subject.moveY(-1);
  assert.equal(false, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(true, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
  subject.sync()
  assert.equal(false, subject.getDirection().left);
  assert.equal(false, subject.getDirection().right);
  assert.equal(false, subject.getDirection().top);
  assert.equal(false, subject.getDirection().bottom);
}

function textTest() {
  let text;

  // no args constructor
  new quick.TextObject();

  // all args constructor
  text = new quick.TextObject("whatever");

  // setString
  text.setString("test");

  // getString
  assert.equal("test", text.getString());
}
