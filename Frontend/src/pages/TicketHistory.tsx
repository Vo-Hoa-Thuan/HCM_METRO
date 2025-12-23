import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, QrCode, MapPin, Calendar, Clock, CreditCard, Tag, User, Phone, Info, AlertCircle } from "lucide-react";
import { generateQRCode } from "@/api/orderApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import type { Ticket } from "@/types/ticket";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/order/history";

export default function TicketHistory() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isQRLoading, setIsQRLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchTicketHistory = async () => {
            try {
                if (!user?.token) {
                    throw new Error("Vui lòng đăng nhập để xem lịch sử vé");
                }

                console.log("Đang gửi request với token:", user.token);
                const response = await axios.get(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Response từ server:", response.data);
                setTickets(response.data);
                setError(null);

                if (response.data.length === 0) {
                    toast({
                        description: "Bạn chưa có vé nào trong lịch sử",
                    });
                }
            } catch (error) {
                console.error("Error fetching ticket history:", error);
                let errorMessage = "Có lỗi xảy ra khi tải lịch sử vé";

                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
                        // Có thể thêm logic để logout user ở đây
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                }

                setError(errorMessage);
                toast({
                    variant: "destructive",
                    description: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchTicketHistory();
        } else {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem lịch sử vé");
        }
    }, [user, toast]);

    const handleViewTicket = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        // Nếu vé đã có QR code, sử dụng nó
        if (ticket.qrCode) {
            setQrCode(ticket.qrCode);
            return;
        }

        // Nếu chưa có, gọi API để tạo mới
        setIsQRLoading(true);
        try {
            if (!user?.token) {
                throw new Error("Vui lòng đăng nhập để xem mã QR");
            }

            const qrCodeData = await generateQRCode(ticket.orderId, user.token);
            setQrCode(qrCodeData);
        } catch (error) {
            console.error("Error generating QR code:", error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo mã QR";
            toast({
                variant: "destructive",
                description: errorMessage
            });
        } finally {
            setIsQRLoading(false);
        }
    };

    const formatTicketType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'luot': 'Vé lượt',
            'ngay': 'Vé ngày',
            'tuan': 'Vé tuần',
            'thang': 'Vé tháng',
            'khuhoi': 'Vé khứ hồi',
            'nhom': 'Vé nhóm'
        };
        return typeMap[type] || type;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Lịch sử vé đã mua
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Xem thông tin chi tiết về các vé bạn đã mua
                            </p>
                        </div>
                        <Button
                            asChild
                            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        >
                            <a href="/tickets">
                                <Tag className="w-4 h-4 mr-2" />
                                Mua vé mới
                            </a>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-600">Đang tải thông tin vé...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid gap-6">
                            {tickets.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="p-8 text-center bg-white shadow-lg">
                                        <div className="max-w-md mx-auto">
                                            <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <h3 className="text-xl font-semibold mb-2">Chưa có vé nào</h3>
                                            <p className="text-gray-500 mb-6">
                                                Bạn chưa mua vé nào. Hãy mua vé để bắt đầu hành trình của bạn!
                                            </p>
                                            <Button
                                                asChild
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                            >
                                                <a href="/tickets">Mua vé ngay</a>
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                tickets.map((ticket, index) => (
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                                            <CardContent className="p-6">
                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                                <Tag className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Loại vé</p>
                                                                <p className="font-medium">{formatTicketType(ticket.ticketType)}</p>
                                                                {ticket.usageCount && (
                                                                    <p className="text-sm text-blue-600 mt-1">
                                                                        Số lượt: {ticket.usageCount}
                                                                    </p>
                                                                )}
                                                                {ticket.groupSize && (
                                                                    <p className="text-sm text-blue-600 mt-1">
                                                                        Số người: {ticket.groupSize}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 bg-green-50 rounded-lg">
                                                                <CreditCard className="h-5 w-5 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Giá vé</p>
                                                                <p className="font-medium text-green-600">
                                                                    {ticket.price.toLocaleString()} VND
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                                <Calendar className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Hiệu lực từ</p>
                                                                <p className="font-medium">
                                                                    {format(new Date(ticket.validFrom), "dd/MM/yyyy HH:mm")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 bg-orange-50 rounded-lg">
                                                                <Clock className="h-5 w-5 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Hiệu lực đến</p>
                                                                <p className="font-medium">
                                                                    {format(new Date(ticket.validTo), "dd/MM/yyyy HH:mm")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {ticket.routes && ticket.routes.length > 0 && (
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-red-50 rounded-lg">
                                                                    <MapPin className="h-5 w-5 text-red-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Tuyến</p>
                                                                    <p className="font-medium">{ticket.routes.join(' → ')}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-end justify-between">
                                                        <span
                                                            className={`px-4 py-2 rounded-full text-sm font-medium ${ticket.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {ticket.status === "active" ? "Còn hiệu lực" : "Hết hiệu lực"}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full mt-4 border-2 hover:bg-gray-50"
                                                            onClick={() => handleViewTicket(ticket)}
                                                        >
                                                            <QrCode className="w-4 h-4 mr-2" />
                                                            Xem mã QR
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}

                    <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Chi tiết vé</DialogTitle>
                                <DialogDescription>
                                    Thông tin chi tiết và mã QR của vé
                                </DialogDescription>
                            </DialogHeader>
                            {selectedTicket && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Loại vé</p>
                                            <p className="font-medium">{formatTicketType(selectedTicket.ticketType)}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-500">Trạng thái</p>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm ${selectedTicket.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {selectedTicket.status === "active" ? "Còn hiệu lực" : "Hết hiệu lực"}
                                            </span>
                                        </div>
                                    </div>

                                    {isQRLoading ? (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                                            <p className="text-gray-500">Đang tải mã QR...</p>
                                        </div>
                                    ) : qrCode ? (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-4 bg-white rounded-lg shadow-md">
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 text-center">
                                                Quét mã QR này để sử dụng vé của bạn
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-4" />
                                            <p className="mb-4">
                                                Không thể tải mã QR. Vui lòng thử lại sau.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewTicket(selectedTicket)}
                                                disabled={isQRLoading}
                                                className="border-2"
                                            >
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Thử lại
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
} 