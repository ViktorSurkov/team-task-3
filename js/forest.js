////////////////////////////////////
/// Represents a forest obstacles
/// inherited from the wall object

function Forest(parentId, parentDims, dims) {
  Wall.call(this, parentId, parentDims, dims);
}

Forest.prototype = Object.create(Wall.prototype);
Forest.prototype.constructor = Forest;

///////////////////////////////////////////////////
///           Overriden

// Overriden. Returns id prefix
Forest.prototype.getIdPrefix = function () {
  return "forest";
}

// Overriden. Returns local backgroun image path
Forest.prototype.getBgImage = function () {
  return "./img/forest.gif";
}

// Overriden. Returns background size
Forest.prototype.getBgSize = function () {
  return "1060% 1060%";
}

// Overriden. Returns z-index of background image
Forest.prototype.getZIndex = function () {
  return "2";
}
