import React, { useEffect, useRef, useState } from 'react';
import style from './Board.module.css';
import { getPossibleMoves } from './possibleMoves';
import PromoteModal from './PromoteModal/PromoteModal';
import { defaultPlacement, piceImageMap, BOARDROWS, BOARDCOLS } from '../assets/constants';



function Board() {
   const [piecesPlacement, setPiecesPlacement] = useState(defaultPlacement);
   const [activePiece, setActivePiece] = useState()
   const [possibleMoves, setPossibeMoves] = useState({})
   const [promotionInfo, setPromotionInfo] = useState(null);
   const [isIllegalMoveError, setIsIlegalMoveError] = useState(false)

   const [allBlackMoves, setAllBlackMoves] = useState()
   const [allWhiteMoves, setAllWhtieMoves] = useState()

   const [isCheck, setIsCheck] = useState(null)

   useEffect(() => {
    const isKingOnPath = Object.values(possibleMoves).some(e => {
      const isKingOnPath = String(e).includes("king")
      if(isKingOnPath) setIsCheck(e)
      return isKingOnPath
    })

    if(!isKingOnPath) setIsCheck(null)
   },[possibleMoves, activePiece])

   const onDrop = (e, to) => {
        const from = e.dataTransfer.getData("position")
        if(!Object.keys(possibleMoves).includes(to)) { // move is illegal  
          setIsIlegalMoveError(from)
          setTimeout(() => setIsIlegalMoveError(false) , 1000);
          return
        } 

        const piece = piecesPlacement[from];

        if (piece === 'l-pawn' && to[1] === '8' || piece === 'd-pawn' && to[1] === '1') setPromotionInfo({from, to, piece})
        else setPiecesPlacement(p => ({ ...p, [from]: null, [to]: piece }));
    
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

              const isMoveClassName = possibleMoves[cellName] === false ? style.isMove : typeof possibleMoves[cellName] == "string" ? style.isKill : null
              const isErrorClassName = isIllegalMoveError == cellName ? style.error : null


              console.log({cell: `${col}${row}`, isCheck, dd: piecesPlacement[cellName], condition: piecesPlacement[cellName] == isCheck})
              return (
                <div key={colIndex} className={`${style.col} ${backgroundColor} ${isMoveClassName} `} onMouseDown={() => setActivePiece(cellName)} onDragOver={e => e.preventDefault()}  onDrop={e => onDrop(e, cellName)}
                    style={activePiece === cellName ? {backgroundColor: "#829769"} : {}}
                >
                    {piceImageMap[piecesPlacement[cellName]] && (
                        <img  
                            className={`${isErrorClassName} ${isCheck==piecesPlacement[cellName] && style.isCheck}`}
                            src={piceImageMap[piecesPlacement[cellName]]} 
                            onDragStart={(e) => handleDrag(e, cellName)}  
                            draggable 
                        ></img>
                    )}
                    <p>{col}{row}</p>
                </div>
              );
            })}
          </div>
        );
      })}
      {promotionInfo && <PromoteModal closeModal={() => setPromotionInfo(null)} setPiecesPlacement={setPiecesPlacement} promotionInfo={promotionInfo} />}
    </div>
  );
}


export default React.memo(Board);
