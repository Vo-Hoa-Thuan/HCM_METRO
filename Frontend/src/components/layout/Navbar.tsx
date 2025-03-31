
import { Link } from 'react-router-dom';
import { MapPin, Route, Ticket, Menu, X, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">Metro Hồ Chí Minh</span>
          </Link>

          {/* Desktop Navigation */}
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
                  <span>Lộ trình</span>
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
              {isAuthenticated && (
                <Button variant="ghost" asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Quản lý</span>
                  </Link>
                </Button>
              )}
            </nav>
          )}

          {/* User actions */}
          <div className="flex items-center gap-2">
            {!isMobile ? (
              <>
                {isAuthenticated ? (
                  <Button variant="outline" size="sm" onClick={logout}>
                    Đăng xuất
                  </Button>
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

      {/* Mobile menu */}
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
            <Link to="/tickets" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Ticket className="h-4 w-4" />
              <span>Vé</span>
            </Link>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/admin" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Settings className="h-4 w-4" />
                <span>Quản lý</span>
              </Link>
            </Button>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button variant="outline" className="w-full" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Đăng xuất
              </Button>
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
