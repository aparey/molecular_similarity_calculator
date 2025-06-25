import React, { useState, useEffect } from 'react';
import MoleculeInput from '../components/MoleculeInput';
import MoleculeVisualizer from '../components/MoleculeVisualizer';
import SimilarityGauge from '../components/SimilarityGauge';
import { Molecule, ComparisonResult } from '../types';
import { useMoleculeContext } from '../context/MoleculeContext';
import { 
  generateFingerprint, 
  calculateTanimotoSimilarity, 
  calculateDiceSimilarity, 
  calculateCosineSimilarity,
  generateId 
} from '../utils/moleculeUtils';
import { Download, Repeat, ArrowRight } from 'lucide-react';

const CompareView: React.FC = () => {
  const [molecule1, setMolecule1] = useState<Molecule | null>(null);
  const [molecule2, setMolecule2] = useState<Molecule | null>(null);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [method, setMethod] = useState<'tanimoto' | 'dice' | 'cosine'>('tanimoto');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { addToHistory, addRecentMolecule } = useMoleculeContext();

  useEffect(() => {
    calculateSimilarity();
  }, [molecule1, molecule2, method]);

  const handleMolecule1Select = (molecule: Molecule) => {
    setMolecule1({
      ...molecule,
      fingerprint: generateFingerprint(molecule.smiles)
    });
    addRecentMolecule(molecule);
  };

  const handleMolecule2Select = (molecule: Molecule) => {
    setMolecule2({
      ...molecule,
      fingerprint: generateFingerprint(molecule.smiles)
    });
    addRecentMolecule(molecule);
  };

  const calculateSimilarity = () => {
    if (!molecule1 || !molecule2 || !molecule1.fingerprint || !molecule2.fingerprint) {
      setSimilarity(null);
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      let similarityValue: number;
      
      switch (method) {
        case 'dice':
          similarityValue = calculateDiceSimilarity(molecule1.fingerprint!, molecule2.fingerprint!);
          break;
        case 'cosine':
          similarityValue = calculateCosineSimilarity(molecule1.fingerprint!, molecule2.fingerprint!);
          break;
        case 'tanimoto':
        default:
          similarityValue = calculateTanimotoSimilarity(molecule1.fingerprint!, molecule2.fingerprint!);
          break;
      }
      
      setSimilarity(similarityValue);
      setIsCalculating(false);
      
      // Add to history if both molecules are set
      if (molecule1 && molecule2) {
        const result: ComparisonResult = {
          id: generateId(),
          timestamp: Date.now(),
          molecule1,
          molecule2,
          similarity: similarityValue,
          method
        };
        addToHistory(result);
      }
    }, 500);
  };

  const swapMolecules = () => {
    setMolecule1(molecule2);
    setMolecule2(molecule1);
  };

  const exportResult = () => {
    if (!molecule1 || !molecule2 || similarity === null) return;
    
    const result = {
      date: new Date().toISOString(),
      molecule1: {
        name: molecule1.name,
        smiles: molecule1.smiles
      },
      molecule2: {
        name: molecule2.name,
        smiles: molecule2.smiles
      },
      method,
      similarity
    };
    
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `similarity-${molecule1.name}-${molecule2.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Compare Molecules</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Molecule 1</h2>
          <MoleculeInput 
            label="Enter SMILES for Molecule 1" 
            onMoleculeSelect={handleMolecule1Select}
            value={molecule1}
          />
          
          {molecule1 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">{molecule1.name}</h3>
              <MoleculeVisualizer smiles={molecule1.smiles} height={250} width={300} />
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Molecule 2</h2>
          <MoleculeInput 
            label="Enter SMILES for Molecule 2" 
            onMoleculeSelect={handleMolecule2Select}
            value={molecule2}
          />
          
          {molecule2 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">{molecule2.name}</h3>
              <MoleculeVisualizer smiles={molecule2.smiles} height={250} width={300} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={swapMolecules}
          disabled={!molecule1 || !molecule2}
          className="btn border border-gray-300 flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Repeat size={16} />
          Swap Molecules
        </button>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Similarity Calculation</h2>
        
        <div className="mb-6">
          <label htmlFor="method-select" className="label">Similarity Method</label>
          <select
            id="method-select"
            className="input"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'tanimoto' | 'dice' | 'cosine')}
          >
            <option value="tanimoto">Tanimoto Coefficient</option>
            <option value="dice">Dice Coefficient</option>
            <option value="cosine">Cosine Similarity</option>
          </select>
        </div>

        {similarity !== null ? (
          <div className="mt-8 text-center animate-fade-in">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-3 text-lg font-medium">
                <span>{molecule1?.name}</span>
                <ArrowRight className="text-gray-400" />
                <span>{molecule2?.name}</span>
              </div>
              
              <SimilarityGauge similarity={similarity} />
              
              <div className="mt-4">
                <p className="text-lg">
                  <span className="font-medium">Method:</span> <span className="capitalize">{method}</span>
                </p>
                <p className="text-lg">
                  <span className="font-medium">Similarity Score:</span> {(similarity * 100).toFixed(2)}%
                </p>
              </div>
              
              <button 
                onClick={exportResult}
                className="btn btn-secondary flex items-center gap-2 mt-4"
              >
                <Download size={16} />
                Export Result
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            {isCalculating ? (
              <div className="flex flex-col items-center">
                <div className="animate-pulse-slow h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary-500"></div>
                </div>
                <p>Calculating similarity...</p>
              </div>
            ) : (
              <p>Enter two molecules to calculate similarity</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareView;