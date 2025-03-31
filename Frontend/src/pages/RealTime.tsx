
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const RealTime = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Thời gian thực</h1>
          <div className="p-8 bg-accent/10 rounded-xl mb-8">
            <p className="text-lg mb-4">Tính năng này đang được phát triển và sẽ sớm ra mắt!</p>
            <p className="text-muted-foreground">
              Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn thông tin thời gian thực về các 
              chuyến tàu. Hãy quay lại sau để trải nghiệm tính năng này.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RealTime;
