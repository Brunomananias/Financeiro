import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/DashboardPage.tsx'
import PlanejamentoContas from './pages/PlanejamentoContas.tsx'
import Navbar from './Components/navbar/navbar.tsx';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planejamento-contas" element={<PlanejamentoContas />} />
      </Routes>
    </Router>
  );
};

export default App;
