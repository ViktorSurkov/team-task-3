/////////////////////////////////////////////////
///     Represents tank moving navigator

function Navigator(tankWidth, tankHeight, bfDims, walls) {
  this._walls = walls;
  this._tankWidth = tankWidth;
  this._tankHeight = tankHeight;
  this._dims = bfDims;

  this._allowOffsetCoef = 0.12;
}

// figure out the new position of the tank (pos parameter) if there is possible to move and
// returns true
//
Navigator.prototype.calcMovePos = function (pos, dir, moveDist, newPos) {
  switch (dir) {
    case DIRECTION.UP:
      var newUp = pos.top + moveDist;
      if(newUp < 0 || !this._correctTankVerMove(pos.left, newUp, newPos)) {
        return false;
      }
      break;
    case DIRECTION.RIGHT:
      var newRight = pos.left + this._tankWidth + moveDist;
      if(newRight > this._dims.side || !this._correctTankHorMove(pos.left + moveDist, pos.top, newPos)) {
        return false;
      }
      break;
    case DIRECTION.DOWN:
      var newDown = pos.top + this._tankHeight + moveDist;
      if(newDown > this._dims.side || !this._correctTankVerMove(pos.left, pos.top + moveDist, newPos)) {
        return false;
      }
      break;
    case DIRECTION.LEFT:
      var newLeft = pos.left + moveDist;
      if(newLeft < 0 || !this._correctTankHorMove(newLeft, pos.top, newPos)) {
        return false;
      }

      break;
    default:

  }

  return true;
}

//////////////////////////////////////////////////////
////            Internals

Navigator.prototype._correctTankVerMove = function (left, top, newPos) {
  if(!this._isTankInWalls(left, top)) {
    newPos.left = left;
    newPos.top = top;

    return true;
  }

  // turns on the left
  var newLeft = { left: 0 };
  this._makeHorOffset(left, top, newLeft, true);
  if(!this._isTankInWalls(newLeft.left, top)) {
    newPos.left = newLeft.left;
    newPos.top = top;

    return true;
  }

  // turns on the right
  this._makeHorOffset(left, top, newLeft, false);
  if(!this._isTankInWalls(newLeft.left, top)) {
    newPos.left = newLeft.left;
    newPos.top = top;

    return true;
  }

  return false;
}

Navigator.prototype._correctTankHorMove = function (left, top, newPos) {
  if(!this._isTankInWalls(left, top)) {
    newPos.left = left;
    newPos.top = top;

    return true;
  }

  // turns on the left
  var newTop = { top: 0 };
  this._makeVerOffset(left, top, newTop, true);
  if(!this._isTankInWalls(left, newTop.top)) {
    newPos.left = left;
    newPos.top = newTop.top;

    return true;
  }

  // turns on the right
  this._makeVerOffset(left, top, newTop, false);
  if(!this._isTankInWalls(left, newTop.top)) {
    newPos.left = left;
    newPos.top = newTop.top;

    return true;
  }

  return false;
}

Navigator.prototype._isTankInWalls = function (left, top) {
  var nv = this;

  return this._walls.some(function(wall) {
    // tank can move through forest
    if(wall.getIdPrefix() == "forest") {
      return false;
    }

    return nv._isTankInRect(wall, left, top, nv._tankWidth, nv._tankHeight);
  });
}

Navigator.prototype._isTankInRect = function (wall, left, top, width, height) {
  if(this._isPointInRect(wall, left, top)
  || this._isPointInRect(wall, left + width, top)
  || this._isPointInRect(wall, left, top + height)
  || this._isPointInRect(wall, left + width, top + height)) {
    return true;
  }

  return false;
}

Navigator.prototype._isPointInRect = function (wall, left, top) {
  var dims = wall.getDims();
  // var sizeParams = this.formSizeParams();
  // var wallParams = this.calcWallParams(sizeParams, wall);

  if((top >= dims.top && top <= dims.top + dims.height)
    && (left >= dims.left && left <= dims.left + dims.width)) {
    return true;
  }

  return false;
}

Navigator.prototype._makeHorOffset = function (left, top, newLeft, bLeft) {
  // shift to the left
  if(bLeft) {
    newLeft.left = left - this._allowOffsetCoef * this._tankWidth;
  }
  // or to the right
  else {
    newLeft.left = left + this._allowOffsetCoef * this._tankWidth;
  }
}

Navigator.prototype._makeVerOffset = function (left, top, newTop, bUp) {
  // shift up
  if(bUp) {
    newTop.top = top - this._allowOffsetCoef * this._tankHeight;
  }
  // shift down
  else {
    newTop.top = top + this._allowOffsetCoef * this._tankHeight;
  }
}
