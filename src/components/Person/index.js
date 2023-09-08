/**
 * @description 显示节点组件
 * @author junshi wang
 */

import React from 'react';
import './index.css';
import { memo } from 'react';

const Person = memo(({ node, onClick }) => {

  return (
    <div className="person">
      <span>{node?.name}</span>
      <i
        className="del-icon"
        onClick={() => onClick(node?.id)}
      ></i>
    </div>
  );
})

export default Person;
