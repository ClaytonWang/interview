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
    return <div className="person">{this.props.name}</div>;
  }
}

export default Person;
