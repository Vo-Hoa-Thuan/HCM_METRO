
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { tickets } from "@/utils/metroData";

interface TicketsTabProps {
  searchTerm: string;
}

const TicketsTab = ({ searchTerm }: TicketsTabProps) => {
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {ticket.name}
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
              <div className="font-medium text-lg">
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND',
                  maximumFractionDigits: 0 
                }).format(ticket.price)}
              </div>
              <div className="text-muted-foreground">
                {ticket.description}
              </div>
              {ticket.validityPeriod && (
                <div className="text-muted-foreground">
                  Thời hạn: {ticket.validityPeriod}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketsTab;
