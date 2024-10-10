# Chtholly Tree

A Chtholly Tree implementation in TypeScript.

## Usage

```ts
import { ChthollyTree, type ChthollyNode } from "chtholly-tree";

const rootNode: ChthollyNode<number> = {
  left: 0,
  right: 10,
  value: 1,
  next: null,
};

const tree = new ChthollyTree<number>(rootNode);
tree.assign(3, 5, 2);
tree.assign(6, 10, 3);

let result = 0;
const sum = (node: ChthollyNode<number>) =>
  (result += node.value * (node.right - node.left + 1));
tree.query(1, 7, sum);
console.log(result); // 14
```

## References

- [C. Willem, Chtholly and Seniorious - CodeForces](https://codeforces.com/problemset/problem/896/C)
- [珂朵莉树/颜色段均摊 - OI Wiki](https://oi-wiki.org/misc/odt/)
- [【信竞】珂朵莉树（推平树）数据结构全网最详细食用指南 - bilibili](https://www.bilibili.com/video/BV18u411N7P8/)
