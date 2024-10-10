import { describe, expect, it, vi } from "vitest";
import { ChthollyNode, ChthollyTree, createDefaultNode } from "./chtholly-tree";

const flattenLinkedList = <T = unknown>(
  tree: ChthollyTree<T>,
): Omit<ChthollyNode<T>, "next">[] => {
  const array: Omit<ChthollyNode<T>, "next">[] = [];
  let currentNode: ChthollyNode<T> | null = tree.root;
  while (currentNode !== null) {
    array.push({
      left: currentNode.left,
      right: currentNode.right,
      value: currentNode.value,
    });
    currentNode = currentNode.next;
  }
  return array;
};

describe("ChthollyTree split", () => {
  it("should split the node correctly when pos is within the range", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    const result = tree.split(5);

    expect(result.left).toBe(5);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 4,
          "value": 1,
        },
        {
          "left": 5,
          "right": 10,
          "value": 1,
        },
      ]
    `);

    const result2 = tree.split(6);
    expect(result2.left).toBe(6);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 4,
          "value": 1,
        },
        {
          "left": 5,
          "right": 5,
          "value": 1,
        },
        {
          "left": 6,
          "right": 10,
          "value": 1,
        },
      ]
    `);
  });

  it("should return the node when pos is exactly at the left boundary", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    const result = tree.split(0);

    expect(result).toBe(rootNode);
  });

  it("should throw an error when pos is out of range", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    expect(() => tree.split(11)).toThrowError("Position is out of range");
    expect(() => tree.split(-1)).toThrowError("Position is out of range");
  });
});

describe("ChthollyTree assign", () => {
  it("should assign a value to a range correctly", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    const result = tree.assign(2, 5, 3);

    expect(result.left).toBe(2);
    expect(result.right).toBe(5);
    expect(result.value).toBe(3);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 1,
          "value": 1,
        },
        {
          "left": 2,
          "right": 5,
          "value": 3,
        },
        {
          "left": 6,
          "right": 10,
          "value": 1,
        },
      ]
    `);

    const result2 = tree.assign(3, 7, 4);
    expect(result2.left).toBe(3);
    expect(result2.right).toBe(7);
    expect(result2.value).toBe(4);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 1,
          "value": 1,
        },
        {
          "left": 2,
          "right": 2,
          "value": 3,
        },
        {
          "left": 3,
          "right": 7,
          "value": 4,
        },
        {
          "left": 8,
          "right": 10,
          "value": 1,
        },
      ]
    `);
  });

  it("should assign a value to the single point correctly", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    const result = tree.assign(5, 5, 2);

    expect(result.left).toBe(5);
    expect(result.right).toBe(5);
    expect(result.value).toBe(2);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 4,
          "value": 1,
        },
        {
          "left": 5,
          "right": 5,
          "value": 2,
        },
        {
          "left": 6,
          "right": 10,
          "value": 1,
        },
      ]
    `);
  });

  it("should assign a value to right boundary correctly", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    const result = tree.assign(10, 10, 2);

    expect(result.left).toBe(10);
    expect(result.right).toBe(10);
    expect(result.value).toBe(2);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 9,
          "value": 1,
        },
        {
          "left": 10,
          "right": 10,
          "value": 2,
        },
      ]
    `);
  });

  it("should assign a value to the whole range correctly", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    const result = tree.assign(0, 10, 2);

    expect(result.left).toBe(0);
    expect(result.right).toBe(10);
    expect(result.value).toBe(2);
    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 10,
          "value": 2,
        },
      ]
    `);
  });
});

describe("ChthollyTree perform", () => {
  it("should perform an action on a range correctly", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    tree.perform(2, 5, (node) => {
      const newValue = node.value + 1;
      return newValue;
    });

    expect(flattenLinkedList(tree)).toMatchInlineSnapshot(`
      [
        {
          "left": 0,
          "right": 1,
          "value": 1,
        },
        {
          "left": 2,
          "right": 5,
          "value": 2,
        },
        {
          "left": 6,
          "right": 10,
          "value": 1,
        },
      ]
    `);
  });

  it("should throw an error if the range is invalid", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    expect(() => tree.perform(5, 2, (node) => node.value)).toThrow(
      "Range is invalid",
    );
  });

  it("should throw an error if the range is out of bounds", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);

    expect(() => tree.perform(-1, 5, (node) => node.value)).toThrow(
      "Range is out of range",
    );
    expect(() => tree.perform(2, 11, (node) => node.value)).toThrow(
      "Range is out of range",
    );
  });
});

describe("ChthollyTree query", () => {
  it("should apply read function to nodes within the range", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    const read = vi.fn();

    tree.query(2, 5, read);

    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith({
      left: 2,
      right: 5,
      value: 1,
      next: null,
    });
  });

  it("should throw an error if the range is invalid", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    const read = vi.fn();

    expect(() => tree.query(5, 2, read)).toThrow("Range is invalid");
  });

  it("should throw an error if the range is out of bounds", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    const read = vi.fn();

    expect(() => tree.query(-1, 5, read)).toThrow("Range is out of range");
    expect(() => tree.query(2, 11, read)).toThrow("Range is out of range");
  });

  it("should apply read function to multiple nodes within the range", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    tree.assign(3, 5, 2);
    tree.assign(6, 10, 3);
    const read = vi.fn();

    tree.query(1, 7, read);

    expect(read).toHaveBeenCalledTimes(3);
    expect(read).toHaveBeenCalledWith({
      left: 1,
      right: 2,
      value: 1,
      next: null,
    });
    expect(read).toHaveBeenCalledWith({
      left: 3,
      right: 5,
      value: 2,
      next: null,
    });
    expect(read).toHaveBeenCalledWith({
      left: 6,
      right: 7,
      value: 3,
      next: null,
    });
  });
});

describe("ChthollyTree example", () => {
  it("should sum the values within the range", () => {
    const rootNode: ChthollyNode<number> = {
      left: 0,
      right: 10,
      value: 1,
      next: null,
    };
    const tree = new ChthollyTree(rootNode);
    tree.assign(3, 5, 2);
    tree.assign(6, 10, 3);

    let result = 0;
    const sum = (node: ChthollyNode<number>) =>
      (result += node.value * (node.right - node.left + 1));
    tree.query(1, 7, sum);
    expect(result).toBe(14);
  });
});

describe("leetcode 715", () => {
  // https://leetcode.com/problems/range-module/
  class RangeModule {
    tree: ChthollyTree<number>;
    constructor() {
      this.tree = new ChthollyTree<number>(createDefaultNode());
    }

    addRange(left: number, right: number): void {
      right--;
      this.tree.assign(left, right, 1);
    }

    queryRange(left: number, right: number): boolean {
      right--;
      let result = true;
      this.tree.query(left, right, (node) => {
        if (node.value !== 1) {
          result = false;
        }
      });
      return result;
    }

    removeRange(left: number, right: number): void {
      right--;
      this.tree.assign(left, right, 0);
    }
  }

  const run = (testCase: any) => {
    let rangeModule: RangeModule;
    const result = testCase[0].map((method: any, i: any) => {
      const args = testCase[1][i] as [number, number];
      switch (method) {
        case "RangeModule":
          rangeModule = new RangeModule();
          return null;
        case "addRange":
          rangeModule.addRange(...args);
          return null;
        case "removeRange":
          rangeModule.removeRange(...args);
          return null;
        case "queryRange":
          return rangeModule.queryRange(...args);
        default:
          break;
      }
      throw new Error("Unreachable");
    });
    return result;
  };

  it("case1", () => {
    const testCase = [
      [
        "RangeModule",
        "addRange",
        "removeRange",
        "queryRange",
        "queryRange",
        "queryRange",
      ],
      [[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]],
    ];
    expect(run(testCase)).toEqual([null, null, null, true, false, true]);
  });

  it("case2", () => {
    const testCase = [
      [
        "RangeModule",
        "addRange",
        "queryRange",
        "removeRange",
        "removeRange",
        "addRange",
        "queryRange",
        "addRange",
        "queryRange",
        "removeRange",
      ],
      [
        [],
        [5, 8],
        [3, 4],
        [5, 6],
        [3, 6],
        [1, 3],
        [2, 3],
        [4, 8],
        [2, 3],
        [4, 9],
      ],
    ];
    expect(run(testCase)).toEqual([
      null,
      null,
      false,
      null,
      null,
      null,
      true,
      null,
      true,
      null,
    ]);
  });
});
