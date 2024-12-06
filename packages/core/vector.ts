export type Vector = [x: number, y: number]

export const vector = (x: number = 0, y: number = x): Vector => [x, y]

export const neg = ([x, y]: Vector): Vector => [-x, -y]
export const add = ([x1, y1]: Vector, [x2, y2]: Vector): Vector => [x1 + x2, y1 + y2]
export const sub = ([x1, y1]: Vector, [x2, y2]: Vector): Vector => [x1 - x2, y1 - y2]
export const mul = ([x, y]: Vector, scalar: number): Vector => [x * scalar, y * scalar]
export const div = ([x, y]: Vector, scalar: number): Vector => [x / scalar, y / scalar]
