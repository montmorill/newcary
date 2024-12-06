export type FixedArray<T, N extends number, A extends T[] = []> =
  A['length'] extends N ? A : FixedArray<T, N, [...A, T]>
