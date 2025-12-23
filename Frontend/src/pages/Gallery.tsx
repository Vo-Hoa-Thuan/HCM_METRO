
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Gallery from '@/components/gallery/Gallery';

const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="py-10">
          <Gallery />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
