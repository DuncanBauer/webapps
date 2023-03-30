import styles from "./TicTacToe.module.css";
import React, { useState, useEffect } from 'react';

function TicTacToe() {
  const players = {
    HUMAN: {
      name: "You",
      symbol: "X"
    },
    CPU: {
      name: "CPU",
      symbol: "O"
    }
  };

  const [board, setBoard] = useState([["","",""],
                                      ["","",""],
                                      ["","",""]]);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [winner, setWinner] = useState(null);

  function playFn(row, column) {
    if(!cpuTurn && !winner) {
      board[row][column] = players?.HUMAN?.symbol;
      setCpuTurn(true);
      setBoard((board) => [...board])
      checkWinner()
    }
  };

  function playAgainFn() {
    setBoard([["","",""],
              ["","",""],
              ["","",""]]);
    setCpuTurn(false);
    setWinner(null);
  }
  
  useEffect(() => {
    if (winner) return;
    if (cpuTurn) {
      cpuPlay();
    }
  });

  function cpuPlay() {
    var emptyCells = [];
    for (var row = 0; row < board.length; row++) {
      for(var column = 0; column < board[row].length; column++) {
        if (board[row][column] === "") {
          emptyCells.push({row, column});
        }
      }
    }

    const chosen = Math.floor(Math.random() * (emptyCells.length - 1));
    const move = emptyCells[chosen];

    board[move.row][move.column] = players?.CPU?.symbol;
    setCpuTurn(false);
    setBoard((board) => [...board])
    checkWinner()
  }

  function checkWinner() {
    // Check horizontals
    for(let i = 0; i < 3; i++) {
      const row = board[i];
      if(row.every((cell) => cell === players?.HUMAN?.symbol)) {
        setWinner(players?.HUMAN?.name);
        return true;
      } else if(row.every((cell) => cell === players?.CPU?.symbol)) {
        setWinner(players?.CPU?.name);
        return true;
      }
    }

    // Check verticals
    for(let i = 0; i < 3; i++) {
      const column = board.map((row) => row[i]);
      if(column.every((cell) => cell === players?.HUMAN?.symbol)) {
        setWinner(players?.HUMAN?.name);
        return true;
      } else if(column.every((cell) => cell === players?.CPU?.symbol)) {
        setWinner(players?.CPU?.name);
        return true;
      }
    }

    // Check diagonals
    let diag1 = [board[0][0], board[1][1], board[2][2]];
    let diag2 = [board[0][2], board[1][1], board[2][0]];

    if(diag1.every((cell) => cell === players?.HUMAN?.symbol)) {
      setWinner(players?.HUMAN?.name);
      return true;
    }
    if(diag1.every((cell) => cell === players?.CPU?.symbol)) {
      setWinner(players?.CPU?.name);
      return true;
    }
    if(diag2.every((cell) => cell === players?.HUMAN?.symbol)) {
      setWinner(players?.HUMAN?.name);
      return true;
    }
    if(diag2.every((cell) => cell === players?.CPU?.symbol)) {
      setWinner(players?.CPU?.name);
      return true;
    }
    if(board.flat().every((cell) => cell !== "")) {
      setWinner("Draw");
      console.log("Hello");
      return true;
    }
    setWinner(null);
    return false;
  }

  function displayTurn() {
    if(cpuTurn) {
      return players?.CPU?.name;
    }
    return players?.HUMAN?.name;
  }

  function displayWinner() {
    return winner;
  }

  return (
    <div>
      <div>{!winner && displayTurn()}</div>
      <div className={styles.container}>
        <div className={styles.column}>
          <span onClick={() => playFn(0,0)} className={styles.cell}>
            {board[0][0]}
          </span>
          <span onClick={() => playFn(0,1)} className={styles.cell}>
            {board[0][1]}
          </span>
          <span onClick={() => playFn(0,2)} className={styles.cell}>
            {board[0][2]}
          </span>
        </div>
        <div className={styles.column}>
          <span onClick={() => playFn(1,0)} className={styles.cell}>
            {board[1][0]}
          </span>
          <span onClick={() => playFn(1,1)} className={styles.cell}>
            {board[1][1]}
          </span>
          <span onClick={() => playFn(1,2)} className={styles.cell}>
            {board[1][2]}
          </span>
        </div>
        <div className={styles.column}>
          <span onClick={() => playFn(2,0)} className={styles.cell}>
            {board[2][0]}
          </span>
          <span onClick={() => playFn(2,1)} className={styles.cell}>
            {board[2][1]}
          </span>
          <span onClick={() => playFn(2,2)} className={styles.cell}>
            {board[2][2]}
          </span>
        </div>
      </div>
      {winner && <h2>{displayWinner()}</h2>}
      {winner && (
        <button className={styles.video_game_button} onClick={playAgainFn}>
          Play Again
        </button>
      )}
    </div>
  )
}

export default TicTacToe;