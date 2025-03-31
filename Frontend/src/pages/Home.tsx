
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import RoutePlanner from '@/components/route/RoutePlanner';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                Lập lộ trình
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tìm <span className="text-accent">lộ trình tối ưu</span> cho hành trình của bạn
              </h2>
              <p className="text-muted-foreground">
                Chọn điểm đi và điểm đến, chúng tôi sẽ giúp bạn tìm lộ trình phù hợp nhất.
              </p>
            </div>
            <RoutePlanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
