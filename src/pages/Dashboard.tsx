import React from 'react';
import { Link } from 'react-router-dom';
import { useMoleculeContext } from '../context/MoleculeContext';
import { LineChart, Table, History, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { history } = useMoleculeContext();
  const recentComparisons = history.slice(0, 3);

  const features = [
    {
      title: 'Compare Two Molecules',
      description: 'Calculate the similarity between any two molecules using multiple methods',
      icon: <LineChart className="h-10 w-10 text-primary-500" />,
      link: '/compare',
      buttonText: 'Compare Now',
    },
    {
      title: 'Batch Comparison',
      description: 'Compare one molecule against multiple others to find the most similar structures',
      icon: <Table className="h-10 w-10 text-secondary-500" />,
      link: '/batch',
      buttonText: 'Start Batch',
    },
    {
      title: 'Comparison History',
      description: 'View and export your previous molecular similarity comparisons',
      icon: <History className="h-10 w-10 text-accent-500" />,
      link: '/history',
      buttonText: 'View History',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center py-10 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Molecular Similarity Calculator</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare chemical structures and calculate similarity coefficients using advanced algorithms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="card p-6 hover:shadow-lg transition-shadow animate-slide-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <Link to={feature.link} className="btn btn-primary inline-flex items-center">
              {feature.buttonText} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      {recentComparisons.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Comparisons</h2>
          <div className="space-y-4">
            {recentComparisons.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{item.molecule1.name} vs {item.molecule2.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">
                    Method: <span className="capitalize">{item.method}</span>
                  </div>
                  <div className="font-medium">
                    Similarity: <span 
                      className={
                        item.similarity > 0.7 ? 'text-success-500' :
                        item.similarity > 0.3 ? 'text-warning-500' :
                        'text-error-500'
                      }
                    >
                      {Math.round(item.similarity * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {history.length > 3 && (
            <div className="mt-4 text-center">
              <Link to="/history" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                View All History <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">About Molecular Similarity</h2>
          <p className="mb-6">
            Molecular similarity is a fundamental concept in computational chemistry and drug discovery. 
            By comparing the structural features of molecules, scientists can identify compounds with 
            similar properties, helping to accelerate drug development and understand structure-activity 
            relationships.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Tanimoto Coefficient</h3>
              <p>
                The most widely used similarity metric, measuring the ratio of shared features to the total 
                number of features in both molecules.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Fingerprinting</h3>
              <p>
                Molecular fingerprints encode structural information as binary patterns, enabling 
                efficient similarity calculations.
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Applications</h3>
              <p>
                Used in virtual screening, lead optimization, chemical database searching, and 
                understanding structure-activity relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;