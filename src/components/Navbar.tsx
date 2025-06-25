import React from 'react';
import { NavLink } from 'react-router-dom';
import { FlaskRound as Flask, LineChart, Table, History } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-6">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <Flask className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-800">MolSimilarity</span>
            </NavLink>
            <button className="md:hidden p-2" aria-label="Toggle menu">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <nav className="md:flex md:items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-500'
                }`
              }
              end
            >
              <Flask className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-500'
                }`
              }
            >
              <LineChart className="h-4 w-4" />
              <span>Compare</span>
            </NavLink>
            <NavLink
              to="/batch"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-500'
                }`
              }
            >
              <Table className="h-4 w-4" />
              <span>Batch Compare</span>
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-500'
                }`
              }
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;