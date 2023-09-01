/**
 * 家谱组件,按照数据渲染出树
 */
import { useContext } from 'react';
import Person from '../Person';
import './index.css';

import { EventContext } from '../../app';

const Genealogy = ({ source }) => {
  const delNode = useContext(EventContext);

  if (!source) {
    return <div>搜索的数据不存在或已被删除,请刷新页面重新加载数据!</div>;
  }

  // 树节点的组件
  const TreeNodeComponent = ({ node, children }) => {
    return (
      <div className="container">
        <Person node={node} key={node.id} onClick={delNode} />
        {children?.length > 0 ? <div className="wraper">{children}</div> : null}
      </div>
    );
  };

  // 将树按照深度优先遍历转换为组件层级结构
  const treeToReactComponents = (node) => {
    return (
      <TreeNodeComponent key={node.id} node={node}>
        {node.children.map((childNode) => treeToReactComponents(childNode))}
      </TreeNodeComponent>
    );
  };
  return treeToReactComponents(source);
};

export default Genealogy;
