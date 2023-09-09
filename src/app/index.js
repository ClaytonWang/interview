import './index.css';
import Search from '../components/Search';
import Genealogy from '../components/Genealogy';
import { createContext, useCallback, useLayoutEffect } from 'react';
import { findNode, breadthFirstDelete} from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import {
  calcTree,
  commitSourceData,
  selectSourceData,
  selectMatrixData
} from '../utils/treeSlice';

export const EventContext = createContext();

function App() {
  const source = useSelector(selectSourceData);
  const matrix = useSelector(selectMatrixData);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(calcTree(source));
  }, [source,dispatch]);

  const search = useCallback(
    (name) => {
      const newdata = findNode(source, name);

      if (!newdata) {
        dispatch(commitSourceData(null));
      } else {
        dispatch(commitSourceData({ ...newdata }));
      }
    },
    [source,dispatch]
  );

  const delNode = useCallback(
    (id) => {
      const newdata = breadthFirstDelete(source, id);

      if (!newdata) {
        dispatch(commitSourceData(null));
      } else {
        dispatch(commitSourceData({ ...newdata }));
      }
    },
    [source,dispatch]
  );

  // const matrixData = useMemo(() => {
  //   console.log(source)
  //   if (!source) return [];
  //   return calcTreeColRowSpan(source);
  //   // const data = calcTreeColRowSpan(source);
  // }, [source]);

  return (
    <EventContext.Provider value={delNode}>
      <div className="app">
        <header>
          <h1>测试题目</h1>
        </header>
        <Search onSearch={search} />
        <Genealogy source={matrix} />
      </div>
    </EventContext.Provider>
  );
}

export default App;
