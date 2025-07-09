

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, useMatch } from 'react-router-dom';
import { User, Address, CartItem, Order, Product, SelectedProductOption, PaymentMethod, Coupon, DeliveryType, Table, Employee } from './types';
import { ROUTE_PATHS } from './constants';
import { MOCK_USER, MOCK_ADDRESSES, MOCK_ORDERS, MOCK_PAYMENT_METHODS, MOCK_COUPONS, MOCK_TABLES, MOCK_EMPLOYEES } from './data';

import NavBar from './components/NavBar';
import FooterNav from './components/FooterNav';
import SideCart from './components/SideCart';
import SideCartTab from './components/SideCartTab';
import ProductList from './components/ProductList';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import StoreScreen from './screens/StoreScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import ProfileScreen from './screens/ProfileScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import AddressManagementScreen from './screens/AddressManagementScreen';
import PaymentManagementScreen from './screens/PaymentManagementScreen';
import AppSettingsScreen from './screens/AppSettingsScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import CouponsScreen from './screens/CouponsScreen';
import FavoritesScreen from './screens/FavoritesScreen';

// Company Screens
import CompanyLayout from './screens/company/CompanyLayout';
import CompanyDashboardScreen from './screens/company/CompanyDashboardScreen';
import MenuManagementScreen from './screens/company/MenuManagementScreen';
import StoreInfoScreen from './screens/company/StoreInfoScreen';
import WhatsappScreen from './screens/company/WhatsappScreen';
import WhatsappBotScreen from './screens/company/WhatsappBotScreen';
import PromotionsScreen from './screens/company/PromotionsScreen';
import ClientsScreen from './screens/company/ClientsScreen';
import ReportsScreen from './screens/company/ReportsScreen';
import EmployeeManagementScreen from './screens/company/EmployeeManagementScreen';
import TableManagementScreen from './screens/company/TableManagementScreen';

// Employee Screens
import EmployeeLayout from './screens/employee/EmployeeLayout';
import EmployeeLoginScreen from './screens/employee/EmployeeLoginScreen';
import TableOverviewScreen from './screens/employee/TableOverviewScreen';
import TableDetailScreen from './screens/employee/TableDetailScreen';


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const currentAddress = addresses.find(a => a.isDefault) || addresses[0] || null;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); 
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(['rest2']); 
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('DELIVERY');
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  
  // New state for company/employee data
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);

  const location = useLocation();
  const navigate = useNavigate();
  const onProductScreen = useMatch(ROUTE_PATHS.PRODUCT_DETAIL);

  const openSideCart = useCallback(() => setIsSideCartOpen(true), []);
  const closeSideCart = useCallback(() => setIsSideCartOpen(false), []);

  const handleDeliveryTypeChange = useCallback((type: DeliveryType) => {
    setDeliveryType(type);
  }, []);
  
  const toggleStoreOpen = useCallback(() => {
    setIsStoreOpen(prev => !prev);
  }, []);
  
  // --- Employee and Table Management ---
  const handleAddEmployee = useCallback((employee: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...employee, id: `emp-${Date.now()}` }]);
  }, []);
  
  const handleDeleteEmployee = useCallback((employeeId: string) => {
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
  }, []);
  
  const handleAddTable = useCallback((table: Omit<Table, 'id' | 'status'>) => {
    setTables(prev => [...prev, { ...table, id: `table-${Date.now()}`, status: 'Livre' }]);
  }, []);

  const handleUpdateTable = useCallback((table: Table) => {
    setTables(prev => prev.map(t => t.id === table.id ? table : t));
  }, []);

  const handleDeleteTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  }, []);
  
  const updateTableStatus = useCallback((tableId: string, status: Table['status'], orderId?: string) => {
    setTables(prevTables => prevTables.map(t => 
        t.id === tableId ? { ...t, status, currentOrderId: status === 'Livre' ? undefined : (orderId || t.currentOrderId) } : t
    ));
  }, []);
  
  // --- Favorite Restaurants ---
  const toggleFavoriteRestaurant = useCallback((restaurantId: string) => {
    setFavoriteRestaurants(prev => {
      const isFavorited = prev.includes(restaurantId);
      if (isFavorited) {
        return prev.filter(id => id !== restaurantId);
      } else {
        return [...prev, restaurantId];
      }
    });
  }, []);
  
  // --- Address Management ---
  const handleSetDefaultAddress = useCallback((addressId: string) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === addressId })));
  }, []);

  const handleAddAddress = useCallback((newAddress: Omit<Address, 'id'>) => {
      setAddresses(prev => {
          const newAddrWithId = { ...newAddress, id: `addr-${Date.now()}` };
          let listWithNewAddr = [...prev, newAddrWithId];
          if (listWithNewAddr.length === 1 || newAddrWithId.isDefault) {
              listWithNewAddr = listWithNewAddr.map(a => ({ ...a, isDefault: a.id === newAddrWithId.id }));
          }
          return listWithNewAddr;
      });
  }, []);

  const handleUpdateAddress = useCallback((updatedAddress: Address) => {
    setAddresses(prev => {
        let updatedList = [...prev];
        if (updatedAddress.isDefault) {
            updatedList = updatedList.map(a => ({...a, isDefault: false}));
        }
        const index = updatedList.findIndex(a => a.id === updatedAddress.id);
        if (index > -1) {
            updatedList[index] = updatedAddress;
        }
        return updatedList;
    });
  }, []);

  const handleDeleteAddress = useCallback((addressId: string) => {
      setAddresses(prev => {
          const addressToDelete = prev.find(a => a.id === addressId);
          const remaining = prev.filter(addr => addr.id !== addressId);
          if (addressToDelete?.isDefault && remaining.length > 0) {
              remaining[0].isDefault = true;
          }
          return remaining;
      });
  }, []);
  
  // --- Payment Management ---
  const handleSetDefaultPaymentMethod = useCallback((paymentMethodId: string) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === paymentMethodId })));
  }, []);

  const handleAddPaymentMethod = useCallback((newPaymentMethod: Omit<PaymentMethod, 'id'>) => {
    setPaymentMethods(prev => {
      const newPmWithId = { ...newPaymentMethod, id: `pay-${Date.now()}` };
      let listWithNewPm = [...prev, newPmWithId];
      if (listWithNewPm.length === 1 || newPmWithId.isDefault) {
        listWithNewPm = listWithNewPm.map(p => ({ ...p, isDefault: p.id === newPmWithId.id }));
      }
      return listWithNewPm;
    });
  }, []);

  const handleDeletePaymentMethod = useCallback((paymentMethodId: string) => {
    setPaymentMethods(prev => {
      const pmToDelete = prev.find(p => p.id === paymentMethodId);
      const remaining = prev.filter(p => p.id !== paymentMethodId);
      if (pmToDelete?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  }, []);

  // --- Coupon Management ---
  const handleAddCoupon = useCallback((code: string) => {
    const upperCaseCode = code.toUpperCase();
    const couponExists = MOCK_COUPONS.find(c => c.code === upperCaseCode);
    if (!couponExists) {
        alert('Cupom inválido.');
        return;
    }
    const alreadyAdded = userCoupons.some(c => c.code === upperCaseCode);
    if (alreadyAdded) {
        alert('Você já adicionou este cupom.');
        return;
    }
    setUserCoupons(prev => [...prev, couponExists]);
    alert(`Cupom "${couponExists.code}" adicionado com sucesso!`);
  }, [userCoupons]);

  // --- User / Employee Authentication ---
  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = useCallback((user: User, fromPath?: string) => {
    setCurrentUser(user);
    navigate(fromPath || ROUTE_PATHS.HOME, { replace: true });
  }, [navigate]);

  const handleSignup = useCallback((user: User, fromPath?: string) => {
    setCurrentUser(user);
    navigate(fromPath || ROUTE_PATHS.HOME, { replace: true });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  }, [navigate]);
  
  const handleEmployeeLogin = useCallback((employee: Employee) => {
      setCurrentEmployee(employee);
      navigate(ROUTE_PATHS.EMPLOYEE_DASHBOARD, { replace: true });
  }, [navigate]);

  const handleEmployeeLogout = useCallback(() => {
      setCurrentEmployee(null);
      // The declarative <Navigate> in the route definition will now handle the redirect.
      // This change ensures the history is correctly replaced on logout.
  }, []);

  // --- Cart and Order Logic ---
  const addToCartHandler = useCallback((product: Product, quantity: number, selectedOptions?: SelectedProductOption[], observations?: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || [])
      );

      let priceWithOptions = product.price;
      selectedOptions?.forEach(opt => { priceWithOptions += opt.priceAdjustment || 0; });

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].quantity * priceWithOptions;
        if (observations) updatedCart[existingItemIndex].observations = observations;
        return updatedCart;
      } else {
        if (prevCart.length > 0 && prevCart[0].product.restaurantId !== product.restaurantId) {
            if (window.confirm("Você só pode adicionar itens de um restaurante por vez. Deseja limpar o carrinho e adicionar este novo item?")) {
                return [{ product, quantity, selectedOptions: selectedOptions || [], observations, totalPrice: quantity * priceWithOptions }];
            }
            return prevCart;
        }
        return [...prevCart, { product, quantity, selectedOptions: selectedOptions || [], observations, totalPrice: quantity * priceWithOptions }];
      }
    });
  }, []);

  const updateCartItemQuantity = useCallback((productId: string, newQuantity: number, selectedOptions?: SelectedProductOption[]) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || [])) {
          let priceWithOptions = item.product.price;
          item.selectedOptions?.forEach(opt => { priceWithOptions += opt.priceAdjustment || 0; });
          return { ...item, quantity: newQuantity, totalPrice: newQuantity * priceWithOptions };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  }, []);

  const removeFromCartHandler = useCallback((productId: string, selectedOptions?: SelectedProductOption[]) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || []))));
  }, []);
  
  const clearCart = useCallback(() => {
    setCart([]);
    closeSideCart();
  }, [closeSideCart]);

  const placeOrder = useCallback((order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
    if (order.tableId) {
        updateTableStatus(order.tableId, 'Ocupada', order.id);
    } else {
        clearCart();
        navigate(ROUTE_PATHS.ORDER_TRACKING.replace(':orderId', order.id));
    }
  }, [clearCart, navigate, updateTableStatus]);

  if (isLoading) {
    return <SplashScreen />;
  }
  
  const noNavFooterRoutes = [
    ROUTE_PATHS.LOGIN, 
    ROUTE_PATHS.SIGNUP, 
    ROUTE_PATHS.PASSWORD_RECOVERY,
  ];
  const isCompanyRoute = location.pathname.startsWith('/company');
  const isEmployeeRoute = location.pathname.startsWith('/employee');
  const showNavAndFooter = !noNavFooterRoutes.includes(location.pathname) && !isCompanyRoute && !isEmployeeRoute;
  const showFooter = showNavAndFooter && !onProductScreen;

  return (
    <>
      {showNavAndFooter && <NavBar cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onCartClick={openSideCart} />}
      
      <main className={`flex-grow ${showNavAndFooter ? 'pt-[60px]' : ''} ${showFooter ? 'pb-[80px]' : ''} ${!isCompanyRoute && !isEmployeeRoute ? 'lg:px-40' : ''}`}>
        <div className={`layout-content-container flex flex-col w-full ${showNavAndFooter ? 'lg:max-w-[960px]' : 'max-w-full'} mx-auto flex-1`}>
          <Routes>
            <Route path={ROUTE_PATHS.HOME} element={<HomeScreen favoriteRestaurants={favoriteRestaurants} onToggleFavorite={toggleFavoriteRestaurant} />} />
            <Route path={ROUTE_PATHS.LOGIN} element={!currentUser ? <LoginScreen onLogin={handleLogin} /> : <Navigate to={location.state?.from?.pathname || ROUTE_PATHS.HOME} replace />} />
            
            <Route path={ROUTE_PATHS.SIGNUP} element={!currentUser ? <SignupScreen onSignup={handleSignup} /> : <Navigate to={ROUTE_PATHS.HOME} replace />} />
            <Route path={ROUTE_PATHS.PASSWORD_RECOVERY} element={<PasswordRecoveryScreen />} />

            {/* Public routes */}
            <Route path={ROUTE_PATHS.SEARCH} element={<SearchScreen favoriteRestaurants={favoriteRestaurants} onToggleFavorite={toggleFavoriteRestaurant} />} />
            <Route path={ROUTE_PATHS.STORE_DETAIL} element={<StoreScreen deliveryType={deliveryType} onDeliveryTypeChange={handleDeliveryTypeChange} />} />
            <Route path={ROUTE_PATHS.PRODUCT_DETAIL} element={<ProductScreen addToCart={addToCartHandler} currentUser={currentUser} onSocialLogin={handleLogin} />} />
            
            {/* Authenticated Customer Routes */}
            <Route path={ROUTE_PATHS.CART} element={currentUser ? <CartScreen cartItems={cart} updateCartItemQuantity={updateCartItemQuantity} removeFromCart={removeFromCartHandler} clearCart={clearCart} deliveryType={deliveryType} onDeliveryTypeChange={handleDeliveryTypeChange}/> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.CHECKOUT} element={currentUser && currentAddress ? <CheckoutScreen cartItems={cart} deliveryAddress={currentAddress} paymentMethods={paymentMethods} onPlaceOrder={placeOrder} deliveryType={deliveryType} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ORDER_TRACKING} element={currentUser ? <OrderTrackingScreen orders={orders} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.PROFILE} element={currentUser ? <ProfileScreen user={currentUser} onLogout={handleLogout} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            
            <Route path={ROUTE_PATHS.FAVORITES} element={currentUser ? <FavoritesScreen favoriteRestaurants={favoriteRestaurants} onToggleFavorite={toggleFavoriteRestaurant} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ORDER_HISTORY} element={currentUser ? <OrderHistoryScreen orders={orders} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ADDRESS_MANAGEMENT} element={currentUser ? <AddressManagementScreen addresses={addresses} onSetDefault={handleSetDefaultAddress} onAdd={handleAddAddress} onUpdate={handleUpdateAddress} onDelete={handleDeleteAddress} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.PAYMENT_MANAGEMENT} element={currentUser ? <PaymentManagementScreen paymentMethods={paymentMethods} onSetDefault={handleSetDefaultPaymentMethod} onAdd={handleAddPaymentMethod} onDelete={handleDeletePaymentMethod} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.COUPONS} element={currentUser ? <CouponsScreen userCoupons={userCoupons} onAddCoupon={handleAddCoupon} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.APP_SETTINGS} element={currentUser ? <AppSettingsScreen /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.HELP_CENTER} element={currentUser ? <HelpCenterScreen user={currentUser} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />

            {/* Company Routes: Protected by currentUser */}
            <Route element={currentUser ? <CompanyLayout /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />}>
                <Route path={ROUTE_PATHS.COMPANY_DASHBOARD} element={<CompanyDashboardScreen isStoreOpen={isStoreOpen} onToggleStoreOpen={toggleStoreOpen} />} />
                <Route path={ROUTE_PATHS.COMPANY_MENU} element={<MenuManagementScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_INFO} element={<StoreInfoScreen isStoreOpen={isStoreOpen} onToggleStoreOpen={toggleStoreOpen} />} />
                <Route path={ROUTE_PATHS.COMPANY_PROMOTIONS} element={<PromotionsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_CLIENTS} element={<ClientsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_REPORTS} element={<ReportsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_WHATSAPP} element={<WhatsappScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_WHATSAPP_BOT} element={<WhatsappBotScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_EMPLOYEES} element={<EmployeeManagementScreen employees={employees} onAdd={handleAddEmployee} onDelete={handleDeleteEmployee} />} />
                <Route path={ROUTE_PATHS.COMPANY_TABLES} element={<TableManagementScreen tables={tables} onAdd={handleAddTable} onUpdate={handleUpdateTable} onDelete={handleDeleteTable} />} />
            </Route>

            {/* Employee Routes: Protected by currentEmployee */}
            <Route path={ROUTE_PATHS.EMPLOYEE_LOGIN} element={<EmployeeLoginScreen employees={employees} onLogin={handleEmployeeLogin} />} />
            <Route element={currentEmployee ? <EmployeeLayout employee={currentEmployee} onLogout={handleEmployeeLogout} /> : <Navigate to={ROUTE_PATHS.EMPLOYEE_LOGIN} state={{ from: location }} replace />}>
              <Route path={ROUTE_PATHS.EMPLOYEE_DASHBOARD} element={<TableOverviewScreen tables={tables} orders={orders} />} />
              <Route path={ROUTE_PATHS.EMPLOYEE_TABLE_DETAIL} element={<TableDetailScreen tables={tables} orders={orders} onPlaceOrder={placeOrder} onUpdateTableStatus={updateTableStatus} />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} />} />
          </Routes>
        </div>
      </main>

      {showFooter && <FooterNav />}
      <SideCart 
        isOpen={isSideCartOpen}
        onClose={closeSideCart}
        cartItems={cart}
        updateCartItemQuantity={updateCartItemQuantity}
        removeFromCart={removeFromCartHandler}
        deliveryType={deliveryType}
        userCoupons={userCoupons}
      />
      {cart.length > 0 && !isSideCartOpen && showNavAndFooter && (
        <SideCartTab 
          itemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
          onOpen={openSideCart} 
        />
      )}
    </>
  );
};

export default App;
