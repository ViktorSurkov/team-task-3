////////////////////////////////////
/// Represents a brick wall obstacles
/// inherited from the wall object

function BrickWall(parentId, parentDims, dims) {
  Wall.call(this, parentId, parentDims, dims);
}

BrickWall.prototype = Object.create(Wall.prototype);
BrickWall.prototype.constructor = BrickWall;

///////////////////////////////////////////////////
///           Overriden

// Overriden. Returns id prefix
BrickWall.prototype.getIdPrefix = function () {
  return "brick_wall";
}

// Overriden. Returns local backgroun image path
BrickWall.prototype.getBgImage = function () {
  return "./img/battlefield.jpg";
}

// Overriden. Returns background size
BrickWall.prototype.getBgSize = function () {
  return "1360% 1360%";
}

// Overriden. Returns z-index of background image
BrickWall.prototype.getZIndex = function () {
  return "-1";
}
