/**
 * @description 显示节点组件
 * @author junshi wang
 */

import React from 'react';
import './index.css';

class Person extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="person">
        <span>{this.props.node?.name}</span>
        <i
          className="del-icon"
          onClick={() => this.props.onClick(this.props.node?.id)}
        ></i>
      </div>
    );
  }
}

export default Person;
