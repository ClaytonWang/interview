/**
 * @description Search组件
 * @author junshi wang
 */

import { useState,memo } from 'react';
import './index.css';

const Search = memo(({ onSearch }) => {
  const [value, setValue] = useState('');

  return (
    <div className="search">
      <input
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button onClick={() => onSearch(value)}>查询</button>
    </div>
  );
});

export default Search;
