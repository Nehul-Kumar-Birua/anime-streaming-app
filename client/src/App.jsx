import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar/Navbar';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import AnimeDetail from './pages/AnimeDetail/AnimeDetail';
import Watch from './pages/Watch/Watch';
import NotFound from './pages/NotFound/NotFound';
import './styles/globals.css';

function App() {
  console.log('🎬 App component rendering');
  
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/watch/:episodeId" element={<Watch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
