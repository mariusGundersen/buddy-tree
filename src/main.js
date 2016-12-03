export function allocate(tree, size=1){
  if(tree.size < size){
    return [tree, -1];
  }

  if(tree.used){
    return [tree, -1];
  }

  if(tree.size/2 < size){
    if(tree.left === null && tree.right === null){
      return [{
        ...tree,
        used: true
      }, ...range(tree.address, size)];
    }else{
      return [tree, -1];
    }
  }

  let addresses = [-1];
  let left = tree.left;
  let right = tree.right;

  [left, ...addresses] = allocate(left || createNode(tree.size/2, tree.address), size);
  if(addresses[0] === -1){
    [right, ...addresses] = allocate(right || createNode(tree.size/2, tree.address + tree.size/2), size);
  }

  const used = left && left.used && right && right.used ? true : false;

  return [{
    ...tree,
    used,
    left,
    right
  }, ...addresses];
}

export function deallocate(tree, address){
  if(tree === null){
    return null;
  }

  let left = tree.left;
  let right = tree.right;
  if(address < tree.size/2){
    left = deallocate(tree.left, address);
  }else{
    right = deallocate(tree.right, address - tree.size/2);
  }

  if(left === null && right === null){
    return null;
  }

  const used = left && left.used && right && right.used ? true : false;

  return {
    ...tree,
    used,
    left,
    right
  };
}

export function createNode(size, address=0){
  return createFromLevel(log2(size), address);
}

export function createTree(size, address=0){
  return createFromLevel(log2(size), address);
}

export function createFromLevel(level, address=0){
  return {
    used: false,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    address: address
  };
}

export function log2(x){
  return Math.ceil(Math.log(x)/Math.LN2);
}

export function* range(from, size){
  for(let x=from; x<from+size; x++){
    yield x;
  }
}