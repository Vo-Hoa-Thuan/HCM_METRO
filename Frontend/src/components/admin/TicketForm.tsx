import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface TicketFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel: string;
}

const TicketForm: React.FC<TicketFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange,
  handleSubmit,
  isSubmitting,
  onCancel,
  submitLabel
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên vé</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Vé ngày"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Loại vé</Label>
            <Select
              value={formData.type || ''}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Chọn loại vé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Một lượt</SelectItem>
                <SelectItem value="return">Khứ hồi</SelectItem>
                <SelectItem value="day">Vé ngày</SelectItem>
                <SelectItem value="week">Vé tuần</SelectItem>
                <SelectItem value="month">Vé tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Giá vé (VND)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleInputChange}
              min="0"
              step="1000"
              placeholder="20000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validityPeriod">Thời hạn sử dụng</Label>
            <Input
              id="validityPeriod"
              name="validityPeriod"
              value={formData.validityPeriod || ''}
              onChange={handleInputChange}
              placeholder="24 giờ"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Vé sử dụng cho mọi tuyến metro trong một ngày"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="restrictions">Hạn chế</Label>
          <Textarea
            id="restrictions"
            name="restrictions"
            value={formData.restrictions || ''}
            onChange={handleInputChange}
            placeholder="Không áp dụng vào ngày lễ, tết"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isDiscounted" className="cursor-pointer">Áp dụng giảm giá</Label>
          <Switch
            id="isDiscounted"
            checked={formData.isDiscounted || false}
            onCheckedChange={(checked) => handleSwitchChange('isDiscounted', checked)}
          />
        </div>

        {formData.isDiscounted && (
          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Phần trăm giảm giá (%)</Label>
            <Input
              id="discountPercentage"
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage || 0}
              onChange={handleInputChange}
              min="0"
              max="100"
              placeholder="10"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availableFrom">Có hiệu lực từ</Label>
            <Input
              id="availableFrom"
              name="availableFrom"
              type="date"
              value={formData.availableFrom ? new Date(formData.availableFrom).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableUntil">Hiệu lực đến</Label>
            <Input
              id="availableUntil"
              name="availableUntil"
              type="date"
              value={formData.availableUntil ? new Date(formData.availableUntil).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

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
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
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

export default TicketForm;
