import React, { useEffect, useState } from 'react';
import { getAllNews } from '@/api/newsApi'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Calendar, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NewsItem = {
  _id: string;
  title: string;
  summary: string;
  publishedDate: string;
  category: string;
  image?: string;
  readTime?: string;
};

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        console.log('Dữ liệu API trả về:', data); 
        setNewsItems(data.news);
      } catch (error) {
        console.error('Lỗi khi load tin tức:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNews();
  }, []);

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

        {loading ? (
          <p className="text-center text-muted-foreground">Đang tải tin tức...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsItems.map((news) => (
              <Card key={news._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={news.image || '/default-news.jpg'}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3">{news.category}</Badge>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(news.publishedDate).toLocaleDateString('vi-VN')}
                    </span>
                    {news.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.readTime}
                      </span>
                    )}
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
        )}

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
