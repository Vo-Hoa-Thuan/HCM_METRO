
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoutePlanner from '@/components/route/RoutePlanner';

const Routes = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Tìm lộ trình di chuyển
          </h1>
          <p className="text-muted-foreground">
            Tìm kiếm và lập kế hoạch cho hành trình của bạn trên hệ thống tàu điện metro TP.HCM.
          </p>
        </div>
        <RoutePlanner />
      </main>
      <Footer />
    </div>
  );
};

export default Routes;
