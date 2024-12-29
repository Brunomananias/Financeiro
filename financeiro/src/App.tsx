import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/DashboardPage.tsx'
import Navbar from './Components/navbar/Navbar.tsx';
import PlanejamentoContas from './pages/PlanejamentoContas.tsx'
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planejamento-contas" element={<PlanejamentoContas />} />
      </Routes>
    </Router>
  );
};

export default App;
