var Cell = function(x,y,type,options) {
  options = options || {};

  this.size = options.size || 10;
  this.x = x;
  this.y = y;
  this.xCoord = x * this.size;
  this.yCoord = y * this.size;
  this.type = type;

  this.drawShape = options.draw || this.drawShape;
  this.isHighlighted = false;
  this.isMatched = false;
};


Cell.prototype = {
  
  isNeighbor : function(x,y) {
    if(Math.abs(this.x-x)  === 1 && Math.abs(this.y-y) === 0) {
      return true;
    }
    if(Math.abs(this.y-y) === 1 && Math.abs(this.x-x)  === 0) {
      return true;
    }

    return false;
  },

  draw : function() {
    this.drawShape(this.xCoord,this.yCoord,this.size, this.isHighlighted);
  },

  drawShape : function() {
    //This function is generally overloaded - here for reference
  },

  drawHighlight : function() {

  },

  match : function(other) {
    return this.type === other.type
  },

  updatePosition : function(x,y) {
    this.x = x;
    this.y = y;
    this.xCoord = x * this.size;
    this.yCoord = y * this.size;
  },

  highlight : function() {
    var old = this.isHighlighted;
    this.isHighlighted = true;
    return !old;
  },

  unhighlight : function() {
    if(!this.isMatched) {
      this.isHighlighted = false;  
    }
  },

  toggleHighlight : function() {
    this.isHighlighted = !this.isHighlighted;
  },

  removeCell : function(x,y) {
    this.cells[x][y] = undefined;
  }
};

var CellFactory = {

  setTypes : function(types) {
    this.types = types;
  },

  newCell : function(options) {
    options = options || {};
    var x = options.x || 0,
        y = options.y || 0,
        type = options.type || '',
        cellOptions = {};

    cellOptions.size = options.size || 10;
    cellOptions.draw = this.types[type].draw;

    return new Cell(x,y,type,cellOptions);
  }
}