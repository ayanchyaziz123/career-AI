import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CareerProvider } from './context/CareerContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ComparePage from './pages/ComparePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <CareerProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans">
          {/* Background pattern */}
          <div className="fixed inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0)',
                backgroundSize: '48px 48px',
              }}
            />
          </div>

          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/career/:id" element={<CareerDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </CareerProvider>
  );
}
