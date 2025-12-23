
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { stations, metroLines, getStationById } from '@/utils/metroData';
import { MapPin, Info, Users, ZoomIn, ZoomOut, RotateCcw, Train, Clock, Wifi, Calendar, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRealTimeTrains as getRealTimeTrainsFromMetro } from '@/api/metroApi';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Premium modern map styling
const metroMapStyles = `
  /* Neon Glow Effects */
  .glow-red { filter: drop-shadow(0 0 3px rgba(231, 60, 62, 0.6)); }
  .glow-blue { filter: drop-shadow(0 0 3px rgba(0, 103, 192, 0.6)); }
  .glow-green { filter: drop-shadow(0 0 3px rgba(76, 175, 80, 0.6)); }
  .glow-purple { filter: drop-shadow(0 0 3px rgba(156, 39, 176, 0.6)); }
  .glow-yellow { filter: drop-shadow(0 0 3px rgba(255, 193, 7, 0.6)); }
  .glow-brown { filter: drop-shadow(0 0 3px rgba(121, 85, 72, 0.6)); }

  /* Line Colors */
  .stroke-metro-red { stroke: #E73C3E; }
  .stroke-metro-blue { stroke: #0067C0; }
  .stroke-metro-green { stroke: #4CAF50; }
  .stroke-metro-purple { stroke: #9C27B0; }
  .stroke-metro-yellow { stroke: #FFC107; }
  .stroke-metro-brown { stroke: #795548; }
  
  .fill-metro-red { fill: #E73C3E; }
  .fill-metro-blue { fill: #0067C0; }
  .fill-metro-green { fill: #4CAF50; }
  .fill-metro-purple { fill: #9C27B0; }
  .fill-metro-yellow { fill: #FFC107; }
  .fill-metro-brown { fill: #795548; }

  /* Animations */
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  
  .train-pulse-ring {
    animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    transform-origin: center;
    transform-box: fill-box;
  }

  .station-hover-anim {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-origin: center;
    transform-box: fill-box;
  }
  .station-hover-anim:hover {
    transform: scale(1.5);
    cursor: pointer;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
  }

  .train-marker-group {
    transition: transform 3s linear; 
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  /* Map Background Pattern */
  .map-grid-pattern {
    stroke: #e2e8f0;
    stroke-width: 0.5;
  }
`;

const MetroMap = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState({ x: -50, y: -50 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showAllStationLabels, setShowAllStationLabels] = useState(false);
  const [showRealTime, setShowRealTime] = useState(true);
  const [realTimeTrains, setRealTimeTrains] = useState<any[]>([]);

  const viewBoxWidth = 1000;
  const viewBoxHeight = 700;

  // Geographic bounds - tweaked for better centering of HCMC
  const geoBounds = {
    minLng: 106.580,
    maxLng: 106.830,
    minLat: 10.660,
    maxLat: 10.880
  };

  const geoToSvgX = (lng: number) => {
    return ((lng - geoBounds.minLng) / (geoBounds.maxLng - geoBounds.minLng)) * viewBoxWidth;
  };

  const geoToSvgY = (lat: number) => {
    return viewBoxHeight - ((lat - geoBounds.minLat) / (geoBounds.maxLat - geoBounds.minLat)) * viewBoxHeight;
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const handleZoomReset = () => {
    setScale(1.2);
    setPosition({ x: -50, y: -50 });
  };

  // Mouse/Touch events for pan/zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleStationClick = (stationId: string) => {
    setSelectedStation(prev => prev === stationId ? null : stationId);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) setScale(prev => Math.min(prev * 1.05, 5));
      else setScale(prev => Math.max(prev / 1.05, 0.5));
    };
    const svgElement = svgRef.current;
    if (svgElement) svgElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => svgElement?.removeEventListener('wheel', handleWheel);
  }, []);

  // Poll real-time trains
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchTrains = async () => {
      if (!showRealTime) return;
      try {
        const trains = await getRealTimeTrainsFromMetro();
        // If backend fails or returns empty, fallback to simple simulation for demo
        if (!trains || trains.length === 0) {
          // Fallback simulation logic could go here if needed
          // For now we assume the seed data works or will be fixed soon
        }
        setRealTimeTrains(trains || []);
      } catch (error) {
        // console.error("Failed to fetch real-time trains", error);
      }
    };
    if (showRealTime) {
      fetchTrains();
      intervalId = setInterval(fetchTrains, 3000);
    } else {
      setRealTimeTrains([]);
    }
    return () => clearInterval(intervalId);
  }, [showRealTime]);


  // --- RENDERERS ---

  const renderBackground = () => (
    <g className="map-background">
      {/* Base Land Color */}
      <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="#F8FAFC" />

      {/* Subtle Grid Pattern */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E2E8F0" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Saigon River - Stylized Abstract Shape */}
      <path
        d="M 300,0 C 350,100 250,200 350,300 C 450,400 350,550 500,700"
        fill="none"
        stroke="#BFDBFE"
        strokeWidth="30"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 550,150 C 600,200 600,300 680,350 C 750,400 850,420 950,430"
        fill="none"
        stroke="#BFDBFE"
        strokeWidth="20"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* District Boundaries (Abstract) */}
      <path
        d="M 200,600 Q 400,500 600,600 T 900,550"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.5"
      />
    </g>
  );

  const renderMetroLines = () => {
    return metroLines.map(line => {
      const points = line.stations.map(sid => {
        const s = getStationById(sid);
        return s ? [geoToSvgX(s.coordinates[0]), geoToSvgY(s.coordinates[1])] : null;
      }).filter(Boolean) as [number, number][];

      if (points.length < 2) return null;

      // Build Path string
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

      // Neon Glow effect class
      const glowClass = `glow-${line.id}`;
      const strokeClass = `stroke-metro-${line.id}`;

      return (
        <g key={line.id} className="metro-line-group">
          {/* Outer Glow/Shadow */}
          <path d={pathD} fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            className={`${strokeClass} ${glowClass}`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={line.id === 'blue' || line.id === 'brown' ? "0" : "0"} // Example: solid lines mostly
            opacity="0.9"
          />
        </g>
      );
    });
  };

  const renderStations = () => {
    return stations.map(station => {
      const x = geoToSvgX(station.coordinates[0]);
      const y = geoToSvgY(station.coordinates[1]);
      const isSelected = selectedStation === station.id;
      const isInterchange = station.isInterchange;
      const isDepot = station.isDepot;

      // Determine main color
      const mainLine = station.lines[0] || 'red'; // default
      const fillClass = `fill-metro-${mainLine}`;

      return (
        <g
          key={station.id}
          className={`station-marker station-hover-anim`}
          onClick={(e) => { e.stopPropagation(); handleStationClick(station.id); }}
        >
          {/* Selection Ring */}
          {isSelected && (
            <circle cx={x} cy={y} r={20} fill="none" stroke="#2563EB" strokeWidth="2" opacity="0.5" className="animate-ping" />
          )}

          {/* Marker Body */}
          {isInterchange ? (
            // Diamond for Interchange
            <rect
              x={x - 6} y={y - 6} width="12" height="12"
              className="fill-white stroke-gray-800"
              strokeWidth="2"
              transform={`rotate(45 ${x} ${y})`}
            />
          ) : isDepot ? (
            // Square for Depot
            <rect x={x - 5} y={y - 5} width="10" height="10" className={`${fillClass} stroke-white`} strokeWidth="2" />
          ) : (
            // Circle for Normal
            <circle cx={x} cy={y} r="4.5" className="fill-white" stroke="#334155" strokeWidth="2" />
          )}

          {/* Inner Dot for Interchange */}
          {isInterchange && <circle cx={x} cy={y} r="2" className={fillClass} />}

          {/* Label */}
          {(isSelected || showAllStationLabels || isDepot) && (
            <g pointerEvents="none">
              <rect x={x - 40} y={y + 12} width="80" height="20" rx="4" fill="rgba(255,255,255,0.9)" stroke="#cbd5e1" strokeWidth="1" />
              <text x={x} y={y + 25} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">{station.nameVi}</text>
            </g>
          )}
        </g>
      );
    });
  };

  const renderTrains = () => {
    if (!showRealTime || !realTimeTrains.length) return null;
    return realTimeTrains.map(train => {
      if (!train.lat || !train.lng) return null;
      const x = geoToSvgX(train.lng);
      const y = geoToSvgY(train.lat);

      return (
        <g key={train.trainId} className="train-marker-group" style={{ transform: `translate(${x}px, ${y}px)` }}>
          {/* Pulse Ring */}
          <circle r="15" fill="none" stroke="#F59E0B" strokeWidth="2" className="train-pulse-ring" />

          {/* Icon Body */}
          <circle r="9" fill="#F59E0B" stroke="white" strokeWidth="2" />
          <Train x="-5" y="-5" width="10" height="10" stroke="white" strokeWidth="2" />

          {/* Label Tag */}
          <g transform="translate(12, -10)">
            <rect x="0" y="0" width="36" height="14" rx="2" fill="white" stroke="#F59E0B" strokeWidth="1" />
            <text x="18" y="10" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F59E0B">{train.trainNumber?.split('-').pop() || 'T'}</text>
          </g>
        </g>
      );
    });
  };

  return (
    <div className="metro-map-container bg-slate-50 border rounded-xl shadow-lg relative h-[600px] overflow-hidden">
      <style>{metroMapStyles}</style>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button size="icon" variant="secondary" onClick={handleZoomIn} className="bg-white shadow-md hover:bg-slate-100"><ZoomIn size={18} /></Button>
        <Button size="icon" variant="secondary" onClick={handleZoomOut} className="bg-white shadow-md hover:bg-slate-100"><ZoomOut size={18} /></Button>
        <Button size="icon" variant="secondary" onClick={handleZoomReset} className="bg-white shadow-md hover:bg-slate-100"><RotateCcw size={18} /></Button>
      </div>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Simple Legend Toggle */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white/90 backdrop-blur shadow-sm text-xs font-semibold">
              <Info size={14} className="mr-2" /> Chú thích
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 text-sm bg-white/95 backdrop-blur-md">
            <div className="space-y-3">
              <h4 className="font-semibold border-b pb-2">Ký hiệu bản đồ</h4>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> <span>Tuyến Bến Thành - Suối Tiên</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600" /> <span>Tuyến Bến Thành - Tham Lương</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rotate-45 border border-gray-800 bg-white" /> <span>Trạm trung chuyển</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-gray-600 bg-white" /> <span>Trạm thông thường</span></div>
            </div>
            <div className="mt-4 pt-3 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span>Hiển thị tên trạm</span>
                <input type="checkbox" checked={showAllStationLabels} onChange={() => setShowAllStationLabels(!showAllStationLabels)} />
              </div>
              <div className="flex justify-between items-center text-amber-600 font-medium">
                <span>Vị trí tàu (Live)</span>
                <input type="checkbox" checked={showRealTime} onChange={() => setShowRealTime(!showRealTime)} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Station Card Overlay */}
      {selectedStation && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border p-4 w-[90%] max-w-sm z-30 transition-all duration-300 animate-in slide-in-from-bottom-5">
          {(() => {
            const s = getStationById(selectedStation);
            if (!s) return null;
            return (
              <div className="relative">
                <Button variant="ghost" size="sm" className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0" onClick={() => setSelectedStation(null)}>×</Button>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={18} className="text-red-500" /> {s.nameVi}
                </h3>
                <p className="text-slate-500 text-sm mb-3">{s.name}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.lines.map(l => (
                    <Badge key={l} variant="outline" className={`bg-metro-${l}/10 text-metro-${l} border-metro-${l}/20 uppercase text-[10px]`}>
                      Line {l}
                    </Badge>
                  ))}
                  {s.isInterchange && <Badge variant="secondary" className="text-[10px]">Trạm chuyển tuyến</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                  <div className="flex items-center gap-1"><Clock size={12} /> 05:00 - 23:00</div>
                  <div className="flex items-center gap-1"><Wifi size={12} /> Free Wi-Fi</div>
                  <div className="flex items-center gap-1"><Train size={12} /> Cách 5-10 phút</div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* SVG Map */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {renderBackground()}
        {renderMetroLines()}
        {renderStations()}
        {renderTrains()}
      </svg>
    </div>
  );
};

export default MetroMap;