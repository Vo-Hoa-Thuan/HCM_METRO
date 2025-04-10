import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel: string;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
  isEditing = false
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        {/* Chọn hình thức đăng ký */}
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="signupType">Hình thức đăng ký</Label>
            <Select
              value={formData.signupType || "phone"}
              onValueChange={(value) => handleSelectChange("signupType", value)}
            >
              <SelectTrigger id="signupType">
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">SĐT + Mật khẩu</SelectItem>
                <SelectItem value="google">Đăng ký bằng Google</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Họ tên</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        {/* Chỉ hiện email nếu chọn Google */}
        {!isEditing && formData.signupType === "google" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="example@mail.com"
              required
              disabled={isEditing}
            />
          </div>
        )}

        {/* Hiện password nếu đăng ký bằng SĐT */}
        {!isEditing && formData.signupType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>
        )}

        {/* Số điện thoại chỉ cần nếu là đăng ký qua phone */}
        {formData.signupType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              placeholder="0901234567"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="staff">Điều hành viên</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            placeholder="123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
          />
        </div>

        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status || 'active'}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="suspended">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
