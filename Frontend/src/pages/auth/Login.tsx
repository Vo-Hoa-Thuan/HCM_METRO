import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn, Smartphone, KeyRound, Home } from "lucide-react";
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
import { motion } from "@/components/ui/motion";

const loginSchema = z.object({
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

// const handleGoogleLogin = async () => {
//   window.location.href = "http://localhost:5000/auth/google?prompt=select_account&access_type=offline";
// };

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setGeneralError("");

    try {
      await login(values.phone, values.password);
      navigate("/admin");
    } catch (error: any) {
      setGeneralError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-4 left-4 z-10 flex items-center gap-1"
        onClick={() => navigate("/")}
      >
        <Home className="h-4 w-4" />
        <span>Trang chủ</span>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-xl border-t border-accent/20 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập để quản lý hệ thống Metro Hồ Chí Minh
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground caret-transparent" />
                          <Input
                            placeholder="Số điện thoại"
                            className="pl-10 border-accent/20 focus:border-accent"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 pr-10 border-accent/20 focus:border-accent"
                          autoComplete="current-password"

                          {...field} 
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

                <Button 
                  type="submit" 
                  className="w-full hover:shadow-md" 
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </span>
                  )}
                </Button>

                <Button
                  className="w-full flex items-center gap-3 bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-100"
                  onClick={loginWithGoogle}
                  disabled={loading}
                >
                  <img src="/icongg.webp" alt="Google Logo" className="h-5 bg-white rounded-md w-5" />
                  <span className="font-medium">Đăng Nhập với Google</span>
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Link to="/register" className="text-accent hover:underline font-medium">
                Đăng ký
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
