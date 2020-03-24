/* 
Board starts of clear (no one has cllicked anything)
Player 1 clicks on a square
1. Check whether or not square already has been clicked 
2. If square has been clicked, then player can not be able to click it again and change it's color.
3. If square has not been clicked, execute function to color square and check the player won the game or not
  1) If the player won the game, then game is over and the player get 1 score.
  2) If the player didn't win the game now, then check have all of the squares been filled in.
    a) If all the squares have been filled in and no player has won yet, display a message saying it's a tie.
    b) If some of squares have not filled in, then move to next player's turn 
*/

// for setTimeOut() fuction
const timeOut = 2000;

// two diagonal squares' index, be used when check player is win the game or not
const diagonalSquaresIndex = [
  [2, 4, 6],
  [0, 4, 8]
];

// store two players score
const scores = [0, 0];

const resetButton = document.querySelector(".reset-button");
const squares = document.querySelectorAll(".square");
const currentPlayer = document.querySelector(".player-name");
const redPlayerScore = document.querySelector(".redplayer-score");
const bluePlayerScore = document.querySelector(".blueplayer-score");
const gameResult = document.querySelector(".game-result");

// tag which player be in current turn, 0 for red player, 1 for blue player
let playerTurn = 0;

// invoke when player click the square
function squareClicked(e) {
  let square = e.target;
  let alreadyClicked = square.dataset.clicked !== "-1";
  if (alreadyClicked) {
    // if the square has been clicked
    console.log("You must select a different square");
  } else {
    if (playerTurn == 0) {
      // if the red player clicks a square
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
      // if the blue player clicks a square
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

/**
 * handle the logic when player click the square,
 *  1. checking the player won the game or not.
 *    1) If the player won the game, then game is over and the player get 1 score.
 *    2) If the player doesn't win the game now, then check all of the squares have been filled in or not.
 *      a) If all the squares are filled in and no player has won yet, display a message saying it's a tie.
 *      b) If some of squares are not filled in, then move to next player's turn
 * @param {Object} square - the square the player clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @param {String} currentPlayerName - the name of current player("Red" or "Blue")
 * @param {String} nextPlayerName - the name of next turn player("Red" or "Blue")
 * @param {String} clickedStyle - the style class for square's background-color,it will be "redPlayerClicked" when red player clicked,otherwise,it's "bluePlayerClicked"
 * @param {Object} playerScoreEle - the html element which shows the player's score
 * @param {*} currentPlayerColorStyle - the color style class for current player
 * @param {*} nextPlayerColorStyle - the color style class for next turn player
 */
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

  // check the current player won the game or not
  let isWin = checkIsWin(squareIndex, player);
  if (isWin) {
    // if the player won the game, the player got 1 more score
    scores[parseInt(player)]++;
    playerScoreEle.innerText = scores[parseInt(player)];

    // display the message on page and log to console
    let info = `${currentPlayerName} player has won the game!`;
    gameResult.innerText = info;
    gameResult.classList.add(currentPlayerColorStyle);
    console.log(info);

    // remove the "click" eventlistener for all of square, then the player will not able to invoke function squareClicked when click
    squares.forEach(val => val.removeEventListener("click", squareClicked));
    setTimeout(function() {
      resetGame();
    }, timeOut);
  } else {
    // if the player didn't win the game now, check have all of the squares been filled in.
    let isAllFilled = checkIfAllClicked();
    if (isAllFilled) {
      // if all of the squares have been filled in, then game is a tie.
      gameResult.innerText = "The game is a tie!";
      console.log("The game is a tie");
      setTimeout(function() {
        resetGame();
      }, timeOut);
    } else {
      // if some of squares have not filled in, then move to next player's turn
      playerTurn = 1 - player;
      currentPlayer.innerText = nextPlayerName;
      currentPlayer.classList.remove(currentPlayerColorStyle);
      currentPlayer.classList.add(nextPlayerColorStyle);
    }
  }
}

/**
 * reset the game
 */
function resetGame() {
  console.log("Resetting game");
  currentPlayer.innerText = "Red";
  currentPlayer.classList.remove("bluePlayerColor");
  currentPlayer.classList.add("redPlayerColor");
  gameResult.classList.remove("redPlayerColor");
  gameResult.classList.remove("bluePlayerColor");
  gameResult.innerText = "";
  playerTurn = 0;
  squares.forEach(val => {
    val.dataset.clicked = "-1";
    val.classList.remove("redPlayerClicked");
    val.classList.remove("bluePlayerClicked");
    val.addEventListener("click", squareClicked);
  });
}

/**
 * check the player won the game or not:
 *  1. check the squares in the row have been clicked by current player or not.
 *      e.g: if the square which player clicked is in row 1, then check the squares in row 1 have been clicked by current player or not.
 *  2. if current player has clicked all of the squares in the row, then the player won the game, return true.
 *  3. if current player hasn't clicked all of the squares in the row, then check the squares in the column similar to checking the squares in the row.
 *  4. if current player has clicked all of the squares in the column, then the player won the game, return true.
 *  5. if current player hasn't clicked all of the squares in the column, then check the square clicked is in diagonal or not
 *  6. if the square clicked is in diagonal, then check all of the squares in the diagonal similar to checking the squares in the row.
 *  7. if current player has clicked all of the squares in the diagonal, then the player won the game, return true.
 *  8. otherwise, return false.
 *
 * @param {String} index - the index of the square clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @returns {boolean} - true: the player won the game; false: the player didn't win the game now
 */
function checkIsWin(index, player) {
  let indexNum = parseInt(index);
  // check current player has clicked the squares in the row or not.
  let isWinByRow = checkIsWinByRow(indexNum, player);
  if (isWinByRow) return true;

  // check current player has clicked the squares in the column or not.
  let isWinByColumn = checkIsWinByColumn(indexNum, player);
  if (isWinByColumn) return true;

  // check current player has clicked the squares in the diagonal or not.
  return checkIsWinByDiagonal(indexNum, player);
}

/**
 * check current player has clicked the squares in the row or not.
 * @param {Number} index - the index of the square clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @returns {boolean} - true: the player won the game; false: the player didn't win the game now
 */
function checkIsWinByRow(index, player) {
  // get indexs of another two square in row which index's value is ${index}
  let rowIndex = Math.floor(index / 3);
  let tempIndex1 = index + 1;
  let index1 = rowIndex * 3 + (tempIndex1 % 3);
  let tempIndex2 = index + 2;
  let index2 = rowIndex * 3 + (tempIndex2 % 3);
  return checkIsWinByArray([index, index1, index2], player);
}

/**
 * check current player has clicked the squares in the column or not.
 * @param {Number} index - the index of the square clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @returns {boolean} - true: the player won the game; false: the player didn't win the game now
 */
function checkIsWinByColumn(index, player) {
  // get indexs of another two square in column which index's value is ${index}
  let checkArray = [index, (index + 3) % 9, (index + 6) % 9];
  return checkIsWinByArray(checkArray, player);
}

/**
 * check current player has clicked the squares in the diagonal or not.
 * @param {Number} index - the index of the square clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @returns {boolean} - true: the player won the game; false: the player didn't win the game now
 */
function checkIsWinByDiagonal(index, player) {
  if (index == 4) {
    // if the index of square is 4, then thera are two diagonal may be need checked.
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

/**
 *
 * @param {Number} index - the index of the square clicked
 * @param {Number} player - the number refer which player clicked, 0 for red player, 1 for blue player
 * @returns {boolean} - true: the player won the game; false: the player didn't win the game now
 */
function checkIsWinByArray(array, player) {
  let square1 = squares[array[0]].dataset.clicked == player;
  let square2 = squares[array[1]].dataset.clicked == player;
  let square3 = squares[array[2]].dataset.clicked == player;
  return (playerHasWon = square1 && square2 && square3);
}

// check all of the squares have been filled in or not.
function checkIfAllClicked() {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].dataset.clicked == "-1") {
      return false;
    }
  }
  return true;
}

// when page load, do initialization
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
