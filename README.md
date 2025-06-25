# Molecular Similarity Calculator

A modern web application for calculating and visualizing molecular similarity using different algorithms. Built with React, TypeScript, and Tailwind CSS.

![Molecular Similarity Calculator](https://images.pexels.com/photos/954585/pexels-photo-954585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- **Molecule Comparison**: Compare two molecules using SMILES notation
- **Multiple Similarity Methods**:
  - Tanimoto Coefficient
  - Dice Similarity
  - Cosine Similarity
- **Batch Comparison**: Compare one molecule against multiple targets
- **Molecular Visualization**: 2D structure rendering using SmilesDrawer
- **Comparison History**: Track and export previous comparisons
- **Responsive Design**: Works seamlessly across devices

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- D3.js for visualizations
- SmilesDrawer for molecular structure rendering
- Lucide React for icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/molecule-similarity-calculator.git
   ```

2. Install dependencies:
   ```bash
   cd molecule-similarity-calculator
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Single Molecule Comparison

1. Navigate to the "Compare" section
2. Enter SMILES notation for two molecules
3. Select a similarity method
4. View the calculated similarity and molecular structures

### Batch Comparison

1. Go to the "Batch Compare" section
2. Enter a query molecule
3. Add multiple target molecules
4. Calculate similarities against all targets
5. Export results as needed

## Example Molecules

The application includes several example molecules for testing:

- Aspirin: `CC(=O)OC1=CC=CC=C1C(=O)O`
- Caffeine: `CN1C=NC2=C1C(=O)N(C(=O)N2C)C`
- Paracetamol: `CC(=O)NC1=CC=C(C=C1)O`
- And more...

## Similarity Methods

### Tanimoto Coefficient
- Most widely used similarity metric
- Measures the ratio of shared features to total features
- Range: 0 (no similarity) to 1 (identical)

### Dice Similarity
- Emphasizes common features
- Less sensitive to size differences
- Range: 0 to 1

### Cosine Similarity
- Measures angle between feature vectors
- Size-independent comparison
- Range: 0 to 1

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- SmilesDrawer for molecular visualization
- D3.js community for visualization tools
- React and TypeScript teams

## Contact

For questions or suggestions, please open an issue in the GitHub repository.