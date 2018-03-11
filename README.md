![{ quick }](http://quick-developers.github.io/quick/logo.png)

the open multi-platform game engine

## About
Quick aims to provide a multi-platform, lightweight, easy-to-use engine to be used on game development, focusing in performance, quick development and maintainability. Based on the original engine used in Starship and Ms. Starship, it has evolved with the continuous addition of new features.

Quick includes all requirements for a full-featured game included in a single library. It's the whole thing in a tiny package. It runs on any modern JavaScript runtime, from personal computers with gamepads and keyboards to personal digital assistants with touch screens. Write once, run everywhere... now for real.

### API
[Click here for the wiki-based API](https://github.com/quick-developers/quick/wiki)

### Latest release
[Download or link directly to this file.](https://cdn.rawgit.com/quick-developers/quick/v6.0.2/quick.js)

## Advantages
  * Virtual resolution - run your game in any screen size without affecting your development or game logic
  * Accessible - play with a common user interface for gamepad or keyboard
  * Multiplatform - architecture agnostic at the core, all you need is a JavaScript runtime
  * Complete - no further dependencies required
  * Easy to use - rich, well defined API that feels natural to game development
  * Agnostic - whether you want to write your game with OOP or functional code, the choice is yours
  * Open - free to use, read, and extend it. Enjoy!

Please check the [Wiki](https://github.com/quick-developers/quick/wiki) for more information.

## Games
These are some games made with Quick (in alphabetical order):
  * [Alpha](http://diogoschneider.github.io/games/alpha/)
  * [Cityscape](https://www.kongregate.com/games/diogoschneider/cityscape/)
  * [Colda Kasar's Domain](http://coldmass.com.br/coldakasar/)
  * [Cucurbita's Halloween](http://www.kongregate.com/games/bbastudios/cucurbitas-halloween)
  * [Dragonfire](http://staudt.github.io/dragonfire/)
  * [Fighter Champion](https://rawgit.com/csfeijo/fighter-champion/master/index.html)
  * [Missile Commander](http://staudt.github.io/missile-commander/)

Please get your games made with Quick listed here!

## How to use
All you need is to add Quick to your HTML file and make sure you have a canvas element somewhere in your page.

For a quick start: first, grab [the latest skeleton project](https://github.com/quick-developers/quick-skel), which will get you productive as soon as possible.

The skeleton is written with classes, keeping your code very clean and organized. But you don't need to extend classes if you don't want to, you can just instantiate Quick objects and use delegates if you need.

This skeleton provide a sample Quick project with an initial Scene, a black background and a player Sprite with the Controllable plugin, so you can move it with the keyboard or a gamepad. Make sure you check the [Wiki](https://github.com/quick-developers/quick/wiki) and [demos and plugins](https://github.com/quick-developers) to harness the full potential of the library.

## Input
Quick's input subsystem dynamically attaches physical devices such as gamepads, keyboards, mice and touch screens to virtual devices. Gamepads and keyboards are known to the game as controllers via the Controller class, while mice and touch screens are known to the game as pointers, via the Pointer class. Games can use one or more devices, such as a controller and a pointer to command a more complex game or even multiple controllers for multiplayer games.

### Controllers
In order to be accessible and ergonomic to the majority of players without configuration hassles, Quick convenes to a common set of commands. which are:
  * Up
  * Down
  * Left
  * Right
  * A
  * B
  * X
  * Y
  * Select
  * Start

These commands can be easily referenced to using the [[Command]] enumeration. Physical devices which implement [[Controller]] then map to these commands, as follows:

#### Keyboard
The keyboard mapping allows both left and right handed players to use a comfortable set of keys:
  * Up arrow, E or I - Up
  * Down arrow, D or K - Down
  * Left arrow, S or J - Left
  * Right arrow, F or L - Right
  * Space - A
  * Alt - B
  * Ctrl - X
  * Shift - Y
  * Esc - Select
  * Enter - Start

#### Gamepad
The gamepad mapping allows both digital and analog controls to be properly mapped to a game command:
  * Up (digital / analog) - Up
  * Down (digital / analog) - Down
  * Left (digital / analog) - Left
  * Right (digital / analog) - Right
  * A or 1 - A
  * B or 2 - B
  * X or 3 - X
  * Y or 4 - Y
  * Select - Select
  * Start - Start

### Pointers
While mice and touch screens have different capabilities, they share a few common concepts which we can leverage to interact them in an uniform way. Bot can provide clicks and position coordinates.

## Related projects
Click [here](https://github.com/quick-developers) for the full list of projects including demos and reusable plugins.

[![VanillaJS](http://vanilla-js.com/assets/button.png)](http://vanilla-js.com)
