import React, { useEffect, useState, useRef } from 'react';
import style from './Game.module.css';
import PromoteModal from './PromoteModal/PromoteModal';
import { defaultPlacement } from '../assets/constants';
import { calculateAllMoves, calculateCheckmate } from './utils';
import Board from './board/Board';
import BoardInfo from './BoardInfo/BoardInfo';


function Game({time}) {
  const [piecesPlacement, setPiecesPlacement] = useState(defaultPlacement);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [isIllegalMoveError, setIsIlegalMoveError] = useState(false);
  const [allPiecesMoves, setAllPiecesMoves] = useState({});
  const [checkInfo, setCheckInfo] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('P1'); 
  const [moveHistory, setMoveHistory] = useState([]);

  const [p1Time, setP1Time] = useState(time); 
  const [p2Time, setP2Time] = useState(time);

  const intervalRef = useRef(null);

  useEffect(() => console.log({moveHistory}), [moveHistory])

  const resetGame = () => {
    clearInterval(intervalRef.current); 
    setPiecesPlacement(defaultPlacement); 
    setP1Time(time); 
    setP2Time(time); 
    setCurrentPlayer('P1'); 
    setAllPiecesMoves({});
    setCheckInfo(null); 
    setPromotionInfo(null);
    startTimer(); 
  };

  const handleTimeout = (winner) => {
    window.alert(`Time's up! ${winner} wins the game.`);
    resetGame(); 
  };


  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentPlayer((prevPlayer) => {
        if (prevPlayer === 'P1') {
          setP1Time((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(intervalRef.current);
              handleTimeout('P2'); 
            }
            return prevTime - 1;
          });
        } else {
          setP2Time((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(intervalRef.current);
              handleTimeout('P1');
            }
            return prevTime - 1;
          });
        }
        return prevPlayer;
      });
    }, 1000);
  };

  const switchPlayer = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === 'P1' ? 'P2' : 'P1'));
    startTimer();
  };

  const handlePieceMove = (from, to) => {
    const pieceColor = piecesPlacement[from].split('-')[0];
  
    // Check if the move is legal
    if (!Object.keys(allPiecesMoves[pieceColor][from]).includes(to)) {
      setIsIlegalMoveError(from);
      setTimeout(() => setIsIlegalMoveError(false), 1000);
      return false;
    }
  
    const piece = piecesPlacement[from];
    const capturedPiece = piecesPlacement[to] || null; // Check if a piece is captured
    const isPawnUpgrade = piece === 'l-pawn' && to[1] === '8' || piece === 'd-pawn' && to[1] === '1';
  
    // Handle pawn promotion
    if (isPawnUpgrade) {
      setPromotionInfo({ from, to, piece });
    } else {
      setPiecesPlacement(p => ({ ...p, [from]: null, [to]: piece }));
    }
  
    setMoveHistory(prevHistory => [
      ...prevHistory,
      {
        moveNumber: Math.floor(prevHistory.length / 2) + 1,  // Every two moves is one turn
        from,
        to,
        piece,
        capturedPiece,
        promotion: isPawnUpgrade ? piece : null,
        isCheck: checkInfo?.isCheck || false,
        isCheckmate: checkInfo?.isCheckmate || false
      }
    ]);
  
    switchPlayer();  // Switch turns
    return true;
  };
  useEffect(() => {
    startTimer(); 
  }, []);

  useEffect(() => {
    const darkData = calculateAllMoves('d', piecesPlacement);
    const lightData = calculateAllMoves('l', piecesPlacement);
    let checkD = null
    let moveEntry = {};

    if (darkData.isCkecking) {
      const checkmateForLight = calculateCheckmate(darkData, lightData, piecesPlacement);
      if (checkmateForLight === null) {
        window.alert('CHECK MATE, BLACK WINS');
        return resetGame(); 
      } 
      lightData.moves = checkmateForLight.possibleMoves;
      checkD = darkData.isCkecking
    } else setCheckInfo({});

    if (lightData.isCkecking) {
      const checkmateForDark = calculateCheckmate(lightData, darkData, piecesPlacement);
      if (checkmateForDark === null) {
        window.alert('CHECK MATE, WHITE WINS');
        return resetGame()
      }
      darkData.moves = checkmateForDark.possibleMoves;
      checkD = lightData.isCkecking
    } else setCheckInfo({});

    setCheckInfo(checkD ? checkD : {})
    const data = { d: darkData.moves, l: lightData.moves };
    setAllPiecesMoves(data);
  }, [piecesPlacement]);

  return (
    <div className={style.container}>
      <Board
        currentPlayer={currentPlayer == "P1" ? "l" : "d"}
        piecesPlacement={piecesPlacement}
        allPiecesMoves={allPiecesMoves}
        checkInfo={checkInfo}
        isIllegalMoveError={isIllegalMoveError}
        handlePieceMove={handlePieceMove}
      />
      <BoardInfo history={moveHistory} p1Time={p1Time} p2Time={p2Time} currentPlayer={currentPlayer} TIME={time} />

      {promotionInfo && (
        <PromoteModal
          closeModal={() => setPromotionInfo(null)}
          setPiecesPlacement={setPiecesPlacement}
          promotionInfo={promotionInfo}
        />
      )}
    </div>
  );
}

export default React.memo(Game);
