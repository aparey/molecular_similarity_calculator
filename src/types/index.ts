export interface Molecule {
  id: string;
  name: string;
  smiles: string;
  fingerprint?: number[];
}

export interface ComparisonResult {
  id: string;
  timestamp: number;
  molecule1: Molecule;
  molecule2: Molecule;
  similarity: number;
  method: 'tanimoto' | 'dice' | 'cosine';
}

export interface BatchComparisonResult {
  id: string;
  timestamp: number;
  queryMolecule: Molecule;
  results: {
    molecule: Molecule;
    similarity: number;
  }[];
  method: 'tanimoto' | 'dice' | 'cosine';
}