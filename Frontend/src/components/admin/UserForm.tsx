import React, { useState } from "react";
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
import { Loader2, Eye, EyeOff } from "lucide-react";

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
  isEditing = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hình thức đăng ký */}
      <div className="space-y-2">
        <Label htmlFor="signupType">Hình thức đăng ký</Label>
        <Select
          value={formData.signupType || "phone"}
          onValueChange={(value) => handleSelectChange("signupType", value)}
          disabled={isEditing}
        >
          <SelectTrigger id="signupType">
            <SelectValue placeholder="Chọn hình thức" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phone">Đăng ký bằng số điện thoại</SelectItem>
            <SelectItem value="google">Đăng ký bằng Google</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Form chia 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Họ tên */}
        <div className="space-y-2">
          <Label htmlFor="name">Họ tên</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        {/* Email (chỉ hiện nếu đăng ký bằng Google) */}
        {formData.signupType === "google" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="example@mail.com"
              required
              disabled={isEditing}
            />
          </div>
        )}

        {/* Mật khẩu (chỉ hiện nếu đăng ký bằng số điện thoại) */}
        {formData.signupType === "phone" && (
          <div className="space-y-2 relative">
            <Label htmlFor="password">
              {isEditing ? "Đổi mật khẩu (nếu cần)" : "Mật khẩu"}
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={handleInputChange}
              placeholder="••••••••"
              required={!isEditing}
              className="pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-black"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {/* Số điện thoại (chỉ hiện nếu đăng ký bằng số điện thoại) */}
        {formData.signupType === "phone" && (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              placeholder="0901234567"
              required
            />
          </div>
        )}

        {/* Vai trò */}
        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange("role", value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="staff">Nhân viên</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trạng thái (chỉ hiển thị khi chỉnh sửa) */}
        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status || "active"}
              onValueChange={(value) => handleSelectChange("status", value)}
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

        {/* Địa chỉ */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            placeholder="123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
          />
        </div>
      </div>

      {/* Footer */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
