import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Smartphone, Key, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "@/components/ui/motion";

const registerSchema = z.object({
  phone: z
    .string()
    .regex(/^0\d{9}$/, { message: "Số điện thoại không hợp lệ" }),
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});


type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { registerWithPhone, registerWithGoogle, loading } = useAuth();
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [generalError, setGeneralError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      name: "",
      password: "",
    },
  });

  useEffect(() => {
    if (generalError) {
      form.setFocus("phone"); // Focus vào input khi có lỗi
    }
  }, [generalError, form]);


  const API_URL = "http://localhost:5000/users/register";

  const handleRegister = async () => {
    setGeneralError(null);
    try {
      const { phone, name, password } = form.getValues();
  
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, name, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }
  
      alert("Đăng ký thành công!");
      navigate("/login"); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
    } catch (error: any) {
      setGeneralError(error.message || "Lỗi không xác định");
    }
  };

  

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:5000/auth/google?prompt=select_account&access_type=offline";
  };

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
            <CardTitle className="text-3xl font-bold caret-transparent">Đăng ký</CardTitle>
            <CardDescription className="caret-transparent">
              Đăng ký tài khoản bằng số điện thoại hoặc Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
                        <FormItem className="text-left">
                          <FormLabel className="pl-5 font-bold caret-transparent">Số điện thoại</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground caret-transparent" />
                              <Input
                                placeholder="Nhập số điện thoại"
                                className="pl-10 border-accent/20 focus:border-accent"
                                {...field}
                                disabled={loading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel className="pl-5 font-bold caret-transparent">Họ và tên</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground caret-transparent" />
                              <Input
                                placeholder="Họ và tên"
                                className="pl-10 border-accent/20 focus:border-accent"
                                {...field}
                                disabled={loading}
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
                        <FormItem className="text-left">
                          <FormLabel className="pl-5 font-bold caret-transparent">Mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground caret-transparent" />
                              <Input
                                placeholder="Mật khẩu"
                                className="pl-10 border-accent/20 focus:border-accent"
                                {...field}
                                disabled={loading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <Button type="submit" className="w-full !mt-10" onClick={handleRegister} disabled={loading}>
                    Đăng ký
                  </Button>

             
              


                  <div className="relative text-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <span className="bg-white px-3 relative z-10 text-muted-foreground">
                      Hoặc
                    </span>
                  </div>
              

               
                  <Button
                    className="w-full flex items-center gap-3 bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-100"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <img src="/icongg.webp" alt="Google Logo" className="h-5 bg-white rounded-md w-5" />
                    <span className="font-medium">Đăng ký với Google</span>
                  </Button>
              

              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground caret-transparent">Đã có tài khoản? </span>
              <Link to="/login" className="text-accent hover:underline font-medium">
                Đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
