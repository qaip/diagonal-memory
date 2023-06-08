import { Digit } from './types.ts';

export const printTitle = (input: string) => console.log(`%c(--)\t${input}`, 'color: blue');

type T = Digit[] | Digit[][];
export const printable = (argument: T, compareTo?: Digit[] | string, title?: string) => {
  if (title) printTitle(title);
  const isMatrix = (arg: T): arg is Digit[][] => arg[0] instanceof Array;
  const print = (value: Digit[]) =>
    console.log(
      `%c(${toDecimal(value)})\t${value.map((digit) => `%c${digit}`).join('')}`,
      'color: yellow',
      ...value.map((digit, position) => `color: ${!compareTo || digit === +compareTo[position] ? 'green' : 'red'}`)
    );
  (argument as T & { print: () => void }).print = () =>
    isMatrix(argument) ? (argument.forEach((value) => print(value)), console.log()) : print(argument);
  return argument as T & { print: () => void };
};

export const toBinary = (decimal: number, capacity: number) => {
  const binary: Digit[] = [];
  while (decimal) {
    binary.unshift((decimal % 2) as Digit);
    decimal >>= 1;
  }
  while (binary.length < capacity) binary.unshift(0);
  return binary;
};

export const toDecimal = (value: Digit[]) => {
  const length = value.length - 1;
  return value.reduce<number>((result, digit, index) => result + (digit && index && 2 ** (length - index)), 0);
};

export const print = (values: Digit[][]) =>
  console.table(values.map((_, rowIndex) => values.map((row) => row[rowIndex])));
