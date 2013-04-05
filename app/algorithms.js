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


  checkRow : function(row,user_start) {
    start = user_start || 0;
    var match_total = 0;
    var tmp_matches = [];
    var total_matches = [];

    var match_cell = row[start];
    tmp_matches = [{x:match_cell.x,y:match_cell.y}];
    match_total = 1;

    if(user_start) {
      //check left
      for(var i = start-1; i >= 0; i--) {
        if(match_cell.match(row[i])) {
          match_total++;
        }
        else {
          break;
        }
      }
    }

    for(var i = start+1; i < row.length; i++) {
      // If it matches
      if(match_cell.match(row[i])) {
        tmp_matches.push({x:row[i].x,y:row[i].y});
        match_total++;
      }
      else {
        //redo
        if(user_start) {
          if(match_total > 2) return true;
          return false;
        }
        //check if greater than 2
        if(match_total > 2) {
          //if so add to total_matches
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

    if(user_start) {
      if(match_total > 2) return true;
      return false;
    }
    return total_matches;
  },

  validMove : function(board,selected) {
    
    for(var i = 0; i < selected.length; i++) {
      //check col
      var col = board.getCol(selected[i].x);
      var check = Algorithms.checkRow(col,selected[i].y);
      if(check) {
        return true;
      }
      //check row
      var row = board.getRow(selected[i].y);
      check = Algorithms.checkRow(row,selected[i].x);
      if(check) {
        return true;
      }
    }
    return false;
  }

};