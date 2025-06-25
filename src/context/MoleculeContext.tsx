import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ComparisonResult, Molecule } from '../types';

interface MoleculeContextType {
  history: ComparisonResult[];
  addToHistory: (result: ComparisonResult) => void;
  clearHistory: () => void;
  recentMolecules: Molecule[];
  addRecentMolecule: (molecule: Molecule) => void;
}

const MoleculeContext = createContext<MoleculeContextType | undefined>(undefined);

export const MoleculeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ComparisonResult[]>(() => {
    const saved = localStorage.getItem('molecularComparisonHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentMolecules, setRecentMolecules] = useState<Molecule[]>(() => {
    const saved = localStorage.getItem('recentMolecules');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('molecularComparisonHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('recentMolecules', JSON.stringify(recentMolecules));
  }, [recentMolecules]);

  const addToHistory = (result: ComparisonResult) => {
    setHistory(prev => [result, ...prev].slice(0, 50)); // Keep max 50 items
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addRecentMolecule = (molecule: Molecule) => {
    setRecentMolecules(prev => {
      const exists = prev.some(m => m.smiles === molecule.smiles);
      if (exists) {
        return prev;
      }
      return [molecule, ...prev].slice(0, 10); // Keep max 10 items
    });
  };

  return (
    <MoleculeContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        recentMolecules,
        addRecentMolecule,
      }}
    >
      {children}
    </MoleculeContext.Provider>
  );
};

export const useMoleculeContext = () => {
  const context = useContext(MoleculeContext);
  if (context === undefined) {
    throw new Error('useMoleculeContext must be used within a MoleculeProvider');
  }
  return context;
};