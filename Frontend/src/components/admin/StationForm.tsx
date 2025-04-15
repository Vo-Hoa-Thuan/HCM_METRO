
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Station } from "@/api/stationsApi";



interface StationFormProps {
  formData: Station;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleLineChange: (lineId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  availableLines: any[];
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel: string;
}

const StationForm: React.FC<StationFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  handleLineChange,
  handleSubmit,
  availableLines,
  isSubmitting,
  onCancel,
  submitLabel
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Station Name (English)</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Central Station"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameVi">Station Name (Vietnamese)</Label>
            <Input
              id="nameVi"
              name="nameVi"
              value={formData.nameVi || ''}
              onChange={handleInputChange}
              placeholder="Ga Trung Tâm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coordinates.0">Longitude</Label>
            <Input
              id="coordinates.0"
              name="coordinates.0"
              type="number"
              step="0.000001"
              value={formData.coordinates?.[0] || ''}
              onChange={handleInputChange}
              placeholder="106.629664"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinates.1">Latitude</Label>
            <Input
              id="coordinates.1"
              name="coordinates.1"
              type="number"
              step="0.000001"
              value={formData.coordinates?.[1] || ''}
              onChange={handleInputChange}
              placeholder="10.823099"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tuyến metro</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
            {availableLines.map((line) => (
              <div key={line.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`line-${line._id}`}
                  checked={(formData.lines || []).includes(line._id)}
                  onCheckedChange={(checked) => handleLineChange(line._id)}
                />
                <Label htmlFor={`line-${line._id}`} className="text-sm cursor-pointer">
                  {line.name}
                </Label>
              </div>
            ))}
          </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Đang hoạt động</SelectItem>
                <SelectItem value="construction">Đang xây dựng</SelectItem>
                <SelectItem value="planned">Đã lên kế hoạch</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyPassengers">Lượt hành khách hàng ngày</Label>
            <Input
              id="dailyPassengers"
              name="dailyPassengers"
              type="number"
              value={formData.dailyPassengers || 0}
              onChange={handleInputChange}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tiện ích</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isInterchange"
                checked={formData.isInterchange || false}
                onCheckedChange={(checked) => handleCheckboxChange('isInterchange', !!checked)}
              />
              <Label htmlFor="isInterchange">Trạm chuyển tuyến</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDepot"
                checked={formData.isDepot || false}
                onCheckedChange={(checked) => handleCheckboxChange('isDepot', !!checked)}
              />
              <Label htmlFor="isDepot">Trạm Depot</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isUnderground"
                checked={formData.isUnderground || false}
                onCheckedChange={(checked) => handleCheckboxChange('isUnderground', !!checked)}
              />
              <Label htmlFor="isUnderground">Trạm ngầm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWifi"
                checked={formData.hasWifi || false}
                onCheckedChange={(checked) => handleCheckboxChange('hasWifi', !!checked)}
              />
              <Label htmlFor="hasWifi">Wifi miễn phí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasParking"
                checked={formData.hasParking || false}
                onCheckedChange={(checked) => handleCheckboxChange('hasParking', !!checked)}
              />
              <Label htmlFor="hasParking">Bãi đỗ xe</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTicketMachine"
                checked={formData.hasTicketMachine || false}
                onCheckedChange={(checked) => handleCheckboxChange('hasTicketMachine', !!checked)}
              />
              <Label htmlFor="hasTicketMachine">Máy bán vé tự động</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAccessibility"
                checked={formData.hasAccessibility || false}
                onCheckedChange={(checked) => handleCheckboxChange('hasAccessibility', !!checked)}
              />
              <Label htmlFor="hasAccessibility">Lối đi cho người khuyết tật</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBathroom"
                checked={formData.hasBathroom || false}
                onCheckedChange={(checked) => handleCheckboxChange('hasBathroom', !!checked)}
              />
              <Label htmlFor="hasBathroom">Nhà vệ sinh</Label>
            </div>
          </div>
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

export default StationForm;
