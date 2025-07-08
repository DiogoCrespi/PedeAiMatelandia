
export const ROUTE_PATHS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  PASSWORD_RECOVERY: '/password-recovery',
  HOME: '/',
  SEARCH: '/search',
  STORE_DETAIL: '/store/:storeId', 
  PRODUCT_DETAIL: '/store/:storeId/product/:productId',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_TRACKING: '/order/:orderId', 
  PROFILE: '/profile',
  FAVORITES: '/profile/favorites',
  ORDER_HISTORY: '/profile/orders',
  ADDRESS_MANAGEMENT: '/profile/addresses',
  PAYMENT_MANAGEMENT: '/profile/payments',
  COUPONS: '/profile/coupons',
  APP_SETTINGS: '/profile/settings',
  HELP_CENTER: '/profile/help',
  
  // Company Routes
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_ORDERS: '/company/orders', // Legacy, redirects to dashboard
  COMPANY_MENU: '/company/menu',
  COMPANY_INFO: '/company/info',
  COMPANY_CLIENTS: '/company/clients',
  COMPANY_PROMOTIONS: '/company/promotions',
  COMPANY_REPORTS: '/company/reports',
  COMPANY_WHATSAPP: '/company/whatsapp',
  COMPANY_WHATSAPP_BOT: '/company/whatsapp/bot',
  COMPANY_EMPLOYEES: '/company/employees',
  COMPANY_TABLES: '/company/tables',

  // Employee Routes
  EMPLOYEE_LOGIN: '/employee/login',
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  EMPLOYEE_TABLE_DETAIL: '/employee/table/:tableId',
};
