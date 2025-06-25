import React, { useState } from 'react';
import { isValidSmiles, exampleMolecules } from '../utils/moleculeUtils';
import { useMoleculeContext } from '../context/MoleculeContext';
import { Molecule } from '../types';
import { FlaskRound as Flask, CheckCircle, AlertCircle } from 'lucide-react';

interface MoleculeInputProps {
  label: string;
  onMoleculeSelect: (molecule: Molecule) => void;
  value?: Molecule | null;
}

const MoleculeInput: React.FC<MoleculeInputProps> = ({ label, onMoleculeSelect, value }) => {
  const [inputValue, setInputValue] = useState(value?.smiles || '');
  const [inputName, setInputName] = useState(value?.name || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  
  const { recentMolecules } = useMoleculeContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue) {
      setIsValid(isValidSmiles(newValue));
    } else {
      setIsValid(null);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && isValidSmiles(inputValue)) {
      const moleculeName = inputName || `Molecule ${Math.floor(Math.random() * 1000)}`;
      const molecule: Molecule = {
        id: Math.random().toString(36).substring(2, 9),
        name: moleculeName,
        smiles: inputValue
      };
      onMoleculeSelect(molecule);
    }
  };

  const selectExample = (molecule: Molecule) => {
    setInputValue(molecule.smiles);
    setInputName(molecule.name);
    setIsValid(true);
    onMoleculeSelect(molecule);
    setShowExamples(false);
  };

  return (
    <div className="molecule-input-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`molecule-${label}`} className="label">
            {label}
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                id={`molecule-${label}`}
                className={`input pl-10 ${
                  isValid === false ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 
                  isValid === true ? 'border-success-500 focus:border-success-500 focus:ring-success-500' : ''
                }`}
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter SMILES notation"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Flask size={18} className="text-gray-400" />
              </div>
              {isValid !== null && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {isValid ? (
                    <CheckCircle size={18} className="text-success-500" />
                  ) : (
                    <AlertCircle size={18} className="text-error-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          {isValid === false && (
            <p className="mt-1 text-sm text-error-500">Invalid SMILES notation</p>
          )}
        </div>

        <div>
          <label htmlFor={`molecule-name-${label}`} className="label">
            Molecule Name (optional)
          </label>
          <input
            id={`molecule-name-${label}`}
            className="input"
            value={inputName}
            onChange={handleNameChange}
            placeholder="Enter a name for this molecule"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputValue || isValid === false}
          >
            Set Molecule
          </button>
          <button
            type="button"
            className="btn border border-gray-300 hover:bg-gray-50"
            onClick={() => setShowExamples(!showExamples)}
          >
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium mb-2">Example Molecules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exampleMolecules.map((molecule) => (
              <button
                key={molecule.id}
                className="text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm flex items-center"
                onClick={() => selectExample(molecule)}
              >
                <Flask size={16} className="mr-2 text-primary-500" />
                <div>
                  <div className="font-medium">{molecule.name}</div>
                  <div className="text-xs text-gray-500 truncate" style={{maxWidth: '220px'}}>
                    {molecule.smiles}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {recentMolecules.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-medium mb-2">Recent Molecules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentMolecules.map((molecule) => (
              <button
                key={molecule.id}
                className="text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm flex items-center"
                onClick={() => selectExample(molecule)}
              >
                <Flask size={16} className="mr-2 text-secondary-500" />
                <div>
                  <div className="font-medium">{molecule.name}</div>
                  <div className="text-xs text-gray-500 truncate" style={{maxWidth: '220px'}}>
                    {molecule.smiles}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoleculeInput;