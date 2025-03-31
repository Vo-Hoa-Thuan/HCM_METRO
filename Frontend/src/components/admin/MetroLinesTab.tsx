
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { metroLines } from "@/utils/metroData";

interface MetroLinesTabProps {
  searchTerm: string;
}

const MetroLinesTab = ({ searchTerm }: MetroLinesTabProps) => {
  const filteredLines = metroLines.filter(
    (line) => 
      line.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredLines.map((line) => (
        <Card key={line.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full bg-metro-${line.id}`}
                  style={{ backgroundColor: line.color }}
                ></div>
                {line.nameVi}
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="text-muted-foreground">
                Số trạm: {line.stations.length}
              </div>
              <div className="text-muted-foreground">
                Giờ cao điểm: {line.frequency.peakHours}
              </div>
              <div className="text-muted-foreground">
                Giờ thường: {line.frequency.offPeakHours}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetroLinesTab;
