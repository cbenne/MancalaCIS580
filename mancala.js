var turn = 0;
var playertokens = [
  0,0,0
];
var board = [
  [1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2],[1,1,2]
];
var boardscore = [
  [0,0,0],
  [0,0,0]
];
var marbleworth = [
  3,2,1
];
var gameover = false;

function animate(token, top, left) {
  var y = parseInt(token.style.top);
  var x = parseInt(token.style.left);
  if (y < top) {
    y += 10;
  } else {
    y -= 10;
  }
  if (x < left) {
    x += 10;
  } else {
    x -= 10;
  }

  if ((Math.abs(top - y) < 10) && (Math.abs(left - x) < 10)) {
    token.style.top = top + "px";
    token.style.left = left + "px";
    return;
  }
  if (!(Math.abs(top - y) < 10)) {
    token.style.top = y + "px";
  }
  if (!(Math.abs(left - x) < 10)) {
    token.style.left = x + "px";
  }

  setTimeout(function() {animate(token, top, left);}, 16);
}

function deletetokens(cellno) {
  var node = document.getElementById("Cell"+cellno);
  while (node.firstElementChild) {
    //var mover = document.getElementById("MovingToken");
    //node.firstElementChild.className = "token movable";
    var current = node.firstElementChild.getBoundingClientRect();
    var offsets = document.getElementById('player0gold').getBoundingClientRect();
    var top = offsets.top;
    var left = offsets.left;
    var thing = node.firstElementChild;
    animate(thing, top, left);
    console.log("Child removed from Cell"+cellno)
    node.firstElementChild.remove();
  }
}

function addtoken(cellno,tokentype) {
  console.log("Adding type " + tokentype + "to Cell" + cellno);
  var val = board[cellno][tokentype];
  val++;
  board[cellno][tokentype] = val;
  var n = document.getElementById("Cell"+cellno);
  var newdiv = document.createElement('div');
  newdiv.id = 'token';
  if (tokentype === 0) {
    newdiv.className = "token gold";
  }
  else if (tokentype === 1) {
    newdiv.className = "token silver";
  }
  else {
    newdiv.className = "token bronze";
  }
  n.appendChild(newdiv);
  //newdiv.style.display = "block";
}

function makeinactive() {
  for (var i = (turn * 6); i < (turn * 6 + 6); i++) {
    document.getElementById("Cell" + i).className = "cell";
  }
}

function makeactive() {
  for (var i = (turn * 6); i < (turn * 6 + 6); i++) {
    if (board[i][0] || board[i][1] || board[i][2]) {
      document.getElementById("Cell" + i).className = "cell active";
    }
  }
}

function gamecheck() {
  gameover = true;
  var i = 0;
  var j = 0;
  for (i = (turn  * 6); i < (turn * 6 + 6); i++) {
    if (board[i][0] || board[i][1] || board[i][2]) {
      gameover = false;
    }
  }

  if (gameover) {
    for (i = 0; i < 12; i++) {
      turn = (turn + 1) % 1;
      var l = 0;
      deletetokens(i);
      while (board[i][0] > 0) {
        addmancala(0);
        board[i][0]--;
      }
      while (board[i][1] > 0) {
        addmancala(1);
        board[i][1]--;
      }
      while (board[i][2] > 0) {
        addmancala(2);
        board[i][2]--;
      }
    }
    player1score = (boardscore[0][0])*3 + (boardscore[0][1])*2 + (boardscore[0][2]);
    player2score = (boardscore[1][0])*3 + (boardscore[1][1])*2 + (boardscore[1][2]);
    if (player2score > player1score) {
      document.getElementById("GameHead").innerHTML = "Player 2 Wins";
    } else {
      document.getElementById("GameHead").innerHTML = "Player 1 Wins";
    }

    return true;
  } else {
    return false;
  }

}

function addmancala(tokentype) {
  var val = boardscore[turn][tokentype];
  val++;
  boardscore[turn][tokentype] = val;
  var n = document.getElementById("Mancala"+turn);
  var newdiv = document.createElement('div');
  newdiv.id = 'token';
  newdiv.style.transition = "all 2s"
  if (tokentype === 0) {
    newdiv.className = "token gold";
  }
  else if (tokentype === 1) {
    newdiv.className = "token silver";
  }
  else {
    newdiv.className = "token bronze";
  }
  newdiv.style.display = "none";
  n.appendChild(newdiv);
  newdiv.style.display = "block";
  var curscore = (boardscore[turn][0])*(3) + (boardscore[turn][1])*(2) + boardscore[turn][2];
  document.getElementById("Player" + turn + "Score").innerHTML = "Score: " + curscore;
}

function movetokens(id) {
  if (Math.floor(id/6) != turn || !(board[id][0] || board[id][1] || board[id][2]) || gameover) {
    return;
  }
  playertokens = board[id];
  board[id] = [0,0,0];
  deletetokens(id);
  console.log(id);
  while((playertokens[0] > 0) || (playertokens[1] > 0) || (playertokens[2] > 0)) {
    id++;
    id = id % 12;
    if ((id === 6 && turn === 0) || (id === 0 && turn === 1)) {
      if ((playertokens[0])) {
        addmancala(0);
        playertokens[0]--;
      }
      else if ((playertokens[1])) {
        addmancala(1);
        playertokens[1]--;
      }
      else {
        addmancala(2);
        playertokens[2]--;
      }

      if (!((playertokens[0] > 0) || (playertokens[1] > 0) || (playertokens[2] > 0))) {
        makeinactive();
        if (!(gamecheck())) {
          makeactive();
        }
        return;
      }
    }


    if ((playertokens[0])) {
      addtoken(id,0);
      playertokens[0]--;
    }
    else if ((playertokens[1])) {
      addtoken(id,1);
      playertokens[1]--;
    }
    else {
      addtoken(id,2);
      playertokens[2]--;
    }
  }
  document.getElementById("Player" + turn).className = "player inactive";
  makeinactive();
  turn = (turn + 1) % 2;
  makeactive();
  document.getElementById("Player" + turn).className = "player active";
  gamecheck();
}


for(var i = 0; i < 12; i++) {
  const cel = i;
  console.log("Setting event listener on cell" + cel )
  document.getElementById("Cell" + cel)
    .addEventListener('click', function(event) {
      event.preventDefault();
      movetokens(cel);
    });
}
