
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { stations, metroLines, getStationById } from '@/utils/metroData';
import { MapPin, Info, Layers, ZoomIn, ZoomOut, RotateCcw, Train, Clock, CalendarClock, Wifi, ShowerHead, Coffee } from 'lucide-react';
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

// Define custom CSS for metro line colors
const metroLineStyles = `
  .route-line-red { stroke: #E73C3E; }
  .route-line-blue { stroke: #0067C0; }
  .route-line-green { stroke: #4CAF50; }
  .route-line-purple { stroke: #9C27B0; }
  .route-line-yellow { stroke: #FFC107; }
  .route-line-brown { stroke: #795548; }
  
  .fill-metro-red { fill: #E73C3E; }
  .fill-metro-blue { fill: #0067C0; }
  .fill-metro-green { fill: #4CAF50; }
  .fill-metro-purple { fill: #9C27B0; }
  .fill-metro-yellow { fill: #FFC107; }
  .fill-metro-brown { fill: #795548; }
  
  .text-metro-red { color: #E73C3E; }
  .text-metro-blue { color: #0067C0; }
  .text-metro-green { color: #4CAF50; }
  .text-metro-purple { color: #9C27B0; }
  .text-metro-yellow { color: #FFC107; }
  .text-metro-brown { color: #795548; }
  .text-metro-gray { color: #9E9E9E; }

  @keyframes pulse-animation {
    0% { r: 10; opacity: 0.8; }
    50% { r: 15; opacity: 0.4; }
    100% { r: 10; opacity: 0.8; }
  }
  
  .station-pulse {
    animation: pulse-animation 2s infinite;
  }
  
  .station-marker:hover circle {
    stroke-width: 2px;
    stroke: #333;
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
  
  @keyframes slide-up {
    from {
      transform: translateY(20px) translateX(-50%);
      opacity: 0;
    }
    to {
      transform: translateY(0) translateX(-50%);
      opacity: 1;
    }
  }
  
  .station-label {
    pointer-events: none;
    user-select: none;
  }
  
  .dashed-line {
    stroke-dasharray: 4 4;
  }
`;

const MetroMap = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showAllStationLabels, setShowAllStationLabels] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUnderground, setShowUnderground] = useState(true);
  const { toast } = useToast();
  
  // Setting SVG viewBox parameters
  const viewBoxWidth = 800;
  const viewBoxHeight = 600;
  
  // Geographic bounds of our map area (adjusted to fit all stations)
  const geoBounds = {
    minLng: 106.600,
    maxLng: 106.810,
    minLat: 10.680,
    maxLat: 10.860
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
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleZoomReset = () => {
    setIsAnimating(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    
    // Reset the animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
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

  // Handle station selection
  const handleStationClick = (stationId: string) => {
    setSelectedStation(prev => prev === stationId ? null : stationId);
    
    const station = getStationById(stationId);
    if (station) {
      const lineNames = station.lines.map(line => {
        const metroLine = metroLines.find(l => l.id === line);
        return metroLine?.nameVi || '';
      }).join(', ');
      
      toast({
        title: station.name,
        description: `${station.nameVi} - ${lineNames}`,
      });
    }
  };

  // Get facility icon
  const getFacilityIcon = (facility: string) => {
    switch(facility) {
      case 'elevator':
        return <Clock className="h-4 w-4" />; // Changed from Escalator to Clock
      case 'ticket-office':
        return <MapPin className="h-4 w-4" />;
      case 'ticket-machine':
        return <Train className="h-4 w-4" />;
      case 'restroom':
        return <ShowerHead className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'cafe':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    // Add mouse wheel zoom event
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale(prev => Math.min(prev * 1.05, 5));
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

  // Drawing metro lines
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
      
      // Check if line has underground segments
      const hasUndergroundSegments = line.stations.some(stationId => {
        const station = getStationById(stationId);
        return station?.isUnderground;
      });

      return (
        <g key={line.id} className="metro-line">
          {/* Background for better visibility */}
          <path
            d={pathData}
            className="route-background"
            stroke="white"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Actual colored line */}
          <path
            d={pathData}
            className={`route-line-${line.id}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            strokeDasharray={hasUndergroundSegments && showUnderground ? "5,3" : "0"} // Dashed for underground
          />
        </g>
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
      else if (station.lines.includes('brown')) stationColor = 'text-metro-brown';
      
      // For interchange stations (multiple lines)
      const isInterchange = station.lines.length > 1;
      
      // For depots
      const isDepot = station.isDepot;
      
      // For underground stations
      const isUnderground = station.isUnderground;
      
      return (
        <g key={station.id} className="station-marker">
          {/* Station highlight/pulse effect for selected station */}
          {isSelected && (
            <circle
              cx={x}
              cy={y}
              r={isInterchange ? 12 : 10}
              className="station-pulse"
              fill="currentColor"
              opacity="0.2"
              style={{ color: stationColor.replace('text-', 'fill-') }}
            />
          )}
          
          {/* White outline around station */}
          <circle
            cx={x}
            cy={y}
            r={isInterchange ? 7 : isDepot ? 8 : 5}
            fill="white"
            strokeWidth={isInterchange ? 1.5 : 1}
            stroke="#111"
            className={isSelected ? 'stroke-accent stroke-[2px]' : ''}
          />
          
          {/* Station inner circle */}
          {isDepot ? (
            <rect
              x={x - 5}
              y={y - 5}
              width="10"
              height="10"
              className={`${stationColor.replace('text-', 'fill-')} ${isSelected ? 'stroke-accent stroke-[2px]' : ''}`}
              onClick={() => handleStationClick(station.id)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <circle
              cx={x}
              cy={y}
              r={isInterchange ? 5 : 3}
              className={`${
                isInterchange ? 'fill-white stroke-black stroke-1' : stationColor.replace('text-', 'fill-')
              } ${isSelected ? 'stroke-accent stroke-[2px]' : ''}`}
              onClick={() => handleStationClick(station.id)}
              style={{ cursor: 'pointer' }}
            />
          )}
          
          {/* Underground indicator */}
          {isUnderground && showUnderground && (
            <circle
              cx={x}
              cy={y}
              r="10"
              fill="none"
              stroke="#333"
              strokeWidth="1"
              strokeDasharray="2,2"
              style={{ pointerEvents: 'none' }}
            />
          )}
          
          {/* Station label */}
          {(isSelected || showAllStationLabels || isInterchange || isDepot) && (
            <g className="station-label">
              {/* Label background for better readability */}
              <rect
                x={x - 40}
                y={y + 8}
                width="80"
                height="18"
                rx="4"
                ry="4"
                fill="white"
                opacity="0.9"
                stroke="#eee"
                strokeWidth="1"
              />
              <text
                x={x}
                y={y + 21}
                textAnchor="middle"
                className="text-[9px] font-medium fill-current"
              >
                {station.nameVi}
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  // Render map watermark and background features
  const renderMapFeatures = () => {
    return (
      <g className="map-features">
        {/* City area outlines */}
        <path 
          d="M50,400 C150,350 300,380 400,300 C500,250 650,280 750,320" 
          fill="none" 
          stroke="#ddd" 
          strokeWidth="30" 
          opacity="0.1"
        />
        
        {/* Rivers */}
        <path 
          d="M150,100 C200,200 180,300 250,400 C280,450 350,480 400,500" 
          fill="none" 
          stroke="#A5D6F1" 
          strokeWidth="20" 
          opacity="0.6"
        />
        
        <path 
          d="M450,150 C500,200 520,300 550,350 C580,400 650,420 700,430" 
          fill="none" 
          stroke="#A5D6F1" 
          strokeWidth="15" 
          opacity="0.6"
        />
        
        {/* City center highlight */}
        <circle 
          cx={geoToSvgX(106.698471)} 
          cy={geoToSvgY(10.773237)} 
          r="40" 
          fill="#f8f8f8" 
          opacity="0.2"
        />
        
        {/* Map watermark */}
        <text 
          x={viewBoxWidth / 2} 
          y={viewBoxHeight - 20} 
          textAnchor="middle" 
          className="text-[16px] fill-muted-foreground opacity-30 font-light"
        >
          TP. Hồ Chí Minh
        </text>
        
        {/* Grid lines for reference */}
        <g className="grid-lines" opacity="0.1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line 
              key={`h-${i}`}
              x1="0" 
              y1={i * viewBoxHeight / 5} 
              x2={viewBoxWidth} 
              y2={i * viewBoxHeight / 5} 
              stroke="#333" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line 
              key={`v-${i}`}
              x1={i * viewBoxWidth / 6} 
              y1="0" 
              x2={i * viewBoxWidth / 6} 
              y2={viewBoxHeight} 
              stroke="#333" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
          ))}
        </g>
      </g>
    );
  };

  return (
    <div className="metro-map relative bg-white rounded-xl border overflow-hidden shadow-md">
      {/* Inject CSS for metro line styles */}
      <style>{metroLineStyles}</style>
      
      {/* Map Controls - Styled more prominently */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button variant="default" size="icon" onClick={handleZoomIn} title="Phóng to" className="bg-white text-primary hover:bg-gray-100 shadow-sm">
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon" onClick={handleZoomOut} title="Thu nhỏ" className="bg-white text-primary hover:bg-gray-100 shadow-sm">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon" onClick={handleZoomReset} title="Reset" className="bg-white text-primary hover:bg-gray-100 shadow-sm">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Map Legend with better styling */}
      <div className="absolute top-4 left-4 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-1 shadow-sm">
              <Info className="h-4 w-4" />
              <span>Chú thích</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Train className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Tuyến tàu metro</h3>
            </div>
            <div className="space-y-2 mb-4">
              {metroLines.map(line => (
                <div key={line.id} className="flex items-center gap-2">
                  <div className={`h-3 w-8 bg-metro-${line.id} rounded-full`}></div>
                  <span className="text-sm">{line.nameVi}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Các trạm</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="3" className="fill-metro-red" />
                </svg>
                <span className="text-sm">Trạm thường</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="5" className="fill-white stroke-black stroke-1" />
                </svg>
                <span className="text-sm">Trạm chuyển tuyến</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <rect x="3" y="3" width="10" height="10" className="fill-metro-red" />
                </svg>
                <span className="text-sm">Depot (Trạm đầu cuối)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                  <circle cx="8" cy="8" r="3" className="fill-metro-blue" />
                </svg>
                <span className="text-sm">Trạm ngầm</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t mb-1.5">
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
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Hiển thị đường ngầm</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  checked={showUnderground}
                  onChange={() => setShowUnderground(!showUnderground)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Map SVG Container with improved styling */}
      <div 
        className="w-full h-[600px] overflow-hidden bg-gray-50"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full drop-shadow-sm"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging || isAnimating ? 'transform 0.3s ease-out' : 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Map background with subtle patterns */}
          <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="#f8fafc" />
          
          {/* Map features like city areas */}
          {renderMapFeatures()}
          
          {/* Metro lines */}
          {renderMetroLines()}
          
          {/* Station markers */}
          {renderStations()}
        </svg>
      </div>

      {/* Station Info panel with improved design */}
      {selectedStation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-lg border p-4 z-20 animate-slide-up">
          {(() => {
            const station = getStationById(selectedStation);
            if (!station) return null;
            
            // Get line colors for badges
            const getLineColor = (lineId: string) => {
              switch(lineId) {
                case 'red': return 'bg-metro-red';
                case 'blue': return 'bg-metro-blue';
                case 'green': return 'bg-metro-green';
                case 'purple': return 'bg-metro-purple';
                case 'yellow': return 'bg-metro-yellow';
                case 'brown': return 'bg-metro-brown';
                default: return 'bg-metro-gray';
              }
            };
            
            return (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      {station.isDepot ? (
                        <rect x="5" y="5" width="10" height="10" className={`fill-metro-${station.lines[0]}`} />
                      ) : (
                        <circle cx="10" cy="10" r="6" className={`fill-metro-${station.lines[0]}`} />
                      )}
                    </svg>
                    {station.name}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedStation(null)}
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-muted-foreground mb-3">{station.nameVi}</p>
                
                <div className="flex gap-2 flex-wrap mb-3">
                  {station.lines.map(line => {
                    const metroLine = metroLines.find(l => l.id === line);
                    return (
                      <div 
                        key={line}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getLineColor(line)}`}
                      >
                        {metroLine?.nameVi || ''}
                      </div>
                    );
                  })}
                  
                  {station.isDepot && (
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                      Depot
                    </div>
                  )}
                  
                  {station.isUnderground && (
                    <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-white">
                      Đường ngầm
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Giờ mở cửa</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">05:30 - 22:30</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Tần suất</h4>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-primary" />
                      <span className="text-sm">5-10 phút</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs uppercase text-muted-foreground font-medium mb-1">Tiện ích tại trạm</h4>
                  <div className="flex flex-wrap gap-2">
                    {station.facilities.map(f => {
                      const facilityName = 
                        f === 'elevator' ? 'Thang máy' :
                        f === 'ticket-office' ? 'Phòng vé' :
                        f === 'ticket-machine' ? 'Máy bán vé' :
                        f === 'restroom' ? 'Nhà vệ sinh' : f;
                      
                      return (
                        <span key={f} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-xs border">
                          {getFacilityIcon(f)}
                          {facilityName}
                        </span>
                      );
                    })}
                  </div>
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
                          <Clock className="h-4 w-4" />
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
