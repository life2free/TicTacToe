/* 
Board starts of clear (no one has cllicked anything)
Player 1 clicks on a square
1. Check whether or not square already has been clicked 
2. If square has been clicked, then player can not be able to click it again and change it's color.
3. If square has not been clicked, execute function to color square and check the player is win the game or not
  1) If the player win the game, then game is over and the player get 1 score.
  2) If the player doesn't win the game now, then check have all of the squares been filled in.
    a) If all the squares are filled in and no player has won yet, display a message saying it's a tie.
    b) If some of squares are not filled in, then move to next player's turn 
*/

const timeOut = 2000;

const diagonalSquaresIndex = [
  [2, 4, 6],
  [0, 4, 8]
];

const scores = [0, 0];

const resetButton = document.querySelector(".reset-button");
const squares = document.querySelectorAll(".square");
const currentPlayer = document.querySelector(".player-name");
const redPlayerScore = document.querySelector(".redplayer-score");
const bluePlayerScore = document.querySelector(".blueplayer-score");
const gameResult = document.querySelector(".game-result");
let playerTurn = 0;

function squareClicked(e) {
  let square = e.target;
  let alreadyClicked = square.dataset.clicked !== "-1";
  if (alreadyClicked) {
    console.log("You must select a different square");
  } else {
    // let squareIndex = square.dataset.index;
    if (playerTurn == 0) {
      playerClickedHandle(
        square,
        playerTurn,
        "Red",
        "Blue",
        "redPlayerClicked",
        redPlayerScore,
        "redPlayerColor",
        "bluePlayerColor"
      );
    } else if (playerTurn == 1) {
      playerClickedHandle(
        square,
        playerTurn,
        "Blue",
        "Red",
        "bluePlayerClicked",
        bluePlayerScore,
        "bluePlayerColor",
        "redPlayerColor"
      );
    }
  }
}

function playerClickedHandle(
  square,
  player,
  currentPlayerName,
  nextPlayerName,
  clickedStyle,
  playerScoreEle,
  currentPlayerColorStyle,
  nextPlayerColorStyle
) {
  let squareIndex = square.dataset.index;
  square.dataset.clicked = player;
  square.classList.add(clickedStyle);
  let isWin = checkIsWin(squareIndex, player);
  if (isWin) {
    scores[parseInt(player)]++;

    playerScoreEle.innerText = scores[parseInt(player)];
    let info = `${currentPlayerName} player has won the game!`;
    gameResult.innerText = info;
    gameResult.classList.add(currentPlayerColorStyle);
    console.log(info);
    squares.forEach(val => val.removeEventListener("click", squareClicked));
    setTimeout(function() {
      resetGame();
    }, timeOut);
  } else {
    let isAllFilled = checkIfAllClicked();
    if (isAllFilled) {
      gameResult.innerText = "The game is a tie!";
      console.log("The game is a tie");
      setTimeout(function() {
        resetGame();
      }, timeOut);
    } else {
      playerTurn = 1 - player;
      currentPlayer.innerText = nextPlayerName;
      currentPlayer.classList.remove(currentPlayerColorStyle);
      currentPlayer.classList.add(nextPlayerColorStyle);
    }
  }
}

function resetGame() {
  console.log("Resetting game");
  currentPlayer.innerText = "Red";
  currentPlayer.classList.remove("bluePlayerColor");
  currentPlayer.classList.add("redPlayerColor");
  gameResult.classList.remove("redPlayerColor");
  gameResult.classList.remove("bluePlayerColor");
  gameResult.innerText = "";
  playerTurn = "0";
  squares.forEach(val => {
    val.dataset.clicked = "-1";
    val.classList.remove("redPlayerClicked");
    val.classList.remove("bluePlayerClicked");
    val.addEventListener("click", squareClicked);
  });
}

function checkIsWin(index, player) {
  let indexNum = parseInt(index);
  let isWinByRow = checkIsWinByRow(indexNum, player);
  if (isWinByRow) return true;

  let isWinByColumn = checkIsWinByColumn(indexNum, player);
  if (isWinByColumn) return true;

  return checkIsWinByDiagonal(indexNum, player);
}

function checkIsWinByRow(index, player) {
  let rowIndex = Math.floor(index / 3);
  let tempIndex1 = index + 1;
  let index1 = rowIndex * 3 + (tempIndex1 % 3);
  let tempIndex2 = index + 2;
  let index2 = rowIndex * 3 + (tempIndex2 % 3);
  return checkIsWinByArray([index, index1, index2], player);
}

function checkIsWinByColumn(index, player) {
  let checkArray = [index, (index + 3) % 9, (index + 6) % 9];
  return checkIsWinByArray(checkArray, player);
}

function checkIsWinByDiagonal(index, player) {
  if (index == 4) {
    let isWin = checkIsWinByArray(diagonalSquaresIndex[0], player);
    if (isWin) return true;
    return checkIsWinByArray(diagonalSquaresIndex[1], player);
  } else {
    if (diagonalSquaresIndex[0].includes(index)) {
      return checkIsWinByArray(diagonalSquaresIndex[0], player);
    }
    if (diagonalSquaresIndex[1].includes(index)) {
      return checkIsWinByArray(diagonalSquaresIndex[1], player);
    }
  }
  return false;
}

function checkIsWinByArray(array, player) {
  let square1 = squares[array[0]].dataset.clicked == player;
  let square2 = squares[array[1]].dataset.clicked == player;
  let square3 = squares[array[2]].dataset.clicked == player;
  return (playerHasWon = square1 && square2 && square3);
}

function checkIfAllClicked() {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].dataset.clicked == "-1") {
      return false;
    }
  }
  return true;
}

function init() {
  squares.forEach((val, index) => {
    val.dataset.index = index;
    val.dataset.clicked = "-1";
    val.addEventListener("click", squareClicked);
  });
  currentPlayer.innerText = "Red";
  currentPlayer.classList.add("redPlayerColor");
}

resetButton.addEventListener("click", resetGame);
window.onload = init;
