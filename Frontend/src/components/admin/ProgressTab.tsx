
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { ProgressItem, getAllProgress, createProgress, updateProgress, deleteProgress } from '@/api/progressApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type ProgressStatus = "not-started" | "in-progress" | "completed" | "delayed";

const ProgressTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState<ProgressItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lineId: '',
    startDate: '',
    estimatedCompletionDate: '',
    status: 'not-started' as ProgressStatus,
    completionPercentage: 0,
    location: '',
  });

  const queryClient = useQueryClient();

  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['progress'],
    queryFn: getAllProgress,
  });

  const createProgressMutation = useMutation({
    mutationFn: (data: Partial<ProgressItem>) => createProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      toast({
        title: "Thành công",
        description: "Đã thêm tiến trình mới",
      });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<ProgressItem>) => {
      return updateProgress(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật tiến trình",
      });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteProgressMutation = useMutation({
    mutationFn: (id: string) => deleteProgress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      toast({
        title: "Thành công",
        description: "Đã xóa tiến trình",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      lineId: '',
      startDate: '',
      estimatedCompletionDate: '',
      status: 'not-started',
      completionPercentage: 0,
      location: '',
    });
    setEditingProgress(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgress) {
      updateProgressMutation.mutate({ 
        id: editingProgress._id, 
        ...formData
      });
    } else {
      createProgressMutation.mutate(formData);
    }
  };

  const handleEdit = (progress: ProgressItem) => {
    setEditingProgress(progress);
    setFormData({
      title: progress.title,
      description: progress.description,
      lineId: progress.lineId,
      startDate: new Date(progress.startDate).toISOString().split('T')[0],
      estimatedCompletionDate: new Date(progress.estimatedCompletionDate).toISOString().split('T')[0],
      status: progress.status,
      completionPercentage: progress.completionPercentage,
      location: progress.location,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiến trình này?')) {
      deleteProgressMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredProgress = progress?.progress?.filter(item =>
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedStatus || item.status === selectedStatus)
  );

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý tiến trình</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Tìm kiếm tiến trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="delayed">Trì hoãn</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm tiến trình
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProgress ? 'Chỉnh sửa tiến trình' : 'Thêm tiến trình mới'}
                  </DialogTitle>
                </DialogHeader>
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
                      <Label htmlFor="description">Mô tả</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lineId">ID Tuyến</Label>
                      <Input
                        id="lineId"
                        value={formData.lineId}
                        onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Vị trí</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Ngày bắt đầu</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="estimatedCompletionDate">Ngày hoàn thành dự kiến</Label>
                      <Input
                        id="estimatedCompletionDate"
                        type="date"
                        value={formData.estimatedCompletionDate}
                        onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: ProgressStatus) => 
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
                          <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="delayed">Trì hoãn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="completionPercentage">Phần trăm hoàn thành</Label>
                      <Input
                        id="completionPercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.completionPercentage}
                        onChange={(e) => setFormData({ ...formData, completionPercentage: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit">
                      {editingProgress ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div>Có lỗi xảy ra khi tải dữ liệu</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày dự kiến</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProgress?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${getStatusColor(item.status)}`}>
                        {item.status === 'not-started' && 'Chưa bắt đầu'}
                        {item.status === 'in-progress' && 'Đang thực hiện'}
                        {item.status === 'completed' && 'Hoàn thành'}
                        {item.status === 'delayed' && 'Trì hoãn'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-xs">
                        <Progress
                          value={item.completionPercentage}
                          className="h-2"
                        />
                        <span className="text-sm text-gray-500">{item.completionPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(item.startDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {new Date(item.estimatedCompletionDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

export default ProgressTab;
