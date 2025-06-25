import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CompareView from './pages/CompareView';
import BatchCompare from './pages/BatchCompare';
import History from './pages/History';
import { MoleculeProvider } from './context/MoleculeContext';

function App() {
  return (
    <MoleculeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compare" element={<CompareView />} />
          <Route path="batch" element={<BatchCompare />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MoleculeProvider>
  );
}

export default App;