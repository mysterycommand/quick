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

  const Axis = {
    LEFT_X: 0,
    LEFT_Y: 1,
    RIGHT_X: 2,
    RIGHT_Y: 3
  };

  const Button = {
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
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Bisque',
    'Black',
    'BlanchedAlmond',
    'Blue',
    'BlueViolet',
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkBlue',
    'DarkCyan',
    'DarkGoldenRod',
    'DarkGray',
    'DarkGreen',
    'DarkGrey',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'Darkorange',
    'DarkOrchid',
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkSlateBlue',
    'DarkSlateGray',
    'DarkSlateGrey',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',
    'DeepSkyBlue',
    'DimGray',
    'DimGrey',
    'DodgerBlue',
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Gray',
    'Green',
    'GreenYellow',
    'Grey',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow',
    'LightGray',
    'LightGreen',
    'LightGrey',
    'LightPink',
    'LightSalmon',
    'LightSeaGreen',
    'LightSkyBlue',
    'LightSlateGray',
    'LightSlateGrey',
    'LightSteelBlue',
    'LightYellow',
    'Lime',
    'LimeGreen',
    'Linen',
    'Magenta',
    'Maroon',
    'MediumAquaMarine',
    'MediumBlue',
    'MediumOrchid',
    'MediumPurple',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'MediumSpringGreen',
    'MediumTurquoise',
    'MediumVioletRed',
    'MidnightBlue',
    'MintCream',
    'MistyRose',
    'Moccasin',
    'NavajoWhite',
    'Navy',
    'OldLace',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'PaleGoldenRod',
    'PaleGreen',
    'PaleTurquoise',
    'PaleVioletRed',
    'PapayaWhip',
    'PeachPuff',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'Purple',
    'RebeccaPurple',
    'Red',
    'RosyBrown',
    'RoyalBlue',
    'SaddleBrown',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SeaShell',
    'Sienna',
    'Silver',
    'SkyBlue',
    'SlateBlue',
    'SlateGray',
    'SlateGrey',
    'Snow',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'White',
    'WhiteSmoke',
    'Yellow',
    'YellowGreen',
  ]);

  const Command = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    A: 4,
    B: 5,
    X: 6,
    Y: 7,
    SELECT: 8,
    START: 9,
  };

  const FontFamily = {
    Cursive: 'cursive',
    Fantasy: 'fantasy',
    Monospace: 'monospace',
    SansSerif: 'sans-serif',
    Serif: 'serif',
  };

  const Key = {
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
    F12: 123,
  };

  const ButtonToCommandMap = {};
  ButtonToCommandMap[Button.UP] = Command.UP;
  ButtonToCommandMap[Button.DOWN] = Command.DOWN;
  ButtonToCommandMap[Button.LEFT] = Command.LEFT;
  ButtonToCommandMap[Button.RIGHT] = Command.RIGHT;
  ButtonToCommandMap[Button.A] = Command.A;
  ButtonToCommandMap[Button.B] = Command.B;
  ButtonToCommandMap[Button.X] = Command.X;
  ButtonToCommandMap[Button.Y] = Command.Y;
  ButtonToCommandMap[Button.START] = Command.START;
  ButtonToCommandMap[Button.SELECT] = Command.SELECT;

  const KeyToCommandMap = {};
  KeyToCommandMap[Key.UP] = Command.UP;
  KeyToCommandMap[Key.E] = Command.UP;
  KeyToCommandMap[Key.I] = Command.UP;
  KeyToCommandMap[Key.DOWN] = Command.DOWN;
  KeyToCommandMap[Key.D] = Command.DOWN;
  KeyToCommandMap[Key.K] = Command.DOWN;
  KeyToCommandMap[Key.LEFT] = Command.LEFT;
  KeyToCommandMap[Key.S] = Command.LEFT;
  KeyToCommandMap[Key.J] = Command.LEFT;
  KeyToCommandMap[Key.RIGHT] = Command.RIGHT;
  KeyToCommandMap[Key.F] = Command.RIGHT;
  KeyToCommandMap[Key.L] = Command.RIGHT;
  KeyToCommandMap[Key.SPACE] = Command.A;
  KeyToCommandMap[Key.ALT] = Command.B;
  KeyToCommandMap[Key.CTRL] = Command.X;
  KeyToCommandMap[Key.SHIFT] = Command.Y;
  KeyToCommandMap[Key.ENTER] = Command.START;
  KeyToCommandMap[Key.ESC] = Command.SELECT;

  const PassThrough = [];
  PassThrough[Key.F5] = true;
  PassThrough[Key.F11] = true;
  PassThrough[Key.F12] = true;

  class Point {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
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

  const Input = (() => {
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

      keyDown(command) {
        return this._active[command];
      }

      keyPush(command) {
        return this._active[command] && !this._hold[command];
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
        this._active = this._device.commands;

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

        for (let i in Command) {
          if (Command.hasOwnProperty(i)) {
            const COMMAND = Command[i];

            if (this.keyPush(COMMAND)) {
              this._sequence.push(COMMAND);
              this._tick = 0;
            }
          }
        }
      }
    }

    class GamePad {
      constructor(id = 0) {
        this._id = id;
      }

      get commands() {
        const BUTTONS = Input.getGamePadButtons(this._id);
        const RESULT = {};

        if (Input.getGamePadAxes(this._id)[Axis.LEFT_Y] < - ANALOG_THRESHOLD) {
          RESULT[Command.UP] = true;
        } else if (Input.getGamePadAxes(this._id)[Axis.LEFT_Y] > ANALOG_THRESHOLD) {
          RESULT[Command.DOWN] = true;
        }

        if (Input.getGamePadAxes(this._id)[Axis.LEFT_X] < - ANALOG_THRESHOLD) {
          RESULT[Command.LEFT] = true;
        } else if (Input.getGamePadAxes(this._id)[Axis.LEFT_X] > ANALOG_THRESHOLD) {
          RESULT[Command.RIGHT] = true;
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

        const ON_KEYBOARD = (event) => {
          removeEventListener('keydown', ON_KEYBOARD);
          console.log('Keyboard detected.');
          this.addController(new Keyboard(event));
        };

        const ON_MOUSE = (event) => {
          removeEventListener('mousemove', ON_MOUSE);
          console.log('Mouse detected.');
          this.addPointer(new Mouse(event));
        };

        const ON_TOUCH = (event) => {
          removeEventListener('touchstart', ON_TOUCH);
          console.log('Touch detected.');
          this.addPointer(new Touch(event));
        };

        addEventListener('keydown', ON_KEYBOARD, false);
        addEventListener('mousemove', ON_MOUSE, false);
        addEventListener('touchstart', ON_TOUCH, false);
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

      get commands() {
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

    class Mouse extends Point {
      constructor(event) {
        super();
        this.updateCoordinates(event);

        addEventListener('mousedown', (event) => {
          event.preventDefault();
          this._isDown = true;
        }, false);

        addEventListener('mousemove', (event) => {
          this.updateCoordinates(event);
        }, false);

        addEventListener('mouseup', (event) => {
          event.preventDefault();
          this._isDown = false;
        }, false);
      }

      get command() {
        return this._isDown;
      }

      updateCoordinates(event) {
        event.preventDefault();
        this.x = event.x || event.clientX;
        this.y = event.y || event.clientY;
      }
    }

    class Pointer extends Point {
      constructor() {
        super();
        this._active = false;
        this._device = null;
        this._hold = false;
      }

      get down() {
        return this._active;
      }

      get push() {
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
        this._active = this._device.command;

        if (this._active && LAST) {
          this._hold = true;
        }

        const REAL_X = this._device.x - Quick.offsetLeft;
        const REAL_Y = this._device.y - Quick.offsetTop;
        this.x = Math.floor(REAL_X * Quick.width / Quick.realWidth);
        this.y = Math.floor(REAL_Y * Quick.height / Quick.realHeight);
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

      get command() {
        return this._isDown;
      }

      updateCoordinates(event) {
        const TOUCHES = event['changedTouches'];
        const TOUCH = TOUCHES[0];
        this.x = TOUCH.pageX;
        this.y = TOUCH.pageY;
      }
    }

    function getGamePads() {
      return navigator.getGamepads && navigator.getGamepads() || [];
    }

    return Input;
  })();

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

  const Quick = (() => {
    let _autoScale = true;
    let _canvas = document.getElementById('game') || document.getElementsByTagName('canvas')[0];
    let _context = _canvas.getContext('2d');
    let _everyOther = true;
    let _frameTime = DEFAULT_FRAME_TIME;
    let _height = _canvas.height;
    let _keepAspect = false;
    let _input = new Input();
    let _lastRender;
    let _realHeight = _canvas.height;
    let _realWidth = _canvas.width;
    let _renderableLists = [];
    let _scene;
    let _sound = new Sound();
    let _transition;
    let _width = _canvas.width;

    class Quick {
      static init(scene) {
        _scene = scene;
        boot();
      }

      static get bottom() {
        return _height - 1;
      }

      static get center() {
        return new Point(this.centerX, this.centerY);
      }

      static get centerX() {
        return Math.floor(_width / 2);
      }

      static get centerY() {
        return Math.floor(_height / 2);
      }

      static get height() {
        return _height;
      }

      static get offsetLeft() {
        return _canvas.offsetLeft;
      }

      static get offsetTop() {
        return _canvas.offsetTop;
      }

      static get right() {
        return _width - 1;
      }

      static get everyOther() {
        return _everyOther;
      }

      static get frameTime() {
        return _frameTime;
      }

      static get realHeight() {
        return _realHeight;
      }

      static get realWidth() {
        return _realWidth;
      }

      static get width() {
        return _width;
      }

      static addControllerDevice(device) {
        _input.addController(device);
      }

      static clear() {
        _context.clearRect(0, 0, _width, _height);
      }

      static fadeOut() {
        _sound.fadeOut();
      }

      static flip(image) {
        return invert(image, false, true);
      }

      static getController(id) {
        return _input.getController(id);
      }

      static get controller() {
        return this.getController();
      }

      static getPointer(id) {
        return _input.getPointer(id);
      }

      static get pointer() {
        return this.getPointer();
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

      static mirror(image) {
        return invert(image, true, false);
      }

      static mute() {
        _sound.mute();
      }

      static paint(renderable, index = 0) {
        if (index >= _renderableLists.length) {
          for (let i = _renderableLists.length; i <= index; ++i) {
            _renderableLists.push(new RenderableList());
          }
        }

        _renderableLists[index].add(renderable);
      }

      static play(id) {
        _sound.play(id);
      }

      static playTheme(name) {
        _sound.playTheme(name);
      }

      static random(ceil) {
        const RANDOM = Math.random() * (ceil + 1);
        return Math.floor(RANDOM);
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

      static setAutoScale(customAutoScale = true) {
        _autoScale = customAutoScale;
      }

      static setFrameTime(frameTime) {
        _frameTime = frameTime || DEFAULT_FRAME_TIME;
      }

      static setKeepAspect(customKeepAspect = true) {
        _keepAspect = customKeepAspect;
      }

      static setName(name) {
        document.title = name;
      }

      static stopTheme() {
        _sound.stopTheme();
      }
    }

    function boot() {
      const IMAGES = Array.from(document.getElementsByTagName('img'));

      for (let i = 0; i < IMAGES.length; ++i) {
        const IMAGE = IMAGES[i];

        if (IMAGE.complete) {
          IMAGES.shift();
        } else {
          setTimeout(boot, 100);
          return;
        }
      }

      addEventListener('blur', focus, false);
      addEventListener('focus', focus, false);
      addEventListener('load', focus, false);
      addEventListener('resize', scale, false);
      _autoScale && scale();
      focus();
      initScene();
      _lastRender = Date.now();
      loop();
    }

    function focus() {
      _canvas && _canvas.focus();
    }

    function initScene() {
      if (!_scene) {
        throw('Could not get the next scene.');
      }

      _scene.height = _scene.height || _height;
      _scene.width = _scene.width || _width;
      _scene.init();
    }

    function invert(image, isMirror, isFlip) {
      const IMAGE = document.createElement('canvas');
      IMAGE.width = image.width;
      IMAGE.height = image.height;
      const CONTEXT = IMAGE.getContext('2d');
      CONTEXT.translate(isMirror ? IMAGE.width : 0, isFlip ? IMAGE.height : 0);
      CONTEXT.scale(isMirror ? -1 : 1, isFlip ? - 1 : 1);
      CONTEXT.drawImage(image, 0, 0);
      return IMAGE;
    }

    function loop() {
      _everyOther = !_everyOther;
      _input.update();

      if (_transition != null) {
        if (_transition.sync()) {
          _transition = null;
        }
      } else {
        if (_scene.sync()) {
          _transition = _scene.transition;
          _scene = _scene.next;
          initScene();
        } else {
          _scene.update();
        }
      }

      _sound.update();
      window.requestAnimationFrame && window.requestAnimationFrame(render) || render();
    }

    function render() {
      for (let i = 0; i < _renderableLists.length; ++i) {
        _renderableLists[i].render(_context);
      }

      setTimeout(loop, _frameTime + _lastRender - Date.now());
      _lastRender = Date.now();
    }

    function scale() {
      let width, height;

      if (_keepAspect) {
        let proportion = window.innerWidth / _canvas.width;

        if (window.innerHeight < _canvas.height * proportion) {
          proportion = window.innerHeight / _canvas.height;
        }

        width = _canvas.width * proportion;
        height = _canvas.height * proportion
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }

      _realWidth = width;
      _realHeight = height;
      _canvas.style.width = width + 'px';
      _canvas.style.height = height + 'px';
    }

    return Quick;
  })();

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

  class Direction {
    constructor() {
      this.bottom = false;
      this.left = false;
      this.right = false;
      this.top = false;
    }

    setBottom(isBottom = true) {
      this.bottom = isBottom;
      return this;
    }

    setLeft(isLeft = true) {
      this.left = isLeft;
      return this;
    }

    setRight(isRight = true) {
      this.right = isRight;
      return this;
    }

    setTop(isTop = true) {
      this.top = isTop;
      return this;
    }
  }

  class Rect extends Point {
    constructor(x, y, width = 0, height = 0) {
      super(x, y);
      this.height = height;
      this.width = width;
    }

    get bottom() {
      return this.y + this.height - 1;
    }

    get center() {
      return new Point(this.centerX, this.centerY);
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

    setBottom(y) {
      this.y = y - this.height + 1;
      return this;
    }

    setCenter(point) {
      this.setCenterX(point.x);
      this.setCenterY(point.y);
      return this;
    }

    setCenterX(x) {
      this.x = x - Math.floor(this.width / 2);
      return this;
    }

    setCenterY(y) {
      this.y = y - Math.floor(this.height / 2);
      return this;
    }

    setHeight(height) {
      this.height = height;
      return this;
    }

    setLeft(x) {
      this.x = x;
      return this;
    }

    setRight(x) {
      this.x = x - this.width + 1;
      return this;
    }

    setTop(y) {
      this.y = y;
      return this;
    }

    setWidth(width) {
      this.width = width;
      return this;
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
    constructor(image, duration = 0) {
      this.duration = duration;

      if (typeof(image) == 'string') {
        this.image = document.getElementById(image);
      } else {
        this.image = image;
      }

      this.height = this.image.height;
      this.width = this.image.width;
    }
  }

  class Animation {
    constructor(frames) {
      this._frames = frames;
      this._frame = this._frames[0];
      this._frameIndex = 0;
      this._tick = 0;
    }

    get height() {
      return this._frame.height;
    }

    get image() {
      return this._frame.image;
    }

    get width() {
      return this._frame.width;
    }

    update() {
      let hasLooped = false;

      if (this._frame.duration && ++this._tick > this._frame.duration) {
        let index = this._frameIndex + 1;

        if (index == this._frames.length) {
          hasLooped = true;
          index = 0;
        }

        this.setFrameIndex(index);
      }

      return hasLooped;
    }

    setFrameIndex(frameIndex) {
      if (frameIndex < this._frames.length && frameIndex > -1) {
        this._frameIndex = frameIndex;
        this._tick = 0;
        this._frame = this._frames[frameIndex];
      }
    }

    set frameIndex(frameIndex) {
      this.setFrameIndex(frameIndex);
    }
  }

  class Sprite extends Rect {
    constructor(scene = null) {
      super();
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.boundary = null;
      this.maxSpeedX = 0;
      this.maxSpeedY = 0;
      this.speedX = 0;
      this.speedY = 0;
      this.color = null;
      this.expiration = 0;
      this.layerIndex = 0;
      this.essential = false;
      this.expired = false;
      this.solid = false;
      this.visible = true;
      this.scene = scene;
      this._animation = null;
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

    get image() {
      return this._animation.image;
    }

    get tick() {
      return this._tick;
    }

    addTag(tag) {
      this._tags[tag] = true;
      return this;
    }

    bounceFrom(direction) {
      if ((this.speedX < 0 && direction.left) || (this.speedX > 0 && direction.right)) {
        this.bounceX();
      }

      if ((this.speedY < 0 && direction.top) || (this.speedY > 0 && direction.bottom)) {
        this.bounceY();
      }

      return this;
    }

    bounceX() {
      this.setSpeedX(this.speedX * -1);
      this.x += this.speedX;
      return this;
    }

    bounceY() {
      this.setSpeedY(this.speedY * -1);
      this.y += this.speedY;
      return this;
    }

    expire() {
      this.expired = true;
      return this;
    }

    getCollision(sprite) {
      const DIRECTION = new Direction();
      const TA = this.top;
      const RA = this.right;
      const BA = this.bottom;
      const LA = this.left;
      const XA = this.centerX;
      const YA = this.centerY;
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

    init() {
      // no default behavior
    }

    offBoundary() {
      this.expire();
    }

    onAnimationLoop() {
      // no default behavior
    }

    onCollision(sprite) {
      // no default behavior
    }

    render(context) {
      if (!this.visible) {
        return false;
      }

      const X = Math.floor(this.x + this.scene.x);
      const Y = Math.floor(this.y + this.scene.y);

      if (this.color) {
        context.fillStyle = this.color;
        context.fillRect(X, Y, this.width, this.height);
      }

      if (this._animation) {
        context.drawImage(this._animation.image, X, Y, this.width, this.height);
      }

      return true;
    }

    setAccelerationX(accelerationX = 0) {
      this.accelerationX = accelerationX;
      return this;
    }

    setAccelerationY(accelerationY = 0) {
      this.accelerationY = accelerationY;
      return this;
    }

    setAnimation(animation) {
      if (this._animation == animation) {
        return this;
      }

      this._animation = animation;
      this._animation.setFrameIndex(0);
      this.height = this._animation.height;
      this.width = this._animation.width;
      return this;
    }

    setBoundary(rect) {
      this.boundary = rect || this.scene;
      return this;
    }

    setColor(color) {
      this.color = color;
      return this;
    }

    setEssential(isEssential = true) {
      this.essential = isEssential;
      return this;
    }

    setExpiration(expiration = 0) {
      this.expiration = expiration;
      return this;
    }

    setImage(image) {
      this.setAnimation(new Animation([new Frame(image)]));
      return this;
    }

    set image(image) {
      this.setImage(image);
    }

    setImageId(id) {
      this.setImage(document.getElementById(id));
      return this;
    }

    setLayerIndex(layerIndex = 0) {
      this.layerIndex = layerIndex;
      return this;
    }

    setMaxSpeedX(maxSpeedX = 0) {
      this.maxSpeedX = maxSpeedX;
      return this;
    }

    setMaxSpeedY(maxSpeedY = 0) {
      this.maxSpeedY = maxSpeedY;
      return this;
    }

    setPosition(pointOrX, y) {
      if (y != null) {
        this.x = pointOrX;
        this.y = y;
      } else {
        this.x = pointOrX.x;
        this.y = pointOrX.y;
      }

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

    setSolid(isSolid = true) {
      this.solid = isSolid;
      return this;
    }

    setSpeedToAngle(speed, degrees) {
      const RADIANS = toRadians(degrees);
      this.setSpeedX(speed * Math.cos(RADIANS));
      this.setSpeedY(speed * Math.sin(RADIANS));
      return this;
    }

    setSpeedToPoint(speed, point) {
      const SQUARE_DISTANCE = Math.abs(this.centerX - point.x) + Math.abs(this.centerY - point.y);
      this.setSpeedX((point.x - this.centerX) * speed / SQUARE_DISTANCE);
      this.setSpeedY((point.y - this.centerY) * speed / SQUARE_DISTANCE);
      return this;
    }

    setSpeedX(speedX = 0) {
      this.speedX = speedX;
      return this;
    }

    setSpeedY(speedY = 0) {
      this.speedY = speedY;
      return this;
    }

    setVisible(isVisible = true) {
      this.visible = isVisible;
      return this;
    }

    stop() {
      this.speedX = 0;
      this.speedY = 0;
      return this;
    }

    sync() {
      if (this.expired) {
        return true;
      }

      if (++this._tick == this.expiration) {
        this.expire();
      }

      if (this._animation && this._animation.update()) {
        this.onAnimationLoop();
      }

      this.speedX += this.accelerationX;
      this.speedY += this.accelerationY;

      if (this.maxSpeedX && Math.abs(this.speedX) > this.maxSpeedX) {
        const SIGNAL = this.speedX / Math.abs(this.speedX);
        this.speedX = this.maxSpeedX * SIGNAL;
      }

      if (this.maxSpeedY && Math.abs(this.speedY) > this.maxSpeedY) {
        const SIGNAL = this.speedY / Math.abs(this.speedY);
        this.speedY = this.maxSpeedY * SIGNAL;
      }

      this._lastX = this.x;
      this._lastY = this.y;
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.boundary && !this.hasCollision(this.boundary)) {
        this.offBoundary();
      }

      return false;
    }

    update() {
      // no default behavior
    }
  }

  class Scene extends Sprite {
    constructor() {
      super(new Point(0, 0));
      this.height = Quick.height;
      this.width = Quick.width;
      this._sprites = [];
      this._spritesQueue = [];
    }

    init() {
      // no default behavior
    }

    add(sprite) {
      this._spritesQueue.push(sprite);
      sprite.scene = this;
      sprite.init();
      sprite.x -= sprite.speedX;
      sprite.y -= sprite.speedY;
      return this;
    }

    build(map, tileFactory = null, offsetX = 0, offsetY = 0) {
      tileFactory = tileFactory || function (id) {
        return new BaseTile(id);
      };

      for (let i = 0; i < map.length; ++i) {
        const LINE = map[i];

        for (let j = 0; j < LINE.length; ++j) {
          const ID = map[i][j];

          if (ID) {
            const TILE = tileFactory(ID);

            if (TILE) {
              const X = offsetX || TILE.width;
              const Y = offsetY || TILE.height;
              TILE.y = i * Y;
              TILE.x = j * X;
              this.add(TILE);
            }
          }
        }
      }

      return this;
    }

    sync() {
      Quick.paint(this, this.layerIndex);
      let sprites = [];
      const SOLID_SPRITES = [];

      for (let i = 0; i < this._sprites.length; ++i) {
        const SPRITE = this._sprites[i];
        SPRITE.update();

        if (SPRITE.sync()) {
          if (SPRITE.essential) {
            this.expire();
          }
        } else {
          if (SPRITE.solid) {
            SOLID_SPRITES.push(SPRITE);
          }

          sprites.push(SPRITE);
          Quick.paint(SPRITE, SPRITE.layerIndex);
        }
      }

      checkCollisions(SOLID_SPRITES);
      this._sprites = sprites.concat(this._spritesQueue);
      this._spritesQueue = [];
      return Sprite.prototype.sync.call(this);
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

    setTransition(transition) {
      this.transition = transition;
      return this;
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
      this.scene = {x: 0, y: 0};
      this.setColor(Color.Black);
      this.setHeight(Quick.height);
      this._increase = Quick.width / 32;
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

  class FontSprite extends Sprite {
    constructor(text = '') {
      super();
      this.text = text;
    }

    render(context) {
      Sprite.prototype.render.call(this, context) && this._parse(context);
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
            context.drawImage(IMAGE, this.x + this.scene.x + x, this.y + this.scene.y + y, IMAGE.width, IMAGE.height);
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
    constructor(text) {
      super();
      this.fontColor = Color.White;
      this.text = text;
      this._fontFamily = FontFamily.Monospace;
      this._fontSize = 16;
      this._updateFont();
    }

    render(context) {
      if (Sprite.prototype.render.call(this, context)) {
        context.fillStyle = this.fontColor;
        context.font = this._font;
        context.fillText(this.text, this.left + this.scene.x, this.bottom + this.scene.y, this.width);
      }
    }

    setFontColor(fontColor) {
      this.fontColor = fontColor;
      return this;
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
    Command,
    FontFamily,
    FontSprite,
    Frame,
    Point,
    Quick,
    Rect,
    Scene,
    Sprite,
    TextSprite,
  };

  if (typeof(window) == 'object') {
    window.quick = EXPORTS;
  } else if (typeof(module.exports) == 'object') {
    module.exports = EXPORTS;
  }
})();
