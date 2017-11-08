(function () {
	"use strict";

	// imports
	var CommandEnum = quick.CommandEnum;
	var Quick = quick.Quick;
	var GameObject = quick.GameObject;
	var Rect = quick.Rect;
	var Scene = quick.Scene;

	// static
	function main() {
		Quick.setAutoScale(true);
		Quick.setName("Paddle Demo");
		Quick.init(function () { return new FirstScene() });
	}

	var Background = (function () {
		function Background() {
			GameObject.call(this);
			this.setColor("Green");
			this.setWidth(Quick.getWidth());
			this.setHeight(Quick.getHeight());
		}; Background.prototype = Object.create(GameObject.prototype);

		return Background;
	})();

	var Ball = (function () {
		function Ball() {
			GameObject.call(this);
			this.setImageId("ballSprite");
			this.setBoundary(new Rect(0, 0, Quick.getWidth(), Quick.getHeight()));
			this.setEssential();
			this.setSolid();
			this.setSpeedX(1 + Quick.random(3));
			this.setSpeedY(1 + Quick.random(3));
		}; Ball.prototype = Object.create(GameObject.prototype);

		// override
		Ball.prototype.onCollision = function (gameObject) {
			var collision = this.getCollision(gameObject);
			this.bounceFrom(collision);

			if (gameObject.hasTag("paddle")) {
				Quick.play("pingSound");
			} else {
				Quick.play("pongSound");
			}
		};

		return Ball;
	})();

	var FirstScene = (function () {
		function FirstScene() {
			Scene.call(this);
			this.add(new Background());
			var horizontalPipe = new HorizontalPipe();
			this.add(horizontalPipe);
			var verticalPipe1, verticalPipe2;
			verticalPipe1 = new VerticalPipe();
			verticalPipe2 = new VerticalPipe();
			verticalPipe2.setRight(Quick.getWidth());
			this.add(verticalPipe1);
			this.add(verticalPipe2);
			var ball = new Ball();
			ball.setTop(horizontalPipe.getBottom() + 1);
			ball.setLeft(verticalPipe1.getRight() + 1);
			this.add(ball);
			this.add(new Paddle());
			Quick.play("pongSound");
		}; FirstScene.prototype = Object.create(Scene.prototype);

		// override
		FirstScene.prototype.getNext = function () {
			return new FirstScene();
		};

		return FirstScene;
	})();

	var Paddle = (function () {
		function Paddle() {
			GameObject.call(this);
			this.addTag("paddle");
			this.controller = Quick.getController();
			this.pointer = Quick.getPointer();
			this.setImageId("paddleSprite");
			this.setSolid();
			this.setCenterX(Quick.getWidth() / 2);
			this.setBottom(Quick.getHeight() - this.getHeight());
		}; Paddle.prototype = Object.create(GameObject.prototype);

		// override
		Paddle.prototype.update = function () {
			var position = this.pointer.getPosition();

			if (position.getY() > 0) {
				this.setCenterX(position.getX());
			}

			if (this.controller.keyDown(CommandEnum.LEFT) && this.getLeft() > 0) {
				this.moveX(-4);
			}

			if (this.controller.keyDown(CommandEnum.RIGHT) && this.getRight() < Quick.getWidth()) {
				this.moveX(4);
			}
		};

		return Paddle;
	})();

	var Pipe = (function () {
		function Pipe() {
			GameObject.call(this);
			this.addTag("pipe");
			this.setSolid();
		}; Pipe.prototype = Object.create(GameObject.prototype);

		return Pipe;
	})();

	var HorizontalPipe = (function () {
		function HorizontalPipe() {
			Pipe.call(this);
			this.setImageId("horizontalPipeSprite");
			this.setWidth(Quick.getWidth());
		}; HorizontalPipe.prototype = Object.create(Pipe.prototype);

		return HorizontalPipe;
	})();

	var VerticalPipe = (function () {
		function VerticalPipe() {
			Pipe.call(this);
			this.setImageId("verticalPipeSprite");
			this.setHeight(Quick.getHeight());
		}; VerticalPipe.prototype = Object.create(Pipe.prototype);

		return VerticalPipe;
	})();

	main();
})();
