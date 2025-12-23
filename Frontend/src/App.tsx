import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from '@/routes';
import FloatingFeedbackButton from './components/feedback/FloatingFeedbackButton';
import "./App.css";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FloatingFeedbackButton />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
