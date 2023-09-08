/**
 * 家谱组件,按照数据渲染出树
 */
import { useContext } from 'react';
import Person from '../Person';
import './index.css';

import { EventContext } from '../../app';

const Genealogy = ({ source }) => {
  const delNode = useContext(EventContext);

  if (!source || source.length === 0) {
    return <div>搜索的数据不存在或已被删除,请刷新页面重新加载数据!</div>;
  }

  return <table><tbody>
    {source.map((item, index) => {
      return <tr key={index}>
        {
          item.map((node) => {
            return <td rowSpan={node.rowspan} colSpan={node.colspan} key={node.id}><Person node={node} onClick={delNode} /></td>
          })
        }
      </tr>
    })}
  </tbody></table>

};

export default Genealogy;
