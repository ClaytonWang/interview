import _ from 'lodash';

export function randomID(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 深度优先搜索某个节点,并返回这个节点的子节点
 * @param name 要查找节点的名字
 */
export const findNode = (root, name) => {
  if (!root) return root;

  if (root.name === name) {
    return root;
  }

  for (const child of root.children) {
    const foundNode = findNode(child, name);
    if (foundNode) {
      return foundNode;
    }
  }

  return null;
};

/**
 * 广度优先搜索某个节点,并删除这个节点的子节点
 * @param targetId 要删除节点的id
 */
export const breadthFirstDelete = (root, targetId) => {
  if (!root) return root;

  if (root.id === targetId) {
    return null;
  }

  const queue = [root];
  while (queue.length > 0) {
    const currentNode = queue.shift();
    const childNodes = currentNode.children.filter(
      (child) => child.id !== targetId
    );
    currentNode.children = childNodes;
    queue.push(...childNodes);
  }
  return root;
};

// 算出这棵树的最深深度
function calcMaxDepth(node) {
  if (!node) return 0;

  let maxDepth = 0;

  for (const child of node.children) {
    const childDepth = calcMaxDepth(child);
    maxDepth = Math.max(maxDepth, childDepth);
  }

  return maxDepth + 1;
}

// 算出当前节点的深度
function calcCurrentDepth(root, node, currentDepth) {
  if (!root) return -1;

  if (root.id === node.id) {
    return currentDepth;
  }

  for (const child of root.children) {
    const depth = calcCurrentDepth(child, node, currentDepth + 1);
    if (depth !== -1) {
      return depth;
    }
  }

  //没找到
  return -1;
}

// 没有孩子的节点rowspan等于总深度减去当前节点的深度
function calcRowspan(root, node) {
  let depth = 1;

  if (root.id === node.id) return depth;

  if (node.children.length === 0) {
    const treeDepth = calcMaxDepth(root);
    const currentDepth = calcCurrentDepth(root, node, 0);
    if (currentDepth !== -1) {
      depth = treeDepth - currentDepth;
    }
  }
  return depth;
}

// function calcColspan(node) {
//   if (!node) {
//     return 1;
//   }

//   let count = 0;

//   for (const child of node.children) {
//     count += 1 + calcColspan(child);
//   }

//   return count;
// }

function calcCurrentBreadth(node) {
  if (!node) {
    return 1;
  }

  let count = node.children.length;

  for (const child of node.children) {
    count = count + calcCurrentBreadth(child);
  }

  return count;
}

/**
 * 用当前节点的宽度重算孩子节点的宽度,有可能会出现小数
 * @param {*} width 当前节点的宽度
 * @param {*} node 当前节点
 */
function reCaclColspan(width, node) {
  const queue = [{ width, node }];

  while (queue.length > 0) {
    const item = queue.shift();

    item.node.colspan = item.width;
    // console.log(item.node, item.width)

    let subWidth = item.width;
    if (item.node.children.length > 1) {
      subWidth = subWidth / item.node.children.length;
    }

    for (let n of item.node.children) {
      queue.push({ width: subWidth, node: n });
    }
  }

  return node;
}

/**
 * 计算出这颗树中每个节点的宽度和高度
 * 1，节点的colspan等于兄弟节点中colspan最大的值,也就是宽度最宽的值，当前节点colspan是所有孩子的colspan的总和，最末尾的叶子节点colspan为1。
 * 2，有孩子的节点rowspan为1，没有孩子节点的rowspan等于兄弟节点中最深叶子的深度，也就是总深度减去当前节点的深度,最末尾叶子的rowspan为1。
 * 3, 保持样式统一,同层级中colspan也要取最大值.
 * @param {*} root
 * @returns Array[]
 */
export const calcTreeSpan = (root) => {
  //递归的计算
  /**
   * 1,算出rowspan
   * 2,算出每个节点的最大
   * @param {*} node
   */
  const calcRowAndBreadth = (node) => {
    // //计算出当前节点的colspan 和 rowspan
    // let maxColspan = 0;
    // //取兄弟节点colspan的最大值
    // for (let item of parent.children) {
    //   maxColspan = Math.max(maxColspan,calcColspan(item));
    // }

    // maxColspan = calcCurrentBreadth(node);
    // //最深叶子节点为1
    // if (maxColspan === 0) maxColspan = 1;

    // node.colspan = maxColspan;
    node.breadth = calcCurrentBreadth(node);

    node.rowspan = calcRowspan(root, node);

    node.children.forEach((child) => {
      calcRowAndBreadth(child);
    });
  };

  calcRowAndBreadth(root);

  // console.log(root)

  /**
   * 3,在兄弟节点中取宽度最大的值,用此最大值把小于此宽度的兄弟节点的孩子重新计算一下.
   * @param {*} node
   */
  const calcColspan = (node) => {
    const queue = [{ maxBreadth: 0, node }];
    while (queue.length > 0) {
      const item = queue.shift();

      if (item.node.breadth < item.maxBreadth) {
        // console.log(`currentNode`, item.node, item.maxBreadth);
        reCaclColspan(item.maxBreadth, item.node);
      }

      // console.log(`currentNode`, item.node,item.maxBreadth);

      // 取到当前兄弟 中最大的宽度
      const maxBreadth = item.node.children.reduce((max, current) => {
        if (current.breadth > max) {
          return current.breadth;
        } else {
          return max;
        }
      }, item.node.children[0]?.breadth);

      for (let n of item.node.children) {
        queue.push({ maxBreadth, node: n });
      }
    }
  };

  calcColspan(root);

  // console.log(root)

  return root;
};

/**
 * 把计算好的树转换成二维数组,用来在页面上渲染组件.
 * @param {*} root
 * @returns Array[]
 */
export const treeToMatrix = (root) => {

  if (!root) {
    return [];
  }

  // 计算rowspan,colspan
  calcTreeSpan(root);

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const currentLevelSize = queue.length;
    const currentLevelNodes = [];

    let maxColspan = 1;
    for (let i = 0; i < currentLevelSize; i++) {
      const currentNode = queue.shift();

      //兄弟同层级中colspan取最大值
      // maxColspan = Math.max(maxColspan, currentNode.breadth);

      currentLevelNodes.push({
        id: currentNode.id,
        name: currentNode.name,
        colspan: currentNode.colspan,
        rowspan: currentNode.rowspan,
      });

      if (currentNode.children) {
        queue.push(...currentNode.children);
      }
    }
    result.push(currentLevelNodes);
  }

  // console.log(result);
  return result;
};


let wipRoot = null;
let nextUnitOfWork = null;

export function calcTreeColRowSpan(root) {
  if (!root) return root;

  // wipRoot = nextUnitOfWork = _.cloneDeep(root);
  wipRoot = nextUnitOfWork = root;

  //大数据下,浏览器空闲时候执行
  requestIdleCallback(workLoop);
  // return workLoop()
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    // return commitRoot()
    commitRoot()
  }
  // return null;
  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber) {
  const elements = fiber.children
  let index = 0
  let prevSibling = null
  let maxCol = 1;

  //父亲只有一个孩子,那么这个孩子的宽度与父亲相等
  if (elements.length > 1) {
    let first = calcCurrentBreadth(elements[0]);
    maxCol = elements.reduce((max, currentNode) => {
      let current = calcCurrentBreadth(currentNode);
      if (current > max) {
        return current;
      } else {
        return max;
      }
    }, first);
  } else {
    maxCol = fiber.colspan;
  }

  //最小宽度为1
  if (maxCol === 0) maxCol = 1;

  //如果孩子的宽度没有父亲大,那么平分父亲的宽度
  if (maxCol < fiber.colspan) {
    maxCol = fiber.colspan / elements.length;
  }

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      id: element.id,
      name: element.name,
      children: element.children,
      colspan: maxCol,
      parent: fiber,
      rowspan: calcRowspan(wipRoot, element)
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++

  }

  //父亲宽度是孩子最大宽度的和
  let total = maxCol * index;;
  if (total > fiber.colspan || !fiber.colspan) {
    fiber.colspan = total;
  }

  console.log(fiber, '----', maxCol, '---', index, '---', fiber.colspan)

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }

}

function commitRoot() {
  const data = commitWork(wipRoot)
  store.dispatch(commitMatrixData(data));
  // console.log(wipRoot)
  wipRoot = null
  // return data;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const result = [];
  const queue = [fiber];

  while (queue.length > 0) {
    const currentLevelSize = queue.length;
    const currentLevelNodes = [];

    for (let i = 0; i < currentLevelSize; i++) {
      const currentFiber = queue.shift();
      currentLevelNodes.push({ id: currentFiber.id, name: currentFiber.name, colspan: currentFiber.colspan, rowspan: currentFiber.rowspan });

      // 将子节点按层级顺序添加到队列中
      if (currentFiber.child) {
        let child = currentFiber.child;
        while (child) {
          queue.push(child);
          child = child.sibling;
        }
      }
    }

    result.push(currentLevelNodes);
  }

  // console.log(result)
  return result;
}

