/**
 * Copyright (c) 2014, 2015 Diogo Schneider
 * 
 * Released under The MIT License (MIT)
 * 
 * https://github.com/dgsprb/quick
 */

(function () {

	"use strict";

	var CommandEnum = {
		"UP" : 0,
		"DOWN" : 1,
		"LEFT" : 2,
		"RIGHT" : 3,
		"A" : 4,
		"B" : 5,
		"X" : 6,
		"Y" : 7,
		"SELECT" : 8,
		"START" : 9
	};

	var Quick  = (function () {

		var DEFAULT_AUTO_SCALE = true;
		var DEFAULT_FRAME_TIME = 30;
		var DEFAULT_KEEP_ASPECT = false;
		var DEFAULT_NAME = "Game";
		var DEFAULT_NUMBER_OF_LAYERS = 1;
		var LOADING_TIMEOUT = 100;

		var FirstSceneClass;
		var autoScale = DEFAULT_AUTO_SCALE;
		var canvas;
		var everyOther = true;
		var frameTime;
		var keepAspect = DEFAULT_KEEP_ASPECT;
		var images;
		var input;
		var isRunning;
		var isTransitioning = false;
		var name = DEFAULT_NAME;
		var numberOfLayers = DEFAULT_NUMBER_OF_LAYERS;
		var realWidth = 0;
		var realHeight = 0;
		var renderableLists = [];
		var scene;
		var sceneFactory;
		var sound;
		var transition;
		var width = 0, height = 0;

		var Quick = {};

		Quick.init = function (firstSceneFactory, canvasElement) {
			sceneFactory = firstSceneFactory;
			canvas = canvasElement || document.getElementsByTagName("canvas")[0];
			width = canvas.width;
			height = canvas.height;
			realWidth = width;
			realHeight = height;
			images = document.getElementsByTagName("img");
			input = new Input();
			isRunning = true;
			sound = new Sound();
			addEventListener("resize", scale, false);
			scale();
			polyfill();
			this.setFrameTime();

			for (var i = 0; i < numberOfLayers; ++i) {
				renderableLists.push(new RenderableList());
			}

			load();
		};

		Quick.clearCanvas = function () {
			canvas.height = canvas.height;
		};

		Quick.fadeOut = function () {
			sound.fadeOut();
		};

		Quick.getCanvasBottom = function () {
			return height - 1;
		}

		Quick.getCanvasCenter = function () {
			return new Point(this.getCanvasCenterX(), this.getCanvasCenterY());
		};

		Quick.getCanvasCenterX = function () {
			return Math.floor(this.getCanvasWidth() / 2);
		};

		Quick.getCanvasCenterY = function () {
			return Math.floor(this.getCanvasHeight() / 2);
		};

		Quick.getCanvasHeight = function () {
			return height;
		};

		Quick.getCanvasOffsetLeft = function () {
			return canvas.offsetLeft;
		};

		Quick.getCanvasOffsetTop = function () {
			return canvas.offsetTop;
		};

		Quick.getCanvasRight = function () {
			return width - 1;
		};

		Quick.getCanvasWidth = function () {
			return width;
		};

		Quick.getController = function (id) {
			return input.getController(id);
		};

		Quick.getEveryOther = function () {
			return everyOther;
		};

		Quick.getFrameTime = function () {
			return frameTime;
		};

		Quick.getPointer = function (id) {
			return input.getPointer(id);
		};

		Quick.getRealHeight = function () {
			return realHeight;
		};

		Quick.getRealWidth = function () {
			return realWidth;
		};

		Quick.mute = function () {
			sound.mute();
		};

		Quick.paint = function (renderable, index) {
			var index = index || 0;
			var layer = renderableLists[index];
			layer.add(renderable);
		};

		Quick.play = function (id) {
			sound.play(id);
		};

		Quick.playTheme = function (name) {
			sound.playTheme(name);
		};

		Quick.random = function (ceil) {
			var random = Math.random();
			var raw = random * (ceil + 1);
			var result = Math.floor(raw);
			return result;
		};

		Quick.setAutoScale = function (customAutoScale) {
			autoScale = customAutoScale == undefined || customAutoScale;
		};

		Quick.setFrameTime = function (customFrameTime) {
			frameTime = customFrameTime || DEFAULT_FRAME_TIME;
		};

		Quick.setKeepAspect = function (customKeepAspect) {
			keepAspect = customKeepAspect || DEFAULT_KEEP_ASPECT;
		};

		Quick.setName = function (customName) {
			name = customName;
			document.title = name;
		};

		Quick.setNumberOfLayers = function (customNumberOfLayers) {
			numberOfLayers = customNumberOfLayers;
		};

		Quick.stopTheme = function () {
			sound.stopTheme();
		};

		// private
		function load() {
			for (var i = 0; i < images.length; ++i) {
				var image = images[i];

				if (!image.complete) {
					var timeout = setTimeout(onTimeout, LOADING_TIMEOUT);
					return;
				}
			}

			scene = sceneFactory();
			loop();

			function onTimeout() {
				load();
			}
		}

		function loop() {
			if (!isRunning) return;
			var startTime = Date.now();
			var graphics = canvas.getContext("2d");
			everyOther = !everyOther;
			input.update();

			if (transition != null) {
				if (transition.sync()) transition = null;
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

			for (var i = 0; i < renderableLists.length; ++i) {
				var layer = renderableLists[i];
				layer.render(graphics);
			}

			var elapsedTime = Date.now() - startTime;
			var interval = frameTime - elapsedTime;
			var timeout = setTimeout(onTimeout, interval);

			function onTimeout() {
				var frame = requestAnimationFrame(loop);
			}
		}

		function polyfill() {
			if (!window.requestAnimationFrame) window.requestAnimationFrame = requestAnimationFrameFacade;

			function requestAnimationFrameFacade(functionReference) {
				functionReference();
			}
		}

		function scale() {
			if (!autoScale) return;
			var width, height;

			if (keepAspect) {
				var proportion = window.innerWidth / canvas.width;
				if (window.innerHeight < canvas.height * proportion) proportion = window.innerHeight / canvas.height;
				width = canvas.width * proportion;
				height = canvas.height * proportion
			} else {
				width = window.innerWidth;
				height = window.innerHeight;
			}

			realWidth = width;
			realHeight = height;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
		}

		return Quick;

	})();

	var ImageFactory = (function () {

		var ImageFactory = {};

		ImageFactory.flip = function (image) {
			return invert(image, false, true);
		};

		ImageFactory.mirror = function (image) {
			return invert(image, true, false);
		};

		ImageFactory.rotate = function (image, degrees) {
			if (degrees % 360 == 0 ) return image;
			var radians = degrees * Math.PI / 180;
			var canvas = document.createElement("canvas");

			if (degrees == 90 || degrees == 270) {
				canvas.width = image.height;
				canvas.height = image.width;
			} else {
				canvas.width = image.width;
				canvas.height = image.height;
			}

			var context = canvas.getContext("2d");
			context.translate(canvas.width / 2, canvas.height / 2);
			context.rotate(radians);
			context.drawImage(image, -image.width / 2, -image.height / 2);
			return canvas;
		}

		// private
		function invert(image, isMirror, isFlip) {
			var canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			var context = canvas.getContext("2d");
			context.translate(isMirror ? canvas.width : 0, isFlip ? canvas.height : 0);
			context.scale(isMirror ? -1 : 1, isFlip ? - 1 : 1);
			context.drawImage(image, 0, 0);
			return canvas;
		}

		return ImageFactory;

	})();

	var Mouse = (function () {

		function Mouse(event) {
			var that = this;
			this.buffer = false;
			this.position = new Point();
			addEventListener("mousedown", onMouseDown, false);
			addEventListener("mouseup", onMouseUp, false);
			addEventListener("mousemove", onMouseMove, false);
			onMouseDown(event);

			function onMouseDown(event) {
				event.preventDefault();
				that.buffer = true;
				// that.updateCoordinates(event);
			}

			function onMouseUp(event) {
				event.preventDefault();
				that.buffer = false;
				// that.updateCoordinates(event);
			}

			function onMouseMove(event) {
				event.preventDefault();
				that.updateCoordinates(event);
			}
		}

		Mouse.prototype.getCommand = function () {
			return this.buffer;
		};

		Mouse.prototype.getX = function () {
			return this.position.getX();
		};

		Mouse.prototype.getY = function () {
			return this.position.getY();
		};

		Mouse.prototype.updateCoordinates = function (event) {
			this.position.setX(event.x);
			this.position.setY(event.y);
		};

		return Mouse;

	})();

	var Touch = (function () {

		function Touch(event) {
			var that = this;
			this.buffer = false;
			this.position = new Point();
			addEventListener("touchstart", onTouchStart, false);
			addEventListener("touchend", onTouchEnd, false);
			addEventListener("touchmove", onTouchMove, false);
			onTouchStart(event);

			function onTouchStart(event) {
				event.preventDefault();
				that.buffer = true;
				that.updateCoordinates(event);
			}

			function onTouchEnd(event) {
				event.preventDefault();
				this.buffer = false;
				that.updateCoordinates(event);
			}

			function onTouchMove(event) {
				event.preventDefault();
				that.updateCoordinates(event);
			}
		}

		Touch.prototype.getCommand = function () {
			return this.buffer;
		};

		Touch.prototype.getX = function () {
			return this.position.getX();
		};

		Touch.prototype.getY = function () {
			return this.position.getY();
		};

		Touch.prototype.updateCoordinates = function (event) {
			var touches = event.changedTouches;
			var touch = touches[0];
			this.x = touch.pageX;
			this.y = touch.pageY;
		};

		return Touch;

	})();

	var Pointer = (function () {

		function Pointer() {
			this.active = false;
			this.device = null;
			this.hold = false;
			this.position = new Point();
		}

		Pointer.prototype.getDown = function () {
			return this.active;
		};

		Pointer.prototype.getPush = function () {
			return this.active && !this.hold;
		};

		Pointer.prototype.setDevice = function (device) {
			this.device = device;
		};

		Pointer.prototype.update = function () {
			if (!this.device) return;
			this.hold = false;
			var last = this.active;
			this.active = this.device.getCommand();
			if (this.active && last) this.hold = true;
			var x = Math.floor((this.device.getX() - Quick.getCanvasOffsetLeft()) * Quick.getCanvasWidth() / Quick.getRealWidth());
			var y = Math.floor((this.device.getY() - Quick.getCanvasOffsetTop()) * Quick.getCanvasHeight() / Quick.getRealHeight());
			this.position.setX(x);
			this.position.setY(y);
		};

		Pointer.prototype.getPosition = function () {
			return this.position;
		};

		return Pointer;

	})();

	var Controller = (function () {

		function Controller() {
			this.active = {};
			this.device = null;
			this.hold = {};
		}

		Controller.prototype.keyDown = function (commandEnum) {
			return this.active[commandEnum];
		};

		Controller.prototype.keyPush = function (commandEnum) {
			return this.active[commandEnum] && !this.hold[commandEnum];
		};

		Controller.prototype.setDevice = function (device) {
			this.device = device;
		};

		Controller.prototype.update = function () {
			if (!this.device) return;
			this.hold = {};
			var last = this.active;
			this.active = this.device.getCommands();

			for (var i in this.active) {
				if (last[i]) this.hold[i] = true;
			}
		};

		return Controller;

	})();

	var Gamepad = (function () {

		var ANALOG_TRESHOLD = 0.5;

		var AxisEnum = {
			"LEFT_X" : 0,
			"LEFT_Y" : 1,
			"RIGHT_X" : 2,
			"RIGHT_Y" : 3
		};

		var ButtonEnum = {
			"A" : 0,
			"B" : 1,
			"X" : 2,
			"Y" : 3,
			"L1" : 4,
			"R1" : 5,
			"L2" : 6,
			"R2" : 7,
			"SELECT" : 8,
			"START" : 9,
			"L3" : 10,
			"R3" : 11,
			"UP" : 12,
			"DOWN" : 13,
			"LEFT" : 14,
			"RIGHT" : 15
		};

		var ButtonToCommandMap = {};
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

		function Gamepad(id) {
			this.id = id || 0;
		}

		Gamepad.prototype.getCommands = function () {
			var result = {};

			if (Input.getGamepadAxes(this.id)[AxisEnum.LEFT_Y] < - ANALOG_TRESHOLD) {
				result[CommandEnum.UP] = true;
			} else if (Input.getGamepadAxes(this.id)[AxisEnum.LEFT_Y] > ANALOG_TRESHOLD) {
				result[CommandEnum.DOWN] = true;
			}

			if (Input.getGamepadAxes(this.id)[AxisEnum.LEFT_X] < - ANALOG_TRESHOLD) {
				result[CommandEnum.LEFT] = true;
			} else if (Input.getGamepadAxes(this.id)[AxisEnum.LEFT_X] > ANALOG_TRESHOLD) {
				result[CommandEnum.RIGHT] = true;
			}

			for (var i in ButtonToCommandMap) {
				if (Input.getGamepadButtons(this.id, i)) result[ButtonToCommandMap[i]] = true;
			}

			return result;
		};

		return Gamepad;

	})();

	var Input = (function () {

		function Input() {
			this.controllers = [];
			this.controllerQueue = [];
			this.controllerRequestQueue = [];
			this.pointers = [];
			this.pointerQueue = [];
			this.pointerRequestQueue = [];
			this.gamepads = 0;
			this.waitKeyboard();
			this.waitMouse();
			this.waitTouch();
		}

		Input.getGamepadAxes = function (id) {
			if (getGamepads()[id]) return getGamepads()[id].axes;
			return [];
		};

		Input.getGamepadButtons = function (id, buttonEnum) {
			if (getGamepads()[id]) return getGamepads()[id].buttons[buttonEnum].pressed;
			return false;
		};

		Input.prototype.addController = function (device) {
			this.controllerQueue.push(device);
			this.checkControllerQueues();
		};

		Input.prototype.addPointer = function (device) {
			this.pointerQueue.push(device);
			this.checkPointerQueues();
		};

		Input.prototype.checkGamepads = function () {
			if (getGamepads()[this.gamepads]) this.addController(new Gamepad(this.gamepads++));
		};

		Input.prototype.checkControllerQueues = function () {
			if (this.controllerRequestQueue.length > 0 && this.controllerQueue.length > 0) {
				var requester = this.controllerRequestQueue.shift();
				var device = this.controllerQueue.shift();
				requester.setDevice(device);
			}
		};

		Input.prototype.checkPointerQueues = function () {
			if (this.pointerRequestQueue.length > 0 && this.pointerQueue.length > 0) {
				var requester = this.pointerRequestQueue.shift();
				var device = this.pointerQueue.shift();
				requester.setDevice(device);
			}
		};

		Input.prototype.getController = function (id) {
			var id = id || 0;

			if (this.controllers.length < id + 1) {
				var controller = new Controller();
				this.controllers.push(controller);
				this.controllerRequestQueue.push(controller);
				this.checkControllerQueues();
			}

			return this.controllers[id];
		};

		Input.prototype.getPointer = function (id) {
			var id = id || 0;

			if (this.pointers.length < id + 1) {
				var pointer = new Pointer();
				this.pointers.push(pointer);
				this.pointerRequestQueue.push(pointer);
				this.checkPointerQueues();
			}

			return this.pointers[id];
		};

		Input.prototype.update = function () {
			this.checkGamepads();

			for (var i in this.controllers) {
				var controller = this.controllers[i];
				controller.update();
			}

			for (var i in this.pointers) {
				var pointer = this.pointers[i];
				pointer.update();
			}
		};

		Input.prototype.waitKeyboard = function () {
			var EVENT = "keydown";
			var that = this;
			addEventListener(EVENT, onKeyDown, false);

			function onKeyDown(event) {
				removeEventListener(EVENT, onKeyDown, false);
				that.addController(new Keyboard(event));
			}
		};

		Input.prototype.waitMouse = function () {
			var EVENT = "mousedown";
			var that = this;
			addEventListener(EVENT, onMouseDown, false);

			function onMouseDown(event) {
				removeEventListener(EVENT, onMouseDown, false);
				that.addPointer(new Mouse(event));
			}
		};

		Input.prototype.waitTouch = function () {
			var EVENT = "touchstart";
			var that = this;
			addEventListener(EVENT, onTouchStart, false);

			function onTouchStart(event) {
				removeEventListener(EVENT, onTouchStart, false);
				that.addPointer(new Touch(event));
			}
		};

		// private

		function getGamepads() {
			if (navigator.getGamepads) return navigator.getGamepads();
			return [];
		}

		return Input;

	})();

	var Keyboard = (function () {

		var KeyEnum = {
			"ENTER" : 13,
			"SHIFT" : 16,
			"CTRL" : 17,
			"ALT" : 18,
			"SPACE" : 32,
			"LEFT" : 37,
			"UP" : 38,
			"RIGHT" : 39,
			"DOWN" : 40,
			"D" : 68,
			"E" : 69,
			"F" : 70,
			"I" : 73,
			"J" : 74,
			"K" : 75,
			"L" : 76,
			"S" : 83,
			"ESC" : 127
		};

		var KeyToCommandMap = {};
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

		function Keyboard(event) {
			var that = this;
			this.buffer = {};
			addEventListener("keydown", onKeyDown, false);
			addEventListener("keyup", onKeyUp, false);
			onKeyDown(event);

			function onKeyDown(event) {
				event.preventDefault();
				onKey(event.keyCode, true);
			}

			function onKeyUp(event) {
				onKey(event.keyCode, false);
			}

			function onKey(keyCode, isDown) {
				that.buffer[KeyToCommandMap[keyCode]] = isDown;
			}
		}

		Keyboard.prototype.getCommands = function () {
			var result = {};

			for (var i in this.buffer) {
				if (this.buffer[i]) result[i] = true;
			}

			return result;
		};

		return Keyboard;

	})();

	var RenderableList = (function () {

		function RenderableList() {
			this.elements = [];
		}

		RenderableList.prototype.add = function (renderable) {
			this.elements.push(renderable);
		};

		RenderableList.prototype.render = function (graphics) {
			for (var i = 0; i < this.elements.length; ++i) {
				var renderable = this.elements[i];
				renderable.render(graphics);
			}

			this.elements.length = 0;
		}

		return RenderableList;

	})();

	var Scene = (function () {

		function Scene() {
			this.delegate = null;
			this.gameObjects = [];
			this.nextObjects = [];
			this.expiration = -1;
			this.isExpired = false;
			this.tick = -1;
			this.transition = null;
		}

		Scene.prototype.add = function (gameObject) {
			gameObject.setScene(this);
			this.nextObjects.push(gameObject);
			gameObject.move(gameObject.getSpeedX() * -1, gameObject.getSpeedY() * -1);
		};

		Scene.prototype.build = function (map, tileFactory) {
			tileFactory = tileFactory || function (id) { return new BaseTile(id) };

			for (var i = 0; i < map.length; ++i) {
				var line = map[i];

				for (var j = 0; j < line.length; ++j) {
					var id = map[i][j];

					if (id) {
						var tile = tileFactory(id);
						tile.setTop(i * tile.getHeight());
						tile.setLeft(j * tile.getWidth());
						this.add(tile);
					}
				}
			}

		};

		Scene.prototype.expire = function () {
			this.isExpired = true;
		};

		Scene.prototype.sync = function () {
			if (this.isExpired) return true;
			var gameObjects = [];
			var solidGameObjects = [];

			for (var i = 0; i < this.gameObjects.length; ++i) {
				var gameObject = this.gameObjects[i];
				gameObject.update();

				if (gameObject.sync()) {
					if (gameObject.getEssential()) this.expire();
				} else {
					if (gameObject.getSolid()) solidGameObjects.push(gameObject);
					gameObjects.push(gameObject);
					Quick.paint(gameObject, gameObject.getLayerIndex());
				}
			}

			checkCollisions(solidGameObjects);
			this.gameObjects = gameObjects.concat(this.nextObjects);
			this.nextObjects = [];
			if (++this.tick == this.expiration) this.expire();
			return false;
		}

		Scene.prototype.getNext = function () {
			return null;
		};

		Scene.prototype.getObjectsWithTag = function (tag) {
			var result = [];

			for (var i = 0; i < this.gameObjects.length; ++i) {
				var gameObject = this.gameObjects[i];
				if (gameObject.hasTag(tag)) result.push(gameObject);
			}

			return result;
		};

		Scene.prototype.getTick = function () {
			return this.tick;
		};

		Scene.prototype.getTransition = function () {
			return this.transition;
		};

		Scene.prototype.setDelegate = function (delegate) {
			this.delegate = delegate;
		};

		Scene.prototype.setExpiration = function (expiration) {
			this.expiration = expiration;
		};

		Scene.prototype.setTransition = function (transition) {
			this.transition = transition;
		};

		Scene.prototype.update = function () {
			this.delegate && this.delegate.update && this.delegate.update();
		};

		// private
		function checkCollisions(gameObjects) {
			var length = gameObjects.length;

			for (var i = 0; i < length - 1; ++i) {
				var leftGameObject = gameObjects[i];

				for (var j = i + 1; j < length; ++j) {
					var rightGameObject = gameObjects[j];

					if (leftGameObject.hasCollision(rightGameObject)) {
						leftGameObject.onCollision(rightGameObject);
						rightGameObject.onCollision(leftGameObject);
					}
				}
			}
		}

		return Scene;

	})();

	var Sound = (function () {

		var DEFAULT_MUTE = false;
		var DEFAULT_SOUND_EFFECTS_VOLUME = 0.3;

		function Sound() {
			this.isFading = false;
			this.isMute = DEFAULT_MUTE;
			this.nextThemeName = null;
			this.queue = {};
			this.theme = null;
			this.volume = 100;
		}

		Sound.prototype.fadeOut = function () {
			if (!this.theme) return;
			this.isFading = true;
			this.volume = 100;
		};

		Sound.prototype.mute = function () {
			this.isMute = !this.isMute;

			if (!this.isMute) {
				this.theme.play();
			} else {
				this.theme.pause();
			}
		};

		Sound.prototype.pause = function () {
			if (this.theme) this.theme.pause();
		};

		Sound.prototype.play = function (id) {
			if (this.isMute) return;
			this.queue[id] = true;
		};

		Sound.prototype.playTheme = function (id) {
			if (this.theme && this.theme.currentTime > 0) {
				this.nextThemeName = id;
				if (!this.isFading) this.fadeOut();
				return;
			}

			this.stopTheme();
			this.theme = document.getElementById(id);
			if (this.theme.currentTime > 0) this.theme.currentTime = 0;
			if (this.isMute) return;
			this.theme.volume = 1;
			this.theme.play();
		};

		Sound.prototype.resume = function () {
			if (this.isMute) return;
			if (this.theme.paused) this.theme.play();
		};

		Sound.prototype.stopTheme = function () {
			if (this.theme) {
				this.theme.pause();
				this.theme.currentTime = 0;
			}
		};

		Sound.prototype.update = function () {
			for (var i in this.queue) {
				var sound = document.getElementById(i);
				sound.pause();
				if (sound.currentTime > 0) sound.currentTime = 0;
				sound.volume = DEFAULT_SOUND_EFFECTS_VOLUME;
				sound.play();
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
		};

		return Sound;

	})();

	var Point = (function () {

		function Point(x, y) {
			this.setAccelerationX();
			this.setAccelerationY();
			this.setSpeedX();
			this.setSpeedY();
			this.setX(x || 0);
			this.setY(y || 0);
		}

		Point.prototype.bounceX = function () {
			this.setSpeedX(this.getSpeedX() * -1);
			this.moveX(this.getSpeedX());
		};

		Point.prototype.bounceY = function () {
			this.setSpeedY(this.getSpeedY() * -1);
			this.moveY(this.getSpeedY());
		};

		Point.prototype.getAccelerationX = function () {
			return this.accelerationX;
		};

		Point.prototype.getAccelerationY = function () {
			return this.accelerationY;
		};

		Point.prototype.getCenter = function () {
			return this;
		};

		Point.prototype.getCenterX = function () {
			return this.x;
		};

		Point.prototype.getCenterY = function () {
			return this.y;
		};

		Point.prototype.getSpeedX = function () {
			return this.speedX;
		};

		Point.prototype.getSpeedY = function () {
			return this.speedY;
		};

		Point.prototype.getX = function () {
			return this.x;
		};

		Point.prototype.getY = function () {
			return this.y;
		};

		Point.prototype.move = function (width, height) {
			this.moveX(width);
			this.moveY(height);
		};

		Point.prototype.moveX = function (width) {
			this.setX(this.getX() + width);
		};

		Point.prototype.moveY = function (height) {
			this.setY(this.getY() + height);
		};

		Point.prototype.setAccelerationX = function (accelerationX) {
			this.accelerationX = accelerationX || 0;
		};

		Point.prototype.setAccelerationY = function (accelerationY) {
			this.accelerationY = accelerationY || 0;
		};

		Point.prototype.setPosition = function (x, y) {
			this.setX(x);
			this.setY(y);
		};

		Point.prototype.setSpeedToPoint = function (speed, point) {
			var squareDistance = Math.abs(this.getCenterX() - point.getX()) + Math.abs(this.getCenterY() - point.getY());
			this.setSpeedX((point.getX() - this.getCenterX()) * speed / squareDistance);
			this.setSpeedY((point.getY() - this.getCenterY()) * speed / squareDistance);
		};

		Point.prototype.setSpeedX = function (speedX) {
			this.speedX = speedX || 0;
		};

		Point.prototype.setSpeedY = function (speedY) {
			this.speedY = speedY || 0;
		};

		Point.prototype.setX = function (x) {
			this.x = x;
		};

		Point.prototype.setY = function (y) {
			this.y = y;
		};

		Point.prototype.stop = function () {
			this.setSpeedX(0);
			this.setSpeedY(0);
		};

		Point.prototype.sync = function () {
			this.setSpeedX(this.getSpeedX() + this.accelerationX);
			this.setSpeedY(this.getSpeedY() + this.accelerationY);
			this.move(this.getSpeedX(), this.getSpeedY());
			return false;
		};

		return Point;

	})();

	var Rect = (function () {

		function Rect(x, y, width, height) {
			Point.call(this, x, y);
			this.setHeight(height || 0);
			this.setWidth(width || 0);
		}; Rect.prototype = Object.create(Point.prototype);

		Rect.prototype.bounceFrom = function (collision) {
			if ((this.getSpeedX() < 0 && collision.getLeft()) || (this.getSpeedX() > 0 && collision.getRight())) this.bounceX();
			if ((this.getSpeedY() < 0 && collision.getTop()) || (this.getSpeedY() > 0 && collision.getBottom())) this.bounceY();
		};

		Rect.prototype.getBottom = function () {
			return this.getY() + this.getHeight() - 1;
		};

		// override
		Rect.prototype.getCenter = function () {
			return new Point(this.getCenterX(), this.getCenterY());
		};

		// override
		Rect.prototype.getCenterX = function () {
			return this.getX() + this.getHalfWidth();
		};

		// override
		Rect.prototype.getCenterY = function () {
			return this.getY() + this.getHalfHeight();
		};

		Rect.prototype.getCollision = function (rect) {
			var collision = new Collision();

			var ta = this.getTop();
			var ra = this.getRight();
			var ba = this.getBottom();
			var la = this.getLeft();
			var xa = this.getCenterX();
			var ya = this.getCenterY();

			var tb = rect.getTop();
			var rb = rect.getRight();
			var bb = rect.getBottom();
			var lb = rect.getLeft();

			if (xa <= lb && ra < rb) {
				collision.setRight();
			} else if (xa >= rb && la > lb) {
				collision.setLeft();
			}

			if (ya <= tb && ba < bb) {
				collision.setBottom();
			} else if (ya >= bb && ta > tb) {
				collision.setTop();
			}

			return collision;
		};

		Rect.prototype.getHalfHeight = function () {
			return Math.floor(this.getHeight() / 2);
		};

		Rect.prototype.getHalfWidth = function () {
			return Math.floor(this.getWidth() / 2);
		};

		Rect.prototype.getHeight = function () {
			return this.height;
		};

		Rect.prototype.getLeft = function () {
			return this.getX();
		};

		Rect.prototype.getRight = function () {
			return this.getX() + this.getWidth() - 1;
		};

		Rect.prototype.getTop = function () {
			return this.getY();
		};

		Rect.prototype.getWidth = function () {
			return this.width;
		};

		Rect.prototype.hasCollision = function (rect) {
			return !(
				this.getLeft() > rect.getRight() ||
				this.getRight() < rect.getLeft() ||
				this.getTop() > rect.getBottom() ||
				this.getBottom() < rect.getTop()
			);
		};

		Rect.prototype.increase = function (width, height) {
			this.increaseWidth(width);
			this.increaseHeight(height);
		};

		Rect.prototype.increaseHeight = function (height) {
			this.setHeight(this.getHeight() + height);
		};

		Rect.prototype.increaseWidth = function (width) {
			this.setWidth(this.getWidth() + width);
		};

		Rect.prototype.setBottom = function (y) {
			this.setY(y - this.getHeight() + 1);
		};

		Rect.prototype.setCenter = function (point) {
			this.setCenterX(point.getX());
			this.setCenterY(point.getY());
		};

		Rect.prototype.setCenterX = function (x) {
			this.setX(x - this.getHalfWidth());
		};

		Rect.prototype.setCenterY = function (y) {
			this.setY(y - this.getHalfHeight());
		};

		Rect.prototype.setHeight = function (height) {
			this.height = height;
		};

		Rect.prototype.setLeft = function (x) {
			this.setX(x);
		};

		Rect.prototype.setRight = function (x) {
			this.setX(x - this.getWidth() + 1);
		};

		Rect.prototype.setSize = function (width, height) {
			this.setWidth(width);

			if (arguments.length > 1) {
				this.setHeight(height);
			} else {
				this.setHeight(width);
			}
		};

		Rect.prototype.setTop = function (y) {
			this.setY(y);
		};

		Rect.prototype.setWidth = function (width) {
			this.width = width;
		};

		return Rect;

	})();

	var Collision = (function () {

		function Collision() {
			this.isBottom = false;
			this.isLeft = false;
			this.isRight = false;
			this.isTop = false;
		}

		Collision.prototype.getBottom = function () {
			return this.isBottom;
		};

		Collision.prototype.getLeft = function () {
			return this.isLeft;
		};

		Collision.prototype.getRight = function () {
			return this.isRight;
		};

		Collision.prototype.getTop = function () {
			return this.isTop;
		};

		Collision.prototype.setBottom = function (isBottom) {
			this.isBottom = isBottom || true;
		};

		Collision.prototype.setLeft = function (isLeft) {
			this.isLeft = isLeft || true;
		};

		Collision.prototype.setRight = function (isRight) {
			this.isRight = isRight || true;
		};

		Collision.prototype.setTop = function (isTop) {
			this.isTop = isTop || true;
		};

		return Collision;

	})();

	var Frame = (function () {

		function Frame(image, duration) {
			this.duration = duration || 0;
			this.image = image || new Image();
		}

		Frame.prototype.getDuration = function () {
			return this.duration;
		};

		Frame.prototype.getHeight = function () {
			return this.image.height;
		};

		Frame.prototype.getImage = function () {
			return this.image;
		};

		Frame.prototype.getWidth = function () {
			return this.image.width;
		};

		return Frame;

	})();

	var Animation = (function () {

		function Animation(frames) {
			this.setFrames(frames);
		}

		Animation.prototype.getHeight = function () {
			return this.frame.getHeight();
		};

		Animation.prototype.getImage = function () {
			return this.frame.getImage();
		};

		Animation.prototype.getWidth = function () {
			return this.frame.getWidth();
		};

		Animation.prototype.setFrameIndex = function (frameIndex) {
			if (frameIndex < this.frames.length && frameIndex > -1) {
				this.frameIndex = frameIndex;
				this.tick = 0;
				this.frame = this.frames[frameIndex];
				return true;
			}

			return false;
		};

		Animation.prototype.setFrames = function (frames) {
			this.frames = frames || [new Frame()];
			this.setFrameIndex(0);
		};

		Animation.prototype.update = function () {
			var hasLooped = false;

			if (this.frame.getDuration() && ++this.tick > this.frame.getDuration()) {
				var index = this.frameIndex + 1;

				if (index == this.frames.length) {
					hasLooped = true;
					index = 0;
				}

				this.setFrameIndex(index);
			}

			return hasLooped;
		};

		return Animation;

	})();

	var Sprite = (function () {

		function Sprite() {
			Rect.call(this);
			this.animation = null;
			this.delegate = null;
		}; Sprite.prototype = Object.create(Rect.prototype);

		Sprite.prototype.getImage = function () {
			return this.animation.getImage();
		};

		Sprite.prototype.onAnimationLoop = function () {
			this.delegate && this.delegate.onAnimationLoop && this.delegate.onAnimationLoop();
		};

		Sprite.prototype.render = function (graphics) {
			if (this.animation) {
				var image = this.getImage();
				var x = Math.floor(this.getX());
				var y = Math.floor(this.getY());
				graphics.drawImage(image, x, y, this.getWidth(), this.getHeight());
			}
		};

		Sprite.prototype.setAnimation = function (animation) {
			if (this.animation == animation) return;
			this.animation = animation;
			this.animation.setFrameIndex(0);
			this.setHeight(this.animation.getHeight());
			this.setWidth(this.animation.getWidth());
		};

		Sprite.prototype.setDelegate = function (delegate) {
			this.delegate = delegate;
		};

		Sprite.prototype.setImage = function (image) {
			this.setAnimation(new Animation([new Frame(image)]));
		};

		Sprite.prototype.setImageId = function (id) {
			this.setImage(document.getElementById(id));
		};

		// override
		Sprite.prototype.sync = function () {
			if (this.animation && this.animation.update()) this.onAnimationLoop();
			return Rect.prototype.sync.call(this);
		};

		return Sprite;

	})();

	var BoundSprite = (function () {

		function BoundSprite(animations) {
			Sprite.call(this, animations);
			this.boundary = null;
		}; BoundSprite.prototype = Object.create(Sprite.prototype);

		BoundSprite.prototype.setBoundary = function (rect) {
			this.boundary = rect;
		};

		BoundSprite.prototype.offBoundary = function () {
			this.delegate && this.delegate.offBoundary && this.delegate.offBoundary();
		};

		// override
		BoundSprite.prototype.sync = function () {
			var result = Sprite.prototype.sync.call(this); 
			if (this.boundary && !this.hasCollision(this.boundary)) this.offBoundary();
			return result;
		};

		return BoundSprite;

	})();

	var GameObject = (function () {

		function GameObject() {
			BoundSprite.call(this);
			this.color = null;
			this.layerIndex = 0;
			this.isEssential = false;
			this.isExpired = false;
			this.isSolid = false;
			this.isVisible = true;
			this.scene = null;
			this.tags = {};
			this.tick = 0;
		}; GameObject.prototype = Object.create(BoundSprite.prototype);

		GameObject.prototype.addTag = function (tag) {
			this.tags[tag] = true;
		};

		GameObject.prototype.expire = function () {
			this.isExpired = true;
		};

		GameObject.prototype.getColor = function () {
			return this.color;
		};

		GameObject.prototype.getExpired = function () {
			return this.isExpired;
		};

		GameObject.prototype.getLayerIndex = function () {
			return this.layerIndex;
		};

		GameObject.prototype.getScene = function () {
			return this.scene;
		};

		GameObject.prototype.getTick = function () {
			return this.tick;
		};

		GameObject.prototype.hasTag = function (tag) {
			return this.tags[tag]
		};

		GameObject.prototype.getEssential = function () {
			return this.isEssential;
		};

		GameObject.prototype.getSolid = function () {
			return this.isSolid;
		};

		GameObject.prototype.onCollision = function (gameObject) {
			this.delegate && this.delegate.onCollision && this.delegate.onCollision(gameObject);
		};

		GameObject.prototype.setColor = function (color) {
			this.color = color;
		};

		GameObject.prototype.setEssential = function (isEssential) {
			this.isEssential = isEssential == undefined || isEssential;
		};

		GameObject.prototype.setLayerIndex = function (layerIndex) {
			this.layerIndex = layerIndex || 0;
		};

		GameObject.prototype.setScene = function (scene) {
			this.scene = scene;
		};

		GameObject.prototype.setSolid = function (isSolid) {
			this.isSolid = isSolid == undefined || isSolid;
		};

		GameObject.prototype.setVisible = function (isVisible) {
			this.isVisible = isVisible == undefined || isVisible;
		};

		// override
		GameObject.prototype.render = function (graphics) {
			if (!this.isVisible) return;

			if (this.color) {
				var x = Math.floor(this.getX());
				var y = Math.floor(this.getY());
				graphics.fillStyle = this.color;
				graphics.fillRect(x, y, this.getWidth(), this.getHeight());
			}

			BoundSprite.prototype.render.call(this, graphics);
		};

		// override
		GameObject.prototype.sync = function () {
			if (this.getExpired()) return true;
			++this.tick;
			return BoundSprite.prototype.sync.call(this);
		};

		GameObject.prototype.update = function () {
			this.delegate && this.delegate.update && this.delegate.update();
		};

		return GameObject;

	})();

	var Text = (function () {

		var SPACE = 4;
		var SPACING = 0;

		function Text(string) {
			GameObject.call(this);
			this.setString(string || "");
		}; Text.prototype = Object.create(GameObject.prototype);

		Text.prototype.parse = function (graphics) {
			var height = 0;
			var width = 0;
			var x = 0;
			var y = 0;

			for (var i = 0; i < this.string.length; ++i) {
				var character = this.string[i];

				if (character == " ") {
					x += SPACE + SPACING;
				} else if (character == "\n") {
					x = 0;
					y += height + SPACING;
				} else {
					var image = document.getElementById(character + "Font");
					if (graphics) graphics.drawImage(image, this.getX() + x, this.getY() + y, image.width, image.height);
					x += image.width + SPACING;
					if (x > width) width = x;
					if (image.height > height) height = image.height;
				}
			}

			this.setWidth(width);
			this.setHeight(y + height);
		};

		// override
		Text.prototype.render = function (graphics) {
			this.parse(graphics);
		};

		Text.prototype.setString = function (string) {
			this.string = string;
			this.parse();
		};

		return Text;

	})();

	var BaseTile = (function () {

		function BaseTile(id) {
			GameObject.call(this);
			this.setImageId(id);
		}; BaseTile.prototype = Object.create(GameObject.prototype);

		return BaseTile;

	})();

	var BaseTransition = (function () {

		var FRAMES = 32;

		function BaseTransition() {
			GameObject.call(this);
			this.setColor("Black");
			this.setHeight(Quick.getCanvasHeight());
			this.increase = Quick.getCanvasWidth() / FRAMES;
		}; BaseTransition.prototype = Object.create(GameObject.prototype);

		// override
		BaseTransition.prototype.sync = function () {
			if (this.getWidth() > Quick.getCanvasWidth()) return true;
			this.increaseWidth(this.increase);
			Quick.paint(this);
			return GameObject.prototype.sync.call(this);
		};

		return BaseTransition;

	})();

	// exports
	if (!window.com) window.com = {};
	if (!window.com.dgsprb) window.com.dgsprb = {};

	window.com.dgsprb.quick = {
		"Animation" : Animation,
		"BaseTile" : BaseTile,
		"BaseTransition" : BaseTransition,
		"CommandEnum" : CommandEnum,
		"Controller" : Controller,
		"Frame" : Frame,
		"GameObject" : GameObject,
		"ImageFactory" : ImageFactory,
		"Point" : Point,
		"Quick" : Quick,
		"Rect" : Rect,
		"Scene" : Scene,
		"Text" : Text
	};

})();
