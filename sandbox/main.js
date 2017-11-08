/**
 * Copyright (c) 2015 Diogo Schneider
 * 
 * Made with Quick
 * 
 * https://github.com/dgsprb/quick
 */

(function () {

	"use strict";

	// imports
	for (var i in com.dgsprb.quick) window[i] = com.dgsprb.quick[i];

	// functions
	function main() {
		Quick.setName("Quick Sandbox");
		var scene = new Scene();
		Quick.init(function () { return scene });
		window.scene = scene;

		console.log("Welcome to Quick Sandbox! Have fun!\n" +
			"\n" +
			"The following commands have already been issued for your convenience:\n" +
			"\n" +
			"scene = new Scene()\n" +
			"Quick.init(function () { return scene })\n");
	}

	main();

})();
