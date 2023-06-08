import { DiagonalMemoryCore } from './core.ts';
import { printable, printTitle } from './pretty.ts';
import { Binary, Digit } from './types.ts';

/* Content-addressable memory */
export class DiagonalMemory extends DiagonalMemoryCore {
  constructor(values?: Digit[][]) {
    super(values);
  }

  operationF1() {
    const column1 = this.normalizeColumn(1);
    const column2 = this.normalizeColumn(2);
    const result = column1.map((x1, rowIndex) => (x1 & column2[rowIndex]) as Digit);
    this.values[1] = this.diagonalizeColumn(result, 1);
  }

  operationF3() {
    this.values[3] = this.diagonalizeColumn(this.normalizeColumn(1), 3);
  }

  operationF12() {
    const result = this.normalizeColumn(1).map((x1) => (1 - x1) as Digit);
    this.values[12] = this.diagonalizeColumn(result, 12);
  }

  operationF14() {
    const column1 = this.normalizeColumn(1);
    const column2 = this.normalizeColumn(2);
    const result = column1.map((x1, rowIndex) => (1 - (x1 & column2[rowIndex])) as Digit);
    this.values[14] = this.diagonalizeColumn(result, 14);
  }

  findNearest(input: Binary<typeof this.capacity>, options = { verbose: false }) {
    if (options.verbose) printTitle(input);
    const counters: number[] = Array.from({ length: this.values.length }, () => 0);
    for (const [position, digit] of input.split('').map(Number).entries()) {
      for (const [index, value] of this.values.entries()) {
        if (value[position] === digit) counters[index]++;
      }
    }
    const maxCounter = Math.max(...counters);
    let maxValueIndex = -1;
    for (const [index, counter] of counters.entries()) {
      if (counter === maxCounter) {
        if (options.verbose) printable(this.values[index], input).print();
        if (maxValueIndex === -1 || this.compare(index, maxValueIndex) === 1) {
          maxValueIndex = index;
        }
      }
    }
    if (options.verbose) console.log();
    return printable(this.values[maxValueIndex]);
  }

  
  findByMask(mask: string) {
    const flags: Digit[] = Array.from({ length: this.capacity }, () => 1);
    for (const [position, digit] of mask.split('').map(Number).entries()) {
      for (const [index, value] of this.values.entries()) {
        if (flags[index] === 1 && !isNaN(digit) && digit !== value[position]) {
          flags[index] = 0; // (¬Fi) & (Xi | Ai ~ Si)
        }
      }
    }

    const buffer = this.values.filter((_, index) => flags[index] === 1)
    const bufferA = buffer.map(row => row.slice(3, 7))
    const bufferB = buffer.map(row => row.slice(7, 11))
    const result = bufferA.map((row, rowIndex) => this.addBinary(row, bufferB[rowIndex]) as Digit[]);
    let done = 0
    for (const [index, flag] of flags.entries()) {
      if (flag) {
        console.log(index, '\t', bufferA[done].join(' '), '+', bufferB[done].join(' '), '=', result[done].join(' '))
        for (let position = 11; position < 16; position++) {
          this.values[index][position] = result[done][position - 11]
        }
        done++
      }
    }
    return printable(result, undefined, mask);
  }

  addBinary(first: Digit[], second: Digit[]) {
    let carry = 0;
    const result: Digit[] = []
    for (let position = 3; position >= 0; position--) {
      const sum = carry + first[position] + second[position]
      if (sum > 1) carry = 1
      result.unshift((sum % 2) as Digit)
    }
    result.unshift(carry as Digit)
    return result
  }
}
