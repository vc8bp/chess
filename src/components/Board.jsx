import React, { useEffect, useRef, useState } from 'react';
import style from './Board.module.css';
import { move } from './utils';
import { getPossibleMoves } from './possibleMoves';

const piceImageMap = {
    "d-rook": "/pieces/rook-dark.png",
    "l-rook": "/pieces/rook-light.png",
    "d-bishop": "/pieces/bishop_dark.png",
    "l-bishop": "/pieces/bishiop_light.png",
    "d-king": "/pieces/king-dark.png",
    "l-king": "/pieces/king-light.png",
    "d-knight": "/pieces/knight-dark.png",
    "l-knight": "/pieces/knight-light.png",
    "d-pawn": "/pieces/pawn-dark.png",
    "l-pawn": "/pieces/pawn-light.png",
    "d-queen": "/pieces/queen-dark.png",
    "l-queen": "/pieces/queen-light.png"
  };
  
  const defaultPlacement = {
    "A8": "d-rook", "H8": "d-rook",
    "A1": "l-rook", "H1": "l-rook",
  
    "B8": "d-knight", "G8": "d-knight",
    "B1": "l-knight", "G1": "l-knight",
  
    "C8": "d-bishop", "F8": "d-bishop",
    "C1": "l-bishop", "F1": "l-bishop",
  
    "D8": "d-queen",
    "D1": "l-queen",
  
    "E8": "d-king",
    "E1": "l-king",
  
    "A7": "d-pawn", "B7": "d-pawn", "C7": "d-pawn", "D7": "d-pawn",
    "E7": "d-pawn", "F7": "d-pawn", "G7": "d-pawn", "H7": "d-pawn",
  
    "A2": "l-pawn", "B2": "l-pawn", "C2": "l-pawn", "D2": "l-pawn",
    "E2": "l-pawn", "F2": "l-pawn", "G2": "l-pawn", "H2": "l-pawn"
  };
  

export const BOARDROWS = [8, 7, 6, 5, 4, 3, 2, 1];
export const BOARDCOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function Board() {
   const [piecesPlacement, setPiecesPlacement] = useState(defaultPlacement);
   const [activePiece, setActivePiece] = useState()
   const [possibleMoves, setPossibeMoves] = useState({})

   const onDrop = (e, to) => {
        const from = e.dataTransfer.getData("position")
        if(!move(to, possibleMoves)) return        

        setPiecesPlacement(p => ({...p, [from]: null, [to]: p[from] }))

        //------------------------------------ temp -----------------------------------
        // setActivePiece(null)
        setActivePiece(to)
   }   

   useEffect(() => {
        if(!activePiece) return setPossibeMoves({})
        console.log(getPossibleMoves(activePiece, piecesPlacement))
        setPossibeMoves(getPossibleMoves(activePiece, piecesPlacement))
   },[activePiece, piecesPlacement])
   

   const handleDrag = (e, position) => {
        e.dataTransfer.setData("position", position)
   }
  return (
    <div className={style.container}>
      {BOARDROWS.map((row, rowIndex) => {
        const isRowEven = rowIndex % 2 === 0;
        return (
          <div key={rowIndex} className={style.row}>
            {BOARDCOLS.map((col, colIndex) => {
              const cellName = `${col}${row}`
              const finalColIndex = isRowEven ? colIndex + 1 : colIndex;
              const backgroundColor = finalColIndex % 2 === 0 ? style.darkCell : style.lightCell;

              const isMoveClassName = possibleMoves[cellName] === false ? style.isMove : possibleMoves[cellName] === true ? style.isKill : null
              return (
                <div key={colIndex} className={`${style.col} ${backgroundColor} ${isMoveClassName}`} onMouseDown={() => setActivePiece(cellName)} onDragOver={e => e.preventDefault()}  onDrop={e => onDrop(e, cellName)}
                    style={activePiece === cellName ? {backgroundColor: "#829769"} : {}}
                >
                    {piceImageMap[piecesPlacement[cellName]] && (
                        <img  
                            src={piceImageMap[piecesPlacement[cellName]]} 
                            onDragStart={(e) => handleDrag(e, cellName)}  
                            draggable 
                            style={activePiece === cellName ? {backgrroun: 1.3} : {scale: 1}}
                        ></img>
                    )}
                    <p>{col}{row}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}


export default React.memo(Board);
