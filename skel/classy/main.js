(function () {

	"use strict";

	// imports
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;

	// functions
	function main() {
		Quick.setName("Skel");
		Quick.init(function () { return new GameScene() });
	}

	// class GameScene extends Scene
	var GameScene = (function () {

		function GameScene() {
			Scene.call(this);
			var background = new Background();
			this.add(background);
			var player = new Player();
			this.add(player);
		}; GameScene.prototype = Object.create(Scene.prototype);

		return GameScene;

	})();

	// class Background extends GameObject
	var Background = (function () {

		function Background() {
			GameObject.call(this);
			this.setColor("Black");
			this.setHeight(Quick.getHeight());
			this.setWidth(Quick.getWidth());
		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;

	})();

	// class Player extends GameObject
	var Player = (function () {

		var SPEED = 2;

		function Player() {
			GameObject.call(this);
			this.controller = Quick.getController();
			this.setColor("White");
			this.setSize(32);
		}; Player.prototype = Object.create(GameObject.prototype);

		Player.prototype.respond = function () {
			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				this.moveX(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				this.moveX(SPEED);
			}

			if (this.controller.keyDown(CommandEnum.UP) && this.getTop() > 0) {
				this.moveY(-SPEED);
			} else if (this.controller.keyDown(CommandEnum.DOWN) && this.getBottom() < Quick.getHeight()) {
				this.moveY(SPEED);
			}
		};

		// override
		Player.prototype.update = function () {
			this.respond();
		};

		return Player;

	})();

	main();

})();
