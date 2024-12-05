export interface Vector {
  x: number
  y: number
}

export function vector(x: number = 0, y: number = x): Vector {
  return { x, y }
}

export const copy = (vec: Vector): Vector => vector(vec.x, vec.y)
export const neg = (vec: Vector): Vector => vector(-vec.x, -vec.y)
export const add = (left: Vector, right: Vector): Vector => vector(left.x + right.x, left.y + right.y)
export const sub = (left: Vector, right: Vector): Vector => add(left, neg(right))
export const mul = (vec: Vector, scalar: number): Vector => vector(vec.x * scalar, vec.y * scalar)
export const div = (vec: Vector, scalar: number): Vector => mul(vec, 1 / scalar)
export const dot = (left: Vector, right: Vector): number => left.x * right.x + left.y * right.y
export const magnitude = (vec: Vector): number => Math.sqrt(dot(vec, vec))
export const normalized = (vec: Vector): Vector => div(vec, magnitude(vec))
