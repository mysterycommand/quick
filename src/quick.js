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

  const Color = makeSet([
    "AliceBlue",
    "AntiqueWhite",
    "Aqua",
    "Aquamarine",
    "Azure",
    "Beige",
    "Bisque",
    "Black",
    "BlanchedAlmond",
    "Blue",
    "BlueViolet",
    "Brown",
    "BurlyWood",
    "CadetBlue",
    "Chartreuse",
    "Chocolate",
    "Coral",
    "CornflowerBlue",
    "Cornsilk",
    "Crimson",
    "Cyan",
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGreen",
    "DarkGrey",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "Darkorange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGray",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGray",
    "DimGrey",
    "DodgerBlue",
    "FireBrick",
    "FloralWhite",
    "ForestGreen",
    "Fuchsia",
    "Gainsboro",
    "GhostWhite",
    "Gold",
    "GoldenRod",
    "Gray",
    "Green",
    "GreenYellow",
    "Grey",
    "HoneyDew",
    "HotPink",
    "IndianRed",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "LavenderBlush",
    "LawnGreen",
    "LemonChiffon",
    "LightBlue",
    "LightCoral",
    "LightCyan",
    "LightGoldenRodYellow",
    "LightGray",
    "LightGreen",
    "LightGrey",
    "LightPink",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
    "LightSlateGrey",
    "LightSteelBlue",
    "LightYellow",
    "Lime",
    "LimeGreen",
    "Linen",
    "Magenta",
    "Maroon",
    "MediumAquaMarine",
    "MediumBlue",
    "MediumOrchid",
    "MediumPurple",
    "MediumSeaGreen",
    "MediumSlateBlue",
    "MediumSpringGreen",
    "MediumTurquoise",
    "MediumVioletRed",
    "MidnightBlue",
    "MintCream",
    "MistyRose",
    "Moccasin",
    "NavajoWhite",
    "Navy",
    "OldLace",
    "Olive",
    "OliveDrab",
    "Orange",
    "OrangeRed",
    "Orchid",
    "PaleGoldenRod",
    "PaleGreen",
    "PaleTurquoise",
    "PaleVioletRed",
    "PapayaWhip",
    "PeachPuff",
    "Peru",
    "Pink",
    "Plum",
    "PowderBlue",
    "Purple",
    "RebeccaPurple",
    "Red",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "SeaShell",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGray",
    "SlateGrey",
    "Snow",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal",
    "Thistle",
    "Tomato",
    "Turquoise",
    "Violet",
    "Wheat",
    "White",
    "WhiteSmoke",
    "Yellow",
    "YellowGreen",
  ]);

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

  const FontFamily = makeSet([
    "cursive",
    "fantsy",
    "monospace",
    "sans-serif",
    "serif",
  ]);

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
      this.setX(Math.floor(REAL_X * Quick.getWidth() / Quick.getRealWidth()));
      this.setY(Math.floor(REAL_Y * Quick.getHeight() / Quick.getRealHeight()));
    }
  }

  class Controller {
    constructor() {
      this.tolerance = 0;
      this._active = {};
      this._device = null;
      this._hold = {};
      this._sequence = [];
      this._tick = 0;
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

      if (this.tolerance && ++this._tick > this.tolerance) {
        this._sequence = [];
        this._tick = 0;
      }

      for (let i in CommandEnum) {
        if (CommandEnum.hasOwnProperty(i)) {
          const COMMAND = CommandEnum[i];

          if (this.keyPush(COMMAND)) {
            this._sequence.push(COMMAND);
            this._tick = 0;
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
      this.bottom = false;
      this.left = false;
      this.right = false;
      this.top = false;
    }

    // deprecated
    getBottom() {
      return this.bottom;
    }

    // deprecated
    getLeft() {
      return this.left;
    }

    // deprecated
    getRight() {
      return this.right;
    }

    // deprecated
    getTop() {
      return this.top;
    }

    setBottom(isBottom) {
      this.bottom = isBottom == undefined || isBottom;
      return this;
    }

    setLeft(isLeft) {
      this.left = isLeft == undefined || isLeft;
      return this;
    }

    setRight(isRight) {
      this.right = isRight == undefined || isRight;
      return this;
    }

    setTop(isTop) {
      this.top = isTop == undefined || isTop;
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

    get bottom() {
      return this.y + this.height - 1;
    }

    get center() {
      return new Point(this.getCenterX(), this.getCenterY());
    }

    get centerX() {
      return this.x + Math.floor(this.width / 2);
    }

    get centerY() {
      return this.y + Math.floor(this.height / 2);
    }

    get left() {
      return this.x;
    }

    get right() {
      return this.x + this.width - 1;
    }

    get top() {
      return this.y;
    }

    set bottom(y) {
      this.setBottom(y);
    }

    set center(point) {
      this.setCenter(point);
    }

    set centerX(x) {
      this.setCenterX(x);
    }

    set centerY(y) {
      this.setCenterY(y);
    }

    set left(x) {
      this.setLeft(x);
    }

    set right(x) {
      this.setRight(x);
    }

    set top(y) {
      this.setY(y);
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
      return this._frame.getHeight();
    }

    getImage() {
      return this._frame.getImage();
    }

    getWidth() {
      return this._frame.getWidth();
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
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.maxSpeedX = 0;
      this.maxSpeedY = 0;
      this.speedX = 0;
      this.speedY = 0;
      this.color = null;
      this.delegate = null;
      this.expiration = 0;
      this.layerIndex = 0;
      this.essential = false;
      this.expired = false;
      this.solid = false;
      this.visible = true;
      this.scene = null;
      this._animation = null;
      this._boundary = null;
      this._lastX = this.x;
      this._lastY = this.y;
      this._tags = {};
      this._tick = 0;
    }

    get angle() {
      return toDegrees(Math.atan2(this.speedY, this.speedX));
    }

    get direction() {
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

    addTag(tag) {
      this._tags[tag] = true;
      return this;
    }

    bounceFrom(direction) {
      if ((this.getSpeedX() < 0 && direction.left) || (this.getSpeedX() > 0 && direction.right)) {
        this.bounceX();
      }

      if ((this.getSpeedY() < 0 && direction.top) || (this.getSpeedY() > 0 && direction.bottom)) {
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
      this.expired = true;
      return this;
    }

    // deprecated
    getAccelerationX() {
      return this.accelerationX;
    }

    // deprecated
    getAccelerationY() {
      return this.accelerationY;
    }

    // deprecated
    getAngle() {
      return this.angle;
    }

    getCollision(sprite) {
      const DIRECTION = new Direction();
      const TA = this.top;
      const RA = this.right;
      const BA = this.bottom;
      const LA = this.left;
      const XA = this.getCenterX();
      const YA = this.getCenterY();
      const TB = sprite.top;
      const RB = sprite.right;
      const BB = sprite.bottom;
      const LB = sprite.left;

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

    // deprecated
    getColor() {
      return this.color;
    }

    // deprecated
    getDirection() {
      return this.direction;
    }

    // deprecated
    getEssential() {
      return this.essential;
    }

    // deprecated
    getExpired() {
      return this.expired;
    }

    // deprecated
    getImage() {
      return this._animation.getImage();
    }

    // deprecated
    getLayerIndex() {
      return this.layerIndex;
    }

    // deprecated
    getPosition() {
      return new Point(this.x, this.y);
    }

    // deprecated
    getSpeedX() {
      return this.speedX;
    }

    // deprecated
    getSpeedY() {
      return this.speedY;
    }

    getParentX() {
      return this.scene && this.scene.getParentX() || 0;
    }

    getParentY() {
      return this.scene && this.scene.getParentY() || 0;
    }

    // deprecated
    getScene() {
      return this.scene;
    }

    // deprecated
    getSolid() {
      return this.solid;
    }

    // deprecated
    getTick() {
      return this._tick;
    }

    // deprecated
    getVisible() {
      return this.visible;
    }

    hasCollision(rect) {
      return !(
        this.left > rect.right ||
        this.right < rect.left ||
        this.top > rect.bottom ||
        this.bottom < rect.top
      );
    }

    hasTag(tag) {
      return this._tags[tag];
    }

    init(scene) {
      this.delegate && this.delegate.init && this.delegate.init(scene);
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
      if (this.delegate && this.delegate.offBoundary) {
        this.delegate.offBoundary();
      } else {
        this.expire();
      }
    }

    onAnimationLoop() {
      this.delegate && this.delegate.onAnimationLoop && this.delegate.onAnimationLoop();
    }

    onCollision(sprite) {
      this.delegate && this.delegate.onCollision && this.delegate.onCollision(sprite);
    }

    render(context) {
      if (!this.visible) {
        return false;
      }

      const X = Math.floor(this.x + this.getParentX());
      const Y = Math.floor(this.y + this.getParentY());

      if (this.color) {
        context.fillStyle = this.color;
        context.fillRect(X, Y, this.width, this.height);
      }

      if (this._animation) {
        const IMAGE = this.getImage();
        context.drawImage(IMAGE, X, Y, this.width, this.height);
      }

      return true;
    }

    setAccelerationX(accelerationX) {
      this.accelerationX = accelerationX;
      return this;
    }

    setAccelerationY(accelerationY) {
      this.accelerationY = accelerationY || 0;
      return this;
    }

    setAnimation(animation) {
      if (this._animation == animation) {
        return this;
      }

      this._animation = animation;
      this._animation.updateFrameIndex(0);
      this.setHeight(this._animation.getHeight());
      this.setWidth(this._animation.getWidth());
      return this;
    }

    setBoundary(rect) {
      this._boundary = rect || this.scene && this.scene.getBoundary();
      return this;
    }

    setColor(color) {
      this.color = color;
      return this;
    }

    setDelegate(delegate) {
      this.delegate = delegate;
      return this;
    }

    setEssential(isEssential) {
      this.essential = isEssential == undefined || isEssential;
      return this;
    }

    setExpiration(expiration) {
      this.expiration = expiration;
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
      this.layerIndex = layerIndex || 0;
      return this;
    }

    setMaxSpeedX(maxSpeedX) {
      this.masSpeedX = maxSpeedX || 0;
      return this;
    }

    setMaxSpeedY(maxSpeedY) {
      this.masSpeedY = maxSpeedY || 0;
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
      this.scene = scene;
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
      this.solid = isSolid == undefined || isSolid;
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
      this.speedX = speedX || 0;
      return this;
    }

    setSpeedY(speedY) {
      this.speedY = speedY || 0;
      return this;
    }

    setVisible(isVisible) {
      this.visible = isVisible == undefined || isVisible;
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

      if (++this._tick == this.expiration) {
        this.expire();
      }

      if (this._animation && this._animation.update()) {
        this.onAnimationLoop();
      }

      this.setSpeedX(this.getSpeedX() + this.accelerationX);

      if (this.masSpeedX && Math.abs(this.getSpeedX()) > this.masSpeedX) {
        const SIGNAL = this.getSpeedX() / Math.abs(this.getSpeedX());
        this.setSpeedX(this.masSpeedX * SIGNAL);
      }

      this.setSpeedY(this.getSpeedY() + this.accelerationY);

      if (this.masSpeedY && Math.abs(this.getSpeedY()) > this.masSpeedY) {
        const SIGNAL = this.getSpeedY() / Math.abs(this.getSpeedY());
        this.setSpeedY(this.masSpeedY * SIGNAL);
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
      this.delegate && this.delegate.update && this.delegate.update();
    }
  }

  class Scene extends Sprite {
    constructor(x, y, width = Quick.getWidth(), height = Quick.getHeight()) {
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
      if (this.delegate && this.delegate.getNext) {
        return this.delegate.getNext();
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
      this.expiration = expiration;
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
      const FRAMES = 32;
      this.setColor(Color.Black);
      this.setHeight(Quick.getHeight());
      this._increase = Quick.getWidth() / FRAMES;
    }

    sync() {
      if (this.width > Quick.getWidth()) {
        return true;
      }

      this.width += this._increase;
      Quick.paint(this);
      return Sprite.prototype.sync.call(this);
    }
  }

  class FontSprite extends Sprite {
    constructor(text) {
      super();
      this.text = text;
    }

    // deprecated
    getString() {
      return this._text;
    }

    render(context) {
      Sprite.prototype.render.call(this, context) && this._parse(context);
    }

    // deprecated
    setString(string) {
      return this.setText(string);
    }

    setText(text) {
      this._text = text;
      this._parse();
      return this;
    }

    get text() {
      return this._text;
    }

    set text(text) {
      this.setText(text);
    }

    _parse(context) {
      const SPACE = 4;
      const SPACING = 0;
      let height = 0;
      let width = 0;
      let x = 0;
      let y = 0;

      for (let i = 0; i < this._text.length; ++i) {
        let character = this._text[i];

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
  }

  class TextSprite extends Sprite {
    constructor(x, y, width, height, text) {
      super(x, y, width, height);
      this.fontColor = Color.White;
      this.text = text;
      this._fontFamily = FontFamily.monospace;
      this._fontSize = 8;
      this._updateFont();
    }

    render(context) {
      if (Sprite.prototype.render.call(this, context)) {
        context.fillStyle = this.fontColor;
        context.font = this._font;
        context.fillText(this.text, this.x, this.y, this.width);
      }
    }

    setFontFamily(fontFamily) {
      this._fontFamily = fontFamily;
      this._updateFont();
      return this;
    }

    setFontSize(fontSize) {
      this._fontSize = fontSize;
      this._updateFont();
      return this;
    }

    setText(text) {
      this.text = text;
      return this;
    }

    get fontFamily() {
      return this._fontFamily;
    }

    get fontSize() {
      return this._fontSize;
    }

    set fontFamily(fontFamily) {
      this.setFontFamily(fontFamily);
    }

    set fontSize(fontSize) {
      this.setFontSize(fontSize);
    }

    _updateFont() {
      this._font = this._fontSize + 'px ' + this._fontFamily;
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

  function makeSet(array) {
    const RESULT = {};

    for (let i = 0; i < array.length; ++i) {
      const VALUE = array[i];
      RESULT[VALUE] = VALUE;
    }

    return RESULT;
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
    Color,
    CommandEnum,
    Controller,
    FontFamily,
    FontSprite,
    Frame,
    ImageFactory,
    Mouse,
    Point,
    Quick,
    Rect,
    Scene,
    Sprite,
    TextObject: FontSprite, // deprecated
    TextSprite,
  };

  if (typeof(window) == 'object') {
    window.quick = EXPORTS;
  } else if (typeof(module.exports) == 'object') {
    module.exports = EXPORTS;
  }
})();
