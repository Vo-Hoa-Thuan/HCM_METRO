
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, Mail, KeyRound, Home } from 'lucide-react';
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

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setGeneralError('');

    try {
      await login(values.email, values.password);
      navigate('/admin');
    } catch (error: any) {
      setGeneralError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập để quản lý hệ thống Metro Pathfinder
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
                      Đang đăng nhập...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </span>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Link to="/register" className="text-accent hover:underline font-medium">
                Đăng ký
              </Link>
            </div>
            
            <div className="mt-6 p-4 rounded-md border bg-background/50">
              <p className="text-sm text-muted-foreground mb-2">Đăng nhập với tài khoản demo:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-background hover:bg-accent/5 transition-colors">
                  <span className="font-medium">Email:</span>
                  <span className="text-accent">admin@metro.com</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background hover:bg-accent/5 transition-colors">
                  <span className="font-medium">Mật khẩu:</span>
                  <span className="text-accent">admin123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
