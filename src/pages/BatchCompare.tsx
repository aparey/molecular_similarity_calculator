import React, { useState } from 'react';
import MoleculeInput from '../components/MoleculeInput';
import MoleculeVisualizer from '../components/MoleculeVisualizer';
import { Molecule, BatchComparisonResult } from '../types';
import { useMoleculeContext } from '../context/MoleculeContext';
import { 
  generateFingerprint, 
  calculateTanimotoSimilarity, 
  calculateDiceSimilarity, 
  calculateCosineSimilarity,
  exampleMolecules,
  generateId
} from '../utils/moleculeUtils';
import { Plus, Download, Trash, FlaskRound as Flask, ArrowUpDown } from 'lucide-react';

const BatchCompare: React.FC = () => {
  const [queryMolecule, setQueryMolecule] = useState<Molecule | null>(null);
  const [targetMolecules, setTargetMolecules] = useState<Molecule[]>([]);
  const [results, setResults] = useState<{molecule: Molecule; similarity: number}[]>([]);
  const [method, setMethod] = useState<'tanimoto' | 'dice' | 'cosine'>('tanimoto');
  const [isCalculating, setIsCalculating] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { addRecentMolecule } = useMoleculeContext();

  const handleQueryMoleculeSelect = (molecule: Molecule) => {
    setQueryMolecule({
      ...molecule,
      fingerprint: generateFingerprint(molecule.smiles)
    });
    addRecentMolecule(molecule);
  };

  const addTargetMolecule = (molecule: Molecule) => {
    const newMolecule = {
      ...molecule,
      fingerprint: generateFingerprint(molecule.smiles)
    };
    setTargetMolecules(prev => [...prev, newMolecule]);
    addRecentMolecule(molecule);
  };

  const removeTargetMolecule = (index: number) => {
    setTargetMolecules(prev => prev.filter((_, i) => i !== index));
  };

  const addAllExamples = () => {
    const newMolecules = exampleMolecules.map(molecule => ({
      ...molecule,
      fingerprint: generateFingerprint(molecule.smiles)
    }));
    setTargetMolecules(newMolecules);
  };

  const calculateSimilarities = () => {
    if (!queryMolecule || targetMolecules.length === 0) return;
    
    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      const newResults = targetMolecules.map(molecule => {
        let similarityValue: number;
        
        switch (method) {
          case 'dice':
            similarityValue = calculateDiceSimilarity(queryMolecule.fingerprint!, molecule.fingerprint!);
            break;
          case 'cosine':
            similarityValue = calculateCosineSimilarity(queryMolecule.fingerprint!, molecule.fingerprint!);
            break;
          case 'tanimoto':
          default:
            similarityValue = calculateTanimotoSimilarity(queryMolecule.fingerprint!, molecule.fingerprint!);
            break;
        }
        
        return {
          molecule,
          similarity: similarityValue
        };
      });
      
      // Sort by similarity
      const sortedResults = [...newResults].sort((a, b) => 
        sortOrder === 'desc' ? b.similarity - a.similarity : a.similarity - b.similarity
      );
      
      setResults(sortedResults);
      setIsCalculating(false);
    }, 1000);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    // Re-sort existing results
    if (results.length > 0) {
      const sortedResults = [...results].sort((a, b) => 
        newOrder === 'desc' ? b.similarity - a.similarity : a.similarity - b.similarity
      );
      setResults(sortedResults);
    }
  };

  const exportResults = () => {
    if (!queryMolecule || results.length === 0) return;
    
    const batchResult: BatchComparisonResult = {
      id: generateId(),
      timestamp: Date.now(),
      queryMolecule,
      results,
      method
    };
    
    const blob = new Blob([JSON.stringify(batchResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch-comparison-${queryMolecule.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Batch Comparison</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Query Molecule</h2>
          <MoleculeInput 
            label="Enter SMILES for Query Molecule" 
            onMoleculeSelect={handleQueryMoleculeSelect}
            value={queryMolecule}
          />
          
          {queryMolecule && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">{queryMolecule.name}</h3>
              <MoleculeVisualizer smiles={queryMolecule.smiles} height={200} width={260} />
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Target Molecules</h2>
            <div className="flex gap-2">
              <button 
                onClick={addAllExamples}
                className="btn btn-secondary text-sm"
                title="Add all example molecules"
              >
                Add Examples
              </button>
            </div>
          </div>
          
          {targetMolecules.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {targetMolecules.map((molecule, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center">
                    <Flask className="h-5 w-5 text-primary-500 mr-3" />
                    <div>
                      <div className="font-medium">{molecule.name}</div>
                      <div className="text-xs text-gray-500 truncate" style={{maxWidth: '200px'}}>
                        {molecule.smiles}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeTargetMolecule(index)}
                    className="text-gray-400 hover:text-error-500 transition-colors"
                    title="Remove molecule"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Add target molecules to compare</p>
            </div>
          )}
          
          <div className="mt-6">
            <MoleculeInput 
              label="Add Target Molecule" 
              onMoleculeSelect={addTargetMolecule}
              value={null}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Batch Comparison</h2>
        
        <div className="mb-6">
          <label htmlFor="batch-method-select" className="label">Similarity Method</label>
          <select
            id="batch-method-select"
            className="input"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'tanimoto' | 'dice' | 'cosine')}
          >
            <option value="tanimoto">Tanimoto Coefficient</option>
            <option value="dice">Dice Coefficient</option>
            <option value="cosine">Cosine Similarity</option>
          </select>
        </div>

        <div className="flex justify-center mb-6">
          <button 
            onClick={calculateSimilarities}
            disabled={!queryMolecule || targetMolecules.length === 0 || isCalculating}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Similarities
          </button>
        </div>
        
        {isCalculating ? (
          <div className="text-center p-8 text-gray-500">
            <div className="flex flex-col items-center">
              <div className="animate-pulse-slow h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <div className="h-8 w-8 rounded-full bg-primary-500"></div>
              </div>
              <p>Calculating similarities for {targetMolecules.length} molecules...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Results</h3>
              <div className="flex gap-2">
                <button 
                  onClick={toggleSortOrder}
                  className="text-sm flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-200 rounded"
                >
                  <ArrowUpDown size={14} />
                  {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
                </button>
                <button 
                  onClick={exportResults}
                  className="text-sm flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-200 rounded"
                >
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Molecule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SMILES
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Similarity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.molecule.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {result.molecule.smiles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span 
                          className={
                            result.similarity > 0.7 ? 'text-success-500' :
                            result.similarity > 0.3 ? 'text-warning-500' :
                            'text-error-500'
                          }
                        >
                          {(result.similarity * 100).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <p>Set a query molecule and target molecules, then calculate similarities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchCompare;