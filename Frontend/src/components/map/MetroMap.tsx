
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { stations, metroLines, getStationById } from '@/utils/metroData';
import { MapPin, Info, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MetroMap = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showAllStationLabels, setShowAllStationLabels] = useState(false);
  const { toast } = useToast();
  
  // Map coordinates are based on the actual geographic locations
  // This requires conversion between geographic coordinates and SVG coordinates
  
  // Setting SVG viewBox parameters
  const viewBoxWidth = 600;
  const viewBoxHeight = 400;
  
  // Geographic bounds of our map area
  const geoBounds = {
    minLng: 106.690,
    maxLng: 106.770,
    minLat: 10.770,
    maxLat: 10.835
  };
  
  // Convert geographic coordinates to SVG coordinates
  const geoToSvgX = (lng: number) => {
    return ((lng - geoBounds.minLng) / (geoBounds.maxLng - geoBounds.minLng)) * viewBoxWidth;
  };
  
  const geoToSvgY = (lat: number) => {
    // Y-axis is inverted in SVG
    return viewBoxHeight - ((lat - geoBounds.minLat) / (geoBounds.maxLat - geoBounds.minLat)) * viewBoxHeight;
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPosition({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - startPosition.x,
      y: touch.clientY - startPosition.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleStationClick = (stationId: string) => {
    setSelectedStation(stationId);
    
    const station = getStationById(stationId);
    if (station) {
      toast({
        title: station.name,
        description: `${station.nameVi} - ${station.lines.map(line => 
          line === 'red' ? 'Tuyến đỏ' :
          line === 'blue' ? 'Tuyến xanh' : 
          line === 'green' ? 'Tuyến xanh lá' : 
          line === 'purple' ? 'Tuyến tím' : 
          'Tuyến vàng'
        ).join(', ')}`,
      });
    }
  };

  useEffect(() => {
    // Add mouse wheel zoom event
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale(prev => Math.min(prev * 1.05, 4));
      } else {
        setScale(prev => Math.max(prev / 1.05, 0.5));
      }
    };

    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (svgElement) {
        svgElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Drawing station connections (metro lines)
  const renderMetroLines = () => {
    return metroLines.map(line => {
      const lineStations = line.stations.map(stationId => {
        const station = getStationById(stationId);
        return station ? [geoToSvgX(station.coordinates[0]), geoToSvgY(station.coordinates[1])] : null;
      }).filter(Boolean) as [number, number][];

      // Create path data from coordinates
      let pathData = '';
      if (lineStations.length > 0) {
        pathData = `M ${lineStations[0][0]} ${lineStations[0][1]}`;
        for (let i = 1; i < lineStations.length; i++) {
          pathData += ` L ${lineStations[i][0]} ${lineStations[i][1]}`;
        }
      }

      return (
        <path
          key={line.id}
          d={pathData}
          className={`route-line-${line.id}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      );
    });
  };

  // Rendering stations
  const renderStations = () => {
    return stations.map(station => {
      const x = geoToSvgX(station.coordinates[0]);
      const y = geoToSvgY(station.coordinates[1]);
      const isSelected = selectedStation === station.id;
      
      // Determine station color based on lines
      let stationColor = 'text-metro-gray';
      if (station.lines.includes('red')) stationColor = 'text-metro-red';
      else if (station.lines.includes('blue')) stationColor = 'text-metro-blue';
      else if (station.lines.includes('green')) stationColor = 'text-metro-green';
      else if (station.lines.includes('purple')) stationColor = 'text-metro-purple';
      else if (station.lines.includes('yellow')) stationColor = 'text-metro-yellow';
      
      // For interchange stations (multiple lines)
      const isInterchange = station.lines.length > 1;
      
      return (
        <g key={station.id} className="station-marker">
          {/* Station circle */}
          <circle
            cx={x}
            cy={y}
            r={isInterchange ? 6 : 4}
            className={`${
              isInterchange ? 'fill-white stroke-black stroke-2' : stationColor.replace('text-', 'fill-')
            } ${isSelected ? 'stroke-accent stroke-[3px]' : ''}`}
            onClick={() => handleStationClick(station.id)}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Station label */}
          {(isSelected || showAllStationLabels || isInterchange) && (
            <text
              x={x}
              y={y + 16}
              textAnchor="middle"
              className="text-[10px] font-medium fill-current"
              style={{ pointerEvents: 'none' }}
            >
              {station.name}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className="metro-map relative bg-white rounded-xl border overflow-hidden shadow-md">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn} title="Phóng to">
          <span className="text-lg font-bold">+</span>
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut} title="Thu nhỏ">
          <span className="text-lg font-bold">−</span>
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomReset} title="Reset">
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Chú thích</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <h3 className="font-medium mb-2">Tuyến tàu metro</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 bg-metro-red rounded-full"></div>
                <span className="text-sm">Tuyến đỏ (Line 1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 bg-metro-blue rounded-full"></div>
                <span className="text-sm">Tuyến xanh (Line 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 bg-metro-green rounded-full"></div>
                <span className="text-sm">Tuyến xanh lá (Line 3)</span>
              </div>
            </div>
            
            <h3 className="font-medium mt-4 mb-2">Các trạm</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <circle cx="8" cy="8" r="4" className="fill-metro-red" />
                <span className="text-sm">Trạm thường</span>
              </div>
              <div className="flex items-center gap-2">
                <circle cx="8" cy="8" r="6" className="fill-white stroke-black stroke-2" />
                <span className="text-sm">Trạm chuyển tuyến</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-2 border-t">
              <span className="text-xs text-muted-foreground">Hiển thị tất cả trạm</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={showAllStationLabels}
                  onChange={() => setShowAllStationLabels(!showAllStationLabels)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map SVG Container */}
      <div 
        className="w-full h-[600px] overflow-hidden"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Metro lines */}
          {renderMetroLines()}
          
          {/* Station markers */}
          {renderStations()}
        </svg>
      </div>

      {/* Station Info panel appears when a station is selected */}
      {selectedStation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-lg border p-4 z-20 animate-slide-up">
          {(() => {
            const station = getStationById(selectedStation);
            if (!station) return null;
            
            return (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{station.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedStation(null)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-muted-foreground mb-3">{station.nameVi}</p>
                
                <div className="flex gap-2 mb-3">
                  {station.lines.map(line => (
                    <div 
                      key={line}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium text-white bg-metro-${line}`}
                    >
                      {line === 'red' ? 'Tuyến đỏ' : 
                       line === 'blue' ? 'Tuyến xanh' : 
                       line === 'green' ? 'Tuyến xanh lá' : 
                       line === 'purple' ? 'Tuyến tím' : 
                       'Tuyến vàng'}
                    </div>
                  ))}
                </div>
                
                <div className="text-sm mb-3">
                  <strong>Tiện ích:</strong> {station.facilities.map(f => {
                    switch(f) {
                      case 'elevator': return 'Thang máy';
                      case 'ticket-office': return 'Phòng vé';
                      case 'ticket-machine': return 'Máy bán vé';
                      case 'restroom': return 'Nhà vệ sinh';
                      default: return f;
                    }
                  }).join(', ')}
                </div>
                
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="gap-1">
                    <MapPin className="h-4 w-4" />
                    Chỉ đường đến đây
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="default" size="sm" className="gap-1">
                          Xem lịch trình
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Xem lịch tàu tại trạm này</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MetroMap;
