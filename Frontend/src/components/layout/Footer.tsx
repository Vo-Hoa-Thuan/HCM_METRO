
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white">
                <div className="flex items-center justify-center h-full">
                  <span className="text-primary text-lg font-bold">M</span>
                </div>
              </div>
              <span className="font-semibold text-lg">Metro Hồ Chí Minh</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Hỗ trợ người dùng tàu điện ngầm TP.HCM tìm kiếm lộ trình, thông tin vé và dịch vụ.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Truy cập nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Bản đồ tàu điện
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Lộ trình
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Thông tin vé
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Tài khoản
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">
                  36/4/3 Huỳnh Văn Nghệ, Phường 15, Quận Tân Bình, TP.HCM
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">
                  0867962672
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">
                  support@metrohcm.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mạng xã hội</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Tải ứng dụng</h4>
              <div className="flex space-x-2">
                <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-3 py-2 rounded-md text-sm transition-colors">
                  App Store
                </button>
                <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-3 py-2 rounded-md text-sm transition-colors">
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© {currentYear} Metro Hồ Chí Minh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
