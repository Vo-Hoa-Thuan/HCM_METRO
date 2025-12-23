export interface Ticket {
    id: string;
    orderId: string;
    purchaseDate: string;
    ticketType: string;
    price: number;
    status: string;
    validFrom: string;
    validTo: string;
    qrCode?: string;
    routes?: string[];
    usageCount?: number;
    groupSize?: number;
} 