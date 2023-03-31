import styles from './Checkers.module.css'
import { useState, useEffect } from 'react'

class Piece {
    constructor(color, direction) {
        this.name = 'Pawn';
        this.color = color;
        this.points = 1;
        this.direction = direction
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
    const [board, setBoard] = useState([[null, new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1)],
                                        [new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1), null],
                                        [null, new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1), null, new Piece('black', 1)],
                                        [null, null, null, null, null, null, null, null],
                                        [null, null, null, null, null, null, null, null],
                                        [new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1), null],
                                        [null, new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1)],
                                        [new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1), null, new Piece('red', -1), null]]);
    const [cpuTurn, setCpuTurn] = useState(false);
    const [winner, setWinner] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState({x: -1, y: -1});
    const [availableMoves, setAvailableMoves] = useState([]);

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

            setAvailableMoves(actualMoves);
        // If you clicked on an empty space that is a valid move
        } else if(board[row][column] === null && availableMoves.some(move => move.x === row && move.y === column)) {
            // Move the piece
            movePiece(row, column);

            // Clear available moves
            setAvailableMoves([]);
        }
    }

    function movePiece(row, column) {
        let tempBoard = board;
        let piece = board[selectedPiece.x][selectedPiece.y];

        tempBoard[selectedPiece.x][selectedPiece.y] = null;
        tempBoard[row][column] = piece;

        setBoard(tempBoard);
        setSelectedPiece(null);
        setCpuTurn(true);
        checkWinner();
    }

    function cpuPlayFn() {
        let blacks = board.flat().filter(piece => piece?.color === 'black');
        let moves = {};
       
        for (const piece in blacks) {
            moves[piece] = getMoves(piece);
        }

        let piecesAbleToMove = Array.from(moves.keys());
        
        let piece = piecesAbleToMove[Math.floor(Math.random() * (piecesAbleToMove.length - 1))];

        let move = moves[Math.floor(Math.random() * (moves[piece].length - 1))];
        setCpuTurn(false);
    }

    function getMoves(piece, position) {
        let moves = [];
        let actualMoves = [];

        if(piece?.name === 'King') {
            moves = [{x: position.x - 1, y: position.y - 1},
                     {x: position.x - 1, y: position.y + 1},
                     {x: position.x + 1, y: position.y - 1},
                     {x: position.x + 1, y: position.y + 1}];
        } else if (piece?.color === 'black' && piece?.name === 'Pawn') {
            moves = [{x: position.x + 1, y: position.y - 1},
                     {x: position.x + 1, y: position.y + 1}];
        } else if (piece?.color === 'red'   && piece?.name === 'Pawn') {
            moves = [{x: position.x - 1, y: position.y - 1},
                     {x: position.x - 1, y: position.y + 1}];
        }
    
        for(let i = 0; i < moves.length; i++) {
            // need to check opponent pieces for jump
            if(moves[i]?.x <= 7 && moves[i]?.x >= 0 && moves[i]?.y <= 7 && moves[i]?.y >= 0 && board[moves[i]?.x][moves[i]?.y] === null) {
                actualMoves.push({x: moves[i].x, y: moves[i].y});
            }
        }

        return actualMoves;
    }

    function checkWinner() {
        let reds = board.filter(piece => piece != null && piece?.color === 'red');
        let blacks = board.filter(piece => piece != null && piece?.color === 'black');

        if(reds.length <= 0) {
            setWinner('CPU');
        }

        if(blacks.length <= 0) {
            setWinner('You');
        }
    }

    useEffect(() => {
        if(winner) return;
        if(cpuTurn) cpuPlayFn();
    }, [cpuTurn, winner]);

    let _board = [];
    let _cellStyle = styles.blackCell;
    let _style = {color: 'white'};

    for(let i = 0; i < 8; i++) {
        let _row = [];

        for(let j = 0; j < 8; j++) {
            if(_cellStyle === styles.redCell || _cellStyle === styles.selectedRedCell) {
                _cellStyle = styles.blackCell;
                if(selectedPiece?.x === i && selectedPiece?.y === j) {
                    _cellStyle = styles.selectedBlackCell;
                }
            } else if(_cellStyle === styles.blackCell || _cellStyle === styles.selectedBlackCell) {
                _cellStyle = styles.redCell;
                if(selectedPiece?.x === i && selectedPiece?.y === j) {
                    _cellStyle = styles.selectedRedCell;
                }
            }

            let temp = _cellStyle;
            if(availableMoves.some(move => move.x === i && move.y === j)) {
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

    console.log("RENDER");

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