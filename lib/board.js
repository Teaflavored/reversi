  var Piece = require("./piece");
//array function to add array elements in place
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
      grid[i].push(undefined)
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
  if (!this.isValidPos(pos)){
    throw new Error("Not a valid Position!")
  }
  var row = pos[0];
  var col = pos[1];

  return this.grid[row][col];
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
  if (!this.getPiece(pos)){
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

  var newPos = pos.addInPlace(dir)

  if(!board.isValidPos(newPos)){
    //if the position is not on board
    return null;
  } else if (!board.isOccupied(newPos)){
    //if the position is not occupied (no piece there)
    return null;
  } else if (board.isMine(newPos, color)) {
    //if the piece is mine
    if (piecesToFlip.length === 0){
      return null;
    } else {
      return piecesToFlip;
    }
  } else {
    piecesToFlip.push(newPos)
    return _positionsToFlip(board, newPos, color, dir, piecesToFlip)
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
    //place the piece if it's a valid move
    this.grid[row][col] = new Piece(color);
  }

  var allPieces = []

  for(var i = 0; i < Board.DIRS.length; i++){
    var piecesInDir = _positionsToFlip(this, pos, color, Board.DIRS[i], []);
    if (piecesInDir){
      allPieces = allPieces.concat(piecesInDir);
    }
  }

  for(var i = 0; i < allPieces.length; i++){
    this.getPiece(allPieces[i]).flip();
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for(var i = 0; i < 8; i++){
    var row = "";
    for(var j = 0; j < 8; j++){
      piece = this.getPiece([i, j]);

      if (piece){
        row += (piece.toString() + "|");
      } else {
        row += " |";
      }

    }
    console.log(row);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)){
    return false
  }

  for(var i = 0; i < Board.DIRS.length; i++){
    var piecesToFlipInDir = _positionsToFlip(this, pos, color, Board.DIRS[i], []);
    if (piecesToFlipInDir){
      return true;
    }
  }
  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  var valid_positions = [];
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      if (this.validMove([i, j], color)){
        valid_positions.push([i, j]);
      }
    }
  }
  return valid_positions;
};

module.exports = Board;
