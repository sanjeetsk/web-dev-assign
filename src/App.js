import { Routes, Route } from 'react-router-dom';
import './App.css';
import PostsPage from './components/PostsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<PostsPage />} />
      </Routes>
    </div>
  );
}

export default App;
