////////////////////////////////////
/// Represents a concrete obstacles
/// inherited from the wall object

function ConcreteWall(parentId, parentDims, dims) {
  Wall.call(this, parentId, parentDims, dims);
}

ConcreteWall.prototype = Object.create(Wall.prototype);
ConcreteWall.prototype.constructor = ConcreteWall;

///////////////////////////////////////////////////
///           Overriden

// Overriden. Returns id prefix
ConcreteWall.prototype.getIdPrefix = function () {
  return "concrete_wall";
}

// Overriden. Returns local backgroun image path
ConcreteWall.prototype.getBgImage = function () {
  return "./img/concrete.jpg";
}

// Overriden. Returns background size
ConcreteWall.prototype.getBgSize = function () {
  return "1100% 1100%";
}

// Overriden. Returns z-index of background image
ConcreteWall.prototype.getZIndex = function () {
  return "-1";
}
