import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  UserPlus,
  Download,
  Filter
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/ui/motion";

// Sample user data
const sampleUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com", role: "Admin", status: "active", lastActive: "2 giờ trước", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trần Thị B", email: "tranthib@gmail.com", role: "User", status: "active", lastActive: "3 ngày trước", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Lê Văn C", email: "levanc@gmail.com", role: "User", status: "inactive", lastActive: "1 tuần trước", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 4, name: "Phạm Thị D", email: "phamthid@gmail.com", role: "User", status: "active", lastActive: "5 giờ trước", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 5, name: "Hoàng Văn E", email: "hoangvane@gmail.com", role: "Moderator", status: "active", lastActive: "1 ngày trước", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 6, name: "Đỗ Thị F", email: "dothif@gmail.com", role: "User", status: "suspended", lastActive: "1 tháng trước", avatar: "https://i.pravatar.cc/150?img=6" },
];

interface UsersTabProps {
  searchTerm: string;
}

const UsersTab = ({ searchTerm }: UsersTabProps) => {
  const [users, setUsers] = useState(sampleUsers);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole === "all" || user.role.toLowerCase() === selectedRole.toLowerCase()) &&
      (selectedStatus === "all" || user.status.toLowerCase() === selectedStatus.toLowerCase())
  );

  // Toggle user admin status
  const toggleAdminStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId
        ? { ...user, role: user.role === "Admin" ? "User" : "Admin" }
        : user
    ));
  };

  // Delete user
  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "suspended": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Moderator": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "User": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Lọc</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Vai trò: {selectedRole === "all" ? "Tất cả" : selectedRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedRole("all")}>
                Tất cả vai trò
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole("Admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole("Moderator")}>
                Moderator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole("User")}>
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Trạng thái: {selectedStatus === "all" ? "Tất cả" : selectedStatus === "active" ? "Đang hoạt động" : selectedStatus === "inactive" ? "Không hoạt động" : "Đã khóa"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                Tất cả trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                Đang hoạt động
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>
                Không hoạt động
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("suspended")}>
                Đã khóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Xuất</span>
          </Button>
          <Button className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Thêm người dùng</span>
          </Button>
        </div>
      </div>
      
      {/* User Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="hover-3d">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-10 w-10 rounded-full mr-3 object-cover border-2 border-white shadow-sm" 
                  />
                  <div>
                    <CardTitle className="text-base font-medium">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Tùy chọn</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAdminStatus(user.id)}>
                      {user.role === "Admin" ? (
                        <>
                          <ShieldOff className="mr-2 h-4 w-4" />
                          <span>Hủy quyền Admin</span>
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Cấp quyền Admin</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa người dùng</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Badge className={getRoleColor(user.role)} variant="outline">
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.status)} variant="outline">
                      {user.status === "active" ? "Đang hoạt động" : 
                       user.status === "inactive" ? "Không hoạt động" : "Đã khóa"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Hoạt động lần cuối: {user.lastActive}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex h-10 w-10 rounded-full bg-muted items-center justify-center mb-4">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Không tìm thấy người dùng</h3>
          <p className="text-muted-foreground mt-1">
            Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTab;