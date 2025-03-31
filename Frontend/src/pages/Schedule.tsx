
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ScheduleItem {
  id: string;
  name: string;
  from: string;
  to: string;
  time: string;
  days: string[];
}

const Schedule = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: '1',
      name: 'Đi làm',
      from: 'Bến Thành',
      to: 'Suối Tiên',
      time: '07:30',
      days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6']
    },
    {
      id: '2',
      name: 'Về nhà',
      from: 'Suối Tiên',
      to: 'Bến Thành',
      time: '18:00',
      days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6']
    }
  ]);

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: "Đã xóa lịch trình",
      description: "Lịch trình đã được xóa thành công",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Chỉnh sửa lịch trình",
      description: "Tính năng đang được phát triển",
    });
  };

  const handleAdd = () => {
    toast({
      title: "Thêm lịch trình mới",
      description: "Tính năng đang được phát triển",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lịch trình cá nhân</h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Thêm lịch trình
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-accent" /> Lịch trình của bạn
          </h2>

          {schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="p-4 border border-border rounded-lg hover:bg-secondary/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{schedule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Từ <span className="text-foreground">{schedule.from}</span> đến <span className="text-foreground">{schedule.to}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {schedule.time} • {schedule.days.join(", ")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Bạn chưa có lịch trình nào</p>
              <Button variant="outline" className="mt-4" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Tạo lịch trình đầu tiên
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary/50 p-6 rounded-xl border border-border">
          <h2 className="text-lg font-medium mb-4">Lợi ích của việc lập lịch trình</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm">Nhận thông báo trước khi khởi hành để không bao giờ bỏ lỡ chuyến tàu</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm">Được cập nhật tự động khi có sự cố hay thay đổi lịch trình</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm">Tiết kiệm thời gian khi không phải tìm kiếm lộ trình mỗi ngày</p>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
