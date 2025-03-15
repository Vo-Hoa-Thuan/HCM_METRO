
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetroLinesTab from "@/components/admin/MetroLinesTab";
import StationsTab from "@/components/admin/StationsTab";
import TicketsTab from "@/components/admin/TicketsTab";
import SearchBar from "@/components/admin/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';


const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, don't render the admin page
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
       
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý Metro</h1>
            <p className="text-muted-foreground">Quản lý tuyến tàu, trạm và vé</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>

        <Tabs defaultValue="lines" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lines">Tuyến Metro</TabsTrigger>
            <TabsTrigger value="stations">Trạm</TabsTrigger>
            <TabsTrigger value="tickets">Vé</TabsTrigger>
          </TabsList>

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <TabsContent value="lines">
            <MetroLinesTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="stations">
            <StationsTab searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketsTab searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
