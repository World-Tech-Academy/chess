'use strict';

function Piece(color,x,y){
  this.color = color;
  this.x = x;
  this.y = y;
  this.targets = [];
}
Piece.prototype = {
  //constructor: Piece,
  isOnBoard: function(x,y){
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  },
  move: function(x,y,undo){
    this.x = x;
    this.y = y;
  },
  setTargets: function(board){
    this.targets = this.getTargets(board);
  },
  getTargets: function(){
    return [];
  }
};

function Pawn(color,x,y){
  Piece.call(this, color, x, y);
  this.hasMoved = 0;
  this.img = color === 'white' ? '2659' : '265F';
  this.type = 'Pawn';
}
Pawn.prototype = new Piece();
Pawn.prototype.getTargets = function(board,color,kingCheck){
  var dir = this.color === 'white' ? -1 : 1;
  var targets = [];
  if(!board[this.x + (dir * 1)][this.y] && this.isOnBoard(this.x + (dir * 1),this.y)){
    targets.push({x:this.x + (dir * 1),y:this.y});
  }
  if(targets.length === 1 && !this.hasMoved && !board[this.x + (dir * 2)][this.y] && this.isOnBoard(this.x + (dir * 2),this.y)){
    targets.push({x:this.x + (dir * 2),y:this.y});
  }
  if(
      ((kingCheck && color && this.color !== color) && !board[this.x + (dir * 1)][this.y-1]) ||
      (board[this.x + (dir * 1)][this.y-1] && board[this.x + (dir * 1)][this.y-1].color !== this.color)
  ){
    targets.push({x:this.x + (dir * 1),y:this.y - 1});
  }
  if(
      ((kingCheck && color && this.color !== color) && !board[this.x + (dir * 1)][this.y + 1]) ||
      (board[this.x + (dir * 1)][this.y + 1] && board[this.x + (dir * 1)][this.y + 1].color !== this.color)
  ){
    targets.push({x:this.x + (dir * 1),y:this.y + 1});
  }
  return targets;
};
Pawn.prototype.move = function(x,y,undo){
  Piece.prototype.move.call(this,x,y,undo);
  this.hasMoved += undo ? -1 : 1;
};

function Rook(color,x,y){
  Piece.call(this, color, x, y);
  this.img = color === 'white' ? '2656' : '265C';
  this.type = 'Rook';
}
Rook.prototype = new Piece();
Rook.prototype.getTargets = function(board,color,kingCheck){
  var targets = [];
  for(var x = this.x + 1; x <= 7; x++){
    targets.push({x:x,y:this.y});
    if(board[x][this.y]){
      if(board[x][this.y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(x = this.x - 1; x >= 0; x--){
    targets.push({x:x,y:this.y});
    if(board[x][this.y]){
      if(board[x][this.y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(var y = this.y + 1; y <= 7; y++){
    targets.push({x:this.x,y:y});
    if(board[this.x][y]){
      if(board[this.x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(y = this.y - 1; y >= 0; y--){
    targets.push({x:this.x,y:y});
    if(board[this.x][y]){
      if(board[this.x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  return targets;
};

function Knight(color,x,y){
  Piece.call(this, color, x, y);
  this.img = color === 'white' ? '2658' : '265E';
  this.type = 'Knight';
}
Knight.prototype = new Piece();
Knight.prototype.getTargets = function(board,color,kingCheck){
  var targets = [];
  for(var i = -1; i < 2; i++){
    if(i === 0) continue;
    for(var j = -1; j < 2; j++){
      if(j === 0) continue;
      if(this.isOnBoard(this.x + i * 2,this.y + j) && (!board[this.x + i * 2][this.y + j] || board[this.x + i * 2][this.y + j].color !== this.color || kingCheck)){
        targets.push({x:this.x + i * 2,y:this.y + j});
      }
      if(this.isOnBoard(this.x + i,this.y + j * 2) && (!board[this.x + i][this.y + j * 2] || board[this.x + i][this.y + j * 2].color !== this.color || kingCheck)){
        targets.push({x:this.x + i,y:this.y + j * 2});
      }
    }
  }
  return targets;
};

function Bishop(color,x,y){
  Piece.call(this, color, x, y);
  this.img = color === 'white' ? '2657' : '265D';
  this.type = 'Bishop';
}
Bishop.prototype = new Piece();
Bishop.prototype.getTargets = function(board,color,kingCheck){
  var targets = [];
  for(var x = this.x + 1, y = this.y + 1; x <= 7 && y <= 7; x++, y++){
    targets.push({x:x,y:y});
    if(board[x][y]){
      if(board[x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(x = this.x + 1, y = this.y - 1; x <= 7 && y >= 0; x++, y--){
    targets.push({x:x,y:y});
    if(board[x][y]){
      if(board[x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(x = this.x - 1, y = this.y + 1; x >= 0 && y <= 7; x--, y++){
    targets.push({x:x,y:y});
    if(board[x][y]){
      if(board[x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  for(x = this.x - 1, y = this.y - 1; x >= 0 && y >= 0; x--, y--){
    targets.push({x:x,y:y});
    if(board[x][y]){
      if(board[x][y].color === this.color && !kingCheck){
        targets.pop();
      }
      break;
    }
  }
  return targets;
};

function Queen(color,x,y){
  Piece.call(this, color, x, y);
  this.img = color === 'white' ? '2655' : '265B';
  this.type = 'Queen';
}
Queen.prototype = new Piece();
Queen.prototype.getTargets = function(board,color,kingCheck){
  var linear = Rook.prototype.getTargets.call(this,boardState,color,kingCheck);
  var diagonal = Bishop.prototype.getTargets.call(this,boardState,color,kingCheck);
  return linear.concat(diagonal);
};

function King(color,x,y){
  Piece.call(this, color, x, y);
  this.img = color === 'white' ? '2654' : '265A';
  this.turn = true;
  this.type = 'King';
}
King.prototype = new Piece();
King.prototype.getTargets = function(board,color,kingCheck){
  var targets = [];
  for(var i = -1; i <= 1; i++){
    for(var j = -1; j <= 1; j++){
      if(i === 0 && j === 0) continue;
      if(this.isOnBoard(this.x + i, this.y + j) &&
        (!board[this.x + i][this.y + j] ||
          board[this.x + i][this.y + j].color !== this.color ||
          (color && this.color !== color)
        )
      ){
        targets.push({x:this.x + i,y: this.y + j});
      }
    }
  }
  if(!kingCheck){
    var checks = this.getChecks(board,color);
    for(var k = 0; k < targets.length; k++){
      for(var l = 0; l < checks.length; l++){
        if(targets[k].x === checks[l].x && targets[k].y === checks[l].y){
          targets.splice(k,1);
          k--;
          break;
        }
      }
    }
  }
  return targets;
};
King.prototype.getChecks = function(board,color){
  var checks = [];
  for(var i = 0; i <= 7; i++){
    for(var j = 0; j <= 7; j++){
      if(board[i][j] && board[i][j].color !== this.color){
        checks = checks.concat(board[i][j].getTargets(board,color,true));
      }
    }
  }
  return checks;
};

var boardState = [[
  new Rook('black',0,0),
  new Knight('black',0,1),
  new Bishop('black',0,2),
  new Queen('black',0,3),
  new King('black',0,4),
  new Bishop('black',0,5),
  new Knight('black',0,6),
  new Rook('black',0,7)
],[
  new Pawn('black',1,0),
  new Pawn('black',1,1),
  new Pawn('black',1,2),
  new Pawn('black',1,3),
  new Pawn('black',1,4),
  new Pawn('black',1,5),
  new Pawn('black',1,6),
  new Pawn('black',1,7)
],
new Array(8),
new Array(8),
new Array(8),
new Array(8),
[
  new Pawn('white',6,0),
  new Pawn('white',6,1),
  new Pawn('white',6,2),
  new Pawn('white',6,3),
  new Pawn('white',6,4),
  new Pawn('white',6,5),
  new Pawn('white',6,6),
  new Pawn('white',6,7)
],[
  new Rook('white',7,0),
  new Knight('white',7,1),
  new Bishop('white',7,2),
  new Queen('white',7,3),
  new King('white',7,4),
  new Bishop('white',7,5),
  new Knight('white',7,6),
  new Rook('white',7,7)
]];

function createBoard(){
  var board = document.getElementById('chess-board');
  for(var i = 0, color, row; i < 8; i++){
    row = document.createElement('div');
    row.classList.add('row');
    for(var j = 0, cell, text; j < 8; j++){
      color = (i + j) % 2 === 0 ? 'white-cell' : 'black-cell';
      cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add(color);
      if(boardState[i][j]){
        text = document.createTextNode(String.fromCharCode(parseInt(boardState[i][j].img, 16)));
        cell.appendChild(text);
      }
      else{
        text = document.createTextNode('');
      }
      cell.appendChild(text);
      cell.setAttribute('onclick','clickCell(' + i + ',' + j + ')');
      cell.setAttribute('id','x' + i + 'y' + j);
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

function placePiece(piece,x,y){
  var cell = getCell(x,y);
  var text = cell.childNodes[0];
  cell.removeChild(text);
  text = document.createTextNode(piece ? String.fromCharCode(parseInt(piece.img, 16)) : '');
  cell.appendChild(text);
}

function removePiece(x,y){
  var cell = getCell(x,y);
  cell.removeChild(cell.childNodes[0]);
  cell.appendChild(document.createTextNode(''));
}

function movePiece(piece,x,y,clearRedo){
  if(clearRedo) redoStack = [];
  pushToHistory({
    type: piece.type,
    color: turn,
    fromx: piece.x,
    fromy: piece.y,
    tox:x,
    toy:y,
    capture: boardState[x][y]
  });
  boardState[piece.x][piece.y] = null;
  removePiece(piece.x,piece.y);
  piece.move(x,y);
  boardState[x][y] = piece;
  placePiece(piece,x,y);
  toggleTurn();
}

var turn = 'white';
var selectedPiece;
var targets = [];

function toggleTurn(){
  turn = turn === 'white' ? 'black' : 'white';
  selectedPiece = null;
}

function clickCell(x,y){
  console.log('x',x,'y',y);
  var piece = boardState[x][y];
  if(piece && piece.color === turn){
    selectCell(x,y);
  }
  else if(selectedPiece && isTarget(x,y)){
    setSelection(false);
    movePiece(selectedPiece,x,y,true);
  }
}

function isTarget(x,y){
  for(var i = 0; i < targets.length; i++){
    if(targets[i].x === x && targets[i].y === y){
      return true;
    }
  }
  return false;
}

function selectCell(x,y){
  if(selectedPiece){
    setSelection(false);
  }
  selectedPiece = boardState[x][y];
  targets = selectedPiece.getTargets(boardState,turn);
  setSelection(true);
}

function setSelection(add){
  select(add);
  for(var i = 0, cell; i < targets.length; i++){
    cell = targets[i];
    getCell(cell.x,cell.y).classList[add ? 'add' : 'remove']('target');
  }
}

function select(add){
  if(!selectedPiece) return;
  var cell = getCell(selectedPiece.x,selectedPiece.y);
  var action = add ? 'add' : 'remove';
  cell.classList[action]('selected');
}

function getCell(x,y){
  return document.getElementById('x'+x+'y'+y);
}

var stack = [];
var redoStack = [];

function pushToHistory(hist){
  var horizontal = ['A','B','C','D','E','F','G','H'];
  var vertical = [8,7,6,5,4,3,2,1];
  hist.fromHorizontal = horizontal[hist.fromy];
  hist.fromVertical = vertical[hist.fromx];
  hist.toHorizontal = horizontal[hist.toy];
  hist.toVertical = vertical[hist.tox];
  stack.push(hist);
  var text = document.createTextNode(
    hist.color + ' ' + hist.type + ' at ' + hist.fromHorizontal + hist.fromVertical +
    (hist.capture ? ' captures ' + hist.capture.color + ' ' + hist.capture.type + ' at ' : ' moves to ') +
    hist.toHorizontal + hist.toVertical
  );
  var li = document.createElement('li');
  li.appendChild(text);
  document.getElementById('history').appendChild(li);
}

function popHistory(){
  if(stack.length === 0) return;
  setSelection(false);
  var history = document.getElementById('history');
  var record = history.childNodes[history.childNodes.length - 1];
  if(!record) return;
  history.removeChild(record);
  var curr = stack[stack.length-1];
  toggleTurn();
  var piece = boardState[curr.tox][curr.toy];
  boardState[piece.x][piece.y] = null;
  removePiece(piece.x,piece.y);
  if(curr.capture){
    placePiece(curr.capture,curr.capture.x,curr.capture.y);
    boardState[curr.tox][curr.toy] = curr.capture;
  }
  piece.move(curr.fromx,curr.fromy,true);
  boardState[curr.fromx][curr.fromy] = piece;
  placePiece(piece,curr.fromx,curr.fromy);

  redoStack.push(curr);
  stack.pop();
}

function redoHistory(){
  if(redoStack.length === 0) return;
  var curr = redoStack[redoStack.length - 1];
  var piece = boardState[curr.fromx][curr.fromy];
  if(curr.capture){
    boardState[curr.capture.x][curr.capture.y] = curr.capture;
  }
  movePiece(piece,curr.tox,curr.toy,false);
  redoStack.pop();
}

function KeyPress(e){
  var evtobj = window.event ? event : e;
  if(evtobj.keyCode === 90 && evtobj.ctrlKey){
    popHistory();
  }
  else if(evtobj.keyCode === 89 && evtobj.ctrlKey){
    redoHistory();
  }
}

document.onkeydown = KeyPress;
