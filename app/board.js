  var Board = function(width, height, cellSize) {
  this.width = width;
  this.height = height;
  this.cellSize = cellSize;

  this.xMax = Math.floor(width/cellSize);
  this.yMax = Math.floor(height/cellSize);

  this.cells = [];

}

Board.prototype = {

  setCellFactory : function(cellFactory) {
    this.cellFactory = cellFactory;
  },

  setShapes : function(shapes) {
    this.shapes = shapes;
    this.shapeKeys = Object.keys(shapes);
  },

  highlightCell : function(x,y) {
    return this.cells[x][y].highlight();
  },

  highlightCells : function(cells) {
    for(var i = 0; i < cells.length; i++) {
      this.highlightCell(cells[i].x,cells[i].y);
    }
  },

  setMatches : function(cells) {
    for(var i = 0; i < cells.length; i++) {
      this.cells[cells[i].x][cells[i].y].isMatched = true;
    }
  },

  unhighlightCell : function(x,y) {
    this.cells[x][y].unhighlight();
  },

  getRandomShape : function() {
    return this.shapeKeys[Math.floor(Math.random() * this.shapeKeys.length)]
  },

  getCell : function(x,y) {
    return this.cells[x][y];
  },

  newCell : function(x,y) {
    return this.cellFactory.newCell({
          x : x,
          y : y,
          size : this.cellSize,
          type: this.getRandomShape()
        });
  },

  removeCells : function(cells) {
    for(var i = 0; i < cells.length; i++) {
      this.cells[cells[i].x][cells[i].y] = undefined;
    }
    this.repopulateCells();
  },

  repopulateCells : function() {
    for(var i = 0; i < this.xMax; i++) {
      var col = this.getCol(i);
      this.repopulateCol(col,i);
    }
  },

  repopulateCol: function(col,x) {
    undefIndex = col.indexOf(undefined);
    if(undefIndex > -1) {
      for(var i = undefIndex; i > 0; i--) {
        this.switchCells({x:x,y:i},{x:x,y:i-1});
      }
      col[0] = this.newCell(x,0);
    }
    if(col.indexOf(undefined) > -1) {
      this.repopulateCol(col,x);
    }
  },

  neighbors : function(pos1,pos2) {
    return this.cells[pos1.x][pos1.y].isNeighbor(pos2.x,pos2.y);
  },

  switchCells : function(pos1,pos2) {
    var tmpCell = this.cells[pos1.x][pos1.y];
    this.cells[pos1.x][pos1.y] = this.cells[pos2.x][pos2.y];
    this.cells[pos2.x][pos2.y] = tmpCell;

    if(this.cells[pos1.x][pos1.y]){
      this.cells[pos1.x][pos1.y].updatePosition(pos1.x,pos1.y);  
    }
    if(this.cells[pos2.x][pos2.y]) {
      this.cells[pos2.x][pos2.y].updatePosition(pos2.x,pos2.y);  
    }
    
  },

  getCol : function(x) {
    return this.cells[x];
  },

  getRow : function(y) {
    var cells = [];
    for(var i = 0; i < this.xMax; i++) {
      cells.push(this.cells[i][y]);
    }

    return cells;
  },

  init : function() {
    this.cellFactory.setTypes(this.shapes);

    for(var x = 0; x < this.xMax; x++) {
      this.cells.push([]);
      for(var y = 0; y < this.yMax; y++) {
        this.cells[x].push(this.newCell(x,y))
      }
    }
  },

  draw : function() {
    for(var x = 0; x < this.xMax; x++) {
      for(var y = 0; y < this.yMax; y++) {
        if(this.cells[x][y]) {
          this.cells[x][y].draw();
        }
      }
    }
  }


};