import React, { useState } from 'react';
import { useMoleculeContext } from '../context/MoleculeContext';
import MoleculeVisualizer from '../components/MoleculeVisualizer';
import SimilarityGauge from '../components/SimilarityGauge';
import { Download, Trash, ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';

const History: React.FC = () => {
  const { history, clearHistory } = useMoleculeContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'molecule-comparison-history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comparison History</h1>
        
        <div className="flex gap-2">
          <button 
            onClick={exportHistory}
            disabled={history.length === 0}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export All
          </button>
          
          <button 
            onClick={clearHistory}
            disabled={history.length === 0}
            className="btn bg-error-50 text-error-700 hover:bg-error-100 focus:ring-error-500 flex items-center gap-2"
          >
            <Trash size={16} />
            Clear History
          </button>
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          <p className="mb-4">No comparison history available</p>
          <p className="text-sm">Comparisons you perform will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="card overflow-hidden animate-fade-in">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="font-medium">{item.molecule1.name} vs {item.molecule2.name}</div>
                  <div className="text-sm px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                    {item.method}
                  </div>
                  <div 
                    className={
                      item.similarity > 0.7 ? 'text-success-500 font-medium' :
                      item.similarity > 0.3 ? 'text-warning-500 font-medium' :
                      'text-error-500 font-medium'
                    }
                  >
                    {Math.round(item.similarity * 100)}% similarity
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.timestamp)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(item.timestamp)}
                  </div>
                  {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedId === item.id && (
                <div className="p-4 pt-0 border-t border-gray-100 animate-slide-up">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <div>
                      <h3 className="text-md font-medium mb-2">{item.molecule1.name}</h3>
                      <MoleculeVisualizer smiles={item.molecule1.smiles} height={180} width={220} />
                      <div className="mt-2 text-sm text-gray-500 break-all">
                        <div className="font-medium">SMILES:</div>
                        {item.molecule1.smiles}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <SimilarityGauge similarity={item.similarity} size={180} />
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-2">{item.molecule2.name}</h3>
                      <MoleculeVisualizer smiles={item.molecule2.smiles} height={180} width={220} />
                      <div className="mt-2 text-sm text-gray-500 break-all">
                        <div className="font-medium">SMILES:</div>
                        {item.molecule2.smiles}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `similarity-${item.molecule1.name}-${item.molecule2.name}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="btn btn-secondary flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;