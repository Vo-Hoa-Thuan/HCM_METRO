
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Edit, 
  Trash2,
  Plus, 
  Ticket as TicketIcon,
  ChevronDown,
  AlertCircle,
  Loader2,
  Clock,
  Calendar,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/ui/motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tickets , getTickets, createTicket, updateTicket, deleteTicket } from "@/api/ticketsAPI";
import TicketForm from "./TicketForm";

interface TicketsTabProps {
  searchTerm: string;
}

const TicketsTab = ({ searchTerm }: TicketsTabProps) => {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Tickets>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'luot',
    sub_type: 'thuong',
    price: 20000,
    description: '',
    trip_limit: null,
    discount_percent: 0,
    restrictions: '',
    availableFrom: '',
    availableUntil: '',
    status: 'active',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tickets
  const { 
    data: ticketsData, 
    isLoading: isLoadingTickets,
    error: ticketsError 
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets()
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Tạo vé mới thành công",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể tạo vé: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Tickets }) => updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Cập nhật vé thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật vé: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Delete ticket mutation
  const deleteTicketMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Xóa vé thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể xóa vé: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    }
  });

  // Filter tickets based on search term
  const filteredTickets = ticketsData?.filter(
    (ticket: Tickets) => 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  

  // Toggle expanded ticket
  const toggleExpandTicket = (ticketId: string) => {
    console.log("Trạng thái trước:", expandedTicket);
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
    console.log("Trạng thái sau:", ticketId);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'discountPercentage') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'single',
      price: 20000,
      description: '',
      validityPeriod: '24 giờ',
      restrictions: '',
      isDiscounted: false,
      discountPercentage: 0,
      status: 'active',
      availableFrom: '',
      availableUntil: ''
    });
  };

  // Handle edit ticket click
  const handleEditClick = (ticket: Tickets) => {
    setCurrentTicket(ticket);
    setFormData({
      name: ticket.name,
      category: ticket.category,
      sub_type: ticket.sub_type,
      price: ticket.price,
      description: ticket.description || '',
      trip_limit: ticket.trip_limit || null,
      discount_percent: ticket.discount_percent || 0,
      restrictions: ticket.restrictions || '',
      availableFrom: ticket.availableFrom || '',
      availableUntil: ticket.availableUntil || '',
      status: ticket.status,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete ticket click
  const handleDeleteClick = (ticket: Tickets) => {
    console.log("Đang xóa vé:", ticket);
    setCurrentTicket(ticket);
    setIsDeleteDialogOpen(true);
  };

  // Handle create form submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dữ liệu vé mới:", formData); 
    const ticketData = { 
      ...formData,
      trip_limit: formData.trip_limit || null,
    };
    createTicketMutation.mutate(ticketData as Tickets);
    resetForm();
  };

  // Handle edit form submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTicket) {
      const updatedData = {
        ...formData,
        trip_limit: formData.trip_limit || null, // Đảm bảo giá trị null nếu không có
      };
      updateTicketMutation.mutate({
        id: currentTicket._id,
        data: updatedData as Tickets,
      });
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (currentTicket) {
      deleteTicketMutation.mutate(currentTicket._id);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoadingTickets) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (ticketsError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium">Không thể tải dữ liệu</h3>
        <p className="text-muted-foreground mt-1">
          {ticketsError instanceof Error ? ticketsError.message : 'Đã xảy ra lỗi khi tải dữ liệu vé.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý vé</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm vé mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm vé mới</DialogTitle>
              <DialogDescription>
                Điền các thông tin dưới đây để tạo vé mới.
              </DialogDescription>
            </DialogHeader>
            <TicketForm
              formData={formData}          
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
              handleSubmit={handleCreateSubmit}
              isSubmitting={createTicketMutation.isPending}
              onCancel={() => setIsCreateDialogOpen(false)}
              submitLabel="Tạo vé"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTickets.map((ticket: Tickets, index: number) => (
          <motion.div
            key={ticket._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <TicketIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ticket.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2">
                        {ticket.category === 'luot' ? 'Vé lượt' : 
                        ticket.category === 'ngay' ? 'Vé ngày' : 
                        ticket.category === 'thang' ? 'Vé tháng': 
                        ticket.category === 'tuan' ? 'Vé tuần' :
                        ticket.category === 'khu hoi' ? 'Vé khứ hồi':
                        ticket.category === 'nhom' ? 'Vé nhóm' : ''}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {ticket.discount_percent > 0 ? (
                          <span className="flex items-center">
                            <span className="line-through text-muted-foreground mr-1">
                              {formatCurrency(ticket.price)}
                            </span>
                            {formatCurrency(ticket.price * (1 - ticket.discount_percent / 100))}
                          </span>
                        ) : formatCurrency(ticket.price)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditClick(ticket)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteClick(ticket)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleExpandTicket(ticket._id)}
                    className={expandedTicket === ticket._id ? "bg-primary/10" : ""}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedTicket === ticket._id ? "transform rotate-180" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
                
                {ticket.validityPeriod && (
                  <div className="flex items-center mt-2 text-xs">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>Thời hạn: {ticket.validityPeriod} ngày</span>
                  </div>
                )}
              </CardContent>
              
              {expandedTicket === ticket._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pt-2 pb-4"
                >
                  <div className="border-t pt-4">
                  {ticket.restrictions && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Hạn chế:</p>
                      <p className="text-sm">{ticket.restrictions}</p>
                    </div>
                  )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {ticket.availableFrom && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>
                            Từ: {new Date(ticket.availableFrom).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                      {ticket.availableUntil && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>
                            Đến: {new Date(ticket.availableUntil).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                      {ticket.discount_percent > 0 && (
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>Giảm giá: {ticket.discount_percent}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <CardFooter className="px-6 py-3">
                <div className="flex justify-between items-center w-full">
                <Badge 
                    className={`mt-1 text-white
                      ${ticket.status === 'active' ? 'bg-active' : ''}
                      ${ticket.status === 'inactive' ? 'bg-inactive' : ''}
                    `}
                  >
                    {ticket.status === 'active' ? 'Đang hoạt động' : 
                     ticket.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => toggleExpandTicket(ticket._id)}>          
                    {expandedTicket === ticket._id ? "Thu gọn" : "Chi tiết"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy vé nào</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Không có vé nào khớp với tìm kiếm của bạn.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm vé mới
          </Button>
        </div>
      )}

      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vé</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cho vé {currentTicket?.name}.
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            handleSubmit={handleEditSubmit}
            isSubmitting={updateTicketMutation.isPending}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Cập nhật"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Vé "{currentTicket?.name}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteTicketMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketsTab;
