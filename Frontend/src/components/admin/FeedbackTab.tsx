
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Feedback, FeedbackStats, getAllFeedback, getFeedbackStats, updateFeedback, deleteFeedback } from '@/api/feedbackApi';
import { 
  MoreHorizontal, 
  Star, 
  Filter, 
  Search, 
  RefreshCw, 
  Check, 
  X, 
  MessageSquare, 
  BarChart4,
  ArrowUpDown,
  UserRound
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const responseSchema = z.object({
  status: z.enum(['new', 'reviewed', 'resolved', 'archived']),
  response: z.string().min(1, 'Phản hồi không được để trống'),
});

const FeedbackTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof responseSchema>>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      status: 'reviewed',
      response: '',
    },
  });

  // Fetch feedback data
  const { 
    data: feedbackData, 
    isLoading: isFeedbackLoading,
    isError: isFeedbackError,
    refetch: refetchFeedback
  } = useQuery({
    queryKey: ['feedback', currentPage, pageSize, statusFilter, ratingFilter, searchQuery],
    queryFn: () => getAllFeedback({
      page: currentPage,
      limit: pageSize,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      rating: ratingFilter !== 'all' ? ratingFilter : undefined,
      search: searchQuery || undefined
    }),
  });

  // Fetch feedback stats
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['feedbackStats'],
    queryFn: getFeedbackStats,
  });

  // Update feedback mutation
  const updateFeedbackMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Feedback> }) => 
      updateFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedbackStats'] });
      toast({
        title: 'Phản hồi đã được cập nhật',
        description: 'Thông tin phản hồi đã được cập nhật thành công.',
      });
      setIsResponseDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Lỗi cập nhật phản hồi',
        description: 'Đã xảy ra lỗi khi cập nhật phản hồi.',
        variant: 'destructive',
      });
      console.error('Error updating feedback:', error);
    }
  });

  // Delete feedback mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedbackStats'] });
      toast({
        title: 'Phản hồi đã được xóa',
        description: 'Phản hồi đã được xóa thành công.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Lỗi xóa phản hồi',
        description: 'Đã xảy ra lỗi khi xóa phản hồi.',
        variant: 'destructive',
      });
      console.error('Error deleting feedback:', error);
    }
  });

  // Handle form submission for response
  const onSubmitResponse = (values: z.infer<typeof responseSchema>) => {
    if (!selectedFeedback?._id) return;
    
    updateFeedbackMutation.mutate({
      id: selectedFeedback._id,
      data: {
        status: values.status,
        response: values.response
      }
    });
  };

  useEffect(() => {
    if (selectedFeedback) {
      // Kiểm tra xem giá trị status có hợp lệ không
      const validStatuses = ['new', 'reviewed', 'resolved', 'archived'];
      const status = validStatuses.includes(selectedFeedback.status) ? selectedFeedback.status : 'new';
  
      form.reset({
        status: status as 'new' | 'reviewed' | 'resolved' | 'archived', // Ép kiểu tại đây
        response: selectedFeedback.response || '',
      });
    }
  }, [selectedFeedback, form]);
  
  // Feedback list content
  const renderFeedbackList = () => {
    const feedback = feedbackData?.feedback || [];
    const totalPages = Math.ceil((feedbackData?.totalCount || 0) / pageSize);

    if (isFeedbackLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <RefreshCw className="h-8 w-8 animate-spin text-accent" />
        </div>
      );
    }

    if (isFeedbackError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu phản hồi.</p>
          <Button 
            onClick={() => refetchFeedback()} 
            variant="outline" 
            className="mt-4"
          >
            Thử lại
          </Button>
        </div>
      );
    }

    if (feedback.length === 0) {
      return (
        <div className="text-center py-10">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Không tìm thấy phản hồi nào.</p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableCaption>Danh sách phản hồi người dùng</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center">
                  <span>Đánh giá</span>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Người dùng</TableHead>
              <TableHead>Bình luận</TableHead>
              <TableHead className="hidden md:table-cell">Nguồn</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item, index) => (
              <TableRow key={item._id || index}>
                <TableCell className="font-mono text-xs">
                  {item._id?.substring(0, 6) || index}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {item.rating} <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.userName || item.userEmail || 'Ẩn danh'}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {item.comment || <span className="text-muted-foreground italic">Không có bình luận</span>}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.source}
                </TableCell>
                <TableCell>
                  {item.date ? format(new Date(item.date), 'dd/MM/yyyy', { locale: vi }) : '-'}
                </TableCell>
                <TableCell>
                  <div className={`rounded-full px-2 py-1 text-xs inline-flex items-center ${
                    item.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                    item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                    item.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'resolved' ? 'Đã giải quyết' : 
                     item.status === 'reviewed' ? 'Đã xem xét' : 
                     item.status === 'archived' ? 'Đã lưu trữ' : 
                     'Mới'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedFeedback(item);
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Phản hồi</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          updateFeedbackMutation.mutate({
                            id: item._id as string,
                            data: { status: 'resolved' }
                          });
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        <span>Đánh dấu đã giải quyết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          updateFeedbackMutation.mutate({
                            id: item._id as string,
                            data: { status: 'archived' }
                          });
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        <span>Lưu trữ</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này không?')) {
                            deleteFeedbackMutation.mutate(item._id as string);
                          }
                        }}
                        className="text-red-600"
                      >
                        <X className="mr-2 h-4 w-4" />
                        <span>Xóa phản hồi</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, feedbackData?.totalCount || 0)} trên {feedbackData?.totalCount || 0} phản hồi
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }
                    }}
                    className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      }
                    }}
                    className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

          </div>
        )}
      </>
    );
  };

  // Feedback stats content
  const renderFeedbackStats = () => {
    const stats = statsData as FeedbackStats;

    if (isStatsLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <RefreshCw className="h-8 w-8 animate-spin text-accent" />
        </div>
      );
    }

    if (isStatsError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu thống kê.</p>
          <Button 
            onClick={() => refetchStats()} 
            variant="outline" 
            className="mt-4"
          >
            Thử lại
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đánh giá trung bình</CardTitle>
            <CardDescription>Đánh giá trung bình từ tất cả phản hồi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-6xl font-bold text-accent">
                {stats.averageRating.toFixed(1)}
              </div>
              <Star className="h-10 w-10 ml-2 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingsDistribution[rating] || 0;
                const percentage = stats.totalCount > 0 
                  ? Math.round((count / stats.totalCount) * 100) 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span>{rating}</span>
                      <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mx-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-muted-foreground text-sm">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê phản hồi</CardTitle>
            <CardDescription>Tổng quan về tất cả phản hồi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-muted-foreground text-sm">Tổng số phản hồi</div>
                <div className="text-3xl font-bold mt-1">{stats.totalCount || 0}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-muted-foreground text-sm">Phản hồi mới</div>
                <div className="text-3xl font-bold mt-1">
                  {stats.statusDistribution?.new || 0}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-muted-foreground text-sm">Đã giải quyết</div>
                <div className="text-3xl font-bold mt-1 text-green-600">
                  {stats.statusDistribution?.resolved || 0}
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-muted-foreground text-sm">Đang xử lý</div>
                <div className="text-3xl font-bold mt-1 text-blue-600">
                  {stats.statusDistribution?.reviewed || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Phân bố theo nguồn</CardTitle>
            <CardDescription>Phản hồi được gửi từ các nguồn khác nhau</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(stats.sourceDistribution || {}).map(([source, count]) => (
                <div key={source} className="border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm capitalize">{source}</div>
                  <div className="text-2xl font-bold mt-1">{count}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stats.totalCount > 0 
                      ? Math.round((count / stats.totalCount) * 100) 
                      : 0}% của tổng số
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quản lý phản hồi</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả phản hồi từ người dùng
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Danh sách phản hồi</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Thống kê</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Lọc theo:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="new">Mới</SelectItem>
                      <SelectItem value="reviewed">Đã xem xét</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                      <SelectItem value="archived">Đã lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả đánh giá</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="1">1 sao</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm phản hồi..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderFeedbackList()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Thống kê phản hồi</CardTitle>
                  <CardDescription>Phân tích toàn diện về phản hồi người dùng</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchStats()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderFeedbackStats()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Phản hồi lại người dùng</DialogTitle>
            <DialogDescription>
              Phản hồi của bạn sẽ được gửi đến người dùng
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <UserRound className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedFeedback.userName || selectedFeedback.userEmail || 'Người dùng ẩn danh'}
                  </span>
                </div>
                <div className="flex items-center mb-2 text-sm text-muted-foreground">
                  <span>Đánh giá: {selectedFeedback.rating}</span>
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-sm">
                  {selectedFeedback.comment || <span className="italic">Không có bình luận</span>}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Gửi lúc: {selectedFeedback.date ? format(new Date(selectedFeedback.date), 'dd/MM/yyyy HH:mm', { locale: vi }) : '-'}
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitResponse)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">Mới</SelectItem>
                            <SelectItem value="reviewed">Đã xem xét</SelectItem>
                            <SelectItem value="resolved">Đã giải quyết</SelectItem>
                            <SelectItem value="archived">Đã lưu trữ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phản hồi</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập phản hồi của bạn..."
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Nội dung phản hồi sẽ được gửi tới người dùng.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={updateFeedbackMutation.isPending}>
                      {updateFeedbackMutation.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackTab;
