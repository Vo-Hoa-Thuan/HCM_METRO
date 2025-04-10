import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Search from "./pages/Search";
import RoutesPage from "./pages/Routes";
import Tickets from "./pages/Tickets";
import Support from "./pages/Support";
import Schedule from "./pages/Schedule";
import Devices from "./pages/Devices";
import RealTime from "./pages/RealTime";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import Progress from './pages/Progress';
import News from './pages/News';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FloatingFeedbackButton from './components/feedback/FloatingFeedbackButton';
import "./App.css";

function App() {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <FloatingFeedbackButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/search" element={<Search />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/support" element={<Support />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/realtime" element={<RealTime />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
