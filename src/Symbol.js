import React from 'react';

import { symbols } from './symbols';

export function Symbol({ index }) {
  return <div className="symbol">{symbols[index]}</div>;
}
