type Tuple<T, N, A extends T[] = []> = A['length'] extends N ? A : Tuple<T, N, [...A, T]>;
type Join<T extends unknown[], D extends string = ''> = T extends [] ? '' : T extends [string | number | boolean | bigint] ? `${T[0]}` : T extends [string | number | boolean | bigint, ...infer U] ? `${T[0]}${D}${Join<U, D>}` : string;
type StringTuple<T, N> = Join<Tuple<T, N>>;

export type Digit = 0 | 1;
export type Mask<N extends number> = StringTuple<Digit | 'x', N>;
export type Binary<N extends number> = StringTuple<Digit, N>;
export type Natural<Max extends number, R = never, A extends 1[] = [1]> = A['length'] extends Max
? R | A['length']
: Natural<Max, R | A['length'], [...A, 1]>;
