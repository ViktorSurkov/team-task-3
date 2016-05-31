// Represents tank object

// tank move directions
var DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
}

var MOVE_DIST = 8;

function Tank(sizeCoef, battlefield) {
  this._sizeCoef = sizeCoef;
  this._battlefield = battlefield;

  var bfDims = this._battlefield.getDims();
  var side = bfDims.side * this._sizeCoef;
  var pos = this._battlefield.getMainTankStart(side, side);

  // tank picture
  var tank = $("<div>", {id: this.getId()});
  tank.css({
    "width": side + "px",
    "height": side + "px",
    "background-image": "url('./img/tank_up.gif')",
    "background-size": "100% 100%",//side + "px" + side + "px",
    "transition": "all 0.1s ease-out 0s",
    "position": "relative",
    "top": pos.top + "px",
    "left": pos.left + "px"
    //"border": "0.5px solid green"
  });

  $("#" + pos.id).append(tank);

  this.saveDims({
    width: side,
    height: side,
    left: pos.left,
    top: pos.top
  });

  // creates tank moving navigator
  this._navigator = new Navigator(side, side, bfDims, battlefield.getWalls());

  // default direction
  this._dir = DIRECTION.UP;

  // sounds
  this.appendSounds();
  this.playIdling();
}

/////////////////////////////////////////////////
///           Tank params
Tank.prototype.getId = function () {
  return "tank";
}

Tank.prototype.getSizeCoef = function () {
  return this._sizeCoef;
}

// Tank dimensions { width: [some], height: [some], left: [some], top: [some] }
Tank.prototype.getDims = function () {
  return this._dims;
}

Tank.prototype.saveDims = function (dims) {
  this._dims = dims;
}

////////////////////////////////////////////////
///           Moving methods

Tank.prototype.turn = function (dir) {
  var oldDir = this._dir;
  this._dir = dir;

  // if there is the same direction - don't rotate
  if(oldDir != dir) {
    $("#tank").css('transform', 'rotate('+ this._calcTurn(oldDir, dir) + 'deg)');
  }
}

Tank.prototype.getDir = function () {
  return this._dir;
}

Tank.prototype.move = function (dir) {
  var oldDir = this._dir;

  // turns tank
  this.turn(dir);

  // sets sounds
  $("#idling")[0].pause();
  $("#drive")[0].play();

  // if tank has turned - return
  if(dir != oldDir)
    return;

  var dirStr;
      moveDist = this._battlefield.getDims().side * 0.019;

  switch (dir) {
    case DIRECTION.UP:
      dirStr = "top";
      moveDist *= -1;
      break;
    case DIRECTION.RIGHT:
      dirStr = "left";
      break;
    case DIRECTION.DOWN:
      dirStr = "top";
      break;
    case DIRECTION.LEFT:
      dirStr = "left";
      moveDist *= -1;
      break;
    default:
      dirStr = "top"
  }

  // sets the move state and play engine sound
  $("#tank").css("background-image", "url('./img/tank_move_up.gif')");

  var pos = {
    left: parseFloat($("#tank").css("left")),
    top: parseFloat($("#tank").css("top"))
  }

  var newPos = {
    left: pos.left,
    top: pos.top
  };

  // should replace canMove() in future
  if(this._navigator.calcMovePos(pos, dir, moveDist, newPos)) {
    //var offset = parseFloat($("#tank").css(dirStr)) + moveDist;
    $("#tank").css({
      left: newPos.left,
      top: newPos.top
    });

    this._dims.left = newPos.left;
    this._dims.top = newPos.top;
    //this.saveSizeCoef();
  }

  // Old move ability check
  // if(this._battlefield.canMove(left, top, dir, moveDist)) {
  //   var offset = parseFloat($("#tank").css(dirStr)) + moveDist;
  //   $("#tank").css(dirStr, function(index) {
  //     return offset + 'px';
  //   });
  //
  //   this._dims[dirStr] = offset;
  //   //this.saveSizeCoef();
  // }
};

Tank.prototype._calcTurn = function (oldDir, dir) {
  var turnCoef = dir - oldDir;

  // 0
  if(oldDir == 0 && dir == 3) {
    turnCoef = -1;
  }
  else if(oldDir == 0 && dir == -3) {
    turnCoef = 1;
  }

  // 1
  if(oldDir == 1) {
    switch (dir) {
      case 0:
        turnCoef = -0;
        break;
      case 1:
        turnCoef = 1;
        break;
      case 2:
        turnCoef = 2;
        break;
      case 3:
        turnCoef = -1;
        break;
      default:

    }
  }

  // 2
  if(oldDir == 2) {
    switch (dir) {
      case 0:
        turnCoef = 0;
        break;
      case 1:
        turnCoef = 1;
        break;
      case 2:
        turnCoef = 2;
        break;
      case 3:
        turnCoef = -1;
        break;
      default:

    }
  }

  // 3
  if(oldDir == 3) {
    switch (dir) {
      case 0:
        turnCoef = 0;
        break;
      case 1:
        turnCoef = 1;
        break;
      case 2:
        turnCoef = -2;
        break;
      case 3:
        turnCoef = -1;
        break;
      default:

    }
  }

  return 90 * turnCoef;
}

Tank.prototype.stopMove = function (dir) {
  // sets "stay" state
  $("#tank").css("background-image", "url('./img/tank_up.gif')");

  $("#drive")[0].pause();
  $("#idling")[0].play();
}

////////////////////////////////////////////////////////
///             Sound methods

Tank.prototype.appendSounds = function () {
  var idlingAudio = $("<audio>", {
    id: "idling",
    src: "./sound/idling.wav",
    loop: "loop"
  });

  $(document.body).append(idlingAudio);

  var driveAudio = $("<audio>", {
    id: "drive",
    src: "./sound/drive.wav",
    loop: "loop"
  });

  $(document.body).append(driveAudio);
  //$(document.body).append(<audio src='aaa.mp3' autoplay></audio>)
}

Tank.prototype.playIdling = function () {
  $("#idling")[0].play();
}
