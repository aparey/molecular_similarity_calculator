import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 container mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;