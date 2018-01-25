export interface BaseNode {
  readonly level : number,
  readonly size : number,
  readonly usedSize : number,
  readonly address : number,
  readonly used : boolean,
  readonly left : Node | null,
  readonly right : Node | null
}

export interface Node extends BaseNode {
  readonly maxBlock : number
}

export interface OldNode extends BaseNode {
  readonly maxBlock : undefined
}

export interface Allocation {
  readonly tree : Node,
  readonly address : number,
  readonly count : number,
  readonly size : number
}
