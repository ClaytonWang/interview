/**
 * @description mock树结构的原始数据,以用来显示在页面上
 * @author junshi wang
 */

import GenealogyNode from './genealogyNode';

export function getGenealogyData() {
  const rootNode = new GenealogyNode('爷爷');
  const babaNode = new GenealogyNode('爸爸');
  const ershuNode = new GenealogyNode('二叔');
  const sanguNode = new GenealogyNode('三姑');
  const myNode = new GenealogyNode('我');
  const sisterNode = new GenealogyNode('妹妹');
  const tgNode = new GenealogyNode('堂哥');
  const tmNode = new GenealogyNode('堂妹');
  const sonNode = new GenealogyNode('儿子');
  const doNode = new GenealogyNode('女儿');
  const zhiziNode = new GenealogyNode('侄子');
  const zhinvNode = new GenealogyNode('侄女');

  rootNode.addChild(babaNode);
  rootNode.addChild(ershuNode);
  rootNode.addChild(sanguNode);

  babaNode.addChild(myNode);
  babaNode.addChild(sisterNode);

  ershuNode.addChild(tgNode);
  ershuNode.addChild(tmNode);

  myNode.addChild(sonNode);
  myNode.addChild(doNode);

  tmNode.addChild(zhiziNode);
  tmNode.addChild(zhinvNode);

  return rootNode;
}

// 删除节点值为 3 的节点及其子节点
// rootNode.breadthFirstDelete(3);

// console.log(rootNode); // 输出树结构，已删除节点 3 及其子节点
