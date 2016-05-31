////////////////////////////////////
/// Represents a base object for obstacles
/// on the battlefield

function Wall(parentId, parentDims, dims) {
  this._parentId = parentId;
  this._parentDims = parentDims;
  this._dims = dims;
  this._id = this._uniqueWallId();

  var bgi = this.getBgImage();// debug

  var wall = $("<div>", {id: this._id});
  wall.css({
    width: this._dims.width + "px",
    height: this._dims.height + "px",
    backgroundImage: "url('" + bgi + "')",
    backgroundSize: this.getBgSize(),
    left: this._parentDims.left + this._dims.left + "px",
    top: this._parentDims.top + this._dims.top + "px",
    position: "fixed",
    zIndex: this.getZIndex()
  });

  $("#" + this._parentId).append(wall);
}

///////////////////////////////////////////////////
///           Override

// Override this. Returns id prefix
Wall.prototype.getIdPrefix = function () {
  return "wall";
}

// Override this. Returns local backgroun image path
Wall.prototype.getBgImage = function () {
  return "";
}

// Override this. Returns background size
Wall.prototype.getBgSize = function () {
  return "";
}

// Override this. Returns z-index of background image
Wall.prototype.getZIndex = function () {
  return "-1";
}


//////////////////////////////////////////////////
///           Publics

Wall.prototype.getId = function() {
  return this._id;
}

Wall.prototype.getDims = function() {
  return this._dims;
}

// dims == { width: [some], height: [some], left: [some], top: [some] }
Wall.prototype.saveDims = function(dims) {
  this._dims = dims;
}

//////////////////////////////////////////////////
///           Internals

// id counter
Wall.idCount = 0;

Wall.prototype._uniqueWallId = function () {
  return "" + this.getIdPrefix() + Wall.idCount++;
}
