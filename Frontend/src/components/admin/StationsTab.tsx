
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { stations } from "@/utils/metroData";

interface StationsTabProps {
  searchTerm: string;
}

const StationsTab = ({ searchTerm }: StationsTabProps) => {
  const filteredStations = stations.filter(
    (station) =>
      station.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {filteredStations.map((station) => (
        <Card key={station.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {station.nameVi}
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
                Tuyến: {station.lines.join(", ")}
              </div>
              <div className="text-muted-foreground">
                Tiện ích: {station.facilities.join(", ")}
              </div>
              {station.isInterchange && (
                <div className="text-blue-500">Trạm chuyển tuyến</div>
              )}
              {station.isDepot && (
                <div className="text-green-500">Depot</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StationsTab;
