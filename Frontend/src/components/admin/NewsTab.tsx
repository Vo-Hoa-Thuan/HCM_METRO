import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import { NewsItem, getAllNews, createNews, updateNews, deleteNews } from '@/api/newsApi';
import { Edit, Trash2, Plus, Badge } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORY_COLORS: Record<string, string> = {
  announcement: 'bg-blue-100 text-blue-800 border-blue-200',
  event: 'bg-green-100 text-green-800 border-green-200',
  promotion: 'bg-purple-100 text-purple-800 border-purple-200',
  update: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
};

const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'Thông báo',
  event: 'Sự kiện',
  promotion: 'Khuyến mãi',
  update: 'Cập nhật',
  other: 'Khác'
};


const NewsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: '',
    category: 'announcement',
    tags: '',
    image: ''
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        if (data?.news) {
          setNewsItems(data.news);
        } else {
          console.error('Dữ liệu không đúng định dạng');
          setError('Dữ liệu không đúng định dạng');
        }
      } catch (error) {
        console.error('Lỗi khi load tin tức:', error);
        setError('Không thể tải danh sách tin tức');
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách tin tức",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNews();
  }, []);
  
  const refetchNews = async () => {
    try {
      const data = await getAllNews();
      if (data?.news) {
        setNewsItems(data.news);
      }
    } catch (err) {
      setError('Lỗi khi tải lại tin tức');
      toast({
        title: "Lỗi",
        description: "Không thể tải lại danh sách tin tức",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newsData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      if (editingNews) {
        await updateNews({ id: editingNews._id, ...newsData });
        toast({ title: "Thành công", description: "Đã cập nhật tin tức" });
      } else {
        await createNews(newsData);
        toast({ title: "Thành công", description: "Đã thêm tin tức mới" });
      }
      setIsDialogOpen(false);
      resetForm();
      await refetchNews();
    } catch (err) {
      toast({ 
        title: "Lỗi", 
        description: editingNews ? "Không thể cập nhật tin tức" : "Không thể thêm tin tức", 
        variant: "destructive" 
      });
    }
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      summary: news.summary,
      author: news.author,
      category: news.category,
      tags: news.tags.join(', '),
      image: news.image || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
      try {
        await deleteNews(id);
        toast({ title: "Thành công", description: "Đã xóa tin tức" });
        await refetchNews();
      } catch (err) {
        toast({ title: "Lỗi", description: "Không thể xóa tin tức", variant: "destructive" });
      }
  };

  const filteredNews = newsItems.filter(item =>
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || item.category === selectedCategory)
  );

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      author: '',
      category: 'announcement',
      tags: '',
      image: ''
    });
    setEditingNews(null);
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Quản lý tin tức</CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="announcement">Thông báo</SelectItem>
                  <SelectItem value="event">Sự kiện</SelectItem>
                  <SelectItem value="promotion">Khuyến mãi</SelectItem>
                  <SelectItem value="update">Cập nhật</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm tin tức
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNews ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Tiêu đề</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="summary">Tóm tắt</Label>
                          <Textarea
                            id="summary"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="content">Nội dung</Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            className="min-h-[200px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Danh mục</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="announcement">Thông báo</SelectItem>
                                <SelectItem value="event">Sự kiện</SelectItem>
                                <SelectItem value="promotion">Khuyến mãi</SelectItem>
                                <SelectItem value="update">Cập nhật</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="author">Tác giả</Label>
                            <Input
                              id="author"
                              value={formData.author}
                              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                            <Input
                              id="tags"
                              value={formData.tags}
                              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="image">URL hình ảnh</Label>
                            <Input
                              id="image"
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingNews ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                      </div>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-destructive">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
              <TableRow className="border-b-2 border-t-2 border-gray-400 text-center">
                <TableHead className="w-[25%] border-r border-gray-400 text-center">Tiêu đề</TableHead>
                <TableHead className="w-[15%] border-r border-gray-400 text-center">Danh mục</TableHead>
                <TableHead className="w-[15%] border-r border-gray-400 text-center">Tác giả</TableHead>
                <TableHead className="w-[15%] border-r border-gray-400 text-center">Ngày đăng</TableHead>
                <TableHead className="w-[10%] text-center">Thao tác</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item._id} className="border-b border-gray-400 hover:bg-gray-50">
                    <TableCell className="font-medium border-r border-gray-400 p-3">{item.title}</TableCell>
                    <TableCell className="border-r border-gray-400 p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[item.category]}`}>
                      {CATEGORY_LABELS[item.category]}
                    </span>
                    </TableCell>
                    <TableCell className="border-r border-gray-400 p-3">{item.author}</TableCell>
                    <TableCell className="border-r border-gray-400 p-3">
                      {new Date(item.publishedDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right p-3">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn muốn xoá không?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Tin tức sẽ bị xoá vĩnh viễn khỏi hệ thống.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item._id)}>
                                  Xoá
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsTab;