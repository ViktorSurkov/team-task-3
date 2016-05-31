///////////////////////////////////////////////////
///////////////////////////////////////////////////
// Represents resizer for game objects

function Resizer(battlefield) {
  this._battlefield = battlefield;
  this._minMarginCoef = battlefield.getMinMarginCoef();

  this._wndWidth = $(window).width();
  this._wndHeight = $(window).height();

  // sets window resize handler
  var game = this;
  $(window).resize(function() {
    game.resize();
  });
}

Resizer.prototype.resize = function () {
  var wndWidth = $(window).width();
  var wndHeight = $(window).height();

  var resizeRatio = this._resizeBattlefield(wndWidth, wndHeight);
  this._resizeMainTank(resizeRatio);
  this._resizeObstacles(resizeRatio);

  // saves new browser dimensions
  this._wndWidth = wndWidth;
  this._wndHeight = wndHeight;
}

Resizer.prototype._resizeBattlefield = function (wndWidth, wndHeight) {
  // var widthChangeRatio = wndWidth / this._wndWidth;
  // var heightChangeRatio = wndHeight / this._wndHeight;

  // figure out a new battlefield side
  var newWidth = wndWidth - this._minMarginCoef * wndWidth * 2;
  var newHeight = wndHeight - this._minMarginCoef * wndHeight * 2;
  var newSide = newWidth > newHeight ? newHeight : newWidth;

  // figures out a new battlefield position
  var testWidth = $(window).width(); // debug
  var testHeight = $(window).height(); // debug

  var newLeft = (wndWidth - newSide) / 2;
  var newTop = (wndHeight - newSide) / 2;

  // gets old size and position
  // var $bf = $("#" + this._battlefield.getId());
  // var bfWidth = parseFloat($bf).css("width"));
  // var bfHeight = parseFloat($bf).css("height"));
  // var bfLeft = parseFloat($bf).css("left"));
  // var bfTop = parseFloat($bf).css("top"));

  var oldSide = this._battlefield.getDims().side;
  $("#" + this._battlefield.getId()).css({
    width: newSide + "px",
    height: newSide + "px",
    minWidth: newSide + "px",
    left: newLeft + "px",
    top: newTop + "px"
  });

  this._battlefield.saveDims(newSide, newLeft, newTop);

  // !!! returns resize ratio
  return newSide / oldSide;
}

Resizer.prototype._resizeMainTank = function (resizeRatio) {
  var $tank = $("#tank");

  var tank = this._battlefield.getMainTank();
  var tankDims = tank.getDims();

  var newLeft = tankDims.left * resizeRatio;
  var newTop = tankDims.top * resizeRatio;

  var newWidth = this._battlefield.getDims().side * tank.getSizeCoef();
  var newHeight = newWidth;

  $tank.css({
    "width": newWidth + "px",
    "height": newHeight + "px",
    "left": newLeft + "px",
    "top": newTop + "px"
  });

  tank.saveDims({
    width: newWidth,
    height: newHeight,
    left: newLeft,
    top: newTop
  });
}


Resizer.prototype._resizeTanks = function (resizeRatio) {
  // var $tank = $("#tank");
  //
  // // left
  // var oldLeft = parseFloat($tank.css("left"));
  // var newLeft = oldLeft * resizeRatio;
  //
  // var oldTop = parseFloat($tank.css("top"));
  // var newTop = oldTop * resizeRatio;
  //
  // var oldWidth = parseFloat($tank.css("width"));
  // var newWidth = oldWidth * resizeRatio;
  //
  // var oldHeight = parseFloat($tank.css("height"));
  // var newHeight = oldHeight * resizeRatio;
  //
  // $tank.css({
  //   width: newWidth + "px",
  //   height: newHeight + "px",
  //   left: newLeft + "px",
  //   top: newTop + "px"
  // });
  //
  // var tank = this._battlefield.getTank("tank");
  // this.saveDims({
  //   width: newWidth,
  //   height: newHeight,
  //   left: newLeft,
  //   top: newTop
  // });
}

Resizer.prototype._resizeObstacles = function (resizeRatio) {
  var walls = this._battlefield.getWalls();
  var bfDims = this._battlefield.getDims();

  walls.forEach(function(wall) {
    var wallDims = wall.getDims();

    var newLeft = wallDims.left * resizeRatio;
    var newTop = wallDims.top * resizeRatio;

    var newWidth = wallDims.width * resizeRatio;
    var newHeight = wallDims.height * resizeRatio;

    var id = wall.getId();  // debug

    var $wall = $("#" + id);
    $wall.css({
      "width": newWidth + "px",
      "height": newHeight + "px",
      "left": bfDims.left + newLeft + "px",
      "top": bfDims.top + newTop + "px"
    });

    wall.saveDims({
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop
    });
  });
}
