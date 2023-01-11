import React, { useEffect } from 'react';
import { Symbol } from './Symbol';

export const reelIndex = [
  0, 2, 4, 0, 1, 5, 0, 3, 7, 0, 6, 2, 8, 1, 3, 7, 2, 1, 0, 3, 2, 4,
];

export function Reel({ index, state }) {
  return (
    <>
      <div className="reel">
        <Symbol
          index={reelIndex[index > 0 ? index - 1 : reelIndex.length - 1]}
        />
        <Symbol index={reelIndex[index]} />
        <Symbol
          index={reelIndex[index < reelIndex.length - 1 ? index + 1 : 0]}
        />
      </div>
    </>
  );
}
