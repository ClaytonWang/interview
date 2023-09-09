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

function calcCurrentBreadth(node) {
  if (!node) {
    return 0;
  }

  let count = node.children.length

  for (const child of node.children) {
    count += calcCurrentBreadth(child);
  }

  return count;
}


let wipRoot = null;
let nextUnitOfWork = null;

/**
 * 计算出这颗树中每个节点的宽度和高度,仿Fibber结构
 * 1，节点的colspan等于兄弟节点中colspan最大的值,也就是宽度最宽的值，当前节点colspan是所有孩子的colspan的总和，最末尾的叶子节点colspan为1。
 * 2，有孩子的节点rowspan为1，没有孩子节点的rowspan等于兄弟节点中最深叶子的深度，也就是总深度减去当前节点的深度,最末尾叶子的rowspan为1。
 * 3, 保持样式统一,同层级中colspan也要取最大值.如果父亲只有一个孩子,那么这个孩子的宽度与父亲相等,如果孩子的宽度没有父亲大,那么平分父亲的宽度
 * @param {*} root
 */

export function calcTreeColRowSpan(root) {
  if (!root) return root;

  wipRoot = nextUnitOfWork = _.cloneDeep(root);

  //大数据下,浏览器空闲时候执行
  // requestIdleCallback(workLoop);
  return workLoop()
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    return commitRoot()
    // commitRoot()
  }
  return null;
  // requestIdleCallback(workLoop);
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
    if (!fiber.colspan) {
      let sub = elements[0];
      while (sub  && sub.length  ===  1) {
        sub = sub.children[0];
      }
      maxCol = calcCurrentBreadth(sub);
    } else {
      maxCol = fiber.colspan;
    }
  }

  //最小宽度为1
  if (maxCol === 0) maxCol = 1;

  //如果孩子的宽度没有父亲大,那么平分父亲的宽度
  if (maxCol < fiber.colspan) {
    maxCol = Math.ceil(fiber.colspan / elements.length);
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

/**
 * 把计算好的树转换成二维数组,用来在页面上渲染组件.
 */
function commitRoot() {
  const data = commitWork(wipRoot)
  // console.log(wipRoot)
  wipRoot = null
  return data;
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

