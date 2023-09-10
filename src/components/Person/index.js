/**
 * @description 显示节点组件
 * @author junshi wang
 */

import React from 'react';
import './index.css';
import { memo } from 'react';

const Person = memo(({ node, onClick }) => {

  return (
    <div className="person" style={{ width: node.width, height: node.height, left: node.left, top: node.top }}>
      <span>{node?.name}</span>
      <i
        className="del-icon"
        onClick={() => onClick(node?.id)}
      ></i>
    </div>
  );
})

export default Person;
