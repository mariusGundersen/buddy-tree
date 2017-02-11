export interface Node {
  readonly level : number,
  readonly size : number,
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

export function allocate(tree : Node, size=1) : Allocation{
  if(tree.size < size || tree.used){
    return {
      tree,
      address: -1,
      count: 0,
      size: 0
    };
  }

  if(tree.size/2 < size){
    if(tree.left === null && tree.right === null){
      return {
        tree : {
          ...tree,
          used: true
        },
        address: tree.address,
        count: size,
        size: tree.size
      };
    }else{
      return {
        tree,
        address: -1,
        count: 0,
        size: 0
      };
    }
  }

  const {tree: left, address, size: allocatedSize, count} = allocate(tree.left || createNode(tree.size/2, tree.address), size);
  if(left === tree.left){
    const {tree: right, address, size: allocatedSize, count} = allocate(tree.right || createNode(tree.size/2, tree.address + tree.size/2), size);
    if(right === tree.right){
      return {
        tree,
        address: -1,
        count: 0,
        size: 0
      };
    }else{
      return {
        tree: {
          ...tree,
          used: left.used && right.used,
          left,
          right
        },
        address,
        count,
        size: allocatedSize
      };
    }
  }

  return {
    tree: {
      ...tree,
      used: left.used && tree.right != null && tree.right.used,
      left,
      right: tree.right
    },
    address,
    count,
    size: allocatedSize
  };
}


export function deallocate(tree : Node, address : number) : Node {
  return deallocateUnsafe(tree, address) || createNode(tree.size);
}

export function deallocateUnsafe(tree : Node, address : number) : Node | null{
  if(tree === null){
    return null;
  }

  let left = tree.left;
  let right = tree.right;
  if(address < tree.size/2){
    left = tree.left && deallocateUnsafe(tree.left, address);
  }else{
    right = tree.right && deallocateUnsafe(tree.right, address - tree.size/2);
  }

  if(left === null && right === null){
    return null;
  }

  const used = left != null && left.used && right != null && right.used ? true : false;

  return {
    ...tree,
    used,
    left,
    right
  };
}

export function createNode(size : number, address=0){
  return createFromLevel(log2(size), address);
}

export function createTree(size : number, address=0){
  return createFromLevel(log2(size), address);
}

export function createFromLevel(level : number, address=0) : Node{
  return {
    used: false,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    address: address
  };
}

export function log2(x : number){
  return Math.ceil(Math.log(x)/Math.LN2);
}

export function* range({address, count} : {address : number, count : number}){
  for(let x=address; x<address+count; x++){
    yield x;
  }
}