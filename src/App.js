import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import { symbols } from './symbols';
import { payoutTable } from './payoutTable';

import { Reel, reelIndex } from './Reel';

const State = Object.freeze({
  IDLE: 'idle',
  SPINNING: 'spinning',
  SLOWING: 'slowing',
});

export default function App() {
  const SPIN_DURATION = 1000;
  const SPIN_VELOCITY = 100;
  const SPIN_INTERVAL = useRef();
  const COST_PER_SPIN = 0.25;
  const MAX_BET = 3;

  const stateRef = useRef(State.IDLE);

  const [reels, setReels] = useState([7, 1, 2]);
  const [credit, setCredit] = useState(0);
  const [betAmount, setBetAmount] = useState(1);
  const [win, setWin] = useState(0);
  const [log, setLog] = useState([]);

  const getPayout = (reels) => {
    const combination = reels.map((item) => reelIndex[item]);

    const payout = payoutTable.find(
      (item) => item.combination.toString() === combination.toString()
    );

    return (
      (payout ? payout?.amount : combination[0] === 0 ? 1.25 : 0) * betAmount
    );
  };

  const spin = () => {
    if (betAmount * COST_PER_SPIN > credit) return;

    setCredit((s) => s - COST_PER_SPIN * betAmount);

    let reelsTemp = reels;

    const random = [
      Math.floor(Math.random() * reelIndex.length),
      Math.floor(Math.random() * reelIndex.length),
      Math.floor(Math.random() * reelIndex.length),
    ];

    stateRef.current = State.SPINNING;

    setTimeout(() => {
      stateRef.current = State.SLOWING;
    }, SPIN_DURATION);

    SPIN_INTERVAL.current = setInterval(() => {
      reelsTemp = reelsTemp.map((n, i) => {
        if (stateRef.current === State.SLOWING && n === random[i]) return n;
        return n < reelIndex.length - 1 ? ++n : 0;
      });

      setReels(reelsTemp);

      if (
        stateRef.current === State.SLOWING &&
        random.toString() === reelsTemp.toString()
      ) {
        const payout = getPayout(reelsTemp);
        setWin((s) => payout + s);

        clearInterval(SPIN_INTERVAL.current);
        stateRef.current = State.IDLE;
      }
    }, SPIN_VELOCITY);
  };

  const coin = () => {
    setCredit((s) => (s += 0.25));
  };

  const handleBet = () => {
    setBetAmount((s) => (s < MAX_BET ? ++s : 1));
  };

  return (
    <div className="machine">
      <div className="container line">
        {reels.map((index, key) => (
          <Reel key={key} index={index} />
        ))}
      </div>

      <div className="container">
        <div className="bet-amount">
          <div className="label">Bet</div>
          <div>${(betAmount * 0.25).toFixed(2)}</div>
        </div>
        <div className="win">
          <div className="label">Win</div>
          <div>${win.toFixed(2)}</div>
        </div>
        <div className="credit">
          <div className="label">Credit</div> <div>${credit.toFixed(2)}</div>
        </div>
      </div>

      <div className="container">
        <button
          className="bet"
          disabled={stateRef.current !== State.IDLE}
          onClick={handleBet}
        >
          {betAmount}
        </button>

        <button
          className="spin"
          disabled={stateRef.current !== State.IDLE || !credit}
          onClick={spin}
        >
          SPIN
        </button>

        <button
          className="coin"
          disabled={stateRef.current !== State.IDLE}
          onClick={coin}
        >
          25¢
        </button>
      </div>

      <div className="payout-table">
        <div className="puyout-table-col">
          {payoutTable.map((item) => (
            <div className="payout-table-row">
              {item.combination.map((item) => symbols[item])}
            </div>
          ))}
          <div className="payout-table-row">{symbols[0]}❓❓</div>
        </div>

        <div className="puyout-table-col">
          <div className="payout-table-header">1 Credit</div>
          {payoutTable.map((item) => (
            <div className="payout-table-row">${item.amount}</div>
          ))}
          <div className="payout-table-row">${(0.5 * 1).toFixed(2)}</div>
        </div>

        <div className="puyout-table-col">
          <div className="payout-table-header">2 Credit</div>
          {payoutTable.map((item) => (
            <div className="payout-table-row">${item.amount * 2}</div>
          ))}
          <div className="payout-table-row">${(0.5 * 2).toFixed(2)}</div>
        </div>

        <div className="puyout-table-col">
          <div className="payout-table-header">3 Credit</div>
          {payoutTable.map((item) => (
            <div className="payout-table-row">${item.amount * 3}</div>
          ))}
          <div className="payout-table-row">${(0.5 * 3).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
