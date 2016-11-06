# buddy-tree

> Immutable buddy memory allocation

## Installation

    npm install --save buddy-tree

## Usage

```js
import * as buddyTree from 'buddy-tree'

let tree = buddyTree.createTree(16);
[tree, address1] = buddyTree.allocate(tree, 1);
[tree, address2] = buddyTree.allocate(tree, 1);
[tree, address3] = buddyTree.allocate(tree, 4);
tree = buddyTree.deallocate(tree, address2);
```

## Methods

### `buddyTree.allocate(tree, size=1)`

Find a contiguous free span of memory of `size` and consumes it. Returns the modified tree and the address of the memory.

Consumes `2ⁿ >= size` of the memory. This means in the worst case half the memory is wasted.

```js
const tree = buddyTree.createTree(16);
const [result, address] = buddyTree.allocate(tree, 7);
```

### `buddyTree.deallocate(tree, address)`

Frees all the memory consumed at the address. Returns the modified tree.