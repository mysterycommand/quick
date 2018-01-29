/**
 * Copyright (c) 2014, 2018 Diogo Schneider
 *
 * Released under The MIT License (MIT)
 *
 * https://github.com/diogoschneider/quick
 */

(function () {
  'use strict';

  const ANALOG_THRESHOLD = 0.5;
  const DEFAULT_FRAME_TIME = 16;
  const DEFAULT_SOUND_EFFECTS_VOLUME = 0.3;

  const AxisEnum = {
    LEFT_X: 0,
    LEFT_Y: 1,
    RIGHT_X: 2,
    RIGHT_Y: 3
  };

  const ButtonEnum = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    L1: 4,
    R1: 5,
    L2: 6,
    R2: 7,
    SELECT: 8,
    START: 9,
    L3: 10,
    R3: 11,
    UP: 12,
    DOWN: 13,
    LEFT: 14,
    RIGHT: 15
  };

  const CommandEnum = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    A: 4,
    B: 5,
    X: 6,
    Y: 7,
    SELECT: 8,
    START: 9
  };

  const KeyEnum = {
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    D: 68,
    E: 69,
    F: 70,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    S: 83,
    F5: 116,
    F11: 122,
    F12: 123
  };

  const ButtonToCommandMap = {};
    ButtonToCommandMap[ButtonEnum.UP] = CommandEnum.UP;
    ButtonToCommandMap[ButtonEnum.DOWN] = CommandEnum.DOWN;
    ButtonToCommandMap[ButtonEnum.LEFT] = CommandEnum.LEFT;
    ButtonToCommandMap[ButtonEnum.RIGHT] = CommandEnum.RIGHT;
    ButtonToCommandMap[ButtonEnum.A] = CommandEnum.A;
    ButtonToCommandMap[ButtonEnum.B] = CommandEnum.B;
    ButtonToCommandMap[ButtonEnum.X] = CommandEnum.X;
    ButtonToCommandMap[ButtonEnum.Y] = CommandEnum.Y;
    ButtonToCommandMap[ButtonEnum.START] = CommandEnum.START;
    ButtonToCommandMap[ButtonEnum.SELECT] = CommandEnum.SELECT;

  const KeyToCommandMap = {};
    KeyToCommandMap[KeyEnum.UP] = CommandEnum.UP;
    KeyToCommandMap[KeyEnum.E] = CommandEnum.UP;
    KeyToCommandMap[KeyEnum.I] = CommandEnum.UP;
    KeyToCommandMap[KeyEnum.DOWN] = CommandEnum.DOWN;
    KeyToCommandMap[KeyEnum.D] = CommandEnum.DOWN;
    KeyToCommandMap[KeyEnum.K] = CommandEnum.DOWN;
    KeyToCommandMap[KeyEnum.LEFT] = CommandEnum.LEFT;
    KeyToCommandMap[KeyEnum.S] = CommandEnum.LEFT;
    KeyToCommandMap[KeyEnum.J] = CommandEnum.LEFT;
    KeyToCommandMap[KeyEnum.RIGHT] = CommandEnum.RIGHT;
    KeyToCommandMap[KeyEnum.F] = CommandEnum.RIGHT;
    KeyToCommandMap[KeyEnum.L] = CommandEnum.RIGHT;
    KeyToCommandMap[KeyEnum.SPACE] = CommandEnum.A;
    KeyToCommandMap[KeyEnum.ALT] = CommandEnum.B;
    KeyToCommandMap[KeyEnum.CTRL] = CommandEnum.X;
    KeyToCommandMap[KeyEnum.SHIFT] = CommandEnum.Y;
    KeyToCommandMap[KeyEnum.ENTER] = CommandEnum.START;
    KeyToCommandMap[KeyEnum.ESC] = CommandEnum.SELECT;

  const PassThrough = [];
    PassThrough[KeyEnum.F5] = true;
    PassThrough[KeyEnum.F11] = true;
    PassThrough[KeyEnum.F12] = true;

  let autoScale = true;
  let canvas;
  let context;
  let everyOther = true;
  let frameTime = DEFAULT_FRAME_TIME;
  let keepAspect = false;
  let input;
  let isTransitioning = false;
  let lastRender;
  let name = 'Quick Game';
  let numberOfLayers = 1;
  let realWidth = 0;
  let realHeight = 0;
  let renderableLists = [];
  let scene;
  let sceneFactory;
  let sound;
  let transition;
  let width = 0, height = 0;

  class Quick {
    static init(firstSceneFactory, canvasElement) {
      sceneFactory = firstSceneFactory;
      canvas = canvasElement || document.getElementsByTagName('canvas')[0];
      context = canvas.getContext('2d');
      width = canvas.width;
      height = canvas.height;
      realWidth = width;
      realHeight = height;
      input = new Input();
      lastRender = Date.now();
      sound = new Sound();
      addEventListener('resize', scale, false);
      autoScale && scale();
      polyfill();

      for (let i = 0; i < numberOfLayers; ++i) {
        renderableLists.push(new RenderableList());
      }

      boot();
    }

    static addControllerDevice(device) {
      input.addController(device);
    }

    static clear() {
      context.clearRect(0, 0, width, height);
    }

    static fadeOut() {
      sound.fadeOut();
    }

    static getBoundary() {
      return new Rect(0, 0, Quick.getWidth(), Quick.getHeight());
    }

    static getBottom() {
      return height - 1;
    }

    static getCenter() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    static getCenterX() {
      return Math.floor(this.getWidth() / 2);
    }

    static getCenterY() {
      return Math.floor(this.getHeight() / 2);
    }

    static getHeight() {
      return height;
    }

    static getOffsetLeft() {
      return canvas.offsetLeft;
    }

    static getOffsetTop() {
      return canvas.offsetTop;
    }

    static getRight() {
      return width - 1;
    }

    static getController(id) {
      return input.getController(id);
    }

    static getEveryOther() {
      return everyOther;
    }

    static getFrameTime() {
      return frameTime;
    }

    static getPointer(id) {
      return input.getPointer(id);
    }

    static getRealHeight() {
      return realHeight;
    }

    static getRealWidth() {
      return realWidth;
    }

    static getWidth() {
      return width;
    }

    static load() {
      return localStorage.saveData && JSON.parse(localStorage.saveData);
    }

    static mute() {
      sound.mute();
    }

    static paint(renderable, index) {
      const layer = renderableLists[index || 0];
      layer.add(renderable);
    }

    static play(id) {
      sound.play(id);
    }

    static playTheme(name) {
      sound.playTheme(name);
    }

    static random(ceil) {
      const random = Math.random();
      const raw = random * (ceil + 1);
      return Math.floor(raw);
    }

    static save(data) {
      localStorage.saveData = JSON.stringify(data);
    }

    static setAutoScale(customAutoScale) {
      autoScale = customAutoScale == undefined || customAutoScale;
    }

    static setFrameTime(customFrameTime) {
      frameTime = customFrameTime || DEFAULT_FRAME_TIME;
    }

    static setKeepAspect(customKeepAspect) {
      keepAspect = customKeepAspect == undefined || customKeepAspect;
    }

    static setName(customName) {
      name = customName;
      document.title = name;
    }

    static setNumberOfLayers(customNumberOfLayers) {
      numberOfLayers = customNumberOfLayers;
    }

    static stopTheme() {
      sound.stopTheme();
    }

  }

  class ImageFactory {
    static flip(image) {
      return ImageFactory.invert(image, false, true);
    }

    static mirror(image) {
      return ImageFactory.invert(image, true, false);
    }

    static rotate(image, degrees) {
      if (degrees % 360 == 0 ) {
        return image;
      }

      const RADIANS = toRadians(degrees);
      const IMAGE = document.createElement('canvas');
      let sideA = image.width;
      let sideB = image.height;

      if (degrees == 90 || degrees == 270) {
        sideA = image.height;
        sideB = image.width;
      }

      IMAGE.width = sideA;
      IMAGE.height = sideB;
      const CONTEXT = IMAGE.getContext('2d');
      CONTEXT.translate(IMAGE.width / 2, IMAGE.height / 2);
      CONTEXT.rotate(RADIANS);
      CONTEXT.drawImage(image, -image.width / 2, -image.height / 2);
      return IMAGE;
    };

    static invert(image, isMirror, isFlip) {
      const IMAGE = document.createElement('canvas');
      IMAGE.width = image.width;
      IMAGE.height = image.height;
      const CONTEXT = IMAGE.getContext('2d');
      CONTEXT.translate(isMirror ? IMAGE.width : 0, isFlip ? IMAGE.height : 0);
      CONTEXT.scale(isMirror ? -1 : 1, isFlip ? - 1 : 1);
      CONTEXT.drawImage(image, 0, 0);
      return IMAGE;
    }
  }

  class Mouse {
    constructor(event) {
      event.preventDefault();
      this.isDown = true;
      this.position = new Point();

      addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.isDown = true;
      }, false);

      addEventListener('mousemove', (event) => {
        event.preventDefault();
        this.updateCoordinates(event);
      }, false);

      addEventListener('mouseup', (event) => {
        event.preventDefault();
        this.isDown = false;
      }, false);
    }

    getCommand() {
      return this.isDown;
    }

    getX() {
      return this.position.getX();
    }

    getY() {
      return this.position.getY();
    }

    updateCoordinates(event) {
      this.position.setX(event.x || event.clientX);
      this.position.setY(event.y || event.clientY);
    }
  }

  class Touch {
    constructor(event) {
      event.preventDefault();
      this.isDown = true;
      this.position = new Point();
      this.updateCoordinates(event);

      addEventListener('touchend', (event) => {
        event.preventDefault();
        this.isDown = false;
        this.updateCoordinates(event);
      }, false);

      addEventListener('touchmove', (event) => {
        event.preventDefault();
        this.updateCoordinates(event);
      }, false);

      addEventListener('touchstart', () => {
        event.preventDefault();
        this.isDown = true;
        this.updateCoordinates(event);
      }, false);
    }

    getCommand() {
      return this.isDown;
    }

    getX() {
      return this.position.getX();
    }

    getY() {
      return this.position.getY();
    }

    updateCoordinates(event) {
      const TOUCHES = event['changedTouches'];
      const TOUCH = TOUCHES[0];
      this.position.setX(TOUCH.pageX);
      this.position.setY(TOUCH.pageY);
    }
  }

  class Pointer {
    constructor() {
      this.active = false;
      this.device = null;
      this.hold = false;
      this.position = new Point();
    }

    getDown() {
      return this.active;
    }

    getPush() {
      return this.active && !this.hold;
    }

    setDevice(device) {
      this.device = device;
    }

    update() {
      if (!this.device) {
        return;
      }

      this.hold = false;
      const LAST = this.active;
      this.active = this.device.getCommand();

      if (this.active && LAST) {
        this.hold = true;
      }

      const REAL_X = this.device.getX() - Quick.getOffsetLeft();
      const REAL_Y = this.device.getY() - Quick.getOffsetTop();
      this.position.setX(Math.floor(REAL_X * Quick.getWidth() / Quick.getRealWidth()));
      this.position.setY(Math.floor(REAL_Y * Quick.getHeight() / Quick.getRealHeight()));
    }

    getPosition() {
      return this.position;
    }
  }

  class Controller {
    constructor() {
      this.active = {};
      this.device = null;
      this.hold = {};
    }

    keyDown(commandEnum) {
      return this.active[commandEnum];
    }

    keyPush(commandEnum) {
      return this.active[commandEnum] && !this.hold[commandEnum];
    }

    setDevice(device) {
      this.device = device;
    }

    update() {
      if (!this.device) {
        return;
      }

      this.hold = {};
      const LAST = this.active;
      this.active = this.device.getCommands();

      for (let i in this.active) {
        if (this.active.hasOwnProperty(i)) {
          if (LAST[i]) {
            this.hold[i] = true;
          }
        }
      }
    }
  }

  class GamePad {
    constructor(id) {
      this.id = id || 0;
    }

    getCommands() {
      const BUTTONS = Input.getGamePadButtons(this.id);
      const RESULT = {};

      if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_Y] < - ANALOG_THRESHOLD) {
        RESULT[CommandEnum.UP] = true;
      } else if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_Y] > ANALOG_THRESHOLD) {
        RESULT[CommandEnum.DOWN] = true;
      }

      if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_X] < - ANALOG_THRESHOLD) {
        RESULT[CommandEnum.LEFT] = true;
      } else if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_X] > ANALOG_THRESHOLD) {
        RESULT[CommandEnum.RIGHT] = true;
      }

      for (let i in ButtonToCommandMap) {
        if (ButtonToCommandMap.hasOwnProperty(i)) {
          if (BUTTONS[i] && BUTTONS[i]['pressed']) {
            RESULT[ButtonToCommandMap[i]] = true;
          }
        }
      }

      return RESULT;
    };
  }

  class Input {
    constructor() {
      this.controllers = [];
      this.controllerQueue = [];
      this.controllerRequestQueue = [];
      this.pointers = [];
      this.pointerQueue = [];
      this.pointerRequestQueue = [];
      this.gamePads = 0;

      const ON_KEY_DOWN = (event) => {
        removeEventListener('keydown', ON_KEY_DOWN);
        const keyboard = new Keyboard(event);
        this.addController(keyboard);
      };

      const ON_MOUSE_DOWN = (event) => {
        removeEventListener('mousedown', ON_MOUSE_DOWN);
        this.addPointer(new Mouse(event));
      };

      const ON_TOUCH_START = (event) => {
        removeEventListener('touchstart', ON_TOUCH_START);
        this.addPointer(new Touch(event));
      };

      addEventListener('keydown', ON_KEY_DOWN, false);
      addEventListener('mousedown', ON_MOUSE_DOWN, false);
      addEventListener('touchstart', ON_TOUCH_START, false);
    }

    static getGamePadAxes(id) {
      if (getGamePads()[id]) {
        return getGamePads()[id]['axes'];
      }

      return [];
    }

    static getGamePadButtons(id) {
      const GAME_PAD = getGamePads()[id];
      return GAME_PAD && GAME_PAD.buttons || [];
    }

    addController(device) {
      this.controllerQueue.push(device);
      this.checkControllerQueues();
    }

    addPointer(device) {
      this.pointerQueue.push(device);
      this.checkPointerQueues();
    }

    checkGamePads() {
      if (getGamePads()[this.gamePads]) {
        this.addController(new GamePad(this.gamePads++));
      }
    }

    checkControllerQueues() {
      if (this.controllerRequestQueue.length > 0 && this.controllerQueue.length > 0) {
        const REQUESTER = this.controllerRequestQueue.shift();
        const DEVICE = this.controllerQueue.shift();
        REQUESTER.setDevice(DEVICE);
      }
    }

    checkPointerQueues() {
      if (this.pointerRequestQueue.length > 0 && this.pointerQueue.length > 0) {
        const REQUESTER = this.pointerRequestQueue.shift();
        const DEVICE = this.pointerQueue.shift();
        REQUESTER.setDevice(DEVICE);
      }
    }

    getController(id = 0) {
      if (this.controllers.length < id + 1) {
        const CONTROLLER = new Controller();
        this.controllers.push(CONTROLLER);
        this.controllerRequestQueue.push(CONTROLLER);
        this.checkControllerQueues();
      }

      return this.controllers[id];
    }

    getPointer(id = 0) {
      if (this.pointers.length < id + 1) {
        const POINTER = new Pointer();
        this.pointers.push(POINTER);
        this.pointerRequestQueue.push(POINTER);
        this.checkPointerQueues();
      }

      return this.pointers[id];
    }

    update() {
      this.checkGamePads();

      for (let i in this.controllers) {
        if (this.controllers.hasOwnProperty(i)) {
          this.controllers[i].update();
        }
      }

      for (let j in this.pointers) {
        if (this.pointers.hasOwnProperty(j)) {
          this.pointers[j].update();
        }
      }
    }
  }

  class Keyboard {
    constructor(event) {
      this.buffer = {};
      this.onKeyDown(event);

      addEventListener('keydown', (event) => {
        this.onKeyDown(event);
      }, false);

      addEventListener('keyup', (event) => {
        this.onKey(event.keyCode, false);
      }, false);
    }

    getCommands() {
      const RESULT = {};

      for (let i in this.buffer) {
        if (this.buffer.hasOwnProperty(i)) {
          if (this.buffer[i]) {
            RESULT[i] = true;
          }
        }
      }

      return RESULT;
    }

    onKey(keyCode, isDown) {
      this.buffer[KeyToCommandMap[keyCode]] = isDown;
    }

    onKeyDown(event) {
      PassThrough[event.keyCode] || event.preventDefault();
      this.onKey(event.keyCode, true);
    }
  }

  class RenderableList {
    constructor() {
      this.elements = [];
    }

    add(renderable) {
      this.elements.push(renderable);
    }

    render(context) {
      for (let i = 0; i < this.elements.length; ++i) {
        this.elements[i].render(context);
      }

      this.elements.length = 0;
    }
  }

  class Scene {
    constructor() {
      this.delegate = null;
      this.gameObjects = [];
      this.nextObjects = [];
      this.expiration = -1;
      this.isExpired = false;
      this.tick = -1;
      this.transition = null;
    }

    add(gameObject) {
      gameObject.setScene(this);
      gameObject.init(this);
      this.nextObjects.push(gameObject);
      gameObject.move(gameObject.getSpeedX() * -1, gameObject.getSpeedY() * -1);
    }

    build(map, tileFactory = baseTileFactory, offsetX, offsetY) {
      for (let i = 0; i < map.length; ++i) {
        const LINE = map[i];

        for (let j = 0; j < LINE.length; ++j) {
          const ID = map[i][j];

          if (ID) {
            const TILE = tileFactory(ID);
            const X = offsetX ? offsetX : TILE.getWidth();
            const Y = offsetY ? offsetY : TILE.getHeight();
            TILE.setTop(i * Y);
            TILE.setLeft(j * X);
            this.add(TILE);
          }
        }
      }
    }

    expire() {
      this.isExpired = true;
    }

    sync() {
      if (this.isExpired) {
        return true;
      }

      let gameObjects = [];
      const SOLID_GAME_OBJECTS = [];

      for (let i = 0; i < this.gameObjects.length; ++i) {
        const GAME_OBJECT = this.gameObjects[i];
        GAME_OBJECT.update();

        if (GAME_OBJECT.sync()) {
          if (GAME_OBJECT.getEssential()) {
            this.expire();
          }
        } else {
          if (GAME_OBJECT.getSolid()) {
            SOLID_GAME_OBJECTS.push(GAME_OBJECT);
          }

          gameObjects.push(GAME_OBJECT);
          Quick.paint(GAME_OBJECT, GAME_OBJECT.getLayerIndex());
        }
      }

      checkCollisions(SOLID_GAME_OBJECTS);
      this.gameObjects = gameObjects.concat(this.nextObjects);
      this.nextObjects = [];

      if (++this.tick == this.expiration) {
        this.expire();
      }

      return false;
    }

    getNext() {
      if (this.delegate && this.delegate.getNext) {
        return this.delegate.getNext();
      }
    }

    getObjectsWithTag(tag) {
      const RESULT = [];

      for (let i = 0; i < this.gameObjects.length; ++i) {
        const GAME_OBJECT = this.gameObjects[i];

        if (GAME_OBJECT.hasTag(tag)) {
          RESULT.push(GAME_OBJECT);
        }
      }

      return RESULT;
    }

    getTick() {
      return this.tick;
    }

    getTransition() {
      return this.transition;
    }

    setDelegate(delegate) {
      this.delegate = delegate;
    }

    setExpiration(expiration) {
      this.expiration = expiration;
    }

    setTransition(transition) {
      this.transition = transition;
    }

    update() {
      this.delegate && this.delegate.update && this.delegate.update();
    }
  }

  class Sound {
    constructor() {
      this.isFading = false;
      this.isMute = false;
      this.nextThemeName = null;
      this.queue = {};
      this.theme = null;
      this.volume = 100;
    }

    fadeOut() {
      if (!this.theme) {
        return;
      }

      this.isFading = true;
      this.volume = 100;
    }

    mute() {
      this.isMute = !this.isMute;

      if (!this.isMute) {
        this.theme.play();
      } else {
        this.theme.pause();
      }
    }

    pause() {
      if (this.theme) {
        this.theme.pause();
      }
    }

    play(id) {
      if (this.isMute) {
        return;
      }

      this.queue[id] = true;
    }

    playTheme(id) {
      if (this.theme && this.theme.currentTime > 0) {
        this.nextThemeName = id;

        if (!this.isFading) {
          this.fadeOut();
        }

        return;
      }

      this.stopTheme();
      this.theme = document.getElementById(id);

      if (this.theme.currentTime > 0) {
        this.theme.currentTime = 0;
      }

      if (this.isMute) {
        return;
      }

      this.theme.volume = 1;
      this.theme.play();
    }

    resume() {
      if (this.isMute) {
        return;
      }

      if (this.theme.paused) {
        this.theme.play();
      }
    }

    stopTheme() {
      if (this.theme) {
        this.theme.pause();
        this.theme.currentTime = 0;
      }
    }

    update() {
      for (let i in this.queue) {
        if (this.queue.hasOwnProperty(i)) {
          const SOUND = document.getElementById(i);
          SOUND.pause();

          if (SOUND.currentTime > 0) {
            SOUND.currentTime = 0;
          }

          SOUND.volume = DEFAULT_SOUND_EFFECTS_VOLUME;
          SOUND.play();
        }
      }

      this.queue = {};

      if (this.isFading) {
        if (--this.volume > 0) {
          this.theme.volume = this.volume / 100;
        } else {
          this.isFading = false;
          this.theme = null;

          if (this.nextThemeName) {
            this.playTheme(this.nextThemeName);
            this.nextThemeName = null;
          }
        }
      }
    }
  }

  class Point {
    constructor(x, y) {
      this.setAccelerationX();
      this.setAccelerationY();
      this.setMaxSpeedX();
      this.setMaxSpeedY();
      this.setSpeedX();
      this.setSpeedY();
      this.setX(x);
      this.setY(y);
      this.lastX = this.x;
      this.lastY = this.y;
    }

    bounceX() {
      this.setSpeedX(this.getSpeedX() * -1);
      this.moveX(this.getSpeedX());
      return this;
    }

    bounceY() {
      this.setSpeedY(this.getSpeedY() * -1);
      this.moveY(this.getSpeedY());
      return this;
    }

    getAccelerationX() {
      return this.accelerationX;
    }

    getAccelerationY() {
      return this.accelerationY;
    }

    getAngle() {
      return toDegrees(Math.atan2(this.getSpeedY(), this.getSpeedX()));
    }

    getCenter() {
      return this;
    }

    getCenterX() {
      return this.x;
    }

    getCenterY() {
      return this.y;
    }

    getDirection() {
      const direction = new Direction();

      if (this.getX() < this.getLastX()) {
        direction.setLeft();
      } else if (this.getX() > this.getLastX()) {
        direction.setRight();
      }

      if (this.getY() < this.getLastY()) {
        direction.setTop();
      } else if (this.getY() > this.getLastY()) {
        direction.setBottom();
      }

      return direction;
    }

    getLastPosition() {
      return new Point(this.getLastX(), this.getLastY());
    }

    getLastX() {
      return this.lastX;
    }

    getLastY() {
      return this.lastY;
    }

    getSpeedX() {
      return this.speedX;
    }

    getSpeedY() {
      return this.speedY;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    move(width, height) {
      this.moveX(width);
      this.moveY(height);
      return this;
    }

    moveX(width) {
      this.setX(this.getX() + width);
      return this;
    }

    moveY(height) {
      this.setY(this.getY() + height);
      return this;
    }

    setAccelerationX(accelerationX) {
      this.accelerationX = accelerationX || 0;
      return this;
    }

    setAccelerationY(accelerationY) {
      this.accelerationY = accelerationY || 0;
      return this;
    }

    setMaxSpeedX(maxSpeedX) {
      this.maxSpeedX = maxSpeedX || 0;
      return this;
    }

    setMaxSpeedY(maxSpeedY) {
      this.maxSpeedY = maxSpeedY || 0;
      return this;
    }

    setPosition(point) {
      this.setX(point.getX());
      this.setY(point.getY());
      return this;
    }

    setSpeedToAngle(speed, degrees) {
      const radians = toRadians(degrees);
      this.setSpeedX(speed * Math.cos(radians));
      this.setSpeedY(speed * Math.sin(radians));
      return this;
    }

    setSpeedToPoint(speed, point) {
      const squareDistance = Math.abs(this.getCenterX() - point.getX()) + Math.abs(this.getCenterY() - point.getY());
      this.setSpeedX((point.getX() - this.getCenterX()) * speed / squareDistance);
      this.setSpeedY((point.getY() - this.getCenterY()) * speed / squareDistance);
      return this;
    }

    setSpeedX(speedX) {
      this.speedX = speedX || 0;
      return this;
    }

    setSpeedY(speedY) {
      this.speedY = speedY || 0;
      return this;
    }

    setX(x) {
      this.x = x || 0;
      return this;
    }

    setXY(x, y) {
      this.setX(x);
      this.setY(x);
      return this;
    }

    setY(y) {
      this.y = y || 0;
      return this;
    }

    stop() {
      this.setSpeedX(0);
      this.setSpeedY(0);
      return this;
    }

    sync() {
      this.setSpeedX(this.getSpeedX() + this.accelerationX);

      if (this.maxSpeedX && this.getSpeedX() > this.maxSpeedX) {
        this.setSpeedX(this.maxSpeedX);
      }

      this.setSpeedY(this.getSpeedY() + this.accelerationY);

      if (this.maxSpeedY && this.getSpeedY() > this.maxSpeedY) {
        this.setSpeedY(this.maxSpeedY);
      }

      this.lastX = this.getX();
      this.lastY = this.getY();
      this.move(this.getSpeedX(), this.getSpeedY());
      return false;
    }
  }

  class Rect extends Point {
    constructor(x, y, width, height) {
      super(x, y);
      this.setHeight(height);
      this.setWidth(width);
    }

    bounceFrom(direction) {
      if ((this.getSpeedX() < 0 && direction.getLeft()) || (this.getSpeedX() > 0 && direction.getRight())) {
        this.bounceX();
      }

      if ((this.getSpeedY() < 0 && direction.getTop()) || (this.getSpeedY() > 0 && direction.getBottom())) {
        this.bounceY();
      }

      return this;
    }

    getBottom() {
      return this.getY() + this.getHeight() - 1;
    }

    getCenter() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    getCenterX() {
      return this.getX() + this.getHalfWidth();
    }

    getCenterY() {
      return this.getY() + this.getHalfHeight();
    }

    getCollision(rect) {
      const direction = new Direction();

      const ta = this.getTop();
      const ra = this.getRight();
      const ba = this.getBottom();
      const la = this.getLeft();
      const xa = this.getCenterX();
      const ya = this.getCenterY();

      const tb = rect.getTop();
      const rb = rect.getRight();
      const bb = rect.getBottom();
      const lb = rect.getLeft();

      if (xa <= lb && ra < rb) {
        direction.setRight();
      } else if (xa >= rb && la > lb) {
        direction.setLeft();
      }

      if (ya <= tb && ba < bb) {
        direction.setBottom();
      } else if (ya >= bb && ta > tb) {
        direction.setTop();
      }

      return direction;
    }

    getHalfHeight() {
      return Math.floor(this.getHeight() / 2);
    }

    getHalfWidth() {
      return Math.floor(this.getWidth() / 2);
    }

    getHeight() {
      return this.height;
    }

    getLeft() {
      return this.getX();
    }

    getRight() {
      return this.getX() + this.getWidth() - 1;
    }

    getTop() {
      return this.getY();
    }

    getWidth() {
      return this.width;
    }

    hasCollision(rect) {
      return !(
        this.getLeft() > rect.getRight() ||
        this.getRight() < rect.getLeft() ||
        this.getTop() > rect.getBottom() ||
        this.getBottom() < rect.getTop()
      );
    }

    increase(width, height) {
      this.increaseWidth(width);
      this.increaseHeight(height);
      return this;
    }

    increaseHeight(height) {
      this.setHeight(this.getHeight() + height);
      return this;
    }

    increaseWidth(width) {
      this.setWidth(this.getWidth() + width);
      return this;
    }

    setBottom(y) {
      this.setY(y - this.getHeight() + 1);
      return this;
    }

    setCenter(point) {
      this.setCenterX(point.getX());
      this.setCenterY(point.getY());
      return this;
    }

    setCenterX(x) {
      this.setX(x - this.getHalfWidth());
      return this;
    }

    setCenterY(y) {
      this.setY(y - this.getHalfHeight());
      return this;
    }

    setHeight(height) {
      this.height = height || 0;
      return this;
    }

    setLeft(x) {
      this.setX(x);
      return this;
    }

    setRight(x) {
      this.setX(x - this.getWidth() + 1);
      return this;
    }

    setSize(width, height) {
      this.setWidth(width);

      if (arguments.length > 1) {
        this.setHeight(height);
      } else {
        this.setHeight(width);
      }

      return this;
    }

    setTop(y) {
      this.setY(y);
      return this;
    }

    setWidth(width) {
      this.width = width || 0;
      return this;
    }
  }

  class Direction {
    constructor() {
      this.isBottom = false;
      this.isLeft = false;
      this.isRight = false;
      this.isTop = false;
    }

    getBottom() {
      return this.isBottom;
    }

    getLeft() {
      return this.isLeft;
    }

    getRight() {
      return this.isRight;
    }

    getTop() {
      return this.isTop;
    }

    setBottom(isBottom) {
      this.isBottom = isBottom == undefined || isBottom;
      return this;
    }

    setLeft(isLeft) {
      this.isLeft = isLeft == undefined || isLeft;
      return this;
    }

    setRight(isRight) {
      this.isRight = isRight == undefined || isRight;
      return this;
    }

    setTop(isTop) {
      this.isTop = isTop == undefined || isTop;
      return this;
    }
  }

  class Frame {
    constructor(image, duration) {
      this.duration = duration || 0;
      this.image = image || new Image();
    }

    getDuration() {
      return this.duration;
    }

    getHeight() {
      return this.image.height;
    }

    getImage() {
      return this.image;
    }

    getWidth() {
      return this.image.width;
    }
  }

  class Animation {
    constructor(frames) {
      this.setFrames(frames);
    }

    getHeight() {
      return this.frame.getHeight();
    }

    getImage() {
      return this.frame.getImage();
    }

    getWidth() {
      return this.frame.getWidth();
    }

    setFrames(frames) {
      this.frames = frames || [new Frame()];
      this.updateFrameIndex(0);
      return this;
    }

    update() {
      let hasLooped = false;

      if (this.frame.getDuration() && ++this.tick > this.frame.getDuration()) {
        let index = this.frameIndex + 1;

        if (index == this.frames.length) {
          hasLooped = true;
          index = 0;
        }

        this.updateFrameIndex(index);
      }

      return hasLooped;
    }

    updateFrameIndex(frameIndex) {
      if (frameIndex < this.frames.length && frameIndex > -1) {
        this.frameIndex = frameIndex;
        this.tick = 0;
        this.frame = this.frames[frameIndex];
        return true;
      }

      return false;
    }
  }

  class Sprite extends Rect {
    constructor() {
      super();
      this.animation = null;
      this.boundary = null;
      this.delegate = null;
    }

    getImage() {
      return this.animation.getImage();
    }

    offBoundary() {
      if (this.delegate && this.delegate.offBoundary) {
        this.delegate.offBoundary();
      } else {
        this.expire();
      }
    }

    onAnimationLoop() {
      this.delegate && this.delegate.onAnimationLoop && this.delegate.onAnimationLoop();
    }

    render(context) {
      if (this.animation) {
        const image = this.getImage();
        const x = Math.floor(this.getX());
        const y = Math.floor(this.getY());
        context.drawImage(image, x, y, this.getWidth(), this.getHeight());
      }
    }

    setAnimation(animation) {
      if (this.animation == animation) {
        return this;
      }

      this.animation = animation;
      this.animation.updateFrameIndex(0);
      this.setHeight(this.animation.getHeight());
      this.setWidth(this.animation.getWidth());
      return this;
    }

    setBoundary(rect) {
      this.boundary = rect || Quick.getBoundary();
      return this;
    }

    setDelegate(delegate) {
      this.delegate = delegate;
      return this;
    }

    setImage(image) {
      this.setAnimation(new Animation([new Frame(image)]));
      return this;
    }

    setImageId(id) {
      this.setImage(document.getElementById(id));
      return this;
    }

    sync() {
      const result = Rect.prototype.sync.call(this);

      if (this.animation && this.animation.update()) {
        this.onAnimationLoop();
      }

      if (this.boundary && !this.hasCollision(this.boundary)) {
        this.offBoundary();
      }

      return result;
    }
  }

  class GameObject extends Sprite {
    constructor() {
      super();
      this.color = null;
      this.layerIndex = 0;
      this.isEssential = false;
      this.expiration = -1;
      this.isExpired = false;
      this.isSolid = false;
      this.isVisible = true;
      this.scene = null;
      this.tags = {};
      this.tick = 0;
    }

    addTag(tag) {
      this.tags[tag] = true;
      return this;
    }

    expire() {
      this.isExpired = true;
      return this;
    }

    getColor() {
      return this.color;
    }

    getEssential() {
      return this.isEssential;
    }

    getExpired() {
      return this.isExpired;
    }

    getLayerIndex() {
      return this.layerIndex;
    }

    getScene() {
      return this.scene;
    }

    getSolid() {
      return this.isSolid;
    }

    getTick() {
      return this.tick;
    }

    getVisible() {
      return this.isVisible;
    }

    hasTag(tag) {
      return this.tags[tag];
    }

    init(scene) {
      this.delegate && this.delegate.init && this.delegate.init(scene);
    }

    onCollision(gameObject) {
      this.delegate && this.delegate.onCollision && this.delegate.onCollision(gameObject);
    }

    setColor(color) {
      this.color = color;
      return this;
    }

    setEssential(isEssential) {
      this.isEssential = isEssential == undefined || isEssential;
      return this;
    }

    setLayerIndex(layerIndex) {
      this.layerIndex = layerIndex || 0;
      return this;
    }

    setScene(scene) {
      this.scene = scene;
      return this;
    }

    setSolid(isSolid) {
      this.isSolid = isSolid == undefined || isSolid;
      return this;
    }

    setVisible(isVisible) {
      this.isVisible = isVisible == undefined || isVisible;
      return this;
    }

    setExpiration(expiration) {
      this.expiration = expiration;
      return this;
    }

    render(context) {
      if (!this.isVisible) {
        return;
      }

      if (this.color) {
        const x = Math.floor(this.getX());
        const y = Math.floor(this.getY());
        context.fillStyle = this.color;
        context.fillRect(x, y, this.getWidth(), this.getHeight());
      }

      Sprite.prototype.render.call(this, context);
    }

    sync() {
      if (this.getExpired()) {
        return true;
      }

      if (++this.tick == this.expiration) {
        this.expire();
      }

      return Sprite.prototype.sync.call(this);
    }

    update() {
      this.delegate && this.delegate.update && this.delegate.update();
    }
  }

  class TextObject extends GameObject {
    constructor(string) {
      super();
      this.setString(string || '');
    }

    getString() {
      return this.string;
    }

    parse(context) {
      const SPACE = 4;
      const SPACING = 0;
      let height = 0;
      let width = 0;
      let x = 0;
      let y = 0;

      for (let i = 0; i < this.string.length; ++i) {
        let character = this.string[i];

        if (character == ' ') {
          x += SPACE + SPACING;
        } else if (character == '\n') {
          x = 0;
          y += height + SPACING;
        } else {
          const image = document.getElementById(character + 'Font');

          if (context) {
            context.drawImage(image, this.getX() + x, this.getY() + y, image.width, image.height);
          }

          x += image.width + SPACING;

          if (x > width) {
            width = x;
          }

          if (image.height > height) {
            height = image.height;
          }
        }
      }

      this.setWidth(width);
      this.setHeight(y + height);
    }

    render(context) {
      this.parse(context);
    }

    setString(string) {
      this.string = string;
      this.parse();
      return this;
    }
  }

  class BaseTile extends GameObject {
    constructor(id) {
      super();
      this.setImageId(id);
    }
  }

  class BaseTransition extends GameObject {
    constructor() {
      super();
      const COLOR = 'Black';
      const FRAMES = 32;
      this.setColor(COLOR);
      this.setHeight(Quick.getHeight());
      this.increase = Quick.getWidth() / FRAMES;
    }

    sync() {
      if (this.getWidth() > Quick.getWidth()) {
        return true;
      }

      this.increaseWidth(this.increase);
      Quick.paint(this);
      return GameObject.prototype.sync.call(this);
    }
  }

  function baseTileFactory(id) {
    return new BaseTile(id)
  }

  function boot() {
    const LOADING_TIMEOUT = 100;
    const IMAGES = Array.from(document.getElementsByTagName('img'));

    for (let i = 0; i < IMAGES.length; ++i) {
      const IMAGE = IMAGES[i];

      if (IMAGE.complete) {
        IMAGES.shift();
      } else {
        setTimeout(onTimeout, LOADING_TIMEOUT);
        return;
      }
    }

    scene = sceneFactory();
    loop();

    function onTimeout() {
      boot();
    }
  }

  function checkCollisions(gameObjects) {
    const LENGTH = gameObjects.length;

    for (let i = 0; i < LENGTH - 1; ++i) {
      const LEFT_GAME_OBJECT = gameObjects[i];

      for (let j = i + 1; j < LENGTH; ++j) {
        const RIGHT_GAME_OBJECT = gameObjects[j];

        if (LEFT_GAME_OBJECT.hasCollision(RIGHT_GAME_OBJECT)) {
          LEFT_GAME_OBJECT.onCollision(RIGHT_GAME_OBJECT);
          RIGHT_GAME_OBJECT.onCollision(LEFT_GAME_OBJECT);
        }
      }
    }
  }

  function getGamePads() {
    if (navigator.getGamepads) {
      return navigator.getGamepads();
    }

    return [];
  }

  function loop() {
    everyOther = !everyOther;
    input.update();

    if (transition != null) {
      if (transition.sync()) {
        transition = null;
      }
    } else {
      if (isTransitioning) {
        isTransitioning = false;
        scene = scene.getNext();
      }

      if (scene.sync()) {
        isTransitioning = true;
        transition = scene.getTransition();
      } else {
        scene.update();
      }
    }

    sound.update();
    requestAnimationFrame(render);
  }

  function polyfill() {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        callback();
      };
    }
  }

  function render() {
    for (let i = 0; i < renderableLists.length; ++i) {
      renderableLists[i].render(context);
    }

    setTimeout(loop, frameTime + lastRender - Date.now());
    lastRender = Date.now();
  }

  function scale() {
    let width, height;

    if (keepAspect) {
      let proportion = window.innerWidth / canvas.width;

      if (window.innerHeight < canvas.height * proportion) {
        proportion = window.innerHeight / canvas.height;
      }

      width = canvas.width * proportion;
      height = canvas.height * proportion
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    realWidth = width;
    realHeight = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  window.quick = {
    Animation,
    BaseTile,
    BaseTransition,
    CommandEnum,
    Controller,
    Frame,
    GameObject,
    ImageFactory,
    Mouse,
    Point,
    Quick,
    Rect,
    Scene,
    Sprite,
    TextObject,
  };
})();
