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

## References

- [C. Willem, Chtholly and Seniorious - CodeForces](https://codeforces.com/problemset/problem/896/C)
- [珂朵莉树/颜色段均摊 - OI Wiki](https://oi-wiki.org/misc/odt/)
- [【信竞】珂朵莉树（推平树）数据结构全网最详细食用指南 - bilibili](https://www.bilibili.com/video/BV18u411N7P8/)
