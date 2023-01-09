import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import { payoutTable } from './payoutTable';

import { Reel } from './Reel';

const reel = [0, 2, 4, 0, 1, 5, 0, 1, 3, 0, 1, 2, 0, 3, 2, 4, 1, 3, 2, 1];

const randomNumberGenerator = () => {
  return Math.floor(Math.random() * reel.length);
};

const State = Object.freeze({
  IDLE: 'idle',
  SPINNING: 'spinning',
  SLOWING: 'slowing'
});

export default function App() {
  const SPIN_DURATION = 2000;
  const SPIN_VELOCITY = 100;
  const SPIN_INTERVAL = useRef();

  const [state, setState] = useState(State.IDLE);

  const [reels, setReels] = useState([0, 1, 2]);

  useEffect(() => {
    if (state === State.SPINNING) {
      setTimeout(() => {
        setState(State.SLOWING);
      }, SPIN_DURATION);      
    }

    if ([State.SPINNING, State.SLOWING].includes(state)) {
      console.log(state)
      SPIN_INTERVAL.current = setInterval(() => {
        setReels(s => s.map(n => n < reel.length - 1 ? ++n : 0));
        
        if (state === State.SLOWING) {
          clearInterval(SPIN_INTERVAL.current);
          setState(State.IDLE);
        }
      }, SPIN_VELOCITY);
    }

    return () => {
      clearInterval(SPIN_INTERVAL);
    };
  }, [state]);

  const spin = () => {
    setState(State.SPINNING);
  };


  // const [pos, setPos] = useState([0, 1, 2]);

  // const [spinning, setSpinning] = useState(false);
  // const stopSpinning = useRef(true);

  // const interval = useRef(null);

  // const spin = () => {
  //   setSpinning(true);
  //   stopSpinning.current = false;
  //   setPos([
  //     randomNumberGenerator(),
  //     randomNumberGenerator(),
  //     randomNumberGenerator(),
  //   ]);
  // };

  // useEffect(() => {
  //   if (spinning) {
  //     setTimeout(() => {
  //       stopSpinning.current = true;
  //     }, 1000);

  //     interval.current = setInterval(() => {
  //       if (
  //         stopSpinning.current &&
  //         randomNumbers.current.toString() === pos.toString()
  //       ) {
  //         setSpinning(false);
  //         clearInterval(interval.current);
  //       }

  //       randomNumbers.current = randomNumbers.current.map((number, index) => {
  //         if (stopSpinning.current && number === pos[index]) return number;
  //         return number < reel.length - 1 ? ++number : 0;
  //       });

  //       setReelPos(randomNumbers.current);
  //     }, 100);
  //   }
  // }, [spinning]);

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

      <button className="spin" disabled={state === State.SPINNING} onClick={spin}>
        SPIN
      </button>
    </div>
  );
}
