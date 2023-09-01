/**
 * @description 族谱类,包含了用来深度查询和广度删除的方法,节点的信息{id:'',name:'',children:[]}
 * @author junshi wang
 */
import { randomID } from './utils';

export default class GenealogyNode {
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
}
