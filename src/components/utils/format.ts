export const round = (value: number, precision = 2) => 
  Math.round(value * 10 ** precision) / 10 ** precision;

export const formatPercent = (value: number, max: number, precision = 1) =>
  round((value / max) * 100, precision) + '%';