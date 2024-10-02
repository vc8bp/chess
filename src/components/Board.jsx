import React, { useEffect, useState } from 'react';
import style from './Board.module.css';
import { getPossibleMoves } from './possibleMoves';
import PromoteModal from './PromoteModal/PromoteModal';
import { defaultPlacement, piceImageMap, BOARDROWS, BOARDCOLS } from '../assets/constants';
import { calculateAllMoves, calculateCheckmate } from './utils';



function Board() {
   const [piecesPlacement, setPiecesPlacement] = useState(defaultPlacement);
   const [activePiece, setActivePiece] = useState()
   const [activePieceMoves, setActivePiecesMoves] = useState({})
   const [promotionInfo, setPromotionInfo] = useState(null);
   const [isIllegalMoveError, setIsIlegalMoveError] = useState(false)

   const [allPiecesMoves, setAllPiecesMoves] = useState({})

   const [checkInfo, setCheckInfo] = useState(null)

   const onDrop = (e, to) => {
        const from = e.dataTransfer.getData("position")
        if(!Object.keys(activePieceMoves).includes(to)) { // move is illegal  
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
     const darkData = calculateAllMoves("d", piecesPlacement)
     const lightData = calculateAllMoves("l", piecesPlacement)

    if(darkData.isCkecking){
      const checkmateForLight = calculateCheckmate(darkData, lightData, piecesPlacement);
      if(checkmateForLight === null) return window.alert("CHECK MATE, BLACK WINS")

      lightData.moves = checkmateForLight.possibleMoves
      setCheckInfo(darkData.isCkecking)
    } else setCheckInfo({})

    if(lightData.isCkecking){
      const checkmateForDark = calculateCheckmate(lightData, darkData, piecesPlacement);
      if(checkmateForDark === null) return window.alert("CHECK MATE, WHTIE WINS")

      darkData.moves = checkmateForDark.possibleMoves
      setCheckInfo(lightData.isCkecking)
    } else setCheckInfo({})


    const data = {d: darkData.moves, l: lightData.moves}
    console.log(data)
    setAllPiecesMoves(data)
   },[piecesPlacement])

   useEffect(() => {
    console.log(allPiecesMoves, activePiece)
    if(activePiece){
      const [color] = piecesPlacement[activePiece]
      if(allPiecesMoves[color]) setActivePiecesMoves(allPiecesMoves[color][activePiece] || {})
    }
   },[activePiece, allPiecesMoves])
   

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
              let pieceInfo = piecesPlacement[cellName]

              if(pieceInfo){
                const [pieceColor, pieceName] = pieceInfo.split("-")
                pieceInfo = {name: pieceName, color: pieceColor, moves: allPiecesMoves[pieceColor]?.[cellName]}
              }

              const finalColIndex = isRowEven ? colIndex + 1 : colIndex;
              const backgroundColor = finalColIndex % 2 === 0 ? style.darkCell : style.lightCell;


              const isMoveClassName = activePieceMoves[cellName] === false ? style.isMove : typeof activePieceMoves[cellName] == "string" ? style.isKill : null
              const isErrorClassName = isIllegalMoveError == cellName ? style.error : null


              return (
                <div key={colIndex} className={`${style.col} ${backgroundColor} ${isMoveClassName} `} onMouseDown={() => setActivePiece(cellName)} onDragOver={e => e.preventDefault()}  onDrop={e => onDrop(e, cellName)}
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
