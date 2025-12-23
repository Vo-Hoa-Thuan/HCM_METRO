import React, { useState } from 'react';

interface RouteResult {
    routeNumber: string;
    startPoint: string;
    endPoint: string;
    duration: string;
    price: string;
    stops: string[];
}

const RouteExplorer: React.FC = () => {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [routes, setRoutes] = useState<RouteResult[]>([]);

    const handleSearch = () => {
        // TODO: Integrate with actual API
        // This is demo data
        const demoRoutes: RouteResult[] = [
            {
                routeNumber: '33',
                startPoint: startLocation,
                endPoint: endLocation,
                duration: '45 phút',
                price: '7.000 VNĐ',
                stops: ['Bến xe Miền Đông', 'Ngã tư Bình Thái', 'Suối Tiên']
            }
        ];
        setRoutes(demoRoutes);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Tra Cứu Lộ Trình</h2>

            <div style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '24px'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Điểm đi:</label>
                        <input
                            type="text"
                            placeholder="Nhập điểm xuất phát"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Điểm đến:</label>
                        <input
                            type="text"
                            placeholder="Nhập điểm đến"
                            value={endLocation}
                            onChange={(e) => setEndLocation(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Tìm Lộ Trình
                </button>
            </div>

            {routes.length > 0 && (
                <div>
                    <h3>Kết Quả Tìm Kiếm</h3>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                        {routes.map((route, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '20px',
                                    borderBottom: index < routes.length - 1 ? '1px solid #ddd' : 'none'
                                }}
                            >
                                <h4>Tuyến số {route.routeNumber}</h4>
                                <p>Điểm đi: {route.startPoint}</p>
                                <p>Điểm đến: {route.endPoint}</p>
                                <p>Thời gian di chuyển: {route.duration}</p>
                                <p>Giá vé: {route.price}</p>

                                <div style={{ marginTop: '12px' }}>
                                    <strong>Các trạm dừng:</strong>
                                    <ul>
                                        {route.stops.map((stop, stopIndex) => (
                                            <li key={stopIndex}>{stop}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteExplorer; 