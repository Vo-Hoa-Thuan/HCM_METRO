
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <Navbar />
      <main className={`flex-grow container mx-auto px-4 py-6 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
