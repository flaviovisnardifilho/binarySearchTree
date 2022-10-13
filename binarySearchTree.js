/*
 * Binary Search Tree using classes
 */

// gived sorted array, find the middle and make it root

// recursively do the same for left and right child

class Node {
  // data = null;
  // left = null;
  // right = null;

  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  root;

  constructor(arr) {
    this.root = this.buildTree(arr);
  }

  /*
  buildTree(arr, start = 0, end = arr.length - 1) {
    if (start > end) return null;
    const mid = (start + end) / 2;
    const root = new Node(arr[mid]);

    root.left = this.buildTree(arr, start, mid - 1);
    root.right = this.buildTree(arr, mid + 1, end);

    return root;
    */

  buildTree(arr) {
    if (arr.length < 1) return null;

    const mid = Math.floor(arr.length / 2);
    const data = arr[mid];

    const left = this.buildTree(arr.slice(0, mid));
    const right = this.buildTree(arr.slice(mid + 1));
    const root = new Node(data, left, right);

    return root;
  }

  insert(value, node = this.root) {
    if (value === node.data) {
      console.log(`${value} alread exists!`);
      return;
    }

    if (value < node.data && node.left === null) {
      const newNode = new Node(value);
      node.left = newNode;
      // console.log(`${value} inserted on ${node.data} left!`);
      return;
    } else if (value < node.data) {
      this.insert(value, node.left);
    }

    if (value > node.data && node.right === null) {
      const newNode = new Node(value);
      node.right = newNode;
      // console.log(`${value} inserted on ${node.data} right!`);
      return;
    } else if (value > node.data) {
      this.insert(value, node.right);
    }
  }

  delete(value, node = this.root, parent = node, isLeft = true) {
    // node parent
    //TODO check if node === parent

    if (node === null) {
      console.log(`${value} not found!`);
      return;
    }

    if (value < node.data) {
      this.delete(value, node.left, node, true);
      return;
    }
    if (value > node.data) {
      this.delete(value, node.right, node, false);
      return;
    }

    if (node.data === value) {
      // if leaft just remove
      if (node.left === null && node.right === null) {
        isLeft ? (parent.left = null) : (parent.right = null);
        console.log(`${value} deleted`);
        return;
      }

      // if one child copy child to node and delete child
      if (node.left != null && node.right === null) {
        isLeft ? (parent.left = node.left) : (parent.right = node.right);
        console.log(`${value} deleted`);
        return;
      }
      if (node.left === null && node.right != null) {
        isLeft ? (parent.left = node.left) : (parent.right = node.right);
        console.log(`${value} deleted`);
        return;
      }

      // if two children find inorder sucessor, copy contents of sucessor and delete sucessor
      let sucessor = node.right;
      let sucessorParent = node;
      isLeft = false;
      while (sucessor.left != null) {
        sucessorParent = sucessor;
        sucessor = sucessor.left;
        isLeft = true;
      }

      this.delete(sucessor.data, sucessor, sucessorParent, isLeft);

      node.data = sucessor.data;
      isLeft ? (sucessor.left = null) : (sucessor.right = null);
      console.log(`${value} -> ${sucessor.data}`);
    }
  }

  find(value, node = this.root) {
    if (node === null) return null;
    if (node.data === value) {
      return node;
    }

    if (value < node.data) {
      node = this.find(value, node.left);
    } else {
      node = this.find(value, node.right);
    }

    return node;
  }

  levelOrder(cb) {
    let node = this.root;
    let queue = [node];
    const array = [];

    while (queue.length > 0) {
      node = queue.shift();

      // cb ? cb(node) : array.push(node);
      cb ? cb(node) : array.push(node.data);

      if (node.left != null) {
        queue.push(node.left);
      }
      if (node.right != null) {
        queue.push(node.right);
      }
      if (cb) {
        cb(node);
      }
    }

    // if (!cb) return array.map((i) => i.data);
    if (!cb) return array;
  }

  inorder(cb, node = this.root, stack = []) {
    if (node === null) return;

    this.inorder(cb, node.left, stack);
    cb ? cb(node) : stack.push(node.data);
    this.inorder(cb, node.right, stack);

    return stack;
  }

  postorder(cb, node = this.root, stack = []) {
    if (node === null) return;

    this.postorder(cb, node.left, stack);
    this.postorder(cb, node.right, stack);
    cb ? cb(node) : stack.push(node.data);

    return stack;
  }

  preorder(cb, node = this.root, stack = []) {
    if (node === null) return;

    cb ? cb(node) : stack.push(node.data);
    this.preorder(cb, node.left, stack);
    this.preorder(cb, node.right, stack);

    return stack;
  }

  height(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    let root = this.root;
    let counter = 0;

    while (node.data != root.data) {
      if (node.data > root.data) {
        root = root.right;
      } else {
        root = root.left;
      }
      counter++;
    }

    return counter;
  }

  isBalanced(node = this.root) {
    if (node === null) return;

    let leftNode = node.left;
    let rightNode = node.right;

    if (Math.abs(this.height(leftNode) - this.height(rightNode)) > 1) {
      return false;
    } else {
      return true;
    }
  }

  rebalance() {
    const newArray = this.inorder();
    this.root = this.buildTree(newArray);
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
}

function createRandomArray(min = 0, max = 50) {
  let arr = [];
  for (let i = min; i <= max; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }
  arr = [...new Set(arr)]; // unique values
  arr.sort((a, b) => a - b); // sorted

  return arr;
}

let myArray = createRandomArray();
console.log({ myArray });

const BST = new BinarySearchTree(myArray);
const nodeValue3 = BST.find(3);
console.log({ nodeValue3 });

const levelOrder = BST.levelOrder();
console.log({ levelOrder });

const inorder = BST.inorder();
console.log({ inorder });

const postorder = BST.postorder();
console.log({ postorder });
const preorder = BST.preorder();
console.log({ preorder });

BST.prettyPrint();
BST.delete(21);
BST.prettyPrint();

const height = BST.height();
console.log({ height });

const root = BST.buildTree(myArray);
console.log(`DEPTH of Node: ${root.right.left.left.data}`);
const depth = BST.depth(root.right.left.left);
console.log({ depth });

console.log(`The Tree is balanced: ${BST.isBalanced()}`);

function insertALot() {
  lotOfNumbers = createRandomArray(45, 145);
  // console.log(lotOfNumbers)
  lotOfNumbers.map((i) => BST.insert(i));
  BST.prettyPrint();
}

insertALot();
console.log(`The Tree is balanced: ${BST.isBalanced()}`);

BST.rebalance();

BST.prettyPrint();
console.log(`Is balanced: ${BST.isBalanced()}`);
