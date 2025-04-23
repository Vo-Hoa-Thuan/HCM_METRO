import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold">Truy cập bị từ chối</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là lỗi.
      </p>
      <Button onClick={() => navigate(-1)} className="mt-4">
        Quay lại
      </Button>
    </div>
  );
};

export default Unauthorized;