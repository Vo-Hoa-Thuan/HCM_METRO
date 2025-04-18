import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  CalendarDays, 
  Clock, 
  Construction, 
  Landmark, 
  Layers, 
  LineChart, 
  TrendingUp, 
  Train 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllProgress } from '@/api/progressApi';

interface MetroLine {
  _id: string;
  title: string;
  description: string;
  lineId: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  totalInvestment: string;
  updatedAt: string;
}

const ProgressDisplay = () => {
  const [metroLines, setMetroLines] = useState<MetroLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<MetroLine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const data = await getAllProgress();
        setMetroLines(data.progress || []);
        console.log("data", data)
        // Set the first line as selected by default
        if (data.progress?.length > 0) {
          setSelectedLine(data.progress[0]);
        }
      } catch (error) {
        setError('Có lỗi khi tải dữ liệu tiến độ');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedLine) return <div>Không có dữ liệu tuyến metro</div>;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/50 caret-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
            <LineChart className="h-4 w-4" />
            <span>Tiến độ dự án</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiến độ <span className="text-accent">các tuyến Metro</span>
          </h2>
          <p className="text-muted-foreground">
            Cập nhật tiến độ xây dựng các tuyến Metro tại TP.HCM.
          </p>
        </div>

        {/* Metro line selector */}
        <div className="mb-8">
         <div className="flex flex-wrap gap-2 justify-center caret-transparent">
           {[...metroLines]
             .sort((a, b) => {
               const numA = parseInt(a.lineId.replace('metro', ''));
               const numB = parseInt(b.lineId.replace('metro', ''));
               return numA - numB;
             })
             .map((line) => (
               <button
                 key={line._id}
                 onClick={() => setSelectedLine(line)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                   selectedLine?._id === line._id
                     ? 'bg-accent text-white'
                     : 'bg-accent/10 text-accent hover:bg-accent/20'
                 }`}
               >
                 {line.title.split('-')[0].trim()}
               </button>
             ))}
         </div>
        </div>

        {/* Selected line details */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-2 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedLine.title}</CardTitle>
                <CardDescription>
                  Cập nhật: {new Date(selectedLine.updatedAt).toLocaleDateString('vi-VN')}
                </CardDescription>
              </div>
              <div className="text-4xl font-bold text-accent">{selectedLine.progress}%</div>
            </CardHeader>
            <CardContent>
              <Progress value={selectedLine.progress} className="h-4 mb-8" />
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Construction className="h-5 w-5 text-accent" />
                    Thông tin tuyến
                  </h3>
                  <p className="text-muted-foreground">{selectedLine.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <CalendarDays className="h-5 w-5 text-accent" />
                      Thời gian
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bắt đầu</span>
                        <span>{new Date(selectedLine.startDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dự kiến hoàn thành</span>
                        <span>{new Date(selectedLine.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Landmark className="h-5 w-5 text-accent" />
                      Đầu tư
                    </h3>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold">{selectedLine.totalInvestment}</span>
                      <span className="text-muted-foreground text-sm">Tổng mức đầu tư</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Trạng thái
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      selectedLine.status === 'completed' ? 'bg-green-500' :
                      selectedLine.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="capitalize">
                      {selectedLine.status === 'completed' ? 'Đã hoàn thành' :
                       selectedLine.status === 'in-progress' ? 'Đang thi công' :
                       'Chưa bắt đầu'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other metro lines */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Các tuyến Metro khác</CardTitle>
              <CardDescription>Tiến độ các tuyến đang triển khai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metroLines
                  .filter(line => line._id !== selectedLine._id)
                  .map((line) => (
                    <div key={line._id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{line.title.split('-')[0].trim()}</h3>
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm font-medium">
                          {line.progress}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Bắt đầu: {new Date(line.startDate).toLocaleDateString('vi-VN')}</span>
                        <span>Dự kiến: {new Date(line.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <Progress value={line.progress} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgressDisplay;