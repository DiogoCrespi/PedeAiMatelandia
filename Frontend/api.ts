import {
  User, Address, Order, Product, PaymentMethod, Coupon, Restaurant, Category,
  PromotionBanner, MockConversation, ChatMessage, QuickReply,
  CompanyPromotion, Client, Table, Employee, OrderStatus, TableStatus
} from './types';

import {
  MOCK_USER, MOCK_ADDRESSES, MOCK_ORDERS, MOCK_PAYMENT_METHODS, MOCK_COUPONS,
  MOCK_TABLES, MOCK_EMPLOYEES, MOCK_CATEGORIES, MOCK_PROMOTIONS, MOCK_RESTAURANTS,
  MOCK_PRODUCTS, MOCK_CONVERSATIONS, MOCK_MESSAGE_HISTORY, MOCK_QUICK_REPLIES,
  MOCK_COMPANY_PROMOTIONS, MOCK_CLIENTS, MOCK_FAVORITE_RESTAURANTS_IDS, MOCK_RECENT_SEARCHES, MOCK_USER_COUPONS
} from './data';

const LATENCY = 300; // ms

// Helper to simulate network latency and deep copy data to prevent mutation issues
const simulateApi = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), LATENCY);
  });
};

// --- User & Auth ---
export const login = (email: string, password: string): Promise<User | null> => {
  console.log(`Attempting login for ${email}`);
  if (email && password) {
    return simulateApi(MOCK_USER);
  }
  return simulateApi(null);
};

export const passwordRecovery = (email: string): Promise<void> => {
    console.log(`Password recovery requested for ${email}`);
    // In a real app, this would trigger an email send
    return simulateApi(undefined);
};

export const employeeLogin = (pin: string): Promise<Employee | null> => {
    console.log(`Attempting employee login with pin`);
    const employee = MOCK_EMPLOYEES.find(e => e.pin === pin);
    return simulateApi(employee || null);
}

export const signup = (name: string, email: string, password: string): Promise<User> => {
    console.log(`Signing up ${name}`);
    const newUser: User = { ...MOCK_USER, id: `user-${Date.now()}`, name, email };
    return simulateApi(newUser);
}

// --- Read Operations ---
export const getCurrentUser = (): Promise<User> => simulateApi(MOCK_USER);
export const getAddresses = (): Promise<Address[]> => simulateApi(MOCK_ADDRESSES);
export const getPaymentMethods = (): Promise<PaymentMethod[]> => simulateApi(MOCK_PAYMENT_METHODS);
export const getAllCoupons = (): Promise<Coupon[]> => simulateApi(MOCK_COUPONS);
export const getUserCoupons = (): Promise<Coupon[]> => simulateApi(MOCK_USER_COUPONS);
export const getFavoriteRestaurants = (): Promise<string[]> => simulateApi(MOCK_FAVORITE_RESTAURANTS_IDS);
export const getRecentSearches = (): Promise<string[]> => simulateApi(MOCK_RECENT_SEARCHES);
export const getRestaurants = (): Promise<Restaurant[]> => simulateApi(MOCK_RESTAURANTS);

export const getOpenRestaurants = (): Promise<Restaurant[]> => {
    const data = MOCK_RESTAURANTS.filter(r => r.isStoreOpenManually !== false);
    return simulateApi(data);
};

export const getClosedRestaurants = (): Promise<Restaurant[]> => {
    const data = MOCK_RESTAURANTS.filter(r => r.isStoreOpenManually === false);
    return simulateApi(data);
};

export const getRestaurantById = (id: string): Promise<Restaurant | undefined> => simulateApi(MOCK_RESTAURANTS.find(r => r.id === id));
export const getProducts = (): Promise<Product[]> => simulateApi(MOCK_PRODUCTS);
export const getProductsByRestaurant = (restaurantId: string): Promise<Product[]> => simulateApi(MOCK_PRODUCTS.filter(p => p.restaurantId === restaurantId));
export const getProductById = (id: string): Promise<Product | undefined> => simulateApi(MOCK_PRODUCTS.find(p => p.id === id));
export const getCategories = (): Promise<Category[]> => simulateApi(MOCK_CATEGORIES);
export const getPromotions = (): Promise<PromotionBanner[]> => simulateApi(MOCK_PROMOTIONS);
export const getOrders = (): Promise<Order[]> => simulateApi(MOCK_ORDERS);
export const getOrderById = (id: string): Promise<Order | undefined> => simulateApi(MOCK_ORDERS.find(o => o.id === id));
export const getTables = (): Promise<Table[]> => simulateApi(MOCK_TABLES);
export const getTableById = (id: string): Promise<Table | undefined> => simulateApi(MOCK_TABLES.find(t => t.id === id));
export const getEmployees = (): Promise<Employee[]> => simulateApi(MOCK_EMPLOYEES);
export const getClients = (): Promise<Client[]> => simulateApi(MOCK_CLIENTS);
export const getCompanyPromotions = (): Promise<CompanyPromotion[]> => simulateApi(MOCK_COMPANY_PROMOTIONS);
export const getQuickReplies = (): Promise<QuickReply[]> => simulateApi(MOCK_QUICK_REPLIES);
export const getConversations = (): Promise<MockConversation[]> => simulateApi(MOCK_CONVERSATIONS);
export const getMessageHistory = (): Promise<Record<string, ChatMessage[]>> => simulateApi(MOCK_MESSAGE_HISTORY);
export const getOrderAgainRestaurants = (): Promise<Restaurant[]> => {
    // In a real app, this would be complex backend logic based on the logged-in user.
    // Here, we simulate it by finding restaurants from the user's past orders.
    const userOrders = MOCK_ORDERS.filter(o => o.userId === MOCK_USER.id);
    const restaurantIds = [...new Set(userOrders.map(o => o.restaurantId))].slice(0, 3); // Limit to 3 for the example
    const restaurants = MOCK_RESTAURANTS.filter(r => restaurantIds.includes(r.id));
    return simulateApi(restaurants);
};

// --- Search ---
export const searchData = (term: string) => {
    const lowerTerm = term.toLowerCase();
    const filteredRestaurants = MOCK_RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(lowerTerm) || 
      r.cuisine.toLowerCase().includes(lowerTerm)
    );
    const filteredProducts = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) ||
      p.description.toLowerCase().includes(lowerTerm) ||
      (p.category && p.category.toLowerCase().includes(lowerTerm))
    );
    return simulateApi({ restaurants: filteredRestaurants, products: filteredProducts });
}

// --- Write/Update Operations ---

// User Data
export const addAddress = (addressData: Omit<Address, 'id'>): Promise<Address> => {
    const newAddress: Address = { ...addressData, id: `addr-${Date.now()}` };
    if (newAddress.isDefault) { MOCK_ADDRESSES.forEach(a => a.isDefault = false); }
    MOCK_ADDRESSES.push(newAddress);
    return simulateApi(newAddress);
};

export const updateAddress = (address: Address): Promise<Address> => {
    const index = MOCK_ADDRESSES.findIndex(a => a.id === address.id);
    if (index === -1) return Promise.reject(new Error("Address not found"));
    if (address.isDefault) { MOCK_ADDRESSES.forEach(a => a.isDefault = false); }
    MOCK_ADDRESSES[index] = address;
    return simulateApi(address);
};

export const deleteAddress = (addressId: string): Promise<void> => {
    const index = MOCK_ADDRESSES.findIndex(a => a.id === addressId);
    if (index > -1) {
        MOCK_ADDRESSES.splice(index, 1);
        if (MOCK_ADDRESSES.length > 0 && !MOCK_ADDRESSES.some(a => a.isDefault)) {
            MOCK_ADDRESSES[0].isDefault = true;
        }
    }
    return simulateApi(undefined);
};

export const setDefaultAddress = (addressId: string): Promise<void> => {
    MOCK_ADDRESSES.forEach(a => a.isDefault = a.id === addressId);
    return simulateApi(undefined);
};

export const addPaymentMethod = (pmData: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    const newPm: PaymentMethod = { ...pmData, id: `pay-${Date.now()}` };
    if (newPm.isDefault) { MOCK_PAYMENT_METHODS.forEach(p => p.isDefault = false); }
    MOCK_PAYMENT_METHODS.push(newPm);
    return simulateApi(newPm);
};

export const deletePaymentMethod = (pmId: string): Promise<void> => {
    const index = MOCK_PAYMENT_METHODS.findIndex(p => p.id === pmId);
    if (index > -1) {
        MOCK_PAYMENT_METHODS.splice(index, 1);
        if (MOCK_PAYMENT_METHODS.length > 0 && !MOCK_PAYMENT_METHODS.some(p => p.isDefault)) {
            MOCK_PAYMENT_METHODS[0].isDefault = true;
        }
    }
    return simulateApi(undefined);
};

export const setDefaultPaymentMethod = (pmId: string): Promise<void> => {
    MOCK_PAYMENT_METHODS.forEach(p => p.isDefault = p.id === pmId);
    return simulateApi(undefined);
};

export const updateFavoriteRestaurants = (ids: string[]): Promise<string[]> => {
    MOCK_FAVORITE_RESTAURANTS_IDS.length = 0;
    MOCK_FAVORITE_RESTAURANTS_IDS.push(...ids);
    return simulateApi(MOCK_FAVORITE_RESTAURANTS_IDS);
};

export const addUserCoupon = (code: string): Promise<Coupon> => {
    const upperCaseCode = code.toUpperCase();
    const coupon = MOCK_COUPONS.find(c => c.code === upperCaseCode);
    if (!coupon) {
        return Promise.reject(new Error("Cupom inválido."));
    }
    const alreadyAdded = MOCK_USER_COUPONS.some(c => c.id === coupon.id);
    if (alreadyAdded) {
        return Promise.reject(new Error("Você já adicionou este cupom."));
    }
    MOCK_USER_COUPONS.push(coupon);
    return simulateApi(coupon);
}

export const validateCoupon = (code: string): Promise<Coupon> => {
    const upperCaseCode = code.toUpperCase();
    const coupon = MOCK_COUPONS.find(c => c.code === upperCaseCode);
    if (!coupon) {
        return Promise.reject(new Error("Cupom inválido."));
    }
    // In a real app, you might check if the coupon is applicable to the current cart, etc.
    return simulateApi(coupon);
}

export const submitHelpRequest = (data: { name: string; email: string; subject: string; message: string }): Promise<void> => {
    console.log("Submitting help request:", data);
    return simulateApi(undefined);
};

// Orders
export const placeOrder = (order: Order): Promise<Order> => {
    MOCK_ORDERS.unshift(order);
    return simulateApi(order);
};

export const updateOrder = (orderId: string, updates: Partial<Order>): Promise<Order> => {
    const index = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (index === -1) return Promise.reject(new Error("Order not found"));
    MOCK_ORDERS[index] = { ...MOCK_ORDERS[index], ...updates };
    return simulateApi(MOCK_ORDERS[index]);
};

// Company Data
export const updateRestaurant = (id: string, updates: Partial<Restaurant>): Promise<Restaurant> => {
    const index = MOCK_RESTAURANTS.findIndex(r => r.id === id);
    if (index === -1) return Promise.reject(new Error("Restaurant not found"));
    MOCK_RESTAURANTS[index] = { ...MOCK_RESTAURANTS[index], ...updates };
    return simulateApi(MOCK_RESTAURANTS[index]);
};

export const addProduct = (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = { ...productData, id: `prod-${Date.now()}` };
    MOCK_PRODUCTS.push(newProduct);
    return simulateApi(newProduct);
};

export const importProducts = (productsData: Omit<Product, 'id' | 'restaurantId'>[]): Promise<Product[]> => {
    const newProducts: Product[] = productsData.map(p => ({
        ...p,
        id: `prod-${Date.now()}-${Math.random()}`,
        restaurantId: 'rest1',
        isAvailable: true,
    }));
    MOCK_PRODUCTS.push(...newProducts);
    return simulateApi(newProducts);
};

export const updateProduct = (product: Product): Promise<Product> => {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === product.id);
    if (index === -1) return Promise.reject(new Error("Product not found"));
    MOCK_PRODUCTS[index] = product;
    return simulateApi(product);
};

export const deleteProduct = (productId: string): Promise<void> => {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === productId);
    if (index > -1) MOCK_PRODUCTS.splice(index, 1);
    return simulateApi(undefined);
};

export const addCategory = (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const newCategory: Category = { ...categoryData, id: `cat-${Date.now()}` };
    MOCK_CATEGORIES.push(newCategory);
    return simulateApi(newCategory);
};

export const updateCategory = (category: Category): Promise<Category> => {
    const index = MOCK_CATEGORIES.findIndex(c => c.id === category.id);
    if (index === -1) return Promise.reject(new Error("Category not found"));
    const oldName = MOCK_CATEGORIES[index].name;
    MOCK_PRODUCTS.forEach(p => { if (p.category === oldName) p.category = category.name; });
    MOCK_CATEGORIES[index] = category;
    return simulateApi(category);
};

export const deleteCategory = (categoryId: string): Promise<void> => {
    const index = MOCK_CATEGORIES.findIndex(c => c.id === categoryId);
    if (index > -1) {
        const categoryName = MOCK_CATEGORIES[index].name;
        MOCK_PRODUCTS.forEach(p => { if (p.category === categoryName) p.category = 'Outros'; });
        MOCK_CATEGORIES.splice(index, 1);
    }
    return simulateApi(undefined);
};

export const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>): Promise<Client> => {
    const newClient: Client = { ...clientData, id: `client-${Date.now()}`, createdAt: new Date().toISOString(), orderCount: 0 };
    MOCK_CLIENTS.unshift(newClient);
    return simulateApi(newClient);
};

export const updateClient = (client: Client): Promise<Client> => {
    const index = MOCK_CLIENTS.findIndex(c => c.id === client.id);
    if (index === -1) return Promise.reject(new Error("Client not found"));
    MOCK_CLIENTS[index] = client;
    return simulateApi(client);
};

export const deleteClient = (clientId: string): Promise<void> => {
    const index = MOCK_CLIENTS.findIndex(c => c.id === clientId);
    if (index > -1) MOCK_CLIENTS.splice(index, 1);
    return simulateApi(undefined);
};

export const importClients = (clientsData: Omit<Client, 'id' | 'createdAt' | 'orderCount' | 'lastOrder'>[]): Promise<Client[]> => {
    const newClients: Client[] = clientsData.map(c => ({
        ...c,
        id: `client-${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
        orderCount: 0,
    }));
    MOCK_CLIENTS.unshift(...newClients);
    return simulateApi(newClients);
};

export const addEmployee = (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    const newEmployee: Employee = { ...employeeData, id: `emp-${Date.now()}` };
    MOCK_EMPLOYEES.push(newEmployee);
    return simulateApi(newEmployee);
};

export const updateEmployee = (employee: Employee): Promise<Employee> => {
    const index = MOCK_EMPLOYEES.findIndex(e => e.id === employee.id);
    if (index === -1) return Promise.reject(new Error("Employee not found"));
    MOCK_EMPLOYEES[index] = employee;
    return simulateApi(employee);
};

export const deleteEmployee = (employeeId: string): Promise<void> => {
    const index = MOCK_EMPLOYEES.findIndex(e => e.id === employeeId);
    if (index > -1) MOCK_EMPLOYEES.splice(index, 1);
    return simulateApi(undefined);
};

export const addTable = (tableData: Omit<Table, 'id' | 'status'>): Promise<Table> => {
    const newTable: Table = { ...tableData, id: `table-${Date.now()}`, status: 'Livre' };
    MOCK_TABLES.push(newTable);
    return simulateApi(newTable);
};

export const updateTable = (table: Table): Promise<Table> => {
    const index = MOCK_TABLES.findIndex(t => t.id === table.id);
    if (index === -1) return Promise.reject(new Error("Table not found"));
    MOCK_TABLES[index] = table;
    return simulateApi(table);
};

export const deleteTable = (tableId: string): Promise<void> => {
    const index = MOCK_TABLES.findIndex(t => t.id === tableId);
    if (index > -1) MOCK_TABLES.splice(index, 1);
    return simulateApi(undefined);
};

export const updateTableStatus = (tableId: string, status: TableStatus, orderId?: string): Promise<Table> => {
    const index = MOCK_TABLES.findIndex(t => t.id === tableId);
    if (index === -1) return Promise.reject(new Error("Table not found"));
    MOCK_TABLES[index].status = status;
    MOCK_TABLES[index].currentOrderId = status === 'Livre' ? undefined : (orderId || MOCK_TABLES[index].currentOrderId);
    return simulateApi(MOCK_TABLES[index]);
};

export const addPromotion = (promoData: Omit<CompanyPromotion, 'id'>): Promise<CompanyPromotion> => {
    const newPromo: CompanyPromotion = { ...promoData, id: `promo-${Date.now()}` };
    MOCK_COMPANY_PROMOTIONS.push(newPromo);
    return simulateApi(newPromo);
};

export const updatePromotion = (promo: CompanyPromotion): Promise<CompanyPromotion> => {
    const index = MOCK_COMPANY_PROMOTIONS.findIndex(p => p.id === promo.id);
    if (index === -1) return Promise.reject(new Error("Promotion not found"));
    MOCK_COMPANY_PROMOTIONS[index] = promo;
    return simulateApi(promo);
};

export const deletePromotion = (promoId: string): Promise<void> => {
    const index = MOCK_COMPANY_PROMOTIONS.findIndex(p => p.id === promoId);
    if (index > -1) MOCK_COMPANY_PROMOTIONS.splice(index, 1);
    return simulateApi(undefined);
};

export const updateWhatsappGreeting = (message: string): Promise<void> => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === 'rest1');
    if (restaurant && restaurant.whatsappConfig) {
        restaurant.whatsappConfig.greetingMessage = message;
    }
    return simulateApi(undefined);
};

export const updateWhatsappBotConfig = (config: { reengagementConfig: { isActive: boolean; daysInactive: number; message: string; }}): Promise<void> => {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === 'rest1');
    if (restaurant) {
        if (!restaurant.whatsappConfig) {
            restaurant.whatsappConfig = { greetingMessage: '', ...config };
        } else {
            restaurant.whatsappConfig.reengagementConfig = config.reengagementConfig;
        }
    }
    return simulateApi(undefined);
};

export const sendPromoBroadcast = (promoId: string, message: string): Promise<void> => {
    console.log(`Sending broadcast for promo ${promoId} with message: ${message}`);
    // In a real app, this would queue messages to all contacts
    return simulateApi(undefined);
};

export const addQuickReply = (replyData: Omit<QuickReply, 'id'>): Promise<QuickReply> => {
    const newReply: QuickReply = { ...replyData, id: `qr-${Date.now()}` };
    MOCK_QUICK_REPLIES.push(newReply);
    return simulateApi(newReply);
};

export const updateQuickReply = (reply: QuickReply): Promise<QuickReply> => {
    const index = MOCK_QUICK_REPLIES.findIndex(r => r.id === reply.id);
    if (index === -1) return Promise.reject(new Error("Quick Reply not found"));
    MOCK_QUICK_REPLIES[index] = reply;
    return simulateApi(reply);
};

export const deleteQuickReply = (replyId: string): Promise<void> => {
    const index = MOCK_QUICK_REPLIES.findIndex(r => r.id === replyId);
    if (index > -1) MOCK_QUICK_REPLIES.splice(index, 1);
    return simulateApi(undefined);
};