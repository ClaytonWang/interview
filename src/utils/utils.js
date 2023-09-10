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

/**
 *
 * 遍历 整棵树,计算出每个几点的left,top值 ,用绝对定位在页面画出每个元素的位置.
 */

let wipRoot = null;
let nextUnitOfWork = null;

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

let containerWidth = document.getElementById("root").getBoundingClientRect().width - 40;

function performUnitOfWork(fiber) {
  const elements = fiber.children
  const length = elements.length;
  let index = 0
  let prevSibling = null
  let colGap = 5, rowGap = 5;

  //根节点
  if (!fiber.width) {
    fiber.x = 0;
    fiber.y = 0;
    fiber.width = containerWidth;
    fiber.height = 40;
  }


  while (index < length) {
    const element = elements[index]

    const newFiber = {
      id: element.id,
      name: element.name,
      children: element.children,
      width:(fiber.width-(length-1)*colGap)/length,
      height:fiber.height,
      parent: fiber,
    }

    if (index === 0) {
      //第一个 孩子与父亲x对齐
      fiber.child = newFiber
      fiber.child.x = fiber.x;
      fiber.child.y  =  fiber.y + fiber.height + rowGap;
    } else {
      prevSibling.sibling = newFiber
      //兄弟之间对齐
      prevSibling.sibling.y = prevSibling.y;
      prevSibling.sibling.x = prevSibling.x + prevSibling.width + colGap;
    }

    prevSibling = newFiber;
    index++;
  }

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
  wipRoot = null
  return data;
}


/**
 * 把计算好的树转换成一维数组,用来在页面上渲染组件.
 */
function commitWork(root) {
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const currentFiber = queue.shift();
    result.push({
      id: currentFiber.id,
      name: currentFiber.name,
      colspan: currentFiber.colspan,
      rowspan: currentFiber.rowspan,
      left: currentFiber.x,
      top: currentFiber.y,
      height: currentFiber.height,
      width:currentFiber.width
    });

    // 将子节点按层级顺序添加到队列中
    if (currentFiber.child) {
      let child = currentFiber.child;
      while (child) {
        queue.push(child);
        child = child.sibling;
      }
    }
  }

  return result;
}
