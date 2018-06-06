import test from 'ava';
import * as buddy from '../es/main.js';

test('when allocating the full memory', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address} = buddy.allocate(tree, tree.size);
  t.is(address, 0);
  t.not(tree, result);
  t.true(result.used);
  t.is(result.usedSize, 16);
});

test('when allocating the full memory twice', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size);
  t.is(address1, 0);
  t.not(tree, tree1);
  t.is(tree1, tree2);
  t.true(tree2.used);
  t.is(address2, -1);
});

test('when allocating half the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address} = buddy.allocate(tree, tree.size/2);
  t.is(address, 0);
  t.not(tree, result);
  t.false(result.used);
  t.truthy(result.left);
  t.falsy(result.right);
  t.true(result.left.used);
  t.is(result.maxBlock, 8);
  t.is(result.usedSize, 8);
  t.is(result.left.usedSize, 8);
});

test('when allocating one slots', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address, size, count} = buddy.allocate(tree);
  t.is(address, 0);
  t.is(size, 1);
  t.is(count, 1);
  t.is(result.usedSize, 1);
  t.is(result.maxBlock, 8);
});

test('when allocating three slots', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address, size, count} = buddy.allocate(tree, 3);
  t.is(address, 0);
  t.is(size, 4);
  t.is(count, 3);
  t.is(result.usedSize, 3);
  t.is(result.maxBlock, 8);
});

test('when allocating three and three slots', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1, size: size1, count: count1} = buddy.allocate(tree, 3);
  const {tree: result, address: address2, size: size2, count: count2} = buddy.allocate(tree1, 3);
  t.is(address1, 0);
  t.is(size1, 4);
  t.is(count1, 3);
  t.is(address2, 4);
  t.is(size2, 4);
  t.is(count2, 3);
  t.is(result.usedSize, 6);
  t.is(result.maxBlock, 8);
});

test('when allocating half the memory twice', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size/2);
  t.is(address1, 0);
  t.is(address2, tree.size/2);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.true(tree2.used);
  t.truthy(tree2.left);
  t.truthy(tree2.right);
  t.true(tree2.left.used);
  t.true(tree2.right.used);
  t.is(tree2.maxBlock, 0);
});

test('when allocating half the memory then the full memory', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size);
  t.is(address1, 0);
  t.is(address2, -1);
  t.not(tree, tree1);
  t.is(tree1, tree2);
  t.false(tree2.used);
  t.truthy(tree2.left);
  t.falsy(tree2.right);
  t.true(tree2.left.used);
});

test('when allocating a bit less than half the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address} = buddy.allocate(tree, tree.size/2-1);
  t.is(address, 0);
  t.not(tree, result);
  t.false(result.used);
  t.truthy(result.left);
  t.falsy(result.right);
  t.true(result.left.used);
  t.is(result.usedSize, 7);
  t.is(result.maxBlock, 8);
});

test('when allocating a bit more than half the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: result, address} = buddy.allocate(tree, tree.size/2+1);
  t.is(address, 0);
  t.not(tree, result);
  t.true(result.used);
  t.falsy(result.left);
  t.falsy(result.right);
  t.is(result.usedSize, 9);
  t.is(result.maxBlock, 0);
});

test('when deallocating the full memory', t => {
  const tree = {
    ...buddy.createTree(16),
    used: true,
    usedSize: 16
  };
  const result = buddy.deallocateUnsafe(tree, tree.address);
  t.not(tree, result);
  t.is(result, null);
});


test('when safely deallocating the full memory', t => {
  const tree = {
    ...buddy.createTree(16),
    used: true,
    usedSize: 16
  };
  const result = buddy.deallocate(tree, tree.address);
  t.not(tree, result);
  t.not(result, null);
  t.deepEqual(result, buddy.createTree(16));
  t.is(result.maxBlock, 16);
});

test('when allocating then deallocating half the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address} = buddy.allocate(tree, tree.size/2);
  const result = buddy.deallocateUnsafe(tree1, address);
  t.not(tree, tree1);
  t.not(tree1, result);
  t.is(result, null);
});

test('when allocating half the memory twice, then deallocating the first half of the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size/2);
  const result = buddy.deallocateUnsafe(tree2, address1);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.not(tree2, result);
  t.false(result.used);
  t.falsy(result.left);
  t.truthy(result.right);
  t.true(result.right.used);
  t.is(result.usedSize, tree.size/2);
  t.is(result.maxBlock, 8);
});

test('when allocating half the memory twice, then deallocating the second half of the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size/2);
  const result = buddy.deallocateUnsafe(tree2, address2);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.not(tree2, result);
  t.false(result.used);
  t.truthy(result.left);
  t.falsy(result.right);
  t.true(result.left.used);
  t.is(result.usedSize, tree.size/2);
  t.is(result.maxBlock, 8);
});

test('when allocating half the memory twice, then deallocating both halves of the memory', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size/2);
  const tree3 = buddy.deallocateUnsafe(tree2, address1);
  const result = buddy.deallocateUnsafe(tree3, address2);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.not(tree2, tree3);
  t.not(tree3, result);
  t.is(result, null);
});

test('when allocating half the memory twice, then deallocating both halves of the memory in reverse order', t => {
  const tree = buddy.createTree(16);
  const {tree: tree1, address: address1} = buddy.allocate(tree, tree.size/2);
  const {tree: tree2, address: address2} = buddy.allocate(tree1, tree.size/2);
  const tree3 = buddy.deallocateUnsafe(tree2, address2);
  const result = buddy.deallocateUnsafe(tree3, address1);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.not(tree2, tree3);
  t.not(tree3, result);
  t.is(result, null);
});

test('when allocating, deallocating and allocating 1 block', t => {
  const tree = buddy.createTree(4);
  const {tree: tree1} = buddy.allocate(tree, 2);
  const {tree: tree2, address: address1} = buddy.allocate(tree1);
  const tree3 = buddy.deallocateUnsafe(tree2, address1);
  const {tree: result, address: address2} = buddy.allocate(tree3);
  t.not(tree, tree1);
  t.not(tree1, tree2);
  t.not(tree2, tree3);
  t.not(tree3, result);
  t.is(address1, address2);
  t.is(result.usedSize, 3);
  t.is(result.maxBlock, 1);
});

test('range of addresses', t => {
  const tree = buddy.createTree(8);
  const {tree: tree1} = buddy.allocate(tree, 2);
  const {tree: tree2, ...allocation} = buddy.allocate(tree1, 3);

  const addresses = [...buddy.range(allocation)];
  t.deepEqual(addresses, [4, 5, 6]);
});

test('old node to new node', t => {
  const tree = {
    used: false,
    left: {
      used: false,
      left: null,
      right: {
        used: false,
        left: null,
        right: {
          used: true,
          left: null,
          right: null,
          level: 0,
          size: 1,
          usedSize: 1,
          address: 3
        },
        level: 1,
        size: 2,
        usedSize: 0,
        address: 2
      },
      level: 2,
      size: 4,
      usedSize: 0,
      address: 0
    },
    right: null,
    level: 3,
    size: 8,
    usedSize: 0,
    address: 0
  }

  const result = buddy.modernize(tree);

  t.is(result.maxBlock, 4);
  t.is(result.left.maxBlock, 2);
  t.is(result.left.right.maxBlock, 1);
})