
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MetroMap from '@/components/map/MetroMap';

const Map = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Bản đồ tuyến Metro TP.HCM
          </h1>
          <p className="text-muted-foreground">
            Xem bản đồ chi tiết các tuyến metro và thông tin về các trạm. Di chuyển và phóng to để xem chi tiết.
          </p>
        </div>
        <MetroMap />
      </main>
      <Footer />
    </div>
  );
};

export default Map;
