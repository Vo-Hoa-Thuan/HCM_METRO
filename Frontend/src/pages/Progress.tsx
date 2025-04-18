
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProgressDisplay from '@/components/home/ProgressDisplay';


const ProgressPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="py-10">
          <ProgressDisplay />
         
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgressPage;
