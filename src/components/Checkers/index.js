import styles from './Checkers.module.css'
import { useState, useEffect } from 'react'

class Piece {
    constructor(color) {
        this.name = 'Pawn';
        this.color = color;
        this.points = 1;
        // this.position = { x: -1, y: -1 };
    }
}

function Checkers() {
    const players = {
        'Player' : {
            name: 'You',
            color: 'red',
        },
        'CPU' : {
            name: 'CPU',
            color: 'black'
        }
    }
    const [board, setBoard] = useState([[null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black')],
                                        [new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null],
                                        [null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black')],
                                        [null,null,null,null,null,null,null,null],
                                        [null,null,null,null,null,null,null,null],
                                        [new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null],
                                        [null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red')],
                                        [new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null]]);
    const [cpuTurn, setCpuTurn] = useState(false);
    const [winner, setWinner] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState({x: -1, y: -1});
    const [availableMoves, setAvailableMoves] = useState([]);

    function displayTurn() {
        if(cpuTurn) return 'CPU';
        return 'You';
    }

    function displayWinner() {
        return winner;
    }

    function selectPiece(row, column) {
        // Clicked on one of your own pieces
        if(board[row][column]?.color === players?.Player?.color) {
            setSelectedPiece({x: row, y: column});

            // Calculate available moves
            let actualMoves = [];
            
            if(board[row][column]?.name === 'King') {
                let moves = [{x: row - 1, y: column - 1},
                             {x: row - 1, y: column + 1},
                             {x: row + 1, y: column - 1},
                             {x: row + 1, y: column + 1}];
    
                for(let i = 0; i < 4; i++) {
                    if(moves[i]?.x <= 7 && moves[i]?.x >= 0 &&
                       moves[i]?.y <= 7 && moves[i]?.y >= 0 &&
                       board[moves[i]?.x][moves[i]?.y] === null) {
                        actualMoves.push({ x: moves[i].x, y: moves[i].y});
                    }
                }
            } else if(board[row][column]?.name === 'Pawn') {
                let moves = [{x: row - 1, y: column - 1},
                             {x: row - 1, y: column + 1}];

                for(let i = 0; i < 2; i++) {
                    if(moves[i]?.x <= 7 && moves[i]?.x >= 0 &&
                       moves[i]?.y <= 7 && moves[i]?.y >= 0 &&
                       board[moves[i]?.x][moves[i]?.y] === null) {
                        actualMoves.push({ x: moves[i].x, y: moves[i].y});
                    }
                }
            }

            console.log("actual moves: ", actualMoves);
            setAvailableMoves(actualMoves);
            console.log("available moves: ", availableMoves);
        // If you clicked on an empty space that is a valid move
        } else if(board[row][column] === null && availableMoves.includes(board[row][column])) {
            movePiece(row, column);

            // Clear available moves
            setAvailableMoves([]);
        }
    }

    function movePiece(row, column) {
    }

    function cpuPlayFn() {
    }

    function playAgainFn() {
        setBoard([[null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black')],
                  [new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null],
                  [null,new Piece('black'),null,new Piece('black'),null,new Piece('black'),null,new Piece('black')],
                  [null,null,null,null,null,null,null,null],
                  [null,null,null,null,null,null,null,null],
                  [new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null],
                  [null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red')],
                  [new Piece('red'),null,new Piece('red'),null,new Piece('red'),null,new Piece('red'),null]]);
        setCpuTurn(false);
        setWinner(null);
    }

    function checkWinner() {
        return ;
    }

    useEffect(() => {
        if(winner) return;
        if(cpuTurn) cpuPlayFn();
    }, [availableMoves, board, cpuTurn, winner]);

    let _board = [];
    let _cellStyle = styles.blackCell;
    let _style = {color: 'white'};

    for(let i = 0; i < 8; i++) {
        let _row = [];

        for(let j = 0; j < 8; j++) {
            if(_cellStyle === styles.redCell || _cellStyle === styles.selectedRedCell) {
                _cellStyle = styles.blackCell;
                if(selectedPiece.x === i && selectedPiece.y === j) {
                    _cellStyle = styles.selectedBlackCell;
                }
            } else if(_cellStyle === styles.blackCell || _cellStyle === styles.selectedBlackCell) {
                _cellStyle = styles.redCell;
                if(selectedPiece.x === i && selectedPiece.y === j) {
                    _cellStyle = styles.selectedRedCell;
                }
            }

            let temp = _cellStyle;
            if(availableMoves.includes({x: i, y: j})) {
                _cellStyle = styles.possibleMove;
            }

            _row.push(<span key={`${i}-${j}`} onClick={() => selectPiece(i, j)} style={_style} className={_cellStyle}>
                          {board[i][j]?.color}
                      </span>);

            _cellStyle = temp;
        }
        _board.push(<div key={`${i}`} className={styles.row}>{_row}</div>);
    
        if(_cellStyle === styles.redCell || _cellStyle === styles.selectedRedCell) {
            _cellStyle = styles.blackCell;
        } else if(_cellStyle === styles.blackCell || _cellStyle === styles.selectedBlackCell) {
            _cellStyle = styles.redCell;
        }
    }

    return (
        <div>
            <div>{!winner && displayTurn()}</div>
            <div className={styles.container}>
                {_board}
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

export default Checkers;