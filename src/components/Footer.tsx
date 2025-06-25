import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">MolSimilarity</h3>
            <p className="text-sm text-gray-400">
              A tool for calculating molecular similarity using advanced algorithms.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h4 className="font-medium mb-2">Resources</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Algorithms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors" aria-label="Github">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-center text-gray-400">
          © {new Date().getFullYear()} MolSimilarity. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;