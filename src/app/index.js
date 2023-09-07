import './index.css';
import Search from '../components/Search';
import Genealogy from '../components/Genealogy';
import { getGenealogyData } from '../utils/data';
import { useState, createContext, useCallback, useMemo } from 'react';
import { findNode, breadthFirstDelete, treeToMatrix } from '../utils/utils';

const genealogyData = getGenealogyData();

export const EventContext = createContext();

function App() {
  const [source, setSource] = useState(genealogyData);

  const search = useCallback(
    (name) => {
      const newdata = findNode(source, name);
      if (!newdata) {
        setSource(null);
      } else {
        setSource({ ...newdata });
      }
    },
    [source]
  );

  const delNode = useCallback(
    (id) => {
      const newdata = breadthFirstDelete(source, id);
      if (!newdata) {
        setSource(null);
      } else {
        setSource({ ...newdata });
      }
    },
    [source]
  );

  const matrixData = useMemo(() => {
    const data = treeToMatrix(source);
    console.log(data);
    return data;
  },[source])

  return (
    <EventContext.Provider value={delNode}>
      <div className="app">
        <header><h1>测试题目</h1></header>
        <Search onSearch={search} />
        <Genealogy source={matrixData} />
      </div>
    </EventContext.Provider>
  );
}

export default App;
