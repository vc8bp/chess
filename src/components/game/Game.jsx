import React, { useEffect, useState } from 'react';
import style from './Game.module.css';
import { defaultPlacement } from '../../assets/constants';
import Game from '../Game';
import PromoteModal from '../PromoteModal/PromoteModal';
import { calculateAllMoves, calculateCheckmate } from '../utils';

function Game() {
  const [piecesPlacement, setPiecesPlacement] = useState(defaultPlacement);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [isIllegalMoveError, setIsIlegalMoveError] = useState(false);
  const [checkInfo, setCheckInfo] = useState(null);
  const [allPiecesMoves, setAllPiecesMoves] = useState({});
  const [players, setPlayers] = useState({ currentPlayer: "l", otherPlayer: "d" }); 
  const [moveHistory, setMoveHistory] = useState([]);

  console.log({moveHistory})
  useEffect(() => console.log({moveHistory}), [moveHistory])

  const handlePieceMove = (from, to) => {
    const piece = piecesPlacement[from];
    const isPawnUpgrade = piece === 'l-pawn' && to[1] === '8' || piece === 'd-pawn' && to[1] === '1'

    if (isPawnUpgrade) {
      setPromotionInfo({ from, to, piece });
    } else {
      setPiecesPlacement(p => ({ ...p, [from]: null, [to]: piece }));
    }

    setPlayers((prev) => ({
      currentPlayer: prev.otherPlayer,
      otherPlayer: prev.currentPlayer
    }));


    setMoveHistory(prevHistory => [
      ...prevHistory,
      {
        moveNumber: Math.floor(prevHistory.length / 2) + 1, // Every 2 moves is one turn
        from,          
        to,             
        piece,         
        capturedPiece,  
        promotion: isPawnUpgrade ? piece : null, 
        isCheck: checkInfo.isCheck || false,    
        isCheckmate: checkInfo.isCheckmate || false 
      }
    ])
  };

  useEffect(() => {
    const darkData = calculateAllMoves("d", piecesPlacement);
    const lightData = calculateAllMoves("l", piecesPlacement);

    if (darkData.isCkecking) {
      const checkmateForLight = calculateCheckmate(darkData, lightData, piecesPlacement);
      if (checkmateForLight === null) return window.alert("CHECK MATE, BLACK WINS");
      setCheckInfo(darkData.isCkecking);
    } else {
      setCheckInfo({});
    }

    if (lightData.isCkecking) {
      const checkmateForDark = calculateCheckmate(lightData, darkData, piecesPlacement);
      if (checkmateForDark === null) return window.alert("CHECK MATE, WHITE WINS");
      setCheckInfo(lightData.isCkecking);
    } else {
      setCheckInfo({});
    }

    const data = { d: darkData.moves, l: lightData.moves };
    setAllPiecesMoves(data);
  }, [piecesPlacement]);

  return (
    <div className={style.container}>
      <Game 
        piecesPlacement={piecesPlacement} 
        setPiecesPlacement={setPiecesPlacement} 
        allPiecesMoves={allPiecesMoves} 
        checkInfo={checkInfo} 
        isIllegalMoveError={isIllegalMoveError}
        handlePieceMove={handlePieceMove}
      />
      {promotionInfo && <PromoteModal closeModal={() => setPromotionInfo(null)} setPiecesPlacement={setPiecesPlacement} promotionInfo={promotionInfo} />}
    </div>
  );
}

export default React.memo(Game);
