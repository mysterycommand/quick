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
      addEventListener('blur', focus, false);
      addEventListener('focus', focus, false);
      addEventListener('load', focus, false);
      addEventListener('resize', scale, false);
      autoScale && scale();

      for (let i = 0; i < numberOfLayers; ++i) {
        renderableLists.push(new RenderableList());
      }

      focus();
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

    static getBottom() {
      return height - 1;
    }

    static getCenter() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    static getCenterX() {
      return Math.floor(this.width / 2);
    }

    static getCenterY() {
      return Math.floor(this.height / 2);
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
      let result;

      try {
        result = localStorage.saveData && JSON.parse(localStorage.saveData);
      } catch (error) {
        console.log('Could not load saved game: ' + error);
      }

      return result;
    }

    static mute() {
      sound.mute();
    }

    static paint(renderable, index) {
      renderableLists[index || 0].add(renderable);
    }

    static play(id) {
      sound.play(id);
    }

    static playTheme(name) {
      sound.playTheme(name);
    }

    static random(ceil) {
      const RANDOM = Math.random() * (ceil + 1);
      return Math.floor(RANDOM);
    }

    static save(data) {
      if (data != null) {
        try {
          localStorage.saveData = JSON.stringify(data);
        } catch (error) {
          console.log('Could not save current game: ' + error);
        }
      } else {
        try {
          localStorage.clear();
        } catch (error) {
          console.log('Could not clear saved game: ' + error);
        }
      }
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

  class Point {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    // deprecated
    getX() {
      return this.x;
    }

    // deprecated
    getY() {
      return this.y;
    }

    setX(x) {
      this.x = x;
      return this;
    }

    setY(y) {
      this.y = y;
      return this;
    }
  }

  class Mouse extends Point {
    constructor(event) {
      super();
      this.down(event);

      addEventListener('mousedown', (event) => {
        this.down(event);
      }, false);

      addEventListener('mousemove', (event) => {
        event.preventDefault();
        this.updateCoordinates(event);
      }, false);

      addEventListener('mouseup', (event) => {
        event.preventDefault();
        this._isDown = false;
      }, false);
    }

    down(event) {
      event.preventDefault();
      this._isDown = true;
    }

    getCommand() {
      return this._isDown;
    }

    updateCoordinates(event) {
      this.setX(event.x || event.clientX);
      this.setY(event.y || event.clientY);
    }
  }

  class Touch extends Point {
    constructor(event) {
      super();
      event.preventDefault();
      this._isDown = true;
      this.updateCoordinates(event);

      addEventListener('touchend', (event) => {
        event.preventDefault();
        this._isDown = false;
        this.updateCoordinates(event);
      }, false);

      addEventListener('touchmove', (event) => {
        event.preventDefault();
        this.updateCoordinates(event);
      }, false);

      addEventListener('touchstart', () => {
        event.preventDefault();
        this._isDown = true;
        this.updateCoordinates(event);
      }, false);
    }

    getCommand() {
      return this._isDown;
    }

    updateCoordinates(event) {
      const TOUCHES = event['changedTouches'];
      const TOUCH = TOUCHES[0];
      this.setX(TOUCH.pageX);
      this.setY(TOUCH.pageY);
    }
  }

  class Pointer extends Point {
    constructor() {
      super();
      this._active = false;
      this._device = null;
      this._hold = false;
    }

    getDown() {
      return this._active;
    }

    getPush() {
      return this._active && !this._hold;
    }

    setDevice(device) {
      this._device = device;
    }

    update() {
      if (!this._device) {
        return;
      }

      this._hold = false;
      const LAST = this._active;
      this._active = this._device.getCommand();

      if (this._active && LAST) {
        this._hold = true;
      }

      const REAL_X = this._device.x - Quick.getOffsetLeft();
      const REAL_Y = this._device.y - Quick.getOffsetTop();
      this.setX(Math.floor(REAL_X * Quick.width / Quick.getRealWidth()));
      this.setY(Math.floor(REAL_Y * Quick.height / Quick.getRealHeight()));
    }
  }

  class Controller {
    constructor() {
      this._active = {};
      this._device = null;
      this._hold = {};
      this._sequence = [];
    }

    didPerform(commands) {
      for (let i = 1; i <= commands.length; ++i) {
        if (this._sequence[this._sequence.length - i] != commands[commands.length - i]) {
          return false;
        }
      }

      this._sequence = [];
      return true;
    }

    keyDown(commandEnum) {
      return this._active[commandEnum];
    }

    keyPush(commandEnum) {
      return this._active[commandEnum] && !this._hold[commandEnum];
    }

    setDevice(device) {
      this._device = device;
    }

    update() {
      if (!this._device) {
        return;
      }

      this._hold = {};
      const LAST = this._active;
      this._active = this._device.getCommands();

      for (let i in this._active) {
        if (this._active.hasOwnProperty(i)) {
          if (LAST[i]) {
            this._hold[i] = true;
          }
        }
      }

      for (let i in CommandEnum) {
        if (CommandEnum.hasOwnProperty(i)) {
          const COMMAND = CommandEnum[i];

          if (this.keyPush(COMMAND)) {
            this._sequence.push(COMMAND);
          }
        }
      }
    }
  }

  class GamePad {
    constructor(id) {
      this._id = id || 0;
    }

    getCommands() {
      const BUTTONS = Input.getGamePadButtons(this._id);
      const RESULT = {};

      if (Input.getGamePadAxes(this._id)[AxisEnum.LEFT_Y] < - ANALOG_THRESHOLD) {
        RESULT[CommandEnum.UP] = true;
      } else if (Input.getGamePadAxes(this._id)[AxisEnum.LEFT_Y] > ANALOG_THRESHOLD) {
        RESULT[CommandEnum.DOWN] = true;
      }

      if (Input.getGamePadAxes(this._id)[AxisEnum.LEFT_X] < - ANALOG_THRESHOLD) {
        RESULT[CommandEnum.LEFT] = true;
      } else if (Input.getGamePadAxes(this._id)[AxisEnum.LEFT_X] > ANALOG_THRESHOLD) {
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
      this._controllers = [];
      this._controllerQueue = [];
      this._controllerRequestQueue = [];
      this._pointers = [];
      this._pointerQueue = [];
      this._pointerRequestQueue = [];
      this._gamePads = 0;

      const ON_KEY_DOWN = (event) => {
        removeEventListener('keydown', ON_KEY_DOWN);
        console.log('Keyboard detected.');
        this.addController(new Keyboard(event));
      };

      const ON_MOUSE_DOWN = (event) => {
        removeEventListener('mousedown', ON_MOUSE_DOWN);
        console.log('Mouse detected.');
        this.addPointer(new Mouse(event));
      };

      const ON_TOUCH_START = (event) => {
        removeEventListener('touchstart', ON_TOUCH_START);
        console.log('Touch detected.');
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
      this._controllerQueue.push(device);
      this.checkControllerQueues();
    }

    addPointer(device) {
      this._pointerQueue.push(device);
      this.checkPointerQueues();
    }

    checkGamePads() {
      if (getGamePads()[this._gamePads]) {
        console.log('Game pad detected.');
        this.addController(new GamePad(this._gamePads++));
      }
    }

    checkControllerQueues() {
      if (this._controllerRequestQueue.length > 0 && this._controllerQueue.length > 0) {
        const REQUESTER = this._controllerRequestQueue.shift();
        const DEVICE = this._controllerQueue.shift();
        REQUESTER.setDevice(DEVICE);
      }
    }

    checkPointerQueues() {
      if (this._pointerRequestQueue.length > 0 && this._pointerQueue.length > 0) {
        const REQUESTER = this._pointerRequestQueue.shift();
        const DEVICE = this._pointerQueue.shift();
        REQUESTER.setDevice(DEVICE);
      }
    }

    getController(id = 0) {
      if (this._controllers.length < id + 1) {
        const CONTROLLER = new Controller();
        this._controllers.push(CONTROLLER);
        this._controllerRequestQueue.push(CONTROLLER);
        this.checkControllerQueues();
      }

      return this._controllers[id];
    }

    getPointer(id = 0) {
      if (this._pointers.length < id + 1) {
        const POINTER = new Pointer();
        this._pointers.push(POINTER);
        this._pointerRequestQueue.push(POINTER);
        this.checkPointerQueues();
      }

      return this._pointers[id];
    }

    update() {
      this.checkGamePads();

      for (let i in this._controllers) {
        if (this._controllers.hasOwnProperty(i)) {
          this._controllers[i].update();
        }
      }

      for (let j in this._pointers) {
        if (this._pointers.hasOwnProperty(j)) {
          this._pointers[j].update();
        }
      }
    }
  }

  class Keyboard {
    constructor(event) {
      this._buffer = {};
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

      for (let i in this._buffer) {
        if (this._buffer.hasOwnProperty(i)) {
          if (this._buffer[i]) {
            RESULT[i] = true;
          }
        }
      }

      return RESULT;
    }

    onKey(keyCode, isDown) {
      this._buffer[KeyToCommandMap[keyCode]] = isDown;
    }

    onKeyDown(event) {
      PassThrough[event.keyCode] || event.preventDefault();
      this.onKey(event.keyCode, true);
    }
  }

  class RenderableList {
    constructor() {
      this._elements = [];
    }

    add(renderable) {
      this._elements.push(renderable);
    }

    render(context) {
      for (let i = 0; i < this._elements.length; ++i) {
        this._elements[i].render(context);
      }

      this._elements.length = 0;
    }
  }

  class Sound {
    constructor() {
      this._isFading = false;
      this._isMute = false;
      this._nextThemeName = null;
      this._queue = {};
      this._theme = null;
      this._volume = 100;
    }

    fadeOut() {
      if (!this._theme) {
        return;
      }

      this._isFading = true;
      this._volume = 100;
    }

    mute() {
      this._isMute = !this._isMute;

      if (!this._isMute) {
        this._theme.play();
      } else {
        this._theme.pause();
      }
    }

    pause() {
      if (this._theme) {
        this._theme.pause();
      }
    }

    play(id) {
      if (this._isMute) {
        return;
      }

      this._queue[id] = true;
    }

    playTheme(id) {
      if (this._theme && this._theme.currentTime > 0) {
        this._nextThemeName = id;

        if (!this._isFading) {
          this.fadeOut();
        }

        return;
      }

      this.stopTheme();
      this._theme = document.getElementById(id);

      if (this._theme.currentTime > 0) {
        this._theme.currentTime = 0;
      }

      if (this._isMute) {
        return;
      }

      this._theme.volume = 1;
      this._theme.play();
    }

    resume() {
      if (this._isMute) {
        return;
      }

      if (this._theme.paused) {
        this._theme.play();
      }
    }

    stopTheme() {
      if (this._theme) {
        this._theme.pause();
        this._theme.currentTime = 0;
      }
    }

    update() {
      for (let i in this._queue) {
        if (this._queue.hasOwnProperty(i)) {
          const SOUND = document.getElementById(i);
          SOUND.pause();

          if (SOUND.currentTime > 0) {
            SOUND.currentTime = 0;
          }

          SOUND.volume = DEFAULT_SOUND_EFFECTS_VOLUME;
          SOUND.play();
        }
      }

      this._queue = {};

      if (this._isFading) {
        if (--this._volume > 0) {
          this._theme.volume = this._volume / 100;
        } else {
          this._isFading = false;
          this._theme = null;

          if (this._nextThemeName) {
            this.playTheme(this._nextThemeName);
            this._nextThemeName = null;
          }
        }
      }
    }
  }

  class Direction {
    constructor() {
      this._isBottom = false;
      this._isLeft = false;
      this._isRight = false;
      this._isTop = false;
    }

    getBottom() {
      return this._isBottom;
    }

    getLeft() {
      return this._isLeft;
    }

    getRight() {
      return this._isRight;
    }

    getTop() {
      return this._isTop;
    }

    setBottom(isBottom) {
      this._isBottom = isBottom == undefined || isBottom;
      return this;
    }

    setLeft(isLeft) {
      this._isLeft = isLeft == undefined || isLeft;
      return this;
    }

    setRight(isRight) {
      this._isRight = isRight == undefined || isRight;
      return this;
    }

    setTop(isTop) {
      this._isTop = isTop == undefined || isTop;
      return this;
    }
  }

  class Rect extends Point {
    constructor(x, y, width = 0, height = 0) {
      super(x, y);
      this.height = height;
      this.width = width;
    }

    getBottom() {
      return this.y + this.height - 1;
    }

    getCenter() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    getCenterX() {
      return this.x + Math.floor(this.width / 2);
    }

    getCenterY() {
      return this.y + Math.floor(this.height / 2);
    }

    // deprecated
    getHeight() {
      return this.height;
    }

    getLeft() {
      return this.x;
    }

    getRight() {
      return this.x + this.width - 1;
    }

    getTop() {
      return this.y;
    }

    // deprecated
    getWidth() {
      return this.width;
    }

    setBottom(y) {
      this.setY(y - this.height + 1);
      return this;
    }

    setCenter(point) {
      this.setCenterX(point.x);
      this.setCenterY(point.y);
      return this;
    }

    setCenterX(x) {
      this.setX(x - Math.floor(this.width / 2));
      return this;
    }

    setCenterY(y) {
      this.setY(y - Math.floor(this.height / 2));
      return this;
    }

    setHeight(height) {
      this.height = height;
      return this;
    }

    setLeft(x) {
      this.setX(x);
      return this;
    }

    setRight(x) {
      this.setX(x - this.width + 1);
      return this;
    }

    setTop(y) {
      this.setY(y);
      return this;
    }

    setWidth(width) {
      this.width = width;
      return this;
    }
  }

  class Frame {
    constructor(image, duration) {
      this._duration = duration || 0;
      this._image = image || new Image();
    }

    getDuration() {
      return this._duration;
    }

    getHeight() {
      return this._image.height;
    }

    getImage() {
      return this._image;
    }

    getWidth() {
      return this._image.width;
    }
  }

  class Animation {
    constructor(frames) {
      this.setFrames(frames);
    }

    getHeight() {
      return this._frame.height;
    }

    getImage() {
      return this._frame.getImage();
    }

    getWidth() {
      return this._frame.width;
    }

    setFrames(frames) {
      this._frames = frames || [new Frame()];
      this.updateFrameIndex(0);
      return this;
    }

    update() {
      let hasLooped = false;

      if (this._frame.getDuration() && ++this._tick > this._frame.getDuration()) {
        let index = this._frameIndex + 1;

        if (index == this._frames.length) {
          hasLooped = true;
          index = 0;
        }

        this.updateFrameIndex(index);
      }

      return hasLooped;
    }

    updateFrameIndex(frameIndex) {
      if (frameIndex < this._frames.length && frameIndex > -1) {
        this._frameIndex = frameIndex;
        this._tick = 0;
        this._frame = this._frames[frameIndex];
        return true;
      }

      return false;
    }
  }

  class Sprite extends Rect {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      this._animation = null;
      this._boundary = null;
      this._color = null;
      this._delegate = null;
      this._expiration = 0;
      this._layerIndex = 0;
      this._lastX = this.x;
      this._lastY = this.y;
      this._isEssential = false;
      this._isExpired = false;
      this._isSolid = false;
      this._isVisible = true;
      this._scene = null;
      this._tags = {};
      this._tick = 0;
      this.setAccelerationX();
      this.setAccelerationY();
      this.setMaxSpeedX();
      this.setMaxSpeedY();
      this.setSpeedX();
      this.setSpeedY();
    }

    addTag(tag) {
      this._tags[tag] = true;
      return this;
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

    expire() {
      this._isExpired = true;
      return this;
    }

    getAccelerationX() {
      return this._accelerationX;
    }

    getAccelerationY() {
      return this._accelerationY;
    }

    getAngle() {
      return toDegrees(Math.atan2(this.getSpeedY(), this.getSpeedX()));
    }

    getCollision(sprite) {
      const DIRECTION = new Direction();
      const TA = this.getTop();
      const RA = this.getRight();
      const BA = this.getBottom();
      const LA = this.getLeft();
      const XA = this.getCenterX();
      const YA = this.getCenterY();
      const TB = sprite.getTop();
      const RB = sprite.getRight();
      const BB = sprite.getBottom();
      const LB = sprite.getLeft();

      if (XA <= LB && RA < RB) {
        DIRECTION.setRight();
      } else if (XA >= RB && LA > LB) {
        DIRECTION.setLeft();
      }

      if (YA <= TB && BA < BB) {
        DIRECTION.setBottom();
      } else if (YA >= BB && TA > TB) {
        DIRECTION.setTop();
      }

      return DIRECTION;
    }

    getColor() {
      return this._color;
    }

    getDirection() {
      const DIRECTION = new Direction();

      if (this.x < this._lastX) {
        DIRECTION.setLeft();
      } else if (this.x > this._lastX) {
        DIRECTION.setRight();
      }

      if (this.y < this._lastY) {
        DIRECTION.setTop();
      } else if (this.y > this._lastY) {
        DIRECTION.setBottom();
      }

      return DIRECTION;
    }

    getEssential() {
      return this._isEssential;
    }

    getExpired() {
      return this._isExpired;
    }

    getImage() {
      return this._animation.getImage();
    }

    getLayerIndex() {
      return this._layerIndex;
    }

    getPosition() {
      return new Point(this.x, this.y);
    }

    getSpeedX() {
      return this._speedX;
    }

    getSpeedY() {
      return this._speedY;
    }

    getParentX() {
      return this._scene && this._scene.getParentX() || 0;
    }

    getParentY() {
      return this._scene && this._scene.getParentY() || 0;
    }

    getScene() {
      return this._scene;
    }

    getSolid() {
      return this._isSolid;
    }

    getTick() {
      return this._tick;
    }

    getVisible() {
      return this._isVisible;
    }

    hasCollision(rect) {
      return !(
        this.getLeft() > rect.getRight() ||
        this.getRight() < rect.getLeft() ||
        this.getTop() > rect.getBottom() ||
        this.getBottom() < rect.getTop()
      );
    }

    hasTag(tag) {
      return this._tags[tag];
    }

    init(scene) {
      this._delegate && this._delegate.init && this._delegate.init(scene);
    }

    move(width, height) {
      this.moveX(width);
      this.moveY(height);
      return this;
    }

    moveX(width) {
      this.setX(this.x + width);
      return this;
    }

    moveY(height) {
      this.setY(this.y + height);
      return this;
    }

    offBoundary() {
      if (this._delegate && this._delegate.offBoundary) {
        this._delegate.offBoundary();
      } else {
        this.expire();
      }
    }

    onAnimationLoop() {
      this._delegate && this._delegate.onAnimationLoop && this._delegate.onAnimationLoop();
    }

    onCollision(sprite) {
      this._delegate && this._delegate.onCollision && this._delegate.onCollision(sprite);
    }

    render(context) {
      if (!this._isVisible) {
        return;
      }

      const X = Math.floor(this.x + this.getParentX());
      const Y = Math.floor(this.y + this.getParentY());

      if (this._color) {
        context.fillStyle = this._color;
        context.fillRect(X, Y, this.width, this.height);
      }

      if (this._animation) {
        const IMAGE = this.getImage();
        context.drawImage(IMAGE, X, Y, this.width, this.height);
      }
    }

    setAccelerationX(accelerationX) {
      this._accelerationX = accelerationX || 0;
      return this;
    }

    setAccelerationY(accelerationY) {
      this._accelerationY = accelerationY || 0;
      return this;
    }

    setAnimation(animation) {
      if (this._animation == animation) {
        return this;
      }

      this._animation = animation;
      this._animation.updateFrameIndex(0);
      this.setHeight(this._animation.height);
      this.setWidth(this._animation.width);
      return this;
    }

    setBoundary(rect) {
      this._boundary = rect || this._scene && this._scene.getBoundary();
      return this;
    }

    setColor(color) {
      this._color = color;
      return this;
    }

    setDelegate(delegate) {
      this._delegate = delegate;
      return this;
    }

    setEssential(isEssential) {
      this._isEssential = isEssential == undefined || isEssential;
      return this;
    }

    setExpiration(expiration) {
      this._expiration = expiration;
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

    setLayerIndex(layerIndex) {
      this._layerIndex = layerIndex || 0;
      return this;
    }

    setMaxSpeedX(maxSpeedX) {
      this._maxSpeedX = maxSpeedX || 0;
      return this;
    }

    setMaxSpeedY(maxSpeedY) {
      this._maxSpeedY = maxSpeedY || 0;
      return this;
    }

    setPosition(pointOrX, y) {
      if (y != null) {
        this.setX(pointOrX);
        this.setY(y);
      } else {
        this.setX(pointOrX.x);
        this.setY(pointOrX.y);
      }

      return this;
    }

    setScene(scene) {
      this._scene = scene;
      return this;
    }

    setSize(rectOrWidth, height) {
      if (height != null) {
        this.setWidth(rectOrWidth);
        this.setHeight(height);
      } else {
        this.setWidth(rectOrWidth.width);
        this.setHeight(rectOrWidth.height);
      }

      return this;
    }

    setSolid(isSolid) {
      this._isSolid = isSolid == undefined || isSolid;
      return this;
    }

    setSpeedToAngle(speed, degrees) {
      const RADIANS = toRadians(degrees);
      this.setSpeedX(speed * Math.cos(RADIANS));
      this.setSpeedY(speed * Math.sin(RADIANS));
      return this;
    }

    setSpeedToPoint(speed, point) {
      const SQUARE_DISTANCE = Math.abs(this.getCenterX() - point.x) + Math.abs(this.getCenterY() - point.y);
      this.setSpeedX((point.x - this.getCenterX()) * speed / SQUARE_DISTANCE);
      this.setSpeedY((point.y - this.getCenterY()) * speed / SQUARE_DISTANCE);
      return this;
    }

    setSpeedX(speedX) {
      this._speedX = speedX || 0;
      return this;
    }

    setSpeedY(speedY) {
      this._speedY = speedY || 0;
      return this;
    }

    setVisible(isVisible) {
      this._isVisible = isVisible == undefined || isVisible;
      return this;
    }

    stop() {
      this.setSpeedX(0);
      this.setSpeedY(0);
      return this;
    }

    sync() {
      if (this.getExpired()) {
        return true;
      }

      if (++this._tick == this._expiration) {
        this.expire();
      }

      if (this._animation && this._animation.update()) {
        this.onAnimationLoop();
      }

      this.setSpeedX(this.getSpeedX() + this._accelerationX);

      if (this._maxSpeedX && Math.abs(this.getSpeedX()) > this._maxSpeedX) {
        const SIGNAL = this.getSpeedX() / Math.abs(this.getSpeedX());
        this.setSpeedX(this._maxSpeedX * SIGNAL);
      }

      this.setSpeedY(this.getSpeedY() + this._accelerationY);

      if (this._maxSpeedY && Math.abs(this.getSpeedY()) > this._maxSpeedY) {
        const SIGNAL = this.getSpeedY() / Math.abs(this.getSpeedY());
        this.setSpeedY(this._maxSpeedY * SIGNAL);
      }

      this._lastX = this.x;
      this._lastY = this.y;
      this.move(this.getSpeedX(), this.getSpeedY());

      if (this._boundary && !this.hasCollision(this._boundary)) {
        this.offBoundary();
      }

      return false;
    }

    update() {
      this._delegate && this._delegate.update && this._delegate.update();
    }
  }

  class Scene extends Sprite {
    constructor(x, y, width = Quick.width, height = Quick.height) {
      super(x, y, width, height);
      this._sprites = [];
      this._spritesQueue = [];
      this._transition = null;
    }

    add(sprite) {
      this._spritesQueue.push(sprite);
      sprite.setScene(this);
      sprite.init(this);
      sprite.move(sprite.getSpeedX() * -1, sprite.getSpeedY() * -1);
    }

    build(map, tileFactory = baseTileFactory, offsetX, offsetY) {
      for (let i = 0; i < map.length; ++i) {
        const LINE = map[i];

        for (let j = 0; j < LINE.length; ++j) {
          const ID = map[i][j];

          if (ID) {
            const TILE = tileFactory(ID);

            if (TILE) {
              const X = offsetX || TILE.width;
              const Y = offsetY || TILE.height;
              TILE.setTop(i * Y);
              TILE.setLeft(j * X);
              this.add(TILE);
            }
          }
        }
      }
    }

    getBoundary() {
      return new Rect(0, 0, this.width, this.height);
    }

    getParentX() {
      return this.x * -1;
    }

    getParentY() {
      return this.y * -1;
    }

    sync() {
      Quick.paint(this, this.getLayerIndex());
      let sprites = [];
      const SOLID_SPRITES = [];

      for (let i = 0; i < this._sprites.length; ++i) {
        const SPRITE = this._sprites[i];
        SPRITE.update();

        if (SPRITE.sync()) {
          if (SPRITE.getEssential()) {
            this.expire();
          }
        } else {
          if (SPRITE.getSolid()) {
            SOLID_SPRITES.push(SPRITE);
          }

          sprites.push(SPRITE);
          Quick.paint(SPRITE, SPRITE.getLayerIndex());
        }
      }

      checkCollisions(SOLID_SPRITES);
      this._sprites = sprites.concat(this._spritesQueue);
      this._spritesQueue = [];
      return Sprite.prototype.sync.call(this);
    }

    getNext() {
      if (this._delegate && this._delegate.getNext) {
        return this._delegate.getNext();
      }
    }

    getObjectsWithTag(tag) {
      const RESULT = [];

      for (let i = 0; i < this._sprites.length; ++i) {
        const SPRITE = this._sprites[i];

        if (SPRITE.hasTag(tag)) {
          RESULT.push(SPRITE);
        }
      }

      return RESULT;
    }

    getTransition() {
      return this._transition;
    }

    setExpiration(expiration) {
      this._expiration = expiration;
    }

    setTransition(transition) {
      this._transition = transition;
    }
  }

  class BaseTile extends Sprite {
    constructor(id) {
      super();
      this.setImageId(id);
    }
  }

  class BaseTransition extends Sprite {
    constructor() {
      super();
      const COLOR = 'Black';
      const FRAMES = 32;
      this.setColor(COLOR);
      this.setHeight(Quick.height);
      this._increase = Quick.width / FRAMES;
    }

    sync() {
      if (this.width > Quick.width) {
        return true;
      }

      this.width += this._increase;
      Quick.paint(this);
      return Sprite.prototype.sync.call(this);
    }
  }

  class TextObject extends Sprite {
    constructor(string) {
      super();
      this.setString(string || '');
    }

    getString() {
      return this._string;
    }

    parse(context) {
      const SPACE = 4;
      const SPACING = 0;
      let height = 0;
      let width = 0;
      let x = 0;
      let y = 0;

      for (let i = 0; i < this._string.length; ++i) {
        let character = this._string[i];

        if (character == ' ') {
          x += SPACE + SPACING;
        } else if (character == '\n') {
          x = 0;
          y += height + SPACING;
        } else {
          const IMAGE = document.getElementById(character + 'Font');

          if (context) {
            context.drawImage(IMAGE, this.x + x, this.y + y, IMAGE.width, IMAGE.height);
          }

          x += IMAGE.width + SPACING;

          if (x > width) {
            width = x;
          }

          if (IMAGE.height > height) {
            height = IMAGE.height;
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
      this._string = string;
      this.parse();
      return this;
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

  function checkCollisions(sprites) {
    const LENGTH = sprites.length;

    for (let i = 0; i < LENGTH - 1; ++i) {
      const LEFT_SPRITE = sprites[i];

      for (let j = i + 1; j < LENGTH; ++j) {
        const RIGHT_SPRITE = sprites[j];

        if (LEFT_SPRITE.hasCollision(RIGHT_SPRITE)) {
          LEFT_SPRITE.onCollision(RIGHT_SPRITE);
          RIGHT_SPRITE.onCollision(LEFT_SPRITE);
        }
      }
    }
  }

  function focus() {
    canvas && canvas.focus();
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
    window.requestAnimationFrame && window.requestAnimationFrame(render) || render();
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
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  const EXPORTS = {
    Animation,
    BaseTile,
    BaseTransition,
    CommandEnum,
    Controller,
    Frame,
    ImageFactory,
    Mouse,
    Point,
    Quick,
    Rect,
    Scene,
    Sprite,
    TextObject,
  };

  if (typeof(window) == 'object') {
    window.quick = EXPORTS;
  } else if (typeof(module.exports) == 'object') {
    module.exports = EXPORTS;
  }
})();
