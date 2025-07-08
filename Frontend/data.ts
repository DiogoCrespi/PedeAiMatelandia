

import { Category, PromotionBanner, Restaurant, Product, Address, User, Order, OrderStatus, Coupon, PaymentMethod, MockConversation, ChatMessage, QuickReply, CompanyPromotion, Client, Table, Employee, OpeningHour } from './types';
import { ROUTE_PATHS } from './constants';

export const MOCK_USER: User = {
  id: 'user1',
  name: 'João da Silva',
  email: 'joao.silva@email.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAld64GLTtoInwkyek_68R4p3eB6HCZEC7pO9frhkay9NQ0VJAp5O9_VuQzp9_ejiBlG4bMMPswXAqJdM3YdBOaindkZnXv2AtxjODz7fZydf_n-OfH0QR3ScNKcC_G6TCq5szlMtzheo6cur7CGWD8q9J0zpnBM74NDyODOeOaKZud5ApCOfBbxD0xLygWjsDIOLR3fdG_yQEMFsUyUNH1tK2wBD6As6BUx-0AritB3NnxepnkZDqgwysQeUHrzWmB9LY2iwqPrpU'
};

export const MOCK_ADDRESSES: Address[] = [
  { id: 'addr1', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'Matelândia', state: 'PR', zip: '85887-000', isDefault: true },
  { id: 'addr2', street: 'Avenida Brasil', number: '456', neighborhood: 'Vila Nova', city: 'Matelândia', state: 'PR', zip: '85887-000' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Lanches', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 'cat2', name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
  { id: 'cat3', name: 'Japonesa', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80' },
  { id: 'cat4', name: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80' },
  { id: 'cat5', name: 'Sobremesa', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80' },
  { id: 'cat6', name: 'Saudável', imageUrl: 'https://images.unsplash.com/photo-1546793663-3d8b55676148?w=400&q=80' },
  { id: 'cat7', name: 'Massas', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80' },
  { id: 'cat8', name: 'Carnes', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80' },
];

export const MOCK_PROMOTIONS: PromotionBanner[] = [
  { id: 'promo1', title: '50% OFF em Hambúrgueres', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', linkTo: `${ROUTE_PATHS.SEARCH}?q=Hambúrguer` },
  { id: 'promo2', title: 'Pizza em Dobro!', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', linkTo: `${ROUTE_PATHS.STORE_DETAIL.replace(':storeId', 'rest2')}` },
  { id: 'promo3', title: 'Combo Sushi com Temaki', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', linkTo: `${ROUTE_PATHS.STORE_DETAIL.replace(':storeId', 'rest3')}` },
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

export const MOCK_RESTAURANTS: Restaurant[] = [
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
    openingHours: defaultOpeningHours,
  },
  {
    id: 'rest2',
    name: 'Bella Pizza',
    description: 'Pizzas com massa de fermentação natural e os melhores ingredientes. Tradição e sabor em cada fatia.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmXosQiLUs8g1otUQ0Fj4mwfN9J2Ds-0eDRwzzoOpNYmYljtU9R9-SbligoCD-6YD5wBd9J8fPmWfSfNWjn2vwpavaqTgNAaN3nAOHwdMlqfbDFHwydvMdX6dxYptZAfJmceY_zzLyfnBzVDYmB1Ha0HQym0yzcR_h3Xowrh_49aBhR81I_pWhmD_xRq2_kZelwHIC_g_PKmBgwKssaZGDKY7SQRgFxVu77LeM6_6IxcndNrO9J96XzkhlbRjeWOxgigg1CQyBgVU',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3oVZlNEGJ3I4OTdjaLMs4y9cfsS3_40Tk1AL6ziARxVopszl11fRXgFPIUlb8Wc5-Mt21cqarHl78gk2QhgBYE6ABpvTUbTSpOYESpnsQ30FY_fwnlhMx_TUzV6b-fohQQnWv6H9JxuqVZ9wzCxkzkTaLpm67Guv0Jd2X-UUqMtAzXk2iHY2ycEfX2vuKOBTp1Iq3KOr2J1oabMFqM3Hd4WBSmagjSSQE2tsw2KlirSyHgsIr_yn1JVfGTB3Fbs_-sgvCkDxvt14',
    rating: 4.8,
    cuisine: 'Pizza, Massas',
    deliveryTime: '40-55 min',
    deliveryFee: 0,
    info: { address: 'Avenida Central, 200, Vila Nova', cnpj: '22.333.444/0001-55', paymentMethods: ['Cartão de Crédito', 'Pix', 'Dinheiro'] },
    openingHours: defaultOpeningHours,
  },
  {
    id: 'rest3',
    name: 'Ponto do Sushii',
    description: 'O melhor da culinária japonesa, com peixes frescos e um cardápio variado.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSThwgh3h8KBTmqbkto9b-WZHMhYPJwR1g-pYtXMe9WlFLTCTNWlZuRrNnGtESjUuUZXt8VqXhFX8wfeLC7S3TbntTK-GJBAgv3z2-yAdNgv1SQzu6yMBJDE5ekNo28VeQSei33ZWboyQd8TcMMoTgMKARLLJ7BtCkYDc-hk0VWBWlVWJGZ-Qhb5ApGVxhN0k2iNDqGRYSxb7oIdOaYs2SdTmWWLp4WJTVrJkYqV71ncGimC7yRhJ6pxlaPTyNelc2_jOED1YDnYs',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDv4dF5CDPaw16V5BHWAZURKX8lWEU_vysZZzRYArv3YaY5r-gwMfCmCClGEb-lScrm-w1ooBDpBN8yDvE5OFCpjb0Ui_M6dJ-XAfFIoiBc7Gj-A146RWxDpSyQjDmPW2jioMMaPJi9VBSyhWCGfKGpof_ypjYcEAMJKC6lOfWdxZgLsmb3hBBtlu6HqodEJ-GW6cGu6SaLuzz9zUrkDLuusmOxrGWXHm6Gv0LkDnWxTbx0_8WL062hqeDJTXbHOEeMpv7FHsw2s6Q',
    rating: 4.7,
    cuisine: 'Japonesa',
    deliveryTime: '18:00', // Example opening time
    deliveryFee: 7.00,
    info: { address: 'Rua do Sol, 300, Sol Nascente', cnpj: '33.444.555/0001-66', paymentMethods: ['Cartão de Crédito', 'Pix'] },
    openingHours: defaultOpeningHours,
  },
  {
    id: 'rest4',
    name: 'Doces da Vovó',
    description: 'Bolos, tortas e doces caseiros feitos com amor e as receitas secretas da vovó.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz4BpdRuWgFHVPs35YAdF4Zzr7aDMZ0VTTJmayX5TIzX7aX7FFcX2c97oWhyAcXaMfp2A8LpkQJaHuXRTcsHCz3BF-57xiBu-0upnAsPFWFefOEb2jrQ499Qo36UET_lbjBHxCM1MIFqTmgaTkZzVxQEt3MBo0OBpmWNpSz9ss1fr7j_zVl6o8cjk4HLSFgpge_lpafBbALJhHbHM_mCwQSFfLriWFHYy1bKkf6zTJb2fsxxNCJK9Hsum8cm1ZJDcnfrFTI_aeGqE',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPZUtfrUbbbKWoGcpNm6xlWzdRieG6mrbqhwHoe7aZQnWaxYWLwwIKJVnseBv6RubYuERt209pztm5TY9sMHUbVlsL7IRKc6-ExlAvlLp6FDF9xZ45ef_4tsRp1eP9gutBolBcR4g4FTl2fmGUjkGsLyGgyI9oc0FvachTRsYOw4iz8HP294BaNyEQmXrEOkC73WyYYg8Wia4_64gXDMhE2_Bf2yIL_8rBvYAFGBJ4BR0j0PxfTvJJtrpWnwo2tH60aQuQYH3ZhUc',
    rating: 4.9,
    cuisine: 'Sobremesas, Bolos',
    deliveryTime: '14:00', // Example opening time
    deliveryFee: 4.00,
    info: { address: 'Travessa da Lua, 50, Luar', cnpj: '44.555.666/0001-77', paymentMethods: ['Cartão de Crédito', 'Pix'] },
    openingHours: defaultOpeningHours,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Burguer Queen
  { id: 'prod1', name: 'Cheeseburger Clássico', description: 'Pão, carne, queijo, picles, cebola, ketchup e mostarda.', price: 25.50, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', restaurantId: 'rest1', category: 'Lanches' },
  { id: 'prod2', name: 'X-Bacon Duplo', description: 'Pão, duas carnes, queijo, bacon crocante, alface e tomate.', price: 32.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz579VFz5FtIUD1zPeZHxyCu_k6ecB_Cup8cujPp9sDdgAtf7KdtQtIkUtY_g5TnKSbqnNpNuEADM6e6_nVbjDa_j9IF8g4P1MabRlHS6Z2ZXUeJrT9O0QIJiPhjKiBy5-YvbT3SzrEo2OVdalcPHdr0McxR_1XuCsvxASUVocOT5ae_j8qSJps-ll9wOa6tv2s5kAmzmdyadm1Wdw7_x1TqVSTHML7H2GSVFUeBBZ5uk0itqKFIzUO5bVGyzGHJjz0Ap2KI8LgU8', restaurantId: 'rest1', category: 'Lanches', options: [
      { id: 'opt1', name: 'Adicionais', type: 'multiple', choices: [{name: 'Cebola Caramelizada', priceAdjustment: 3.00}, {name: 'Ovo', priceAdjustment: 2.00}, {name: 'Bacon Extra', priceAdjustment: 4.00}] },
      { id: 'opt2', name: 'Ponto da Carne', type: 'single', required: true, choices: [{name: 'Mal Passado'}, {name: 'Ao Ponto'}, {name: 'Bem Passado'}] }
  ]},
  { id: 'prod3', name: 'Batata Frita', description: 'Porção individual de batatas fritas crocantes.', price: 12.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcDjVnIE2wi4XmzKO7emclIqKGSdD8hTxiphv6TNpOWJML8Iax63SeaCVwuWoTOKlQT5ScXVLXTJygo-0t3o1_nWWMBG2VsV6pYLzK5wJ7lflNzzSPS2dT7mTfeaOPzjTVKj74nSCAdztSrt3WFHwyYcZuHHghYCRv-jrdHNiyoepG3dyUzmTAEGBnWoqLPtMEcmIZ42O4BvNNQoiibaXNFOlsQckAUE4dHlsbcHh4DhgEDNDtpV2_OfwnP0y9_SjJzCqOJuT1wjg', restaurantId: 'rest1', category: 'Acompanhamentos' },
  { id: 'prod4', name: 'Refrigerante Lata', description: 'Coca-Cola, Guaraná ou Fanta.', price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3', restaurantId: 'rest1', category: 'Bebidas' },

  // Bella Pizza
  { id: 'prod5', name: 'Pizza Margherita', description: 'Molho de tomate, mussarela e manjericão fresco.', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', restaurantId: 'rest2', category: 'Pizza', options: [
      {id: 'opt3', name: 'Tamanho', type: 'single', required: true, choices: [{name: 'Média'}, {name: 'Grande', priceAdjustment: 15.00}]}
  ]},
  { id: 'prod6', name: 'Pizza Calabresa', description: 'Molho, mussarela, calabresa e cebola.', price: 50.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHyhAxXDG3UFG-YD5fBPgRbaJj-mxSGfK_6q5Q9anPv1yrDw0YjhRLIiXkTzJvShqCJ4zq_cEBJuLpPYXUOjK5xbvjq3I2vDLAyGOUJ_4G8vzX3wC4oaU23_uQiDhNdhVruXKGoTPz0eDtnK7J_SLxBbbyUlfwIfjwZXeLmpw6sQemF-69rrdp8qLSRpj9NseEwFXjuss1XziKZnGPytdTckIPO9bOdUfi47HeCNcJOmajqvT_J68QKWymy0XTcul21ef5MAOx17c', restaurantId: 'rest2', category: 'Pizza', options: [
    {id: 'opt4', name: 'Tamanho', type: 'single', required: true, choices: [{name: 'Média'}, {name: 'Grande', priceAdjustment: 15.00}]},
    {id: 'opt5', name: 'Borda', type: 'single', choices: [{name: 'Sem borda'}, {name: 'Catupiry', priceAdjustment: 8.00}, {name: 'Cheddar', priceAdjustment: 8.00}]}
  ]},

  // Ponto do Sushi
  { id: 'prod7', name: 'Combinado 20 peças', description: 'Seleção do chef com 20 peças variadas.', price: 60.00, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', restaurantId: 'rest3', category: 'Japonesa' },
  { id: 'prod8', name: 'Temaki Salmão Completo', description: 'Salmão, cream cheese e cebolinha.', price: 28.00, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyQzlrRfQYRQA9jYBLF6d0YGMhQ9PImkHEj3-a1kR-Y8LCEix1GulF3BYYou9lEIa8JVOBhxuKhx2ajo3DDZGhSegpJoYjx8zPmzSPPAQ1XoE5JnuKFdANHzLvn0ByVQs7GhfUaovKAf9Tw3y_ELA0kzaXUwuNlu4yd2uSNQhdc2A8FggmomuHXvKoe86YVAfVUjW3pvFcw56lnUpsUqRr2ZlRv0adXnJpoE_tlWCkCdIq5ZLBvkSEfV31gqDMleU6Uc5gDF8_o58', restaurantId: 'rest3', category: 'Japonesa' },
  
  // Doces da Vovó
  { id: 'prod9', name: 'Bolo de Chocolate', description: 'Fatia generosa de bolo de chocolate com cobertura.', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b', restaurantId: 'rest4', category: 'Sobremesa' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order1',
    userId: 'user1',
    restaurantId: 'rest1',
    restaurantName: 'Burguer Queen',
    items: [
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod2')!,
        quantity: 1,
        selectedOptions: [{ groupName: 'Ponto da Carne', choiceName: 'Ao Ponto' }],
        totalPrice: 32.00,
      },
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod3')!,
        quantity: 2,
        totalPrice: 24.00
      }
    ],
    subtotal: 56.00,
    deliveryFee: 5.00,
    discount: 0,
    total: 61.00,
    status: OrderStatus.DELIVERED,
    deliveryAddress: MOCK_ADDRESSES[0],
    paymentMethod: 'Visa final 1234',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    trackingLog: [
        { status: OrderStatus.PLACED, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000).toISOString() },
        { status: OrderStatus.PREPARING, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 25 * 60 * 1000).toISOString() },
        { status: OrderStatus.OUT_FOR_DELIVERY, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000).toISOString() },
        { status: OrderStatus.DELIVERED, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    deliveryType: 'DELIVERY',
    isLocal: false,
    customerName: MOCK_USER.name,
  },
  {
    id: 'order2',
    userId: 'user1',
    restaurantId: 'rest2',
    restaurantName: 'Bella Pizza',
    items: [
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod6')!,
        quantity: 1,
        selectedOptions: [{groupName: 'Tamanho', choiceName: 'Grande', priceAdjustment: 15}, {groupName: 'Borda', choiceName: 'Catupiry', priceAdjustment: 8}],
        totalPrice: 73.00,
      }
    ],
    subtotal: 73.00,
    deliveryFee: 0,
    discount: 10,
    total: 63.00,
    status: OrderStatus.PREPARING,
    deliveryAddress: MOCK_ADDRESSES[0],
    paymentMethod: 'Pix',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
    trackingLog: [
        { status: OrderStatus.PLACED, timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
        { status: OrderStatus.PREPARING, timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    ],
    deliveryType: 'DELIVERY',
    isLocal: false,
    customerName: MOCK_USER.name,
  },
  {
    id: 'order3',
    userId: 'local',
    restaurantId: 'rest1',
    restaurantName: 'Burguer Queen',
    items: [
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod1')!,
        quantity: 2,
        totalPrice: 51.00,
      }
    ],
    subtotal: 51.00,
    deliveryFee: 0,
    discount: 0,
    total: 51.00,
    status: OrderStatus.PLACED,
    deliveryAddress: { id:'local', street: '', number: '', city: '', state: '', zip: '', neighborhood:'' },
    paymentMethod: 'Dinheiro',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    trackingLog: [{ status: OrderStatus.PLACED, timestamp: new Date().toISOString() }],
    deliveryType: 'PICKUP',
    isLocal: true,
    customerName: 'Ana (Mesa 02)',
    customerPhone: '45 99988-7766',
    tableId: 't2',
    tableName: 'Mesa 02'
  },
  {
    id: 'order4',
    userId: 'user1',
    restaurantId: 'rest2',
    restaurantName: 'Bella Pizza',
    items: [
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod5')!,
        quantity: 1,
        totalPrice: 45.00
      }
    ],
    subtotal: 45.00,
    deliveryFee: 0,
    discount: 0,
    total: 45.00,
    status: OrderStatus.PLACED,
    deliveryAddress: MOCK_ADDRESSES[1],
    paymentMethod: 'Visa final 1234',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    trackingLog: [
      { status: OrderStatus.PLACED, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    ],
    isLocal: false,
    deliveryType: 'DELIVERY',
    customerName: MOCK_USER.name,
  },
  {
    id: 'order5',
    userId: 'local',
    restaurantId: 'rest1',
    restaurantName: 'Burguer Queen',
    items: [
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod2')!,
        quantity: 1,
        selectedOptions: [{ groupName: 'Ponto da Carne', choiceName: 'Bem Passado' }],
        totalPrice: 32.00,
      },
      {
        product: MOCK_PRODUCTS.find(p => p.id === 'prod4')!,
        quantity: 1,
        totalPrice: 6.00
      }
    ],
    subtotal: 38.00,
    deliveryFee: 5.00,
    discount: 0,
    total: 43.00,
    status: OrderStatus.READY,
    deliveryAddress: { id:'local', street: 'Av. Brasil, 999', number: '', city: '', state: '', zip: '', neighborhood:'' },
    paymentMethod: 'Cartão na Entrega',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    trackingLog: [
      { status: OrderStatus.PLACED, timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
      { status: OrderStatus.PREPARING, timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
      { status: OrderStatus.READY, timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString() }
    ],
    isLocal: true,
    customerName: 'Marcos (Delivery)',
    customerPhone: '45 98877-6655',
    deliveryType: 'DELIVERY',
  }
];

export const MOCK_COUPONS: Coupon[] = [
    { id: 'coupon1', code: 'PRIMEIRACOMPRA', description: '10% de desconto na sua primeira compra', discountValue: 10, discountType: 'percentage' },
    { id: 'coupon2', code: 'GANHE5', description: 'R$5 de desconto em pedidos acima de R$30', discountValue: 5, discountType: 'fixed' },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pay1', cardType: 'visa', last4: '1234', cardholderName: 'João da Silva', expiryDate: '12/26', isDefault: true },
    { id: 'pay2', cardType: 'mastercard', last4: '5678', cardholderName: 'João da Silva', expiryDate: '10/25' },
];

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'convo1',
    userName: 'Maria Souza',
    userAvatar: 'https://i.pravatar.cc/150?u=maria',
    lastMessage: 'Olá! Gostaria de saber se meu pedido de pizza já saiu para entrega.',
    timestamp: '10:45',
    unreadCount: 2,
  },
  {
    id: 'convo2',
    userName: 'Carlos Pereira',
    userAvatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: 'Perfeito, muito obrigado!',
    timestamp: '10:42',
  },
];

export const MOCK_MESSAGE_HISTORY: Record<string, ChatMessage[]> = {
  'convo1': [
    { id: 'msg1-1', sender: 'user', text: 'Olá! Gostaria de saber se meu pedido de pizza já saiu para entrega.', timestamp: '10:40' },
    { id: 'msg1-2', sender: 'me', text: 'Olá, Maria! Só um momento, vou verificar para você.', timestamp: '10:41' },
    { id: 'msg1-3', sender: 'me', text: 'Seu pedido #4562 já está com o entregador e deve chegar em breve!', timestamp: '10:42' },
    { id: 'msg1-4', sender: 'user', text: 'Ótimo, obrigada!', timestamp: '10:43' },
  ],
  'convo2': [
    { id: 'msg2-1', sender: 'me', text: 'Olá Carlos, seu lanche já está pronto para retirada.', timestamp: '10:40' },
    { id: 'msg2-2', sender: 'user', text: 'Perfeito, muito obrigado!', timestamp: '10:42' },
  ],
};

export const MOCK_QUICK_REPLIES: QuickReply[] = [
  { id: 'qr1', intent: 'horário', reply: 'Nosso horário de funcionamento é das 18h às 23h, de terça a domingo.' },
  { id: 'qr2', intent: 'cardápio', reply: 'Você pode ver nosso cardápio completo no app!' },
  { id: 'qr3', intent: 'endereço', reply: 'Estamos na Rua Principal, 100, Centro. Esperamos por você!' },
  { id: 'qr4', intent: 'entrega', reply: 'Sim, fazemos entregas! A taxa varia conforme a sua localização e pode ser vista no checkout.' },
];

export const MOCK_COMPANY_PROMOTIONS: CompanyPromotion[] = [
  {
    id: 'promo-1',
    name: '10% OFF em Tudo',
    description: 'Desconto de 10% em todos os produtos do cardápio.',
    type: 'percentage',
    value: 10,
    isActive: true,
    appliesTo: 'all',
    applicableIds: [],
  },
  {
    id: 'promo-2',
    name: 'R$5 OFF em Pizzas',
    description: 'Ganhe R$5 de desconto em qualquer pizza.',
    type: 'fixed',
    value: 5,
    isActive: true,
    appliesTo: 'categories',
    applicableIds: ['cat2'], // Corresponds to Pizza category
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Roberto Carlos',
    phone: '45 99999-1111',
    email: 'roberto@email.com',
    address: 'Rua das Emoções, 1974',
    createdAt: new Date('2023-10-25T10:00:00Z').toISOString(),
    orderCount: 12,
    lastOrder: new Date('2024-05-10T19:30:00Z').toISOString(),
  },
];

// --- NEW MOCK DATA ---
export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Atendente 1', pin: '1234', restaurantId: 'rest1' },
  { id: 'emp2', name: 'Garçom 1', pin: '5678', restaurantId: 'rest1' },
];

export const MOCK_TABLES: Table[] = [
  { id: 't1', name: 'Mesa 01', status: 'Livre' },
  { id: 't2', name: 'Mesa 02', status: 'Ocupada', currentOrderId: 'order3' },
  { id: 't3', name: 'Mesa 03', status: 'Livre' },
  { id: 't4', name: 'Mesa 04', status: 'Livre' },
  { id: 't5', name: 'Mesa 05', status: 'Pagando' },
  { id: 't6', name: 'Balcão', status: 'Livre' },
];