# Chtholly Tree

A Chtholly Tree implementation in TypeScript.

## Introduction

The Chtholly Tree, also known as the Old Driver Tree (ODT), originated from [CF896C](https://codeforces.com/problemset/problem/896/C). This term refers to a technique for maintaining color segments using balanced trees, rather than a specific data structure.

The core idea is to merge intervals with the same value into a single node for processing. Compared to traditional data structures like segment trees, the Chtholly Tree can more conveniently maintain the values of each covered interval for problems involving interval coverage operations.

## Usage

```ts
import { ChthollyTree, type ChthollyNode } from "chtholly-tree";

const rootNode: ChthollyNode<number> = {
  left: 0,
  right: 10,
  value: 1,
  next: null,
};

const chthollyTree = new ChthollyTree<number>(rootNode);
chthollyTree.assign(3, 5, 2);
chthollyTree.perform(6, 10, (node) => node.value + 1);

let result = 0;
const sum = (node: ChthollyNode<number>) =>
  (result += node.value * (node.right - node.left + 1));
chthollyTree.query(1, 7, sum);
console.log(result); // 12
```

## Type Definition

```ts
type ChthollyNode<T> = {
  left: number;
  right: number;
  value: T;
  next: ChthollyNode<T> | null;
};

function createDefaultNode(value?: number): ChthollyNode<number>;

class ChthollyTree<T = number> {
  min: number;
  max: number;
  root: ChthollyNode<T>;
  constructor(node: ChthollyNode<T>);
  /**
   * It takes a position `pos` and splits the original interval containing point `pos` (denoted as [left, right])
   * into two intervals [left, pos) and [pos, right], and returns an the latter node.
   */
  split(pos: number): ChthollyNode<T>;
  /**
   * Used to assign a value to a range.
   * Suppose the range [left, right] is to be assigned the value `value`.
   */
  assign(left: number, right: number, value: T): ChthollyNode<T>;
  /**
   * Performs an action on all nodes within the specified range [left, right].
   *
   * The return value of the action function is assigned to the node.
   */
  perform(
    left: number,
    right: number,
    action: (node: Readonly<ChthollyNode<T>>) => T,
  ): void;
  /**
   * Queries the tree for nodes within the specified range [left, right] and applies the read function to each node.
   */
  query(
    left: number,
    right: number,
    read: (node: Readonly<ChthollyNode<T>>) => void,
  ): void;
}
```

## References

- [C. Willem, Chtholly and Seniorious - CodeForces](https://codeforces.com/problemset/problem/896/C)
- [珂朵莉树/颜色段均摊 - OI Wiki](https://oi-wiki.org/misc/odt/)
- [【信竞】珂朵莉树（推平树）数据结构全网最详细食用指南 - bilibili](https://www.bilibili.com/video/BV18u411N7P8/)
