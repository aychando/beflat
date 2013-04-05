$(function(){
  var context = $("#game").attr({
    width:400,
    height:400
  })[0].getContext('2d');
  var width = 400,
      height = 400,
      gridSpace = 40,
      board = [];

  var score = 0;
  var currentSelection = [];
  var renderer = new Renderer(context,width,height,gridSpace);
  var shapeTypes = [
    renderer.drawEmpty.bind(renderer),
    renderer.drawSquare.bind(renderer),
    renderer.drawTriangle.bind(renderer),
    renderer.drawCircle.bind(renderer),
    renderer.drawDiamond.bind(renderer),
    renderer.drawActualDiamond.bind(renderer)
  ]
  function initBoard() {
    for(var x = 0; x < width/gridSpace; x++) {
      board[x] = [];
      for(var y = 0; y < height/gridSpace; y++) {
        board[x][y] = Math.floor(Math.random()*(shapeTypes.length-1)) + 1;
      }
    }
  }
  

  function drawGame() {
    renderer.drawGrid();

    for(var i = 0; i < currentSelection.length; i++) {
      renderer.drawHighlight(currentSelection[i].x*gridSpace,currentSelection[i].y*gridSpace);
    }

    for(var x = 0; x < width/gridSpace; x++) {
      for(var y = 0; y < height/gridSpace; y++) {
        shapeTypes[board[x][y]](x*gridSpace+5, y*gridSpace+5, gridSpace-10, gridSpace-10);
      }
    }  
  }

  function addToScore(points) {
    score += points;
    $('#score').html(score);
  }

  function clearSelection() {
    currentSelection = [];
  }

  function highlightCell(x,y) {
    var xCoord = x*gridSpace,
        yCoord = y*gridSpace;

    if(currentSelection.length > 0 && (currentSelection.length > 1 || !isNeighbor(currentSelection[0].x*gridSpace,currentSelection[0].y*gridSpace,xCoord,yCoord))) {
      clearSelection();
    }
    currentSelection.push({
      x: x,
      y: y
    });
  }

  function shiftCol(x,y) {
    for(var col = y; col > 0; col--) {
      board[x][col] = board[x][col-1];
    }

    board[x][0] = Math.floor(Math.random()*(shapeTypes.length-1)) + 1;
  }

  function isNeighbor(x1,y1,x2,y2) {
    if(Math.abs(x1-x2)/gridSpace  === 1 && Math.abs(y1-y2)/gridSpace === 0) {
      return true;
    }
    if(Math.abs(y1-y2)/gridSpace === 1 && Math.abs(x1-x2)/gridSpace  === 0) {
      return true;
    }

    return false;
  }

  function checkBoard() {
    var matches = 0;

    for(var x = 0; x < width/gridSpace; x++) {
      for(var y = 0; y < height/gridSpace; y++) {
        console.log(x+":"+y)
        furthest = checkRow(x,y);
        x = furthest.rightMostIndex;
        if(furthest.found) {
          addToScore(furthest.matches.length);
          for(var i = 0; i < furthest.matches.length; i++) {
            renderer.drawHighlight(furthest.matches[i].x*gridSpace, furthest.matches[i].y*gridSpace)
            var tmpX = furthest.matches[i].x,
                tmpY = furthest.matches[i].y;
            //board[furthest.matches[i].x][furthest.matches[i].y] = 0;
            setTimeout(function(){
              console.log(this.x+"="+this.y)
              shiftCol(this.x,this.y);
              renderer.clearCanvas();
              drawGame();
            }.bind({x:tmpX,y:tmpY}),1000)
          }
          matches++;
        }
        //checkCol(x,y)
      }
    }
    return matches;
  }

  function checkRow(x,y) {
    matches = [
      {
        x:x,
        y:y
      }
    ];

    var rightMostIndex = x,
        found = false;
    //Check right
    for(var curX = x+1; curX < width/gridSpace; curX++) {
      console.log(curX)
      if(board[curX][y] === board[x][y]){
        matches.push({
          x: curX,
          y: y
        })
        rightMostIndex = curX;
      }
      else {
        break;
      }
    }

    for(var curX = x-1; curX > -1; curX--) {
      if(board[curX][y] === board[x][y]){
        matches.push({
          x: curX,
          y: y
        })
      }
      else {
        break;
      }
    }

    if(matches.length > 2) {
      found = true;
    }
    return {found: found, rightMostIndex: rightMostIndex, matches: matches};
  }

  function checkCol(x,y) {
    rowCount = 1;

    //Check right
    for(var curY = y+1; curY < (height/gridSpace) + 1; curY++) {
      if(board[x][curY] === board[x][y]){
        matches.push({
          x: x,
          y: curY
        })
      }
      else {
        break;
      }
    }

    for(var curY = y-1; curY > -1; curY--) {
      if(board[x][curY] === board[x][y]){
         matches.push({
          x: x,
          y: curY
        })
      }
      else {
        break;
      }
    }


    return matches;
  }

  function validMove() {
    if(checkBoard() > 0) {
      return true;
    }
    
    return false;
  }

  // Need new name
  function checkSwitch() {
    if(currentSelection.length == 2) {
      switchCell();
      console.log(currentSelection)

      if(validMove()){
        clearSelection();  
      }
      else {
        setTimeout(function(){
          switchCell();
          renderer.clearCanvas();
          drawGame();
        },500);
      }
    }
  }

  function switchCell() {
    var tmpSelection = board[currentSelection[0].x][currentSelection[0].y];
    board[currentSelection[0].x][currentSelection[0].y] = board[currentSelection[1].x][currentSelection[1].y];
    board[currentSelection[1].x][currentSelection[1].y] = tmpSelection;
  }



  initBoard();
  drawGame();

  $('body').on('click', function(e){
    if($(e.target).attr('id') !== 'game') {
      renderer.clearCanvas();
      clearSelection();
      drawGame();  
    }
  });

  $('#game').on('click', function(e){
    renderer.clearCanvas();
    // Get coords and draw highlight

    var offset = $(this).offset();
    var x = Math.floor((e.clientX - offset.left)/gridSpace),
        y = Math.floor((e.clientY - offset.top)/gridSpace);
    //shiftCol(x,y);
    
    highlightCell(x,y);
    checkSwitch();
    drawGame();
  });

//highlightCell(160,160);
})