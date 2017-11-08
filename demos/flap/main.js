(function () {
	"use strict";

	// imports
	var Animation = quick.Animation;
	var BaseTransition = quick.BaseTransition;
	var CommandEnum = quick.CommandEnum;
	var Quick = quick.Quick;
	var Frame = quick.Frame;
	var GameObject = quick.GameObject;
	var ImageFactory = quick.ImageFactory;
	var Rect = quick.Rect;
	var Scene = quick.Scene;

	// constants
	var CLOUD_IMAGE = document.getElementById("cloudSprite");
	var CLOUD_IMAGE_MIRROR = ImageFactory.mirror(CLOUD_IMAGE);

	// functions
	function main() {
		Quick.setName("Flap Demo");
		Quick.setNumberOfLayers(3);
		Quick.init(function () { return new GameScene() });
	}

	// classes
	var Background = (function () {
		function Background() {
			GameObject.call(this);
			this.setColor("Blue");
			this.setSize(Quick.getWidth(), Quick.getHeight());
		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;
	})();

	var Cloud = (function () {
		function Cloud() {
			GameObject.call(this);
			this.setImage(CLOUD_IMAGE);
			this.setBoundary(Quick.getBoundary());
		}; Cloud.prototype = Object.create(GameObject.prototype);

		// override
		Cloud.prototype.offBoundary = function () {
			this.setLeft(Quick.getRight());
		};

		return Cloud;
	})();

	var Column = (function () {
		function Column() {
			GameObject.call(this);
			this.addTag("column");
			this.setColor("DarkGray");
			this.setHeight(Quick.getHeight());
			this.setSolid();
		}; Column.prototype = Object.create(GameObject.prototype);

		return Column;
	})();

	var Fog = (function () {
		function Fog() {
			GameObject.call(this);
			this.setLayerIndex(2);
		}; Fog.prototype = Object.create(GameObject.prototype);

		// override
		Fog.prototype.update = function () {
			if (this.getLeft() > -1 * this.getSpeedX() || this.getRight() < Quick.getWidth() - this.getSpeedX()) {
				var speed = this.getSpeedX();
				this.moveX(Quick.getWidth() * -1 * speed / Math.abs(speed));
			}
		};

		return Fog;
	})();

	var GameScene = (function () {
		function GameScene() {
			Scene.call(this);
			this.add(new Background());
			var cloud1 = new Cloud();
			cloud1.setSpeedX(-0.5);
			this.add(cloud1);
			var cloud2 = new Cloud();
			cloud2.setSpeedX(-1);
			cloud2.setRight(Quick.getWidth());
			cloud2.setImage(CLOUD_IMAGE_MIRROR);
			this.add(cloud2);
			var fog1 = new Fog();
			fog1.setImageId("fogSprite0");
			fog1.setRight(Quick.getWidth());
			fog1.setSpeedX(1);
			this.add(fog1);
			var fog2 = new Fog();
			fog2.setImageId("fogSprite1");
			fog2.setSpeedX(-1);
			this.add(fog2);
			this.player = new Player();
			this.wall = new Wall();
			this.add(this.player);
			this.add(this.wall);
		}; GameScene.prototype = Object.create(Scene.prototype);

		// override
		GameScene.prototype.getNext = function () {
			return new GameScene();
		};

		// override
		GameScene.prototype.getTransition = function () {
			return new BaseTransition();
		};

		return GameScene;
	})();

	var Player = (function () {
		var ANIMATION = new Animation([
			new Frame(document.getElementById("birdSprite0"), 4),
			new Frame(document.getElementById("birdSprite1"), 4),
			new Frame(document.getElementById("birdSprite2"), 4)
		]);

		function Player() {
			GameObject.call(this);
			this.controller = Quick.getController();
			this.pointer = Quick.getPointer();
			this.setAnimation(ANIMATION);
			this.setEssential();
			this.setLayerIndex(1);
			this.setSolid();
			this.setSize(16);
			this.setCenterX(Quick.getWidth() / 3);
			this.setCenterY(Quick.getHeight() / 3);
			this.setSpeedY(-7);
		}; Player.prototype = Object.create(GameObject.prototype);

		Player.prototype.flap = function () {
			this.setImageId("birdSprite0");
			this.setAnimation(ANIMATION);
			this.setSpeedY(-7);
			Quick.play("flapSound");
		};

		// override
		Player.prototype.onCollision = function (gameObject) {
			if (gameObject.hasTag("column")) {
				Quick.play("fallSound");
				this.expire();
			}
		};

		// override
		Player.prototype.update = function () {
			// checks for falling off the bottom of the screen
			if (this.getTop() > Quick.getHeight()) {
				this.expire();
			} else if (this.getTop() < 0) {
				this.setTop(0);
			}

			// checks for A or click for flapping or just apply some gravity
			if (this.controller.keyPush(CommandEnum.A) || this.pointer.getPush()) {
				this.flap();
			} else if (this.getSpeedY() < 7) {
				this.setSpeedY(this.getSpeedY() + 1);
			}
		};

		return Player;
	})();

	var Wall = (function () {
		function Wall() {
			GameObject.call(this);
			// the wall is only valid within our screen limits
			this.setBoundary(new Rect(0, 0, Quick.getWidth(), Quick.getHeight()));
			this.setColor("Gray");
			this.setWidth(16);
			this.setHeight(56);
			this.setLeft(Quick.getRight());
			this.setTop(Quick.random(Quick.getHeight() - this.getHeight()));
			this.setSpeedX(-2);
		}; Wall.prototype = Object.create(GameObject.prototype);

		// override
		Wall.prototype.init = function () {
			this.top = new Column();
			this.top.setBottom(this.getTop() - 1);
			this.top.setSpeedX(this.getSpeedX());
			this.top.setWidth(this.getWidth());
			this.top.setLeft(this.getLeft());
			this.getScene().add(this.top);

			this.bottom = new Column();
			this.bottom.setTop(this.getBottom() + 1);
			this.bottom.setSpeedX(this.getSpeedX());
			this.bottom.setWidth(this.getWidth());
			this.bottom.setLeft(this.getLeft());
			this.getScene().add(this.bottom);
		};

		// override
		Wall.prototype.offBoundary = function () {
			this.expire();
			this.bottom.expire();
			this.top.expire();
			this.getScene().add(new Wall());
		};

		return Wall;
	})();

	main();
})();
