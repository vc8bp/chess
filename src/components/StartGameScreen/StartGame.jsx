import { useState } from 'react';
import styles from './StartGame.module.css';

const timeControls = [
  { time: '1+0', label: 'Bullet', initialSeconds: 60 },
  { time: '2+1', label: 'Bullet', initialSeconds: 120 },
  { time: '3+0', label: 'Blitz', initialSeconds: 180 },
  { time: '3+2', label: 'Blitz', initialSeconds: 180 },
  { time: '5+0', label: 'Blitz', initialSeconds: 300 },
  { time: '5+3', label: 'Blitz', initialSeconds: 300 },
  { time: '10+0', label: 'Rapid', initialSeconds: 600 },
  { time: '10+5', label: 'Rapid', initialSeconds: 600 },
  { time: '15+10', label: 'Rapid', initialSeconds: 900 },
  { time: '30+0', label: 'Classical', initialSeconds: 1800 },
  { time: '30+20', label: 'Classical', initialSeconds: 1800 },
];

const StartGame = ({setTime}) => {

  return (
    <div className={styles.gridContainer}>
      {timeControls.map((control, index) => (
        <div
          key={index}
          className={styles.gridItem}
          onClick={() => setTime(control.initialSeconds)}
        >
          <div className={styles.time}>{control.time}</div>
          <div className={styles.label}>{control.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StartGame;
