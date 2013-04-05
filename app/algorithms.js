var Algorithms = {
  checkBoard : function(board) {
    var removeCells = [];
    //Check rows
    for(var i = 0; i < board.yMax; i++) {
      var row = board.getRow(i);
      removeCells = removeCells.concat(Algorithms.checkRow(row));
    }

    // Check cols
    for(var i = 0; i < board.xMax; i++) {
      var col = board.getCol(i);
      removeCells = removeCells.concat(Algorithms.checkRow(col));
    }    
    
    return removeCells;
  },


  checkRow : function(row,start) {
    start = start || 0;
    var match_total;
    var tmp_matches = [];
    var total_matches = [];
    if(start > 0) {
      //check left
    }

    var match_cell = row[start];
    tmp_matches = [{x:match_cell.x,y:match_cell.y}];
    match_total = 1;

    for(var i = start+1; i < row.length; i++) {
      // If it matches
      if(match_cell.match(row[i])) {
        tmp_matches.push({x:row[i].x,y:row[i].y});
        match_total++;
      }
      else {
        //check if greater than 2
        if(match_total > 2) {
          //if so add to total_matches
          //console.log(tmp_matches);
          total_matches = total_matches.concat(tmp_matches);
        }
        match_total = 1;
        match_cell = row[i];
        tmp_matches = [{x:match_cell.x,y:match_cell.y}];
          
        // reset match_total and tmpMatches
      }
    }

    if(match_total > 2) {
      total_matches = total_matches.concat(tmp_matches);
    }

    return total_matches;
  },


};