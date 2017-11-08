(function () {

	"use strict";

	// imports
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Quick = com.dgsprb.quick.Quick;
	var GameObject = com.dgsprb.quick.GameObject;
	var Scene = com.dgsprb.quick.Scene;

	// constants
	var SPEED = 2;

	// functions
	function main() {
		Quick.setName("Skel");
		var gameScene = new Scene();
		Quick.init(function () { return gameScene });
		var background = new GameObject();
		background.setColor("Black");
		background.setHeight(Quick.getHeight());
		background.setWidth(Quick.getWidth());
		gameScene.add(background);
		var player = new GameObject();
		player.controller = Quick.getController();
		player.setColor("White");
		player.setSize(32);

		player.setDelegate({
			"update" : function() {
				if (player.controller.keyDown(CommandEnum.LEFT) && player.getLeft() > 0) {
					player.moveX(-SPEED);
				} else if (player.controller.keyDown(CommandEnum.RIGHT) && player.getRight() < Quick.getWidth()) {
					player.moveX(SPEED);
				}

				if (player.controller.keyDown(CommandEnum.UP) && player.getTop() > 0) {
					player.moveY(-SPEED);
				} else if (player.controller.keyDown(CommandEnum.DOWN) && player.getBottom() < Quick.getHeight()) {
					player.moveY(SPEED);
				}
			}
		});

		gameScene.add(player);
	}

	main();

})();
