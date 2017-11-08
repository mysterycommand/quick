(function () {
	"use strict";

	// imports
	var CommandEnum = quick.CommandEnum;
	var Quick = quick.Quick;
	var GameObject = quick.GameObject;
	var Scene = quick.Scene;

	function main() {
		Quick.setName("Bricks");
		Quick.init(function () { return new GameScene() });
	}

	var Background = (function () {
		function Background() {
			GameObject.call(this);
			this.setColor("Blue");
			this.setWidth(Quick.getWidth());
			this.setHeight(Quick.getHeight());
		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;
	})();

	var Brick = (function () {
		function Brick() {
			GameObject.call(this);
			this.addTag("brick");
			var red = 128 + Quick.random(127);
			var green = 128 + Quick.random(127);
			var blue = 128 + Quick.random(127);
			this.collisionCount = 0;
			this.justCollidedWith = undefined;
			this.setImageId("brickSprite");
			this.setColor("rgb(" + red + "," + green + "," + blue + ")");
			this.setWidth(32 + Quick.random(32));
			this.setHeight(32 + Quick.random(32));
			this.setSolid();
			this.setBottom(-64);
			this.setLeft(Quick.random(Quick.getWidth() - this.getWidth()));
			this.setSpeedY(4);
		}; Brick.prototype = Object.create(GameObject.prototype);

		// override
		Brick.prototype.onCollision = function (gameObject) {
			if (this.getBottom() < 0) {
				this.expire();
				return;
			}

			if (gameObject.hasTag("player") || this.getSpeedY() == 0 || gameObject.getSpeedY() > 0) {
				return;
			}

			var collision = this.getCollision(gameObject);

			if (this.justCollidedWith == null) {
				Quick.play("crashSound");
			}

			if (++this.collisionCount > 1 || (this.justCollidedWith != null && this.justCollidedWith != gameObject)) {
				this.stop();
				this.done();

				if (collision.getLeft()) {
					this.moveX(1);
				} else if (collision.getRight()) {
					this.moveX(-1);
				}

				this.setBottom(this.justCollidedWith.getTop() - 1);
				Quick.play("hitSound");
			} else {
				if (collision.getLeft()) {
					this.moveX(1);
				} else if (collision.getRight()) {
					this.moveX(-1);
				} else {
					this.stop();
					this.done();
				}

				this.setBottom(gameObject.getTop() - 1);
			}

			this.justCollidedWith = gameObject;
		};

		// override
		Brick.prototype.update = function () {
			if (this.collisionCount == 0) {
				this.justCollidedWith = null;
			}

			this.collisionCount = 0;
		};

		Brick.prototype.done = function () {
			this.getScene().add(new Brick());
		};

		return Brick;
	})();

	var GameScene = (function () {
		function GameScene() {
			Scene.call(this);
			this.add(new Background());
			var ground = new Ground();
			ground.setCenterX(Quick.getWidth() / 2);
			this.add(ground);
			var player = new Player();
			player.setCenterX(ground.getCenterX());
			player.setBottom(ground.getTop() - 1);
			this.add(player);
			this.add(new Brick(this));
			Quick.playTheme("mainTheme");
		}; GameScene.prototype = Object.create(Scene.prototype);

		// override
		GameScene.prototype.getNext = function () {
			Quick.stopTheme();
			return new GameScene();
		};

		return GameScene;
	})();

	var Ground = (function () {
		function Ground() {
			GameObject.call(this);
			this.setColor("Green");
			this.setImageId("groundSprite");
			this.setSolid();
			this.setWidth(Quick.getWidth() * 2);
			this.setHeight(32);
			this.setBottom(Quick.getHeight() - 1);
		}; Ground.prototype = Object.create(GameObject.prototype);

		return Ground;
	})();

	var Player = (function () {
		var SPEED = 2;

		function Player() {
			GameObject.call(this);
			this.canJump = true;
			this.controller = Quick.getController();
			this.addTag("player");
			this.setAccelerationY(0.5);
			this.setColor("White");
			this.setEssential();
			this.setSize(16, 32);
			this.setSolid();
		}; Player.prototype = Object.create(GameObject.prototype);

		// override
		Player.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);

			if (collision.getBottom() && this.getSpeedY() > 0) {
				this.setSpeedY(0);
				this.setBottom(gameObject.getTop() - 1);
				this.canJump = true;
			} else if (collision.getTop()) {
				this.stop();
				this.setTop(gameObject.getBottom() + 1);

				if (gameObject.getSpeedY() > 0) {
					this.expire();
					Quick.play("deathSound");
				}
			} else if (collision.getLeft()) {
				this.setLeft(gameObject.getRight() + 1);
			} else if (collision.getRight()) {
				this.setRight(gameObject.getLeft() - 1);
			}
		};

		// override
		Player.prototype.update = function () {
			if (this.getTop() < 0) {
				this.expire();
				Quick.play("winSound");
			}

			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				this.moveX(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				this.moveX(SPEED);
			}

			if (this.canJump && this.controller.keyPush(CommandEnum.A)) {
				this.canJump = false;
				this.setSpeedY(-8);
				Quick.play("jumpSound");
			}
		};

		return Player;
	})();

	main();
})();
