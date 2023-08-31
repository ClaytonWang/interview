/**
 * @description 族谱类,包含了用来深度查询和广度删除的方法,节点的信息{id:'',name:'',children:[]}
 * @author junshi wang
 */
import { randomID } from './utils';

class GenealogyNode {
  constructor(name) {
    this.id = randomID();
    this.name = name;
    this.children = [];
  }

  /**
   * 给当前节点添加子节点
   * @param childNode 子节点
   */
  addChild(childNode) {
    this.children.push(childNode);
  }

  /**
   * 深度优先遍历这棵树,返回节点的数组
   * @param
   */
  depthFirstSearch() {
    const result = [];

    const traverse = (node) => {
      result.push(node);

      node.children.forEach((child) => {
        traverse(child);
      });
    };

    traverse(this);
    return result;
  }

  /**
   * 广度优先遍历一棵树
   * @param
   */
  breadthFirstTraversal() {
    const queue = [this];
    const result = [];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      result.push(currentNode);
      queue.push(...currentNode.children);
    }
    return result;
  }

  /**
   * 深度优先搜索某个节点,并返回这个节点的子节点
   * @param name 要查找节点的名字
   */
  findNode(name) {
    if (this.name === name) {
      return this;
    }

    for (const child of this.children) {
      const foundNode = child.findNode(name);
      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  }

  /**
   * 广度优先搜索某个节点,并删除这个节点的子节点
   * @param targetId 要删除节点的id
   */
  breadthFirstDelete(targetId) {
    const queue = [this];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      const childNodes = currentNode.children.filter(
        (child) => child.id !== targetId
      );
      currentNode.children = childNodes;
      queue.push(...childNodes);
    }
  }
}

export default GenealogyNode;
