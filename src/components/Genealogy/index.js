/**
 * 家谱组件,按照数据渲染出树
 */

import Person from '../Person';
import { getGenealogyData } from '../../utils/data';
const genealogyData = getGenealogyData();
console.log(genealogyData)
const Genealogy = () => {
  const toReactComponent1 = (node) => {
    const TreeNodeComponent = ({ name, children }) => (
      <div>
        <Person name={name} />
        {children?.map((child) => child)}
      </div>
    );

    const childrenComponents = node.children?.map((childNode) =>
      toReactComponent(childNode)
    );

    return (
      <TreeNodeComponent
        name={node.name}
        key={node.id}
        children={childrenComponents}
      />
    );
  };

  const toReactComponent = (node) => {
    const TreeNodeComponent = ({ name, children }) => (
      <div>
        <Person name={name} />
        {children?.map((child) => child)}
      </div>
    );

    const queue = [node];
    const components = [];

    while (queue.length > 0) {

      const currentNode = queue.shift();

      const childrenComponents = currentNode.children.map((childNode) => {
        toReactComponent1(childNode);

    });

      const currentComponent = (
        <TreeNodeComponent key={currentNode.id} name={currentNode.name} >
          {childrenComponents}
        </TreeNodeComponent>
      );

      components.push(currentComponent);
      queue.push(...currentNode.children);
    }

    console.log(components)
    return components;
  };

  return toReactComponent1(genealogyData);
};

export default Genealogy;
