import './index.css';
import Search from '../components/Search';
import Genealogy from '../components/Genealogy';

function App() {
  return (
    <div className="app">
      <header>
        <h1>测试题目</h1>
      </header>
      <Search />
      <Genealogy  />
    </div>
  );
}

export default App;
