import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import { payoutTable } from './payoutTable';

import { Reel } from './Reel';

const reel = [0, 2, 4, 0, 1, 5, 0, 1, 3, 0, 1, 2, 0, 3, 2, 4, 1, 3, 2, 1];

const State = Object.freeze({
  IDLE: 'idle',
  SPINNING: 'spinning',
  SLOWING: 'slowing'
});

export default function App() {
  const SPIN_DURATION = 2000;
  const SPIN_VELOCITY = 100;
  const SPIN_INTERVAL = useRef();

  const stateRef = useRef(State.IDLE);

  const [reels, setReels] = useState([0, 1, 2]);

  const spin = () => {
    let reelsTemp = reels;
    
    const random = [
      Math.floor(Math.random() * reel.length),
      Math.floor(Math.random() * reel.length),
      Math.floor(Math.random() * reel.length)
    ];

    stateRef.current = State.SPINNING;

    setTimeout(() => {
      stateRef.current = State.SLOWING;
    }, SPIN_DURATION);

    SPIN_INTERVAL.current = setInterval(() => {

      reelsTemp = reelsTemp.map((n, i) => {
        if (stateRef.current === State.SLOWING && n === random[i]) return n;
        return n < reel.length - 1 ? ++n : 0;
      })

      setReels(reelsTemp);

      if (stateRef.current === State.SLOWING && random.toString() === reelsTemp.toString()) {
        stateRef.current = State.IDLE;
        clearInterval(SPIN_INTERVAL.current);
      }
    }, SPIN_VELOCITY);
  };

  return (
    <div className="machine">

      <div className="container">
        {reels.map((index, key) => (
          <Reel key={key} index={index} state={} />
        ))}
      </div>

      {/* <div>
        <div className="payout">
          {payoutTable.find(
            (item) =>
              item.combination.toString() ===
              pos.map((item) => reel[item]).toString()
          )?.amount || 0}
        </div>
      </div> */}

      <button className="spin" disabled={stateRef.current !== State.IDLE} onClick={spin}>
        SPIN
      </button>
    </div>
  );
}
