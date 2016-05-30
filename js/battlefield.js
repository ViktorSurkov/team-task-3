////////////////////////////////////////////////////////////////////
var idCount = 0;

function Battlefield(minMarginCoef) {
  this._minMarginCoef = minMarginCoef;

  var wndWidth = $(window).width();
  var wndHeight = $(window).height();

  var bfWidth = wndWidth - this._minMarginCoef * wndWidth * 2;
  var bfHeight = wndHeight - this._minMarginCoef * wndHeight * 2;

  var side = bfWidth > bfHeight ? bfHeight : bfWidth;
  var left = ($(window).width() - side) / 2;
  var top = ($(window).height() - side) / 2;
  this.saveDims(side, left, top);

  this._battlefield = $("<div>", {id: "battlefield"});
  this._battlefield.css({
    width: side + "px",
    height: side + "px",
    minWidth: side + "px",
    //"background-image": "url('./img/battlefield.jpg')",
    backgroundColor: "black",
    left: left + "px",
    top: top + "px",
    position: "fixed",
    zIndex: "-2"
  });

  $(document.body).append(this._battlefield);

  // init walls and tank storages
  this._walls = [];
  this._mainTank = null;
  this._tanks = [];

  // create obstacles
  this.createBrickWalls(this._battlefield);
  this.createConcreteWalls(this._battlefield);
  this.createForests(this._battlefield);
}

///////////////////////////////////////////////
///                  Tanks

var TRIDENT_PLACE_COEF = 0.166;

Battlefield.prototype.getMainTankStart = function (width, height) {
  var dims = this.getDims();

  var withoutTrident = dims.side - dims.side * TRIDENT_PLACE_COEF;
  var leftPos =  withoutTrident / 2 - width;   // !!! tank left counts from the battlefield left border
  var topPos = dims.side - height;

  return {
    id: "battlefield",
    left: leftPos,
    top: topPos
  };
}

Battlefield.prototype.appendMainTank = function (tank) {
  this._mainTank = tank;
}

Battlefield.prototype.appendTank = function (tank) {
  this._tanks.push(tank);
}

Battlefield.prototype.getMainTank = function () {
  return this._mainTank;
}

Battlefield.prototype.getTank = function (id) {
  return this._tanks.find(function (item) {
    return item.getId() == id;
  });
}

Battlefield.prototype.move = function (dir) {
  this._mainTank.move(dir);
}

Battlefield.prototype.stopMove = function (dir) {
  this._mainTank.stopMove(dir);
}

Battlefield.prototype.canMove = function(leftStr, topStr, dir, offset) {
  var left = parseFloat(leftStr);
  var top = parseFloat(topStr);

  //var sizeParams = this.formSizeParams();
  var dims = this.getDims();

  switch (dir) {
    case DIRECTION.UP:
      var newUp = top + offset;
      if(newUp < 0 || this.isTankInWalls(left, newUp)) {
        return false;
      }
      break;
    case DIRECTION.RIGHT:
      var newRight = left + this._mainTank.getDims().width + offset;
      if(newRight > dims.side || this.isTankInWalls(left + offset, top)) {
        return false;
      }
      break;
    case DIRECTION.DOWN:
      var newDown = top + this._mainTank.getDims().height + offset;
      if(newDown > dims.side || this.isTankInWalls(left, top + offset)) {
        return false;
      }
      break;
    case DIRECTION.LEFT:
      var newLeft = left + offset;
      if(newLeft < 0 || this.isTankInWalls(newLeft, top)) {
        return false;
      }

      break;
    default:

  }

  return true;
}

Battlefield.prototype.calcMoveDist = function(leftStr, topStr, dir, offset) {
  // var left = parseFloat(leftStr);
  // var top = parseFloat(topStr);
  //
  // //var sizeParams = this.formSizeParams();
  // var dims = this.getDims();
  // var tankDims = this._mainTank.getDims();
  //
  // var pos = {};
  //
  // switch (dir) {
  //   case DIRECTION.UP:
  //     var newUp = top + offset;
  //     if(newUp < 0 || this.correctTankPos(left, newUp, dir, pos)) {
  //       return false;
  //     }
  //     break;
  //   case DIRECTION.RIGHT:
  //     var newRight = left + tankDims.width + offset;
  //     if(newRight > dims.side || this.correctTankPos(left + offset, top, dir, pos)) {
  //       return false;
  //     }
  //     break;
  //   case DIRECTION.DOWN:
  //     var newDown = top + tankDims.height + offset;
  //     if(newDown > dims.side || this.correctTankPos(left, top + offset, dir, pos)) {
  //       return false;
  //     }
  //     break;
  //   case DIRECTION.LEFT:
  //     var newLeft = left + offset;
  //     if(newLeft < 0 || this.correctTankPos(newLeft, top, dir, pos)) {
  //       return false;
  //     }
  //
  //     break;
  //   default:
  //
  // }

  return true;
}

Battlefield.prototype.isTankInWalls = function (left, top) {
  var dims = this._mainTank.getDims();
  var bf = this;

  return this._walls.some(function(wall) {
    // tank can move through forest
    if(wall.getIdPrefix() == "forest") {
      return false;
    }

    return bf.isTankInRect(wall, left, top, dims.width, dims.height);
  });
}

Battlefield.prototype.correctTankPos = function (left, top, dir, pos) {
  // var dims = this._mainTank.getDims();
  // var bf = this;
  //
  // return this._walls.some(function(wall) {
  //   // tank can move through forest
  //   if(wall.getIdPrefix() == "forest") {
  //     return false;
  //   }
  //
  //   return bf.isTankInRect(wall, left, top, dims.width, dims.height);
  // });
}

Battlefield.prototype.isTankInRect = function (wall, left, top, width, height) {
  if(this.isPointInRect(wall, left, top)
  || this.isPointInRect(wall, left + width, top)
  || this.isPointInRect(wall, left, top + height)
  || this.isPointInRect(wall, left + width, top + height)) {
    return true;
  }

  return false;
}

Battlefield.prototype.isPointInRect = function (wall, left, top) {
  var dims = wall.getDims();
  // var sizeParams = this.formSizeParams();
  // var wallParams = this.calcWallParams(sizeParams, wall);

  if((top >= dims.top && top <= dims.top + dims.height)
    && (left >= dims.left && left <= dims.left + dims.width)) {
    return true;
  }

  return false;
}


/////////////////////////////////////////////////
///       Battlefield params

Battlefield.prototype.getId = function () {
  return "battlefield";
}

Battlefield.prototype.getMinMarginCoef = function () {
  return this._minMarginCoef;
}

Battlefield.prototype.saveDims = function (side, left, top) {
  this._side = side;
  this._left = left;
  this._top = top;
}

Battlefield.prototype.getDims = function () {
  return {
    side: this._side,
    left: this._left,
    top: this._top
  }
}

///////////////////////////////////////////////////
///                Walls

Battlefield.prototype.appendWall = function (wall) {
  this._walls.push(wall);
}

Battlefield.prototype.getWalls = function () {
  return this._walls;
}

Battlefield.prototype.createBrickWalls = function (battlefield) {
  var dims = this.getDims();
  var wallSide = dims.side * 0.1;

  // var tridentWallWidth = dims.side * TRIDENT_PLACE_COEF;
  // var tridentWallHeight = wallSide * 1.5;
  // var tridentLeft = (dims.side - tridentWallWidth) / 2 * 1.007;
  // var tridentTop = (dims.side - tridentWallHeight);
  //
  // this._createBrickWall(tridentWallWidth / 4, tridentWallWidth / 4 * 3, tridentLeft, tridentTop);

  var cor = 1.007;
  // vertical top left sequence
  for(var i = 0; i < 4; ++i) {
    this._createBrickWall(wallSide, wallSide, wallSide * cor, wallSide * (i + 1));
    this._createBrickWall(wallSide, wallSide, wallSide * cor * 3, wallSide * (i + 1));
  }

  // vertical top right sequence
  var offset = dims.side - wallSide;
  for(var i = 0; i < 4; ++i) {
    this._createBrickWall(wallSide, wallSide, offset - wallSide * cor, wallSide * (i + 1));
    this._createBrickWall(wallSide, wallSide, offset - wallSide * cor * 3, wallSide * (i + 1));
  }

  // vertical bottom left sequence
  var topOffset = dims.side - wallSide;
  for(var i = 0; i < 4; ++i) {
    this._createBrickWall(wallSide, wallSide, wallSide * cor, topOffset - wallSide * (i + 1));
    this._createBrickWall(wallSide, wallSide, wallSide * cor * 3, topOffset -  wallSide * (i + 1));
  }

  // for(var i = 0; i < 4; ++i) {
  //   this._createBrickWall(wallSide, wallSide, wallSide * i, wallSide);
  // }

  // for(var i = 0; i < 4; ++i) {
  //   this._createBrickWall(wallSide, wallSide, (dims.side - wallSide) - wallSide * i, wallSide);
  // }

  // this._createBrickWall(wallSide, wallSide, 3 * wallSide, 4 * wallSide);
  // this._createBrickWall(wallSide, wallSide, 4 * wallSide, 4 * wallSide);
  // this._createBrickWall(wallSide, wallSide, 4 * wallSide, 5 * wallSide);
  this._createBrickWall(wallSide, wallSide, dims.side - wallSide * 4.0, dims.side - wallSide);
}

Battlefield.prototype.createConcreteWalls = function (battlefield) {
  var dims = this.getDims();
  var wallSide = 0.1 * dims.side;

  this._createConcreteWall(wallSide, wallSide, wallSide * 9.0, wallSide * 2.0);
  this._createConcreteWall(wallSide, wallSide, wallSide * 9.0, wallSide * 3.0);
}

Battlefield.prototype.createForests = function (battlefield) {
  var dims = this.getDims();
  var wallSide = dims.side * 0.09;

  for(var i = 0; i < 3; ++i) {
    var cor = i + 1;
    this._createForest(wallSide, wallSide,  wallSide * (5 + i), wallSide * 6);
    this._createForest(wallSide, wallSide, wallSide * (5 + i), wallSide * 7);
    this._createForest(wallSide, wallSide, wallSide * (5 + i), wallSide * 8);
  }
}

//////////////////////////////////////////////////////
///               Internals

Battlefield.prototype._createBrickWall = function (width, height, left, top) {
  var parentId = this.getId();

  // we need to give battlefield dims, because
  // wall has "position: fixed", so its left equals to
  // battlefield.style.left + wall.style.left
  var dims = this.getDims();

  // appends to the battlefield object
  this.appendWall(new BrickWall(parentId, dims, {
    width: width,
    height: height,
    left: left,
    top: top
  }));
}

Battlefield.prototype._createConcreteWall = function (width, height, left, top) {
  var parentId = this.getId();

  // we need to give battlefield dims, because
  // wall has "position: fixed", so its left equals to
  // battlefield.style.left + wall.style.left
  var dims = this.getDims();

  // appends to the battlefield object
  this.appendWall(new ConcreteWall(parentId, dims, {
    width: width,
    height: height,
    left: left,
    top: top
  }));
}

Battlefield.prototype._createForest = function (width, height, left, top) {
  var parentId = this.getId();

  // we need to give battlefield dims, because
  // wall has "position: fixed", so its left equals to
  // battlefield.style.left + wall.style.left
  var dims = this.getDims();

  // appends to the battlefield object
  this.appendWall(new Forest(parentId, dims, {
    width: width,
    height: height,
    left: left,
    top: top
  }));
}
