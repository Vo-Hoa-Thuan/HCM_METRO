
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Map from "./pages/Map";
import RoutesPage from "./pages/Routes";
import Tickets from "./pages/Tickets";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
          toast.error("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          console.error("Mutation error:", error);
          toast.error("Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.");
        }
      }
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <RouterRoutes>
            <Route path="/" element={<Index />} />
            <Route path="/map" element={<Map />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
