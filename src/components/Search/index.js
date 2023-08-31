/**
 * @description Search组件
 * @author junshi wang
 */

import { useState } from 'react';
import './index.css';

const Search = () => { 
    const [value, setValue] = useState('');

    return (
        <div className='search'>
            <input />
            <button>查询</button>
        </div>
    )
}

export default Search;