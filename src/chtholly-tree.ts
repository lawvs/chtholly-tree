type Value = number;

// [left, right]
export type ChthollyNode<T> = {
  left: number;
  right: number;
  value: T;
  next: ChthollyNode<T> | null;
};

export function createDefaultNode(value = 0): ChthollyNode<number> {
  return {
    left: -Infinity,
    right: Infinity,
    value,
    next: null,
  };
}

export class ChthollyTree<T = Value> {
  // [min, max]
  min: number;
  max: number;
  root: ChthollyNode<T>;

  constructor(node: ChthollyNode<T>) {
    this.min = node.left;
    let lastNode = node;
    while (lastNode.next) lastNode = lastNode.next;
    this.max = lastNode.right;
    this.root = node;
  }

  /**
   * It takes a position `pos` and splits the original interval containing point `pos` (denoted as [left, right])
   * into two intervals [left, pos) and [pos, right], and returns an the latter node.
   */
  split(pos: number): ChthollyNode<T> {
    if (pos < this.min || pos > this.max)
      throw new Error("Position is out of range");
    let node: ChthollyNode<T> | null = this.root;
    while (node !== null) {
      if (node.left === pos) return node;
      if (node.left <= pos && pos <= node.right) {
        const newNode: ChthollyNode<T> = {
          left: pos,
          right: node.right,
          value: node.value,
          next: node.next,
        };
        node.right = pos - 1;
        node.next = newNode;
        return newNode;
      }
      node = node.next;
    }
    throw new Error("Unreachable");
  }

  /**
   * Used to assign a value to a range.
   * Suppose the range [left, right] is to be assigned the value `value`.
   */
  assign(left: number, right: number, value: T): ChthollyNode<T> {
    if (left > right) throw new Error("Range is invalid");
    if (left < this.min || right > this.max)
      throw new Error("Range is out of range");

    const leftNode = this.split(left);
    const rightNode = right + 1 > this.max ? null : this.split(right + 1);
    const newNode: ChthollyNode<T> = {
      left,
      right,
      value,
      next: null,
    };

    if (this.root === leftNode) {
      this.root = newNode;
      newNode.next = rightNode;
      return newNode;
    }
    let preLeftNode: ChthollyNode<T> = this.root;
    while (preLeftNode.next !== leftNode) {
      if (!preLeftNode.next) throw new Error("Unreachable");
      preLeftNode = preLeftNode?.next;
    }
    preLeftNode.next = newNode;
    newNode.next = rightNode;
    return newNode;
  }

  /**
   * Performs an action on all nodes within the specified range [left, right].
   *
   * The return value of the action function is assigned to the node.
   */
  perform(
    left: number,
    right: number,
    action: (node: Readonly<ChthollyNode<T>>) => T,
  ): void {
    if (left > right) throw new Error("Range is invalid");
    if (left < this.min || right > this.max)
      throw new Error("Range is out of range");

    let currentNode: ChthollyNode<T> | null = this.split(left);
    const rightNode = right + 1 > this.max ? null : this.split(right + 1);

    while (currentNode && currentNode !== rightNode) {
      currentNode.value = action(currentNode);
      currentNode = currentNode.next;
    }
  }

  /**
   * Queries the tree for nodes within the specified range [left, right] and applies the read function to each node.
   */
  query(
    left: number,
    right: number,
    read: (node: Readonly<ChthollyNode<T>>) => void,
  ): void {
    if (left > right) throw new Error("Range is invalid");
    if (left < this.min || right > this.max)
      throw new Error("Range is out of range");

    for (
      let node: ChthollyNode<T> | null = this.root;
      node !== null;
      node = node.next
    ) {
      if (node.left < left && node.right < left) continue;

      // [left, right] is a subset of [node.left, node.right]
      // if (node.left <= left && node.right >= right) {
      //   const tempNode: Readonly<ChthollyNode<T>> = {
      //     left,
      //     right,
      //     value: node.value,
      //     next: null,
      //   };
      //   read(tempNode);
      //   break;
      // }

      if (node.left <= left && node.right >= left) {
        const tempNode: Readonly<ChthollyNode<T>> = {
          left,
          right: Math.min(right, node.right),
          value: node.value,
          next: null,
        };
        read(tempNode);
        continue;
      }

      // [left, right] is a superset of [node.left, node.right]
      if (node.left >= left && node.right <= right) {
        read({
          left: node.left,
          right: node.right,
          value: node.value,
          next: null,
        });
        continue;
      }

      if (node.left <= right && node.right >= right) {
        const tempNode: Readonly<ChthollyNode<T>> = {
          left: Math.max(left, node.left),
          right,
          value: node.value,
          next: null,
        };
        read(tempNode);
        continue;
      }

      if (node.left > right && node.right > right) break;
    }
  }
}
