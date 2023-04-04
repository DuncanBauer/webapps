import styles from './Checkers.module.css'
import { useState, useEffect } from 'react'

class Piece {
    constructor(color) {
        this.name = 'Pawn';
        this.color = color;
        this.points = 1;
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
    const [board, setBoard] = useState([[null, new Piece('black'), null, new Piece('black'), null, new Piece('black'), null, new Piece('black')],
                                        [new Piece('black'), null, new Piece('black'), null, new Piece('black'), null, new Piece('black'), null],
                                        [null, new Piece('black'), null, new Piece('black'), null, new Piece('black'), null, new Piece('black')],
                                        [null, null, null, null, null, null, null, null],
                                        [null, null, null, null, null, null, null, null],
                                        [new Piece('red'), null, new Piece('red'), null, new Piece('red'), null, new Piece('red'), null],
                                        [null, new Piece('red'), null, new Piece('red'), null, new Piece('red'), null, new Piece('red')],
                                        [new Piece('red'), null, new Piece('red'), null, new Piece('red'), null, new Piece('red'), null]]);
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
        setSelectedPiece({x: -1, y: -1});
        setAvailableMoves([]);
    }

    function displayTurn() {
        if(cpuTurn) return 'CPU';
        return 'You';
    }
    
    function findPosition(piece) {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                if(board[i][j] === piece) {
                    return {x: i, y: j};
                }
            }
        }
        return null;
    }

    function claimPiece(piece) {
        let temp = board;
        let pos = findPosition(piece);

        if(pos) {
            temp[pos.x][pos.y] = null;
        }

        setBoard(temp);
    }

    function kingMe(piece) {
        let temp = board;
        let pos = findPosition(piece);

        temp[pos.x][pos.y].name = 'King';
        temp[pos.x][pos.y].points = 2;

        setBoard(temp);
    }

    function checkWinner() {
        let reds = board.flat().filter(piece => piece?.color === 'red');
        let blacks = board.flat().filter(piece => piece?.color === 'black');

        if(reds.length <= 0) {
            setWinner('CPU');
            return;
        }

        if(blacks.length <= 0) {
            setWinner('You');
            return;
        }
    }

    function displayWinner() {
        return winner;
    }

    function selectPiece(row, column) {
        if(!cpuTurn) {
            let moves = [];

            // Clicked on one of your own pieces
            if(board[row][column]?.color === players?.Player?.color) {
                setSelectedPiece({x: row, y: column});

                // Calculate available moves
                let piece = board[row][column];
                moves = getMoves(piece, {x: row, y: column}, [], false);

                setAvailableMoves(moves);
            // If you clicked on an empty space that is a valid move
            } else if(board[row][column] === null && availableMoves.some(move => move.x === row && move.y === column)) {
                // Move the piece
                movePiece(row, column);

                let chosenMove = availableMoves.filter(move => move.x === row && move.y === column);
                for(let i = 0; i < chosenMove[0].claimedPieces.length; i++) {
                    let piece = chosenMove[0].claimedPieces[i];
                    claimPiece(piece);
                }

                // Clear available moves
                setAvailableMoves([]);
            }
        }
    }

    function movePiece(row, column) {
        if(!cpuTurn) {
            let tempBoard = board;
            let piece = board[selectedPiece.x][selectedPiece.y];

            tempBoard[selectedPiece.x][selectedPiece.y] = null;
            tempBoard[row][column] = piece;

            setBoard(tempBoard);

            if(row === 0 && piece.name !== 'King') {
                kingMe(piece);
            }

            setSelectedPiece(null);
            checkWinner();
            if(!winner) {
                setTimeout(() => setCpuTurn(!cpuTurn), 500);
            }
        }
    }

    function cpuPlayFn() {
        let blacks = board.flat().filter(piece => piece?.color === 'black');
        let moves = new Map();
       
        for (let index = 0; index < blacks.length; index++) {
            const piece = blacks[index];
            const position = findPosition(piece);
            moves.set(piece, getMoves(piece, position, [], false));
        }

        let piecesAbleToMove = Array.from(moves.keys()).filter(value => moves.get(value).length > 0 );
        if(piecesAbleToMove.length <= 0) {
            setWinner('You');
            return;
        }
        
        let piece = piecesAbleToMove[Math.floor(Math.random() * (piecesAbleToMove.length - 1))];
        let movesForPiece = moves.get(piece);
        let move = movesForPiece[Math.floor(Math.random() * (movesForPiece.length - 1))];

        let tempBoard = board;
        let pos = findPosition(piece);

        if(pos) {
            tempBoard[pos.x][pos.y] = null;
            tempBoard[move.x][move.y] = piece;

            if(pos.x === 7 && piece.name !== 'King') {
                kingMe(piece)
            }
        }

        setBoard(tempBoard);

        for(let i = 0; i < move.claimedPieces.length; i++) {
            let piece = move.claimedPieces[i];
            claimPiece(piece);
        }

        setCpuTurn(false);
    }

    function getMoves(piece, position, actualMoves, chaining) {
        let moves = [];

        if(piece?.name === 'King') {
            moves = [{x: position.x - 1, y: position.y - 1},
                     {x: position.x - 1, y: position.y + 1},
                     {x: position.x + 1, y: position.y - 1},
                     {x: position.x + 1, y: position.y + 1}];
        } else if (piece?.color === 'black') {
            moves = [{x: position.x + 1, y: position.y - 1},
                     {x: position.x + 1, y: position.y + 1}];
        } else if (piece?.color === 'red') {
            moves = [{x: position.x - 1, y: position.y - 1},
                     {x: position.x - 1, y: position.y + 1}];
        }
    
        for(let i = 0; i < moves.length; i++) {
            const x = moves[i]?.x;
            const y = moves[i]?.y;

            // If we're moving to an open space
            if(!chaining && x <= 7 && x >= 0 && y <= 7 && y >= 0 && board[x][y] === null) {
                actualMoves.push({x: x, y: y, claimedPieces: []});
            
            // If the space has an opponent piece on it
            } else if(x <= 7 && x >= 0 && y <= 7 && y >= 0 && board[x][y] && board[x][y]?.color !== piece?.color) {
                const dx = x - position.x > 0 ? 1 : -1; // determine the direction of the move
                const dy = y - position.y > 0 ? 1 : -1;
                
                let jumpX = dx + x;
                let jumpY = dy + y;

                if(piece.name === 'King') {
                    if(actualMoves.some(move => move.x === jumpX && move.y === jumpY)) {
                        continue;
                    }
                }
                
                // See if we can jump over it
                if(jumpX >= 0 && jumpX <= 7 && jumpY >= 0 && jumpY <= 7 && board[jumpX][jumpY] === null) {
                    let prevPieces = [];
                    if(chaining && actualMoves.length > 0) {
                        prevPieces = actualMoves[actualMoves.length - 1].claimedPieces;
                    }

                    let pieces = [board[x][y]].concat(prevPieces);
                    actualMoves.push({x: jumpX, y: jumpY, claimedPieces: pieces});

                    // See if we can chain our jump
                    actualMoves = actualMoves.concat(getMoves(piece, {x: jumpX, y: jumpY}, actualMoves, true));
                }
            }
        }

        return actualMoves;
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

    console.log('RENDER');

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