import React from 'react';
import style from "./BoardInfo.module.css";
import { BiSolidArrowToLeft, BiSolidArrowToRight, BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import { piceImageMap } from '../../assets/constants';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function BoardInfo({ currentPlayer, p2Time, p1Time, TIME, history }) {
    
  return (
    <div className={style.boardInfo}>
      <div className={`${style.player} ${style.top} ${currentPlayer === 'P2' ? style.activePlayer : ''}`}>
        <div className={style.timer}>{formatTime(p2Time)}</div>
      </div>

      <div className={style.centerSection}>
        <span className={style.border} style={{width: `${p2Time * 100 / TIME}%`}}></span>
        <div className={style.title}><p>Anonymous</p></div>
        <div className={style.moveList}>
          <div className={style.movesRow}>
            <div className={`${style.move} ${style.icon}`}><BiSolidArrowToLeft /></div>
            <div className={style.move}><BiSolidLeftArrow /></div>
            <div className={style.move}><BiSolidRightArrow /></div>
            <div className={`${style.move} ${style.icon}`}><BiSolidArrowToRight /></div>
          </div>
            {history.map((move, index) => {
                if (index % 2 === 0) {
                    return (
                        <div className={style.movesRow} key={index}>
                            <div className={style.move}>
                                <img src={piceImageMap[move.piece]}  alt={move.piece}  className={style.pieceIcon} />
                                {move.from + move.to}
                            </div> 

                            {history[index + 1] && (
                            <div className={style.move}>
                                <img src={piceImageMap[history[index + 1].piece]}  alt={history[index + 1].piece}  className={style.pieceIcon} />
                                {history[index + 1].from + history[index + 1].to}
                            </div>
                            )}
                        </div>
                    );
                }
                return null;
            })}

        </div>
        <div className={style.options}>
          <button className={style.rematchButton}>REMATCH</button>
          <button className={style.opponentButton}>NEW OPPONENT</button>
        </div>
        <span style={{border:"1px solid rgb(101 97 97)"}}></span>
        <div className={style.title}><p>Anonymous</p></div>
        <span className={style.border} style={{width: `${p1Time * 100 / TIME}%`}}></span>
      </div>

      <div className={`${style.player} ${style.bottom} ${currentPlayer === 'P1' ? style.activePlayer : ''}`}>
        <div className={style.timer}>{formatTime(p1Time)}</div>
      </div>
    </div>
  );
}

export default BoardInfo;
