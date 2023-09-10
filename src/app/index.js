import './index.css';
import Search from '../components/Search';
import Genealogy from '../components/Genealogy';
import { useState, createContext, useCallback, useMemo} from 'react';
import { findNode, breadthFirstDelete,calcTreeColRowSpan} from '../utils/utils';
import { data } from '../utils/data';

export const EventContext = createContext();

function App() {
  const [source, setSource] = useState(data);

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
    if (!source) return [];
    return calcTreeColRowSpan(source);

  }, [source]);


  return (
    <EventContext.Provider value={delNode}>
      <div className="app">
        <header>
          <h1>测试题目</h1>
        </header>
        <Search onSearch={search} />
        <Genealogy source={matrixData} />
      </div>
    </EventContext.Provider>
  );
}

export default App;
