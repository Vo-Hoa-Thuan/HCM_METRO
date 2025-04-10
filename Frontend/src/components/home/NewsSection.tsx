
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Calendar, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
};

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Tuyến Metro số 1 dự kiến đưa vào vận hành thương mại vào cuối năm 2025',
    summary: 'Theo thông tin từ Ban Quản lý đường sắt đô thị TP.HCM, tuyến Metro số 1 (Bến Thành - Suối Tiên) đang được đẩy nhanh tiến độ xây dựng.',
    date: '15/04/2024',
    category: 'Tin tức',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Line_1_Ho_Chi_Minh_City_Metro.jpg',
    readTime: '3 phút'
  },
  {
    id: '2',
    title: 'TP.HCM chuẩn bị nguồn nhân lực vận hành tuyến Metro số 1',
    summary: 'Nhiều kỹ sư và nhân viên vận hành tàu Metro đã được cử đi đào tạo tại Nhật Bản để chuẩn bị cho việc vận hành tuyến Metro số 1.',
    date: '12/04/2024',
    category: 'Đào tạo',
    image: 'https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/2/12/metro-hcmc-167628893303240599893.jpg',
    readTime: '4 phút'
  },
  {
    id: '3',
    title: 'Khởi công xây dựng tuyến Metro số 2 TP.HCM',
    summary: 'Dự án xây dựng tuyến Metro số 2 (Bến Thành - Tham Lương) dự kiến sẽ được khởi công vào quý 3/2025.',
    date: '10/04/2024',
    category: 'Dự án',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Ho_Chi_Minh_City_Metro_Binh_Thai_station_under_construction.jpg',
    readTime: '5 phút'
  }
];

const NewsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Newspaper className="h-4 w-4" />
            <span>Tin tức mới nhất</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cập nhật <span className="text-accent">thông tin mới nhất</span> về Metro TP.HCM
          </h2>
          <p className="text-muted-foreground">
            Theo dõi những tin tức và thông báo mới nhất về hệ thống tàu điện ngầm TP.HCM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {newsItems.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 right-3">{news.category}</Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {news.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {news.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{news.summary}</p>
                <Button variant="ghost" size="sm" className="text-accent">
                  Đọc tiếp <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button className="gap-2">
            Xem tất cả tin tức
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
