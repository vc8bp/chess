import React, { useEffect, useState } from 'react';
import style from './PromoteModal.module.css';
import { piceImageMap } from '../../assets/constants';

const promotionPieces = [ "queen", "rook", "bishop", "knight" ];

const PromoteModal = ({ closeModal, setPiecesPlacement, promotionInfo }) => {
  if (!promotionInfo) return null;
  const [options, setOptions] = useState([])

  const handlePromotion = (selectedPiece) => {
    setPiecesPlacement((prev) => ({
      ...prev,
      [promotionInfo.to]: selectedPiece,
      [promotionInfo.from]: null,
    }));
    closeModal();
  };

  useEffect(() => {
    const [color] = promotionInfo.piece;
    setOptions(promotionPieces.map(piece => `${color}-${piece}`))
  },[promotionInfo])


  return (
    <div className={style.modalBackdrop} onClick={closeModal}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Promote Pawn</h3>
        <div className={style.pieces}>
          {options.map((piece, index) => (
            <div 
              key={index} 
              className={style.pieceOption} 
              onClick={() => handlePromotion(piece)}
            >
              <img src={piceImageMap[piece]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PromoteModal);
