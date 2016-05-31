
$(document).ready(function () {
  var game = new Game();

  document.body.onkeydown = function (e) {
    game.onKeyDown(e);
  }

  document.body.onkeyup = function (e) {
    game.onKeyUp(e);
  }
});


//////////////////////////////////////////////////////
// 		Functionality

// Represents battle city game

var KEYCODE_LEFT = 37,
    KEYCODE_RIGHT = 39,
    KEYCODE_UP = 38,
    KEYCODE_DOWN = 40,
    KEYCODE_SPACE = 32,
    KEYCODE_ENTER = 13;

function Game() {
  $(document.body).css({
    backgroundColor: "grey"
  });

  var tankSizeCoef = 0.09;
  var minMarginCoef = 0.05;

  // creates battlefield with tank
  this._battlefield = new Battlefield(minMarginCoef);
  this._battlefield.appendMainTank(new Tank(tankSizeCoef, this._battlefield));

  // init game resizer
  this._resizer = new Resizer(this._battlefield);
}

Game.prototype.onKeyDown = function (e) {
  if (e.keyCode == KEYCODE_LEFT) {
    this._battlefield.move(DIRECTION.LEFT);
  }
  else if (e.keyCode == KEYCODE_RIGHT) {
    this._battlefield.move(DIRECTION.RIGHT);
  }
  else if (e.keyCode == KEYCODE_UP) {
    this._battlefield.move(DIRECTION.UP);
  }
  else if (e.keyCode == KEYCODE_DOWN) {
    this._battlefield.move(DIRECTION.DOWN);
  }
}

Game.prototype.onKeyUp = function (e) {
  if (e.keyCode == KEYCODE_LEFT) {
    this._battlefield.stopMove(DIRECTION.LEFT);
  }
  else if (e.keyCode == KEYCODE_RIGHT) {
    this._battlefield.stopMove(DIRECTION.RIGHT);
  }
  else if (e.keyCode == KEYCODE_UP) {
    this._battlefield.stopMove(DIRECTION.UP);
  }
  else if (e.keyCode == KEYCODE_DOWN) {
    this._battlefield.stopMove(DIRECTION.DOWN);
  }
}
