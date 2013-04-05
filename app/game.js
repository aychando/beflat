var Game = {
  width   : 400,
  height  : 400,
  gridSpace : 40,
  score     : 0,
  selectedCells : [],
  board : [],
  shapes : [
    'square',
    'circle',
    'triangle',
    'diamond',
    'realDiamond'
  ],


  init : function() {
    this.$canvas = $('#game');
    this.$score = $('#score');
    this.initCanvas();
    this.initRenderer();
    this.initEvents();
    this.initBoard();

    this.start();
  },

  initCanvas : function() {
    // Set Size
    this.$canvas.attr({
      height: this.height,
      width:  this.width
    });
    $('#container').attr('width',this.width);
    // Set Context
    this.context = this.$canvas[0].getContext('2d');
  },

  initRenderer : function() {
    this.renderer = new Renderer(this.context, this.width, this.height, this.gridSpace);
  },


  initBoard : function() {
    
    var types = {
      square : {
        name : 'square',
        draw : this.renderer.drawShape.bind(this.renderer,this.renderer.drawSquare.bind(this.renderer))
      },
      circle : {
        name : 'circle',
        draw : this.renderer.drawShape.bind(this.renderer,this.renderer.drawCircle.bind(this.renderer))
      },
      triangle : {
        name : 'triangle',
        draw : this.renderer.drawShape.bind(this.renderer,this.renderer.drawTriangle.bind(this.renderer))
      },
      diamond : {
        name : 'diamond',
        draw : this.renderer.drawShape.bind(this.renderer,this.renderer.drawDiamond.bind(this.renderer))
      },
      realDiamond : {
        name : 'realDiamond',
        draw : this.renderer.drawShape.bind(this.renderer,this.renderer.drawActualDiamond.bind(this.renderer))
      },
    };

    this.board = new Board(this.width,this.height,this.gridSpace);
    this.board.setCellFactory(CellFactory);
    this.board.setShapes(types);
    this.board.init();
  },


  start : function() {
    this.score = 0;
    this.checkForMatches(this.drawGame.bind(this));
  },

  drawGame : function() {
    this.renderer.clearCanvas();
    this.renderer.drawGrid();
    this.board.draw();
    // this.drawSelections();
    // this.drawCells();
    this.drawScore();
  },

  drawScore : function() {
    this.$score.html(this.score);
  },

  checkForMatches : function(cb) {
    var matches = Algorithms.checkBoard(this.board);
    this.board.highlightCells(matches);
    this.board.setMatches(matches);
    this.incrementScore(matches.length);
    cb();
    setTimeout(function() {
        this.board.removeCells(matches);
        this.drawGame();
        if(matches.length > 0) {
          this.checkForMatches(cb);
        }
      }.bind(this),350);
  },

  incrementScore : function(increment) {
    this.score += increment;
    this.drawScore();
  },

  addSelection : function(x,y) {
    // if(this.selectedCells.length == 1 && !this.selectedCells[0].isNeighbor(cell.x,cell.y)) {
    //   this.clearSelection();
    // }
    if(this.selectedCells.length == 1 && !this.board.neighbors(this.selectedCells[0],{x:x,y:y})) {
      this.clearSelection();
    }

    if(this.board.highlightCell(x,y)) {
      this.selectedCells.push({x:x,y:y});  
    }
    
    if(this.selectedCells.length == 2) {
      
      this.board.switchCells(this.selectedCells[0],this.selectedCells[1]);
      this.checkForMatches(this.drawGame.bind(this));

      setTimeout(function() {
        this.clearSelection();
        this.drawGame();
      }.bind(this),350);
    }
    this.drawGame();
  },

  clearSelection : function() {
    for(var i = 0; i < this.selectedCells.length; i++) {
      this.board.unhighlightCell(this.selectedCells[i].x,this.selectedCells[i].y)
    }
    this.selectedCells = [];
  },

  initEvents : function() {
    $('body').on('click', function(e){
      if($(e.target).attr('id') !== 'game') {
        this.clearSelection();
        this.drawGame();
      }
    }.bind(this));

    $('#game').on('click', function(e){
      
      var offset = $(e.target).offset();
      var x = Math.floor((e.clientX - offset.left)/this.gridSpace),
          y = Math.floor((e.clientY - offset.top)/this.gridSpace);

      if(x < this.board.xMax && x >= 0 && y < this.board.yMax && y >= 0){
        // var selectedCell = new Cell(x,y,'',{size:this.gridSpace});

        this.addSelection(x,y);  
      }
    }.bind(this));

    $("#restart").on('click',function(){
      this.init();
      return false;
    }.bind(this));
  }


};