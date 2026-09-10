import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioApp } from './pages/PortfolioApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/experience" element={<PortfolioApp />} />
        <Route path="/software" element={<PortfolioApp />} />
        <Route path="/gamedev" element={<PortfolioApp />} />
        <Route path="/3d-art" element={<PortfolioApp />} />
        <Route path="/games" element={<PortfolioApp />} />
        <Route path="/connect" element={<PortfolioApp />} />
        {/* Redirect unknown routes to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
