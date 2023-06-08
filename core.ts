import { Digit } from './types.ts';

/* Content-addressable memory */
export class DiagonalMemoryCore {
  protected readonly capacity = 16;
  values: Digit[][] = [];

  constructor(values?: Digit[][]) {
    this.values =
      values ??
      Array.from({ length: this.capacity }, () =>
        Array.from({ length: this.capacity }, () => Math.round(Math.random()) as Digit)
      );
  }

  diagonalizeColumn = (column: Digit[], index: number) => [
    ...column.slice(this.capacity - index),
    ...column.slice(0, this.capacity - index),
  ];

  normalizeColumn = (index: number) => [
    ...this.values[index].slice(index),
    ...this.values[index].slice(0, index)
  ];

  diagonalize = () => this.values.map(this.diagonalizeColumn);
  normalize = () => this.values.map((_, index) => this.normalizeColumn(index));

  getWord = (index: number) => this.normalize()[index].join(' ');
  getColumn = (index: number) => this.normalize().map(column => column[index]).join(' ');

  compare(first: number, second: number, index = 0, nextG: Digit = 0, nextL: Digit = 0): 1 | 0 | -1 {
    if (index === this.capacity) return (nextL - nextG) as 1 | 0 | -1;
    const G = nextG || (!this.values[first][index] && this.values[second][index] && !nextL);
    const L = nextL || (this.values[first][index] && !this.values[second][index] && !nextG);
    return this.compare(first, second, index + 1, G as Digit, L as Digit);
  }
}
