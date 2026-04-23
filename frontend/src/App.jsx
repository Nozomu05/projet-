import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WaifuDetail from './pages/WaifuDetail';

export default function App() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/waifu/:id" element={<WaifuDetail />} />
      </Routes>
    </div>
  );
}
