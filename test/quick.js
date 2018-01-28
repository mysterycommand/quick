/**
 * Copyright (c) 2018 Diogo Schneider
 * 
 * Released under The MIT License (MIT)
 * 
 * https://github.com/diogoschneider/quick
 */

'use strict';

// support for browser code
global.window = global.window || global;

// imports
const assert = require('assert');
require('../src/quick.js');

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
    var result = {};
  
    for (var key in global.window.quick.CommandEnum) if (global.window.quick.CommandEnum.hasOwnProperty(key)) {
      result[global.window.quick.CommandEnum[key]] = true;
    }
  
    return result;
  }
};

const event = {
  preventDefault: () => {}
}

// run tests
controllerTest();
gameObjectTest();
mouseTest();
pointTest();
quickTest();
rectTest();
spriteTest();
textTest();

// tests
function controllerTest() {
  var controller;

  // no args constructor
  controller = new global.window.quick.Controller();

  for (var i in global.window.quick.CommandEnum) if (global.window.quick.CommandEnum.hasOwnProperty(i)) {
    var value = global.window.quick.CommandEnum[i];
    assert.equal(undefined, controller.keyDown(value));
    assert.equal(undefined, controller.keyPush(value));
  }

  // with all commands, first update
  controller.setDevice(deviceMock);
  assert.equal(undefined, controller.update());

  for (var j in global.window.quick.CommandEnum) if (global.window.quick.CommandEnum.hasOwnProperty(j)) {
    assert.equal(true, controller.keyDown(global.window.quick.CommandEnum[j]));
    assert.equal(true, controller.keyPush(global.window.quick.CommandEnum[j]));
  }

  // with all commands, second update
  assert.equal(undefined, controller.update());

  for (var k in global.window.quick.CommandEnum) if (global.window.quick.CommandEnum.hasOwnProperty(k)) {
    assert.equal(true, controller.keyDown(global.window.quick.CommandEnum[k]));
    assert.equal(false, controller.keyPush(global.window.quick.CommandEnum[k]));
  }
}

function gameObjectTest() {
  var gameObject;

  // no args constructor
  gameObject = new global.window.quick.GameObject();
  assert.equal(0, gameObject.getHeight());
  assert.equal(0, gameObject.getWidth());
  assert.equal(0, gameObject.getX());
  assert.equal(0, gameObject.getY());
  assert.equal(null, gameObject.getColor());
  assert.equal(0, gameObject.getLayerIndex());
  assert.equal(false, gameObject.getEssential());
  assert.equal(false, gameObject.getSolid());
  assert.equal(true, gameObject.getVisible());

  // expiration
  gameObject = new global.window.quick.GameObject();
  gameObject.setExpiration(5);

  for (var i = 0; i < 5; ++i) {
    assert.equal(false, gameObject.getExpired());
    assert.equal(false, gameObject.sync());
  }

  assert.equal(true, gameObject.getExpired());
  assert.equal(true, gameObject.sync());

  // visibility
  gameObject.setVisible();
  assert.equal(true, gameObject.getVisible());
  gameObject.setVisible(true);
  assert.equal(true, gameObject.getVisible());
  gameObject.setVisible(false);
  assert.equal(false, gameObject.getVisible());
}

function mouseTest() {
  var mouse;

  // no args constructor
  mouse = new global.window.quick.Mouse(event);
  assert.equal(0, mouse.getX());
  assert.equal(0, mouse.getY());
  assert.equal(true, mouse.getCommand());

  // updateCoordinates
  mouse.updateCoordinates({ x: 1, y: 2 });
  assert.equal(1, mouse.getX());
  assert.equal(2, mouse.getY());

  // updateCoordinates on Firefox
  mouse.updateCoordinates({ clientX: 3, clientY: 4 });
  assert.equal(3, mouse.getX());
  assert.equal(4, mouse.getY());
}

function pointTest() {
  var point;

  // no args constructor
  point = new global.window.quick.Point();
  assert.equal(0, point.getAccelerationX());
  assert.equal(0, point.getAccelerationY());
  assert.equal(point, point.getCenter());
  assert.equal(0, point.getCenterX());
  assert.equal(0, point.getCenterY());
  assert.equal(0, point.getSpeedX());
  assert.equal(0, point.getSpeedY());
  assert.equal(0, point.getX());
  assert.equal(0, point.getY());

  // all args constructor
  point = new global.window.quick.Point(1, 2);
  assert.equal(0, point.getAccelerationX());
  assert.equal(0, point.getAccelerationY());
  assert.equal(point, point.getCenter());
  assert.equal(1, point.getCenterX());
  assert.equal(2, point.getCenterY());
  assert.equal(0, point.getSpeedX());
  assert.equal(0, point.getSpeedY());
  assert.equal(1, point.getX());
  assert.equal(2, point.getY());

  // partial args constructor
  point = new global.window.quick.Point(3);
  assert.equal(3, point.getX());

  // getters & setters
  point.setAccelerationX(4);
  assert.equal(4, point.getAccelerationX());

  point.setAccelerationY(5);
  assert.equal(5, point.getAccelerationY());

  point.setPosition(new global.window.quick.Point(10, 11));
  assert.equal(10, point.getX());
  assert.equal(11, point.getY());

  point.setSpeedX(6);
  assert.equal(6, point.getSpeedX());

  point.setSpeedY(7);
  assert.equal(7, point.getSpeedY());

  point.setX(8);
  assert.equal(8, point.getX());

  point.setY(9);
  assert.equal(9, point.getY());

  // multiple objects
  var point1 = new global.window.quick.Point(10, 11);
  assert.equal(0, point1.getAccelerationX());
  assert.equal(0, point1.getAccelerationY());
  assert.equal(0, point1.getSpeedX());
  assert.equal(0, point1.getSpeedY());
  assert.equal(10, point1.getX());
  assert.equal(11, point1.getY());

  var point2 = new global.window.quick.Point(12, 13);
  assert.equal(0, point2.getAccelerationX());
  assert.equal(0, point2.getAccelerationY());
  assert.equal(0, point2.getSpeedX());
  assert.equal(0, point2.getSpeedY());
  assert.equal(12, point2.getX());
  assert.equal(13, point2.getY());

  // speed to angle
  point = new global.window.quick.Point();
  point.setSpeedToAngle(1, 0);
  assert.equal(1, Math.round(point.getSpeedX()));
  assert.equal(0, Math.round(point.getSpeedY()));
  point.setSpeedToAngle(1, 90);
  assert.equal(0, Math.round(point.getSpeedX()));
  assert.equal(1, Math.round(point.getSpeedY()));
  point.setSpeedToAngle(1, 180);
  assert.equal(-1, Math.round(point.getSpeedX()));
  assert.equal(0, Math.round(point.getSpeedY()));
  point.setSpeedToAngle(1, 270);
  assert.equal(0, Math.round(point.getSpeedX()));
  assert.equal(-1, Math.round(point.getSpeedY()));

  // get angle
  point = new global.window.quick.Point();
  point.setSpeedX(1);
  point.setSpeedY(1);
  assert.equal(45, point.getAngle());
  point.setSpeedX(-1);
  point.setSpeedY(1);
  assert.equal(135, point.getAngle());
  point.setSpeedX(-1);
  point.setSpeedY(-1);
  assert.equal(-135, point.getAngle());
  point.setSpeedX(1);
  point.setSpeedY(-1);
  assert.equal(-45, point.getAngle());

  // speed to point
  point1 = new global.window.quick.Point();
  point2 = new global.window.quick.Point(100, 50);
  point1.setSpeedToPoint(2, point2);
  point2.setSpeedToPoint(2, point1);
  assert.equal(100 / 150 * 2, point1.getSpeedX());
  assert.equal(50 / 150 * 2, point1.getSpeedY());
  assert.equal(-100 / 150 * 2, point2.getSpeedX());
  assert.equal(-50 / 150 * 2, point2.getSpeedY());

  // max speed
  point = new global.window.quick.Point();
  point.setAccelerationX(1);
  point.setAccelerationY(2);
  point.setMaxSpeedX(2);
  point.setMaxSpeedY(4);
  point.sync();
  assert.equal(1, point.getSpeedX());
  assert.equal(2, point.getSpeedY());
  point.sync();
  assert.equal(2, point.getSpeedX());
  assert.equal(4, point.getSpeedY());
  point.sync();
  assert.equal(2, point.getSpeedX());
  assert.equal(4, point.getSpeedY());

  // last position
  point = new global.window.quick.Point();
  assert.equal(0, point.getX());
  assert.equal(0, point.getY());
  assert.equal(0, point.getLastX());
  assert.equal(0, point.getLastY());
  var lastPosition = point.getLastPosition();
  assert.equal(0, lastPosition.getX());
  assert.equal(0, lastPosition.getY());
  point.sync();
  point.setX(20);
  point.setY(30);
  assert.equal(20, point.getX());
  assert.equal(30, point.getY());
  assert.equal(0, point.getLastX());
  assert.equal(0, point.getLastY());
  lastPosition = point.getLastPosition();
  assert.equal(0, lastPosition.getX());
  assert.equal(0, lastPosition.getY());
  point.sync();
  assert.equal(20, point.getX());
  assert.equal(30, point.getY());
  assert.equal(20, point.getLastX());
  assert.equal(30, point.getLastY());
  lastPosition = point.getLastPosition();
  assert.equal(20, lastPosition.getX());
  assert.equal(30, lastPosition.getY());

  // direction
  point = new global.window.quick.Point();
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
  point.sync()
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
  point.sync()
  point.moveX(1);
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(true, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
  point.sync();
  point.moveY(1);
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(true, point.getDirection().getBottom());
  point.sync();
  point.moveX(-1);
  assert.equal(true, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
  point.sync();
  point.moveY(-1);
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(true, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
  point.sync()
  assert.equal(false, point.getDirection().getLeft());
  assert.equal(false, point.getDirection().getRight());
  assert.equal(false, point.getDirection().getTop());
  assert.equal(false, point.getDirection().getBottom());
}

function quickTest() {
  // load / save
  assert.equal(undefined, global.window.quick.Quick.load());
  var game = { level: 1, lives: 2 };
  assert.equal(undefined, global.window.quick.Quick.save(game));
  game = global.window.quick.Quick.load();
  assert.equal(JSON.stringify({ level: 1, lives: 2 }), JSON.stringify(game));
}

function rectTest() {
  var rect;

  // no args constructor
  rect = new global.window.quick.Rect();
  assert.equal(0, rect.getHeight());
  assert.equal(0, rect.getWidth());
  assert.equal(0, rect.getX());
  assert.equal(0, rect.getY());

  // all args constructor
  rect = new global.window.quick.Rect(1, 2, 3, 4);
  assert.equal(1, rect.getX());
  assert.equal(2, rect.getY());
  assert.equal(3, rect.getWidth());
  assert.equal(4, rect.getHeight());

  // partial args constructor
  rect = new global.window.quick.Rect(5);
  assert.equal(5, rect.getX());
  assert.equal(0, rect.getY());
  assert.equal(0, rect.getWidth());
  assert.equal(0, rect.getHeight());

  rect = new global.window.quick.Rect(6, 7);
  assert.equal(6, rect.getX());
  assert.equal(7, rect.getY());
  assert.equal(0, rect.getWidth());
  assert.equal(0, rect.getHeight());

  rect = new global.window.quick.Rect(8, 9, 10);
  assert.equal(8, rect.getX());
  assert.equal(9, rect.getY());
  assert.equal(10, rect.getWidth());
  assert.equal(0, rect.getHeight());

  // getters & setters
  rect = new global.window.quick.Rect(0, 0, 5, 5);
  assert.equal(2, rect.getHalfWidth());
  assert.equal(2, rect.getHalfHeight());

  rect = new global.window.quick.Rect(0, 0, 6, 6);
  assert.equal(3, rect.getHalfWidth());
  assert.equal(3, rect.getHalfHeight());

  rect.setBottom(11);
  assert.equal(11, rect.getBottom());

  rect.setCenter(new global.window.quick.Point(12, 13));
  var point = rect.getCenter();
  assert.equal(12, point.getX());
  assert.equal(13, point.getY());

  rect.setCenterX(14);
  assert.equal(14, rect.getCenterX());

  rect.setCenterY(15);
  assert.equal(15, rect.getCenterY());

  rect.setHeight(16);
  assert.equal(16, rect.getHeight());

  rect.setLeft(17);
  assert.equal(17, rect.getLeft());

  rect.setRight(18);
  assert.equal(18, rect.getRight());

  rect.setSize(19);
  assert.equal(19, rect.getWidth());
  assert.equal(19, rect.getHeight());

  rect.setSize(20, 21);
  assert.equal(20, rect.getWidth());
  assert.equal(21, rect.getHeight());

  rect.setTop(22);
  assert.equal(22, rect.getTop());

  rect.setTop(22);
  assert.equal(22, rect.getTop());

  // metrics
  rect = new global.window.quick.Rect(0, 0, 1, 1);
  assert.equal(0, rect.getRight());
  assert.equal(0, rect.getBottom());

  rect = new global.window.quick.Rect(0, 0, 2, 2);
  assert.equal(1, rect.getRight());
  assert.equal(1, rect.getBottom());

  rect = new global.window.quick.Rect(0, 0, 3, 3);
  assert.equal(2, rect.getRight());
  assert.equal(2, rect.getBottom());

  rect = new global.window.quick.Rect(0, 0, 4, 4);
  assert.equal(3, rect.getRight());
  assert.equal(3, rect.getBottom());

  rect.setRight(rect.getRight());
  rect.setBottom(rect.getBottom());
  assert.equal(0, rect.getX());
  assert.equal(0, rect.getY());

  // multiple objects
  var rect1 = new global.window.quick.Rect(0, 1, 2, 3);
  assert.equal(0, rect1.getX());
  assert.equal(1, rect1.getY());
  assert.equal(2, rect1.getWidth());
  assert.equal(3, rect1.getHeight());

  var rect2 = new global.window.quick.Rect(4, 5, 6, 7);
  assert.equal(4, rect2.getX());
  assert.equal(5, rect2.getY());
  assert.equal(6, rect2.getWidth());
  assert.equal(7, rect2.getHeight());

  // collision detection
  rect1 = new global.window.quick.Rect(0, 0, 2, 2);
  rect2 = new global.window.quick.Rect(1, 1, 2, 2);
  var rect3 = new global.window.quick.Rect(2, 2, 2, 2);
  assert.equal(true, rect1.hasCollision(rect2));
  assert.equal(false, rect1.hasCollision(rect3));
  var collision = rect1.getCollision(rect2);
  assert.equal(true, collision.getRight());
  assert.equal(true, collision.getBottom());
}

function spriteTest() {
  var sprite;
  var offBoundaryCalled;

  // no args constructor
  sprite = new global.window.quick.Sprite();
  assert.equal(0, sprite.getLeft());
  assert.equal(0, sprite.getTop());

  // on boundary
  sprite = new global.window.quick.Sprite();
  sprite.setSize(16);
  offBoundaryCalled = false;

  sprite.setDelegate({
    offBoundary: function () {
      offBoundaryCalled = true;
    }
  });

  sprite.setBoundary(new global.window.quick.Rect(0, 0, 200, 200));
  sprite.sync();
  assert.equal(false, offBoundaryCalled);

  // off boundary
  sprite = new global.window.quick.Sprite();
  sprite.setSize(16);
  offBoundaryCalled = false;

  sprite.setDelegate({
    offBoundary: function () {
      offBoundaryCalled = true;
    }
  });

  sprite.setBoundary(new global.window.quick.Rect(20, 20, 100, 100));
  sprite.sync();
  assert.equal(true, offBoundaryCalled);
}

function textTest() {
  var text;

  // no args constructor
  new global.window.quick.TextObject();

  // all args constructor
  text = new global.window.quick.TextObject("whatever");

  // setString
  text.setString("test");

  // getString
  assert.equal("test", text.getString());
}
