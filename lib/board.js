  var Piece = require("./piece");

Array.prototype.addInPlace = function(otherArr){
  var newArr = []
  for(var i = 0; i < this.length; i++){
    newArr[i] = this[i] + otherArr[i]
  }
  return newArr
}

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  var grid = []
  
  for(var i = 0; i < 8; i++){
    grid[i] = []
    for(var k = 0; k < 8; k++){
      grid[i][k] = undefined
    }
  }
  grid[3][4] = new Piece("black")
  grid[4][3] = new Piece("black")
  grid[3][3] = new Piece("white")
  grid[4][4] = new Piece("white")
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  var x = pos[0];
  var y = pos[1];
  
  return this.grid[x][y];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  for(var i = 0; i < 8; i++){
    for(var k = 0; k < 8; k++){
      if(!this.grid[i][k]){
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Checks if every position on the Board is occupied.
 */
Board.prototype.isFull = function () {

  return !this.hasMove();
  
  
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (!this.isOccupied(pos)){
    return false;
  } else{
    return this.getPiece(pos).color === color
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.getPiece(pos)){
    return true;
  } else{
    return false;
  }
  
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  var whiteMoveLeft = this.hasMove("white");
  var blackMoveLeft = this.hasMove("black");
  return !whiteMoveLeft && !blackMoveLeft 
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  var row = pos[0];
  var col = pos[1];
  var rowCheck = row >= 0 && row <= 7;
  var colCheck = col >= 0 && col <= 7;
  return rowCheck && colCheck;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  
  var new_pos = pos.addInPlace(dir)
  
  if (!board.isOccupied(new_pos)){
    if (piecesToFlip.length === 0){
      return null;
    } else{
      return piecesToFlip
    }
  }
  // var flag = _positionsToFlip(board, new_pos, color, dir, piecesToFlip)
  else if (board.getPiece(new_pos).color !== color ){
    piecesToFlip.push(board.getPiece(new_pos));
    return _positionsToFlip (board, new_pos, color, dir, piecesToFlip);
  }
  else {
    if (piecesToFlip.length === 0){
      return null;
    } else{
      return piecesToFlip
    }
  }

}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  var row = pos[0];
  var col = pos[1];
  if (!this.validMove(pos, color)){
    throw new Error("Invalid Move")
  } else {
    this.grid[row][col] = new Piece(color);
    // console.log(this.grid[row][col])
  }
  var allPieces = []
  
  for(var i = 0; i < Board.DIRS.length; i++){
    var piecesInDir = _positionsToFlip(this, pos, color, Board.DIRS[i], []);
    if (piecesInDir){
      allPieces = allPieces.concat(piecesInDir);
    }
  }
  for(var i = 0; i < allPieces.length; i++){
    allPieces[i].flip();
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  
  x = pos[0];
  y = pos[1];
  if(this.grid[x][y]){
    return false;
  }
  
  var allPieces = []
  
  for(var i = 0; i < Board.DIRS.length; i++){
    var a = _positionsToFlip(this, pos, color, Board.DIRS[i], []);
    console.log(a);
    var piecesInDir = a;
    // console.log(piecesInDir)
    if (piecesInDir){
      allPieces = allPieces.concat(piecesInDir);
        // console.log(allPieces)
    }
  }

  if (allPieces.length === 0){
    return false;
  } else {
    return true;    
  }

};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
};

module.exports = Board;
