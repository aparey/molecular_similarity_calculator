import SmilesDrawer from 'smiles-drawer';
import CryptoJS from 'crypto-js';

// Function to generate a molecular fingerprint from SMILES
export const generateFingerprint = (smiles: string): number[] => {
  // This is a simplified version. In a real implementation, you would use
  // a chemistry library to generate proper molecular fingerprints.
  // Here we're just creating a hash-based representation
  const hash = CryptoJS.SHA256(smiles).toString();
  
  // Convert the hash to a simplified binary fingerprint
  const fingerprint: number[] = [];
  for (let i = 0; i < hash.length; i += 2) {
    const byte = parseInt(hash.substr(i, 2), 16);
    for (let j = 0; j < 8; j++) {
      fingerprint.push((byte >> j) & 1);
    }
  }
  
  return fingerprint;
};

// Calculate Tanimoto similarity between two fingerprints
export const calculateTanimotoSimilarity = (fp1: number[], fp2: number[]): number => {
  if (fp1.length !== fp2.length) {
    throw new Error('Fingerprints must have the same length');
  }
  
  let intersectionCount = 0;
  let unionCount = 0;
  
  for (let i = 0; i < fp1.length; i++) {
    if (fp1[i] === 1 && fp2[i] === 1) {
      intersectionCount++;
    }
    if (fp1[i] === 1 || fp2[i] === 1) {
      unionCount++;
    }
  }
  
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

// Calculate Dice similarity between two fingerprints
export const calculateDiceSimilarity = (fp1: number[], fp2: number[]): number => {
  if (fp1.length !== fp2.length) {
    throw new Error('Fingerprints must have the same length');
  }
  
  let intersectionCount = 0;
  let totalCount = 0;
  
  for (let i = 0; i < fp1.length; i++) {
    if (fp1[i] === 1 && fp2[i] === 1) {
      intersectionCount++;
    }
    if (fp1[i] === 1) {
      totalCount++;
    }
    if (fp2[i] === 1) {
      totalCount++;
    }
  }
  
  return totalCount === 0 ? 0 : (2 * intersectionCount) / totalCount;
};

// Calculate Cosine similarity between two fingerprints
export const calculateCosineSimilarity = (fp1: number[], fp2: number[]): number => {
  if (fp1.length !== fp2.length) {
    throw new Error('Fingerprints must have the same length');
  }
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < fp1.length; i++) {
    dotProduct += fp1[i] * fp2[i];
    magnitude1 += fp1[i] * fp1[i];
    magnitude2 += fp2[i] * fp2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  return magnitude1 === 0 || magnitude2 === 0 ? 0 : dotProduct / (magnitude1 * magnitude2);
};

// Draw molecule to canvas using SMILES
export const drawMolecule = (smiles: string, canvas: HTMLCanvasElement): void => {
  try {
    // Initialize SmilesDrawer with better default options
    const options = {
      width: canvas.width,
      height: canvas.height,
      bondThickness: 1.2,
      shortBondLength: 0.8,
      bondSpacing: 5.0,
      atomVisualization: 'default',
      isomeric: true,
      debug: false,
      terminalCarbons: true,
      explicitHs: true,
      overlapSensitivity: 0.42,
      scale: 1.0,
      themes: {
        light: {
          C: '#222222',
          O: '#cc0000',
          N: '#0044cc',
          F: '#00aa00',
          CL: '#00aa00',
          BR: '#882200',
          I: '#6600bb',
          P: '#ff8800',
          S: '#ddaa00',
          B: '#ff8800',
          SI: '#808080',
          H: '#222222',
          BACKGROUND: '#ffffff'
        }
      }
    };

    const drawer = new SmilesDrawer.Drawer(options);
    
    // Clear the canvas first
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Parse and draw the molecule
    SmilesDrawer.parse(smiles, function(tree: any) {
      drawer.draw(tree, canvas, 'light', false);
    });
  } catch (error) {
    console.error('Error drawing molecule:', error);
    
    // Draw error message on canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid SMILES notation', canvas.width / 2, canvas.height / 2);
    }
  }
};

// Validate SMILES string (basic validation)
export const isValidSmiles = (smiles: string): boolean => {
  // This is a very basic validation - in real world you'd use a chemistry library
  if (!smiles || smiles.trim() === '') return false;
  
  // Check for some basic SMILES patterns
  const validChars = /^[A-Za-z0-9@\[\]\(\)\{\}\.\+\-=#$:%\/\\]+$/;
  return validChars.test(smiles);
};

// Example molecules for demo/testing
export const exampleMolecules = [
  { id: '1', name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { id: '2', name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
  { id: '3', name: 'Paracetamol', smiles: 'CC(=O)NC1=CC=C(C=C1)O' },
  { id: '4', name: 'Ibuprofen', smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
  { id: '5', name: 'Penicillin G', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C' },
  { id: '6', name: 'Doxycycline', smiles: 'CC1C2C(C3C(C(=O)C(C(C(=O)C(C1=O)=C(C=C3)O)C(C(N)=O)O)O)O)=C(O)C=CC2(C)O' },
  { id: '7', name: 'Melatonin', smiles: 'CC(=O)NCCC1=CNc2c1cc(OC)cc2' },
  { id: '8', name: 'Adrenaline', smiles: 'CNCC(C1=CC(=C(C=C1)O)O)O' }
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};