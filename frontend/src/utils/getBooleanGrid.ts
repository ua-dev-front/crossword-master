import { State } from 'store';

export default function getBooleanGrid(grid: State['grid']) {
  return grid.map((row) => row.map((cell) => !!cell));
}
