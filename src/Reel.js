import React, { useEffect } from 'react';
import { Symbol } from './Symbol';

export function Reel({ index, state }) {
  const data = [0, 2, 4, 0, 1, 5, 0, 1, 3, 0, 1, 2, 0, 3, 2, 4, 1, 3, 2, 1];

  return (
    <div className="reel">
      <Symbol index={data[index]} />
    </div>
  );
}
