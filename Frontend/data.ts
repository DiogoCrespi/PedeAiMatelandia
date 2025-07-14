import { Category, PromotionBanner, Restaurant, Product, Address, User, Order, OrderStatus, Coupon, PaymentMethod, MockConversation, ChatMessage, QuickReply, CompanyPromotion, Client, Table, Employee, OpeningHour } from './types';
import { ROUTE_PATHS } from './constants';

export let MOCK_USER: User = {
  id: 'user1',
  name: 'João da Silva',
  email: 'joao.silva@email.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAld64GLTtoInwkyek_68R4p3eB6HCZEC7pO9frhkay9NQ0VJAp5O9_VuQzp9_ejiBlG4bMMPswXAqJdM3YdBOaindkZnXv2AtxjODz7fZydf_n-OfH0QR3ScNKcC_G6TCq5szlMtzheo6cur7CGWD8q9J0zpnBM74NDyODOeOaKZud5ApCOfBbxD0xLygWjsDIOLR3fdG_yQEMFsUyUNH1tK2wBD6As6BUx-0AritB3NnxepnkZDqgwysQeUHrzWmB9LY2iwqPrpU'
};

export let MOCK_ADDRESSES: Address[] = [
  { id: 'addr1', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'Matelândia', state: 'PR', zip: '85887-000', isDefault: true },
  { id: 'addr2', street: 'Avenida Brasil', number: '456', neighborhood: 'Vila Nova', city: 'Matelândia', state: 'PR', zip: '85887-000' },
];

export let MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 'cat2', name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
  { id: 'cat3', name: 'Japonesa', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80' },
  { id: 'cat4', name: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80' },
  { id: 'cat5', name: 'Sobremesa', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
  { id: 'cat6', name: 'Saudável', imageUrl: 'https://images.unsplash.com/photo-1546793663-3d8b55676148?w=400&q=80' },
  { id: 'cat7', name: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80' },
  { id: 'cat8', name: 'Carnes', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80' },
];

export let MOCK_PROMOTIONS: PromotionBanner[] = [
  { id: 'promo1', title: '50% OFF em Hambúrgueres', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', linkTo: `${ROUTE_PATHS.SEARCH}?q=Hambúrguer` },
];

const defaultOpeningHours: OpeningHour[] = [
    { dayOfWeek: 'Segunda', opens: '', closes: '', isOpen: false },
    { dayOfWeek: 'Terça', opens: '18:00', closes: '23:00', isOpen: true },
    { dayOfWeek: 'Quarta', opens: '18:00', closes: '23:00', isOpen: true },
    { dayOfWeek: 'Quinta', opens: '18:00', closes: '23:00', isOpen: true },
    { dayOfWeek: 'Sexta', opens: '18:00', closes: '23:30', isOpen: true },
    { dayOfWeek: 'Sábado', opens: '18:00', closes: '23:30', isOpen: true },
    { dayOfWeek: 'Domingo', opens: '18:00', closes: '23:00', isOpen: true },
];

export let MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest1',
    name: 'Burguer Queen',
    description: 'Os melhores hambúrgueres artesanais da cidade, com ingredientes frescos e selecionados.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3XCEFDisUtbcmCUT8DmPLh19nt1O83KJIFKai_-GW7rP-QCAR42NgcNSsUKC-Q7wB0dBv6NH00y2uk5Kv08LquQPNDSsPcTJYjRYFU1QpYv52DkGBiz2Pd5EJhk3p1bC4vPusVR4b-1iUVxVD2me7Xdfp_zXv9F1GQkwBojccfcgnAiJizSxwo39Y9687qAMwI01q33oIFeitypVCo70KahIRNZWm5u7zoQzr1SOHHue6sBg0g3Ihv3JkIZ26pQMdgml7TNfurYE',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACh82YFku5Tos_gWuAO_rilI1_4H5ZV_HssohqMhNaGa5ALqZdMV1Lwazm_LIrwKG8rH6FX_6heReUKA8xQcHjnY5j7tTC1ktt4PxkJrHl_dtXkTNxqI7E_8yJsVlW1eopTVO7MiWiPTPq8Byt66vF-McnhjL5jQ1nATlxmg_rTd3MVL7zx08Q_6ir_0z6dAni5qh5_j-OtuhgwS5NZ4iyz_k7wOzxPAJeQdViX-oG5RazUq5JhrYeoetklIs73KC2b_9ZwVDVFgg',
    rating: 4.5,
    cuisine: 'Hambúrgueres, Lanches',
    deliveryTime: '30-45 min',
    deliveryFee: 5.00,
    info: { address: 'Rua Principal, 100, Centro', cnpj: '11.222.333/0001-44', paymentMethods: ['Cartão de Crédito', 'Pix'] },
    whatsappConfig: {
        greetingMessage: 'Olá! Bem-vindo ao atendimento da Burguer Queen. Como podemos ajudar?',
        reengagementConfig: {
            isActive: false,
            daysInactive: 30,
            message: 'Olá! Sentimos sua falta. Que tal dar uma olhada nas nossas novidades? 😉',
        }
    },
    companyCode: 'BURG-123',
    openingHours: defaultOpeningHours,
    isStoreOpenManually: true,
  },
];

export let MOCK_PRODUCTS: Product[] = [];

export let MOCK_ORDERS: Order[] = [];

export let MOCK_COUPONS: Coupon[] = [
    { id: 'coupon1', code: 'PRIMEIRACOMPRA', description: '10% de desconto na sua primeira compra', discountValue: 10, discountType: 'percentage' },
    { id: 'coupon2', code: 'GANHE5', description: 'R$5 de desconto em pedidos acima de R$30', discountValue: 5, discountType: 'fixed' },
];

export let MOCK_USER_COUPONS: Coupon[] = [];

export let MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pay1', cardType: 'visa', last4: '1234', cardholderName: 'João da Silva', expiryDate: '12/26', isDefault: true },
    { id: 'pay2', cardType: 'mastercard', last4: '5678', cardholderName: 'João da Silva', expiryDate: '10/25' },
];

export let MOCK_CONVERSATIONS: MockConversation[] = [];

export let MOCK_MESSAGE_HISTORY: Record<string, ChatMessage[]> = {};

export let MOCK_QUICK_REPLIES: QuickReply[] = [];

export let MOCK_COMPANY_PROMOTIONS: CompanyPromotion[] = [];

export let MOCK_CLIENTS: Client[] = [];

// --- NEW MOCK DATA ---
export let MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Atendente 1', pin: '1234', restaurantId: 'rest1' },
  { id: 'emp2', name: 'Garçom 1', pin: '5678', restaurantId: 'rest1' },
];

export let MOCK_TABLES: Table[] = [
  { id: 't1', name: 'Mesa 01', status: 'Livre' },
  { id: 't2', name: 'Mesa 02', status: 'Livre' },
  { id: 't3', name: 'Mesa 03', status: 'Livre' },
  { id: 't4', name: 'Mesa 04', status: 'Livre' },
  { id: 't5', name: 'Mesa 05', status: 'Livre' },
  { id: 't6', name: 'Balcão', status: 'Livre' },
];

export let MOCK_FAVORITE_RESTAURANTS_IDS: string[] = [];
export let MOCK_RECENT_SEARCHES: string[] = [];