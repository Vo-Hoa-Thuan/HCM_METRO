
import React, { useState } from 'react';
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


const ProgressDisplay = () => {
  const [progressValue, setProgressValue] = useState(94);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
            <LineChart className="h-4 w-4" />
            <span>Tiến độ dự án</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiến độ <span className="text-accent">tuyến Metro số 1</span>
          </h2>
          <p className="text-muted-foreground">
            Cập nhật tiến độ xây dựng tuyến Metro số 1 (Bến Thành - Suối Tiên).
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-2 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Tổng tiến độ dự án</CardTitle>
                <CardDescription>Cập nhật: Tháng 4/2024</CardDescription>
              </div>
              <div className="text-4xl font-bold text-accent">{progressValue}%</div>
            </CardHeader>
            <CardContent>
              <Progress value={progressValue} className="h-4 mb-8" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {projectMilestones.map((milestone, index) => (
                  <Card key={index} className="bg-accent/5 border-0">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-sm">{milestone.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-end justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{milestone.details}</span>
                        <span className="text-lg font-bold text-accent">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="timeline">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Lộ trình</span>
              </TabsTrigger>
              <TabsTrigger value="investments" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                <span>Đầu tư</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Thống kê</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lộ trình hoàn thành dự án</CardTitle>
                  <CardDescription>Các mốc thời gian quan trọng sắp tới</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-muted"></div>
                    <div className="space-y-6">
                      {timelineEvents.map((event, index) => (
                        <div key={index} className="relative pl-10">
                          <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center bg-accent/10">
                            <Clock className="h-4 w-4 text-accent" />
                          </div>
                          <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{event.title}</h3>
                              <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                                {event.date}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="investments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Đầu tư dự án</CardTitle>
                  <CardDescription>Thông tin về chi phí và nguồn vốn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="h-5 w-5 text-accent" />
                          <h3 className="font-medium">Tổng mức đầu tư</h3>
                        </div>
                        <p className="text-2xl font-bold">43.757 tỷ đồng</p>
                        <p className="text-sm text-muted-foreground mt-1">Tương đương ~1.9 tỷ USD</p>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-accent" />
                          <h3 className="font-medium">Nguồn vốn</h3>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>ODA Nhật Bản</span>
                              <span className="font-medium">88.4%</span>
                            </div>
                            <Progress value={88.4} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Vốn đối ứng</span>
                              <span className="font-medium">11.6%</span>
                            </div>
                            <Progress value={11.6} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-accent" />
                        <h3 className="font-medium">Phân bổ kinh phí theo hạng mục</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Xây dựng hạ tầng</span>
                            <span className="font-medium">55%</span>
                          </div>
                          <Progress value={55} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Thiết bị và đoàn tàu</span>
                            <span className="font-medium">30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Quản lý dự án</span>
                            <span className="font-medium">8%</span>
                          </div>
                          <Progress value={8} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Chi phí khác</span>
                            <span className="font-medium">7%</span>
                          </div>
                          <Progress value={7} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê dự án</CardTitle>
                  <CardDescription>Các số liệu chính về tuyến Metro số 1</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/20 p-4 rounded-lg text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <Train className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold">19.7 km</h3>
                      <p className="text-sm text-muted-foreground">Tổng chiều dài</p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <Landmark className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold">14</h3>
                      <p className="text-sm text-muted-foreground">Số ga</p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <Construction className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold">2.6 km</h3>
                      <p className="text-sm text-muted-foreground">Đoạn hầm ngầm</p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold">30 phút</h3>
                      <p className="text-sm text-muted-foreground">Thời gian di chuyển</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Công suất vận chuyển</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Số lượng đoàn tàu:</span>
                          <span className="font-medium">17 đoàn</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Số toa mỗi đoàn:</span>
                          <span className="font-medium">3 toa</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sức chứa mỗi đoàn:</span>
                          <span className="font-medium">930 hành khách</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Công suất tối đa:</span>
                          <span className="font-medium">23,000 người/giờ</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Tiến độ xây dựng theo ga</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <div className="flex justify-between">
                            <span>Ga Bến Thành:</span>
                            <span className="font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-1.5" />
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Ga Ba Son:</span>
                            <span className="font-medium">95%</span>
                          </div>
                          <Progress value={95} className="h-1.5" />
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Ga Thảo Điền:</span>
                            <span className="font-medium">98%</span>
                          </div>
                          <Progress value={98} className="h-1.5" />
                        </li>
                        <li>
                          <div className="flex justify-between">
                            <span>Ga Suối Tiên:</span>
                            <span className="font-medium">96%</span>
                          </div>
                          <Progress value={96} className="h-1.5" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ProgressDisplay;
