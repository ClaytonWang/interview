/**
 * @description 显示节点组件
 * @author junshi wang
 */

import React from 'react';
import './index.css';
import { memo } from 'react';

const Person = memo(({ node, onClick }) => {
  const width = node.colspan * 200;
  const height = node.rowspan * 40;
  return (
    <div style={{height,width,display:'inline-block'}}>
      <div className="person">
      <span>{node?.name}</span>
      <i
        className="del-icon"
        onClick={() => onClick(node?.id)}
      ></i>
    </div>
    </div>
  );
})

export default Person;
