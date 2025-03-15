
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, UserPlus, User, Mail, KeyRound, Home } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from '@/components/ui/motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setGeneralError('');

    try {
      await register(values.name, values.email, values.password);
      navigate('/admin');
    } catch (error: any) {
      setGeneralError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 perspective-800">
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-4 left-4 z-10 flex items-center gap-1"
        onClick={() => navigate('/')}
      >
        <Home className="h-4 w-4" />
        <span>Trang chủ</span>
      </Button>
      
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-xl border-t border-accent/20 bg-card/95 backdrop-blur hover-3d">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Tạo tài khoản mới để sử dụng dịch vụ Metro Pathfinder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {generalError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
                  >
                    {generalError}
                  </motion.div>
                )}
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Nguyễn Văn A"
                            className="pl-10 transition-all duration-300 border-accent/20 focus:border-accent"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="example@email.com"
                            className="pl-10 transition-all duration-300 border-accent/20 focus:border-accent"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10 transition-all duration-300 border-accent/20 focus:border-accent"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 hover:shadow-md" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang đăng ký...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Đăng ký
                    </span>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Đã có tài khoản? </span>
              <Link to="/login" className="text-accent hover:underline font-medium">
                Đăng nhập
              </Link>
            </div>
            
            <div className="mt-6 p-4 rounded-md border bg-background/50">
              <p className="text-sm text-muted-foreground">
                Lưu ý: Sau khi đăng ký thành công, bạn sẽ được chuyển đến trang quản lý.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
