
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MetroMap from '@/components/map/MetroMap';
import StationInfoPreview from '@/components/map/StationInfoPreview';
import { MapPin, Train, Clock, Calendar, Info, Download, Share2, Filter } from 'lucide-react';
import { metroLines, stations } from '@/utils/metroData';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const Map = () => {
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([
    's1', 's9', 's13' // Default to Ben Thanh, Phuoc Long, and Suoi Tien Park (interchange stations)
  ]);

  // These are stations that are interchanges between different lines
  const interchangeStations = stations.filter(station => station.isInterchange);
  
  // Get popular stations (interchanges + depots)
  const popularStationIds = stations
    .filter(station => station.isInterchange || station.isDepot)
    .map(station => station.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Train className="h-5 w-5" />
            <span className="font-medium">Sơ đồ Metro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Bản đồ tuyến Metro TP.HCM
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Xem bản đồ chi tiết tất cả các tuyến metro và thông tin về các trạm. Di chuyển và phóng to để xem chi tiết.
            Nhấp vào các trạm để xem thông tin chi tiết.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {metroLines.map(line => (
              <div key={line.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: line.color }}
                ></div>
                <span className="text-sm">{line.nameVi}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-sm">Nhấp để xem chi tiết</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Info className="h-4 w-4" /> Hướng dẫn sử dụng
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Download className="h-4 w-4" /> Tải bản đồ
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Share2 className="h-4 w-4" /> Chia sẻ
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Filter className="h-4 w-4" /> Bộ lọc
            </Button>
          </div>
        </div>
        
        <div className="relative mb-12">
          {/* Metro illustration overlays */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-contain bg-no-repeat bg-center opacity-20" 
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 11a7 7 0 0 1 7-7c4.2 0 7 2.8 7 7 0 3.1-2 5.9-5 6.9m-7-4.9h2m-2 8h12m-10 2v-4m8 4v-4'/%3E%3C/svg%3E")`}}></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-contain bg-no-repeat bg-center opacity-20" 
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='8' rx='2' ry='2'/%3E%3Ccircle cx='7' cy='19' r='2'/%3E%3Ccircle cx='17' cy='19' r='2'/%3E%3Cpath d='M10 11V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6'/%3E%3C/svg%3E")`}}></div>
          
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay pointer-events-none"></div>
            <MetroMap />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Station Information Cards - based on the provided image */}
        <div className="mb-12">
          <StationInfoPreview 
            stationIds={selectedStationIds}
            title="Khám phá các trạm chính"
            description="Nhấp vào các trạm trên bản đồ để xem thông tin chi tiết và dịch vụ tại mỗi trạm."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Khám phá các trạm</h3>
                <p className="text-muted-foreground text-sm">Nhấp vào các trạm trên bản đồ để xem thông tin chi tiết và dịch vụ tại mỗi trạm. Đã có đầy đủ các tuyến 1-6.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Thời gian hoạt động</h3>
                <p className="text-muted-foreground text-sm">Các tuyến Metro hoạt động từ 5:30 - 22:30 trong tuần và 6:00 - 22:00 vào cuối tuần.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Lịch và tần suất</h3>
                <p className="text-muted-foreground text-sm">Tần suất tàu: 5-6 phút vào giờ cao điểm và 10-15 phút vào giờ thường, phụ thuộc từng tuyến.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl p-6 shadow-md border max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Thông tin các tuyến Metro TP.HCM</h2>
          <div className="space-y-4">
            {metroLines.map(line => (
              <div key={line.id} className="p-4 rounded-lg border" style={{borderColor: line.color}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: line.color}}></div>
                  <h3 className="font-medium">{line.nameVi}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {line.stations.map(stationId => {
                    const station = metroLines.find(l => l.id === line.id)?.stations.includes(stationId);
                    return station ? 
                      metroLines.find(l => l.id === line.id)?.stations.indexOf(stationId) === 0 || 
                      metroLines.find(l => l.id === line.id)?.stations.indexOf(stationId) === 
                      (metroLines.find(l => l.id === line.id)?.stations.length || 0) - 1 ? 
                        <span key={stationId} className="font-medium">
                          {metroLines.find(l => l.id === line.id)?.stations.indexOf(stationId) === 0 ? '' : ' - '}
                          {` ${metroLines.find(l => l.id === line.id)?.stations.indexOf(stationId) === 0 ? 'Từ ' : 'Đến '}`}
                          {metroLines.find(l => l.id === line.id)?.stations.indexOf(stationId) === 0 && 
                           metroLines.find(l => l.id === line.id)?.stations.length === 1 ? 'Chỉ tại ' : ''}
                          {stations.find(s => s.id === stationId)?.nameVi}
                        </span> 
                      : null : null;
                  })}
                </p>
                <div className="flex flex-wrap text-xs text-muted-foreground gap-4">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Giờ cao điểm: {line.frequency.peakHours}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Giờ thường: {line.frequency.offPeakHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Map;
