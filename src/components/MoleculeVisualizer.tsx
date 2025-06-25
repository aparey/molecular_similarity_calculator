import React, { useRef, useEffect } from 'react';
import { drawMolecule } from '../utils/moleculeUtils';

interface MoleculeVisualizerProps {
  smiles: string;
  height?: number;
  width?: number;
  className?: string;
}

const MoleculeVisualizer: React.FC<MoleculeVisualizerProps> = ({
  smiles,
  height = 300,
  width = 300,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && smiles) {
      const canvas = canvasRef.current;
      // Set canvas size considering device pixel ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(dpr, dpr);
        context.clearRect(0, 0, width, height);
      }
      
      drawMolecule(smiles, canvas);
    }
  }, [smiles, width, height]);

  return (
    <div className={`molecule-visualizer ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="molecule-canvas"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};

export default MoleculeVisualizer;