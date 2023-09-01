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
