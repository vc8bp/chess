import React, { useEffect, useState } from 'react'
import style from "./Board.module.css"
import { BOARDROWS, BOARDCOLS, piceImageMap } from '../../assets/constants';

function Board({currentPlayer, piecesPlacement, allPiecesMoves, checkInfo, isIllegalMoveError, handlePieceMove }) {

    const [activePiece, setActivePiece] = useState(null);
    const [activePieceMoves, setActivePiecesMoves] = useState({});


    const onDrop = (e, to) => {
        const from = e.dataTransfer.getData("position")
        if(handlePieceMove(from, to)) { //moving a piece if it's opponent piece or empty cell
            setActivePiece(null)
            setActivePiecesMoves({})
        }
    }   
   
    const handleDrag = (e, position) => {
        e.dataTransfer.setData("position", position)
    }

    const onCellClick = (cellName, isDisabled) => {

        const pieceInCell = piecesPlacement[cellName];
        
        let pieceColor = pieceInCell ? pieceInCell.split("-")[0] : null;

        if(!isDisabled){
            if (!activePiece && pieceInCell) return setActivePiece(cellName); 
            if (activePiece === cellName) {
                setActivePiece(null); setActivePiecesMoves({}); //deactivating if clicked on same cell which was active
                return
            } 
        }
    
        
        if (activePiece) {
            if (!isDisabled && piecesPlacement[activePiece] && pieceInCell && pieceColor === piecesPlacement[activePiece].split("-")[0]) { // if clicked on his own other piece the we activate that piece
                return setActivePiece(cellName);
            }
    
            if(handlePieceMove(activePiece, cellName)) { //moving a piece if it's opponent piece or empty cell
                setActivePiece(null)
                setActivePiecesMoves({})
            }
        }
    };

    useEffect(() => {
        console.log(allPiecesMoves, activePiece)
        if(activePiece && piecesPlacement[activePiece]){
          const [color] = piecesPlacement[activePiece]
          if(allPiecesMoves[color]) setActivePiecesMoves(allPiecesMoves[color][activePiece] || {})
        }
    },[activePiece, allPiecesMoves])
       

    return (
        <div className={style.container}>
            {BOARDROWS.map((row, rowIndex) => {
                const isRowEven = rowIndex % 2 === 0;
                return (
                <div key={rowIndex} className={style.row}>
                    {BOARDCOLS.map((col, colIndex) => {
                    const cellName = `${col}${row}`
                    let pieceInfo = piecesPlacement[cellName]

                    if(pieceInfo){
                        const [pieceColor, pieceName] = pieceInfo.split("-")
                        pieceInfo = {name: pieceName, color: pieceColor, moves: allPiecesMoves[pieceColor]?.[cellName]}
                    }

                    const finalColIndex = isRowEven ? colIndex + 1 : colIndex;
                    const backgroundColor = finalColIndex % 2 === 0 ? style.darkCell : style.lightCell;


                    const isMoveClassName = activePieceMoves[cellName] === false ? style.isMove : typeof activePieceMoves[cellName] == "string" ? style.isKill : null
                    const isErrorClassName = isIllegalMoveError == cellName ? style.error : null

                    const isDisabled = pieceInfo?.color && pieceInfo.color !== currentPlayer;


                    return (
                        <div key={colIndex} className={`${style.col} ${backgroundColor} ${isMoveClassName} `} onMouseDown={() =>  onCellClick(cellName, isDisabled)} onDragOver={e => e.preventDefault()}  onDrop={e => onDrop(e, cellName)}
                            style={activePiece === cellName ? {backgroundColor: "#829769"} : {}}
                        >
                            {piceImageMap[piecesPlacement[cellName]] && (
                                <img  
                                    className={`
                                        ${isErrorClassName} 
                                        ${checkInfo?.kingPosition==cellName && style.isCheck}
                                        ${checkInfo?.checkFromCell==cellName && style.isChecking}
                                    `}
                                    src={piceImageMap[piecesPlacement[cellName]]} 
                                    onDragStart={(e) => !isDisabled && handleDrag(e, cellName)}  
                                    draggable 
                                ></img>
                            )}
                            {/* <p>{col}{row}</p> */}
                        </div>
                    );
                    })}
                </div>
                );
            })}
        </div>
    )
}

export default Board