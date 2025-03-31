
import React from 'react';
import { Station, MetroLine, stations, metroLines } from '@/utils/metroData';
import StationInfoCard from './StationInfoCard';
import { Separator } from '@/components/ui/separator';

interface StationInfoPreviewProps {
  stationIds?: string[];
  title?: string;
  description?: string;
  className?: string;
}

const StationInfoPreview: React.FC<StationInfoPreviewProps> = ({
  stationIds = ['s1', 's9', 's13'], // Default to showing some important interchange stations
  title = "Các trạm chính",
  description = "Thông tin về các trạm quan trọng trong hệ thống Metro TP.HCM",
  className = ""
}) => {
  // Filter stations based on provided ids
  const filteredStations = stationIds
    .map(id => stations.find(s => s.id === id))
    .filter(Boolean) as Station[];

  return (
    <div className={`bg-white rounded-xl shadow-md border p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <StationInfoCard 
            key={station.id} 
            station={station} 
            lines={metroLines} 
          />
        ))}
      </div>
      
      {filteredStations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không có trạm nào được chọn</p>
        </div>
      )}
    </div>
  );
};

export default StationInfoPreview;
