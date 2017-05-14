export interface Node {
  readonly level : number,
  readonly size : number,
  readonly usedSize : number,
  readonly address : number,
  readonly used : boolean,
  readonly left : Node | null,
  readonly right : Node | null
}

export interface Allocation {
  readonly tree : Node,
  readonly address : number,
  readonly count : number,
  readonly size : number
}
