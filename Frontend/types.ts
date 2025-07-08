

export type DeliveryType = 'DELIVERY' | 'PICKUP';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Address {
  id:string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string; 
}

export interface ProductOptionChoice {
  name: string;
  priceAdjustment?: number;
}
export interface ProductOptionGroup {
  id: string;
  name: string; // e.g., "Size", "Toppings"
  type: 'single' | 'multiple'; // single choice (radio) or multiple choice (checkbox)
  choices: ProductOptionChoice[];
  required?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  category?: string; // e.g., "Pizzas", "Drinks"
  options?: ProductOptionGroup[];
  isAvailable?: boolean;
}

export interface OpeningHour {
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';
  opens: string; // e.g., "18:00"
  closes: string; // e.g., "23:00"
  isOpen: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  logoUrl?: string;
  rating: number;
  cuisine: string;
  deliveryTime: string; // e.g., "30-45 min"
  deliveryFee: number;
  menu?: Product[]; // Simplified, products might be fetched separately
  info?: {
    address: string;
    cnpj: string;
    paymentMethods: string[];
  };
  promotions?: string[]; // IDs or descriptions of promotions
  openingHours?: OpeningHour[];
}

export interface SelectedProductOption {
  groupName: string;
  choiceName: string;
  priceAdjustment?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: SelectedProductOption[];
  observations?: string;
  totalPrice: number; // (product.price + sum of option adjustments) * quantity
}

export enum OrderStatus {
  PLACED = "Pedido realizado",
  PREPARING = "Em preparo",
  READY = "Pronto para Retirada/Entrega",
  OUT_FOR_DELIVERY = "Saiu para entrega",
  DELIVERED = "Entregue",
  CANCELLED = "Cancelado",
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: string; // e.g., "Credit Card", "Cash"
  createdAt: string; // ISO date string
  estimatedDeliveryTime?: string; // ISO date string or textual
  trackingLog?: { status: OrderStatus; timestamp: string }[];
  deliveryType: DeliveryType;
  isLocal: boolean;
  customerName?: string;
  customerPhone?: string;
  tableId?: string; // New: For POS orders
  tableName?: string; // New: For POS orders
}

export interface PromotionBanner {
  id: string;
  imageUrl: string;
  title: string;
  linkTo: string; // Path for router
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
}

export interface PaymentMethod {
  id: string;
  cardType: 'visa' | 'mastercard' | 'other';
  last4: string;
  cardholderName: string;
  expiryDate: string; // MM/YY
  isDefault?: boolean;
}

export interface MockConversation {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'me';
}

export interface QuickReply {
  id: string;
  intent: string;
  reply: string;
}

export interface CompanyPromotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  isActive: boolean;
  appliesTo: 'all' | 'categories' | 'products';
  applicableIds: string[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string; // ISO date string
  orderCount: number;
  lastOrder?: string; // ISO date string
}

// --- NEW TYPES FOR POS/EMPLOYEE ---

export type TableStatus = 'Livre' | 'Ocupada' | 'Pagando';

export interface Table {
  id: string;
  name: string; // e.g., "Mesa 01", "Balcão"
  status: TableStatus;
  currentOrderId?: string;
}

export interface Employee {
  id: string;
  name: string;
  pin: string; // 4-digit PIN for login
  restaurantId: string;
}