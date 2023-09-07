export function randomID(min = 100, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * 深度优先遍历这棵树,返回节点的数组
 * @param
 */
export const depthFirstSearch = (root) => {
  if (!root) return root;

  const result = [];

  const traverse = (node) => {
    result.push(node);
    node.children.forEach((child) => {
      traverse(child);
    });
  };

  traverse(root);
  return result;
};


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
    const foundNode = findNode(child,name);
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

  return maxDepth+1;
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

  if (node.children.length === 0) {
    const treeDepth = calcMaxDepth(root);
    const currentDepth = calcCurrentDepth(root, node, 0);
    if (currentDepth !== -1) {
      depth = treeDepth-currentDepth;
    }
  }
  return depth;
}

//当前节点colspan是所有孩子的colspan的总和
function calcColspan(node) {

  let sum = 0;

  if (node.children.length === 0) return 1;

  for (const child of node.children) {
    sum += calcColspan(child) + 1;
  }

  return sum;
}


/**
 * 计算出这颗树中每个节点的宽度和高度,返回一个相同深度组合的二维数组,用来在页面上渲染组件.
 * 1，节点的colspan等于兄弟节点中colspan最大的值,也就是宽度最宽的值，当前节点colspan是所有孩子的colspan的总和，最末尾的叶子节点colspan为1。
 * 2，有孩子的节点rowspan为1，没有孩子节点的rowspan等于兄弟节点中最深叶子的深度，也就是总深度减去当前节点的深度,最末尾叶子的rowspan为1。
 * @param {*} root
 * @returns Array[][]
 */
export const treeToMatrix = (root) => {
  if (!root) return root;

  const result = [];
  let depth = 0;

  //递归的计算
  const traverse = (parent,node,arr,depth) => {

    //计算出当前节点的colspan 和 rowspan

    let max = 0;
    if (node.children.length === 0) {
      //取兄弟节点colspan的最大值
      for (let item of parent.children) {
        max = Math.max(max,calcColspan(item));
      }
    } else {
      max = calcColspan(node);
    }
    const colspan = max
    const rowspan = calcRowspan(root,node);

    if (!arr[depth]) {
      arr[depth] = [];
    }

    // 放入 二维 数组
    arr[depth].push({ id: node.id, name: node.name, colspan, rowspan, depth });

    node.children.forEach((child) => {
      traverse(node,child,arr,depth + 1);
    });
  };

  traverse(root,root, result, depth);

  console.log(result)
  return result;
}
