import { Link } from 'react-router-dom';
import { MapPin, Route, Ticket, Menu, X, Settings, User, ChevronDown, LogOut, BarChart3, Newspaper } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from '../ui/motion';
import UserProfileTab from "@/components/admin/UserProfileTab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Bản đồ', href: '/map' },
  { name: 'Tìm đường', href: '/search' },
  { name: 'Lộ trình', href: '/routes' },
  { name: 'Theo dõi tàu', href: '/route-explorer' },
  { name: 'Vé', href: '/tickets' },
  { name: 'Hỗ trợ', href: '/support' }
];

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b caret-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center">
              <img src="icon_metro.png" alt="" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">Metro Hồ Chí Minh</span>
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link to="/map" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bản đồ</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/routes" className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <span>Tra cứu lộ trình</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/progress" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Tiến độ</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/news" className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span>Tin tức</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/tickets" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Vé</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/support" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Hổ trợ</span>
                </Link>
              </Button>
              {isAuthenticated && user.role !== "user" && (
                <Button variant="ghost" asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Quản lý</span>
                  </Link>
                </Button>
              )}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {!isMobile ? (
              <>
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" onClick={() => setActiveTab("profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Hồ sơ cá nhân</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/ticket-history">
                            <Ticket className="mr-2 h-4 w-4" />
                            <span>Lịch sử vé</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/admin" onClick={() => setActiveTab("sittings")}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Cài đặt</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login">Đăng nhập</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/register">Đăng ký</Link>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <nav className="container mx-auto px-4 pb-4 space-y-1 animate-fade-in">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/map" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <MapPin className="h-4 w-4" />
              <span>Bản đồ</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/routes" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Route className="h-4 w-4" />
              <span>Lộ trình</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/progress" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <BarChart3 className="h-4 w-4" />
              <span>Tiến độ dự án</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/news" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Newspaper className="h-4 w-4" />
              <span>Tin tức</span>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/tickets" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Ticket className="h-4 w-4" />
              <span>Vé</span>
            </Link>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/ticket-history" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Ticket className="h-4 w-4" />
                <span>Lịch sử vé</span>
              </Link>
            </Button>
          )}
          {isAuthenticated && user.role !== "user" && (
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/admin" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Settings className="h-4 w-4" />
                <span>Quản lý</span>
              </Link>
            </Button>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" onClick={() => setActiveTab("profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/ticket-history">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span>Lịch sử vé</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" onClick={() => setActiveTab("sittings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
