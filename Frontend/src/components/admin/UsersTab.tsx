import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { fetchUsers } from "@/api/userApi";

interface UsersTabProps {
  searchTerm: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
  tickets: string[];
  favoriteStations?: string[];
}

const UsersTab = ({ searchTerm }: UsersTabProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {filteredUsers.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{user.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="text-muted-foreground">Email: {user.email}</div>
              {user.phone && <div className="text-muted-foreground">Số điện thoại: {user.phone}</div>}
              <div className="text-muted-foreground">
                Đăng ký: {new Date(user.registeredAt).toLocaleDateString()}
              </div>
              <div className="text-muted-foreground">
                Vé đã mua: {user.tickets.length > 0 ? user.tickets.join(", ") : "Chưa có vé"}
              </div>
              {user.favoriteStations && user.favoriteStations.length > 0 && (
                <div className="text-blue-500">Ga yêu thích: {user.favoriteStations.join(", ")}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsersTab;
