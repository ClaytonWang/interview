/**
 * 家谱组件,按照数据渲染出树
 */
import { useContext } from 'react';
import Person from '../Person';
import './index.css';
import { memo } from 'react';

import { EventContext } from '../../app';

const Genealogy = memo(({ source }) => {
  const delNode = useContext(EventContext);

  console.log(source)
  if (!source || source.length === 0) {
    return <div>搜索的数据不存在或已被删除,请刷新页面重新加载数据!</div>;
  }

  return <div className='container'>
    {
      source.map((node) => {
        return <Person node={node} onClick={delNode} key={node.id} />
      })
    }
  </div>

});

export default Genealogy;
