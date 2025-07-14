


import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, useMatch } from 'react-router-dom';
import { User, Address, CartItem, Order, Product, SelectedProductOption, PaymentMethod, Coupon, DeliveryType, Table, Employee, OrderStatus } from './types';
import { ROUTE_PATHS } from './constants';
import * as api from './api';

import NavBar from './components/NavBar';
import FooterNav from './components/FooterNav';
import SideCart from './components/SideCart';
import SideCartTab from './components/SideCartTab';
import CouponInputForm from './components/CouponInputForm';

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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);
  const [allCoupons, setAllCoupons] = useState<Coupon[]>([]);
  const currentAddress = addresses.find(a => a.isDefault) || addresses[0] || null;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]); 
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('DELIVERY');
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const onProductScreen = useMatch(ROUTE_PATHS.PRODUCT_DETAIL);

  const openSideCart = useCallback(() => setIsSideCartOpen(true), []);
  const closeSideCart = useCallback(() => setIsSideCartOpen(false), []);

  const handleDeliveryTypeChange = useCallback((type: DeliveryType) => {
    setDeliveryType(type);
  }, []);
  
  
  // --- Favorite Restaurants ---
  const toggleFavoriteRestaurant = useCallback(async (restaurantId: string) => {
    const originalFavorites = [...favoriteRestaurants];
    const newFavorites = originalFavorites.includes(restaurantId)
      ? originalFavorites.filter(id => id !== restaurantId)
      : [...originalFavorites, restaurantId];
    
    setFavoriteRestaurants(newFavorites); // Optimistic update
    try {
      await api.updateFavoriteRestaurants(newFavorites);
    } catch (error) {
      console.error("Failed to update favorites:", error);
      setFavoriteRestaurants(originalFavorites); // Revert on error
      alert("Erro ao atualizar favoritos.");
    }
  }, [favoriteRestaurants]);
  
  // --- Address Management ---
  const handleSetDefaultAddress = useCallback(async (addressId: string) => {
    const originalAddresses = [...addresses];
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === addressId })));
    try {
        await api.setDefaultAddress(addressId);
    } catch (error) {
        console.error("Failed to set default address:", error);
        setAddresses(originalAddresses);
        alert("Erro ao definir endereço padrão.");
    }
  }, [addresses]);

  const handleAddAddress = useCallback(async (newAddress: Omit<Address, 'id'>) => {
      try {
        const addedAddress = await api.addAddress(newAddress);
        setAddresses(prev => {
            let listWithNewAddr = [...prev, addedAddress];
            if (listWithNewAddr.length === 1 || addedAddress.isDefault) {
                listWithNewAddr = listWithNewAddr.map(a => ({ ...a, isDefault: a.id === addedAddress.id }));
            }
            return listWithNewAddr;
        });
      } catch (error) {
          console.error("Failed to add address:", error);
          alert("Erro ao adicionar endereço.");
      }
  }, []);

  const handleUpdateAddress = useCallback(async (updatedAddress: Address) => {
    try {
        await api.updateAddress(updatedAddress);
        setAddresses(prev => {
            let updatedList = prev.map(a => a.id === updatedAddress.id ? updatedAddress : a);
            if (updatedAddress.isDefault) {
                updatedList = updatedList.map(a => (a.id === updatedAddress.id ? a : { ...a, isDefault: false }));
            }
            return updatedList;
        });
    } catch (error) {
        console.error("Failed to update address:", error);
        alert("Erro ao atualizar endereço.");
    }
  }, []);

  const handleDeleteAddress = useCallback(async (addressId: string) => {
      try {
        await api.deleteAddress(addressId);
        setAddresses(prev => {
            const addressToDelete = prev.find(a => a.id === addressId);
            const remaining = prev.filter(addr => addr.id !== addressId);
            if (addressToDelete?.isDefault && remaining.length > 0) {
                remaining[0].isDefault = true;
            }
            return remaining;
        });
      } catch (error) {
        console.error("Failed to delete address:", error);
        alert("Erro ao excluir endereço.");
      }
  }, []);
  
  // --- Payment Management ---
  const handleSetDefaultPaymentMethod = useCallback(async (paymentMethodId: string) => {
    const originalPaymentMethods = [...paymentMethods];
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === paymentMethodId })));
    try {
        await api.setDefaultPaymentMethod(paymentMethodId);
    } catch (error) {
        console.error("Failed to set default payment method:", error);
        setPaymentMethods(originalPaymentMethods);
        alert("Erro ao definir método de pagamento padrão.");
    }
  }, [paymentMethods]);

  const handleAddPaymentMethod = useCallback(async (newPaymentMethod: Omit<PaymentMethod, 'id'>) => {
    try {
        const addedPm = await api.addPaymentMethod(newPaymentMethod);
        setPaymentMethods(prev => {
          let listWithNewPm = [...prev, addedPm];
          if (listWithNewPm.length === 1 || addedPm.isDefault) {
            listWithNewPm = listWithNewPm.map(p => ({ ...p, isDefault: p.id === addedPm.id }));
          }
          return listWithNewPm;
        });
    } catch (error) {
        console.error("Failed to add payment method:", error);
        alert("Erro ao adicionar método de pagamento.");
    }
  }, []);

  const handleDeletePaymentMethod = useCallback(async (paymentMethodId: string) => {
    try {
        await api.deletePaymentMethod(paymentMethodId);
        setPaymentMethods(prev => {
            const pmToDelete = prev.find(p => p.id === paymentMethodId);
            const remaining = prev.filter(p => p.id !== paymentMethodId);
            if (pmToDelete?.isDefault && remaining.length > 0) {
                remaining[0].isDefault = true;
            }
            return remaining;
        });
    } catch (error) {
        console.error("Failed to delete payment method:", error);
        alert("Erro ao excluir método de pagamento.");
    }
  }, []);

  // --- Coupon Management ---
  const handleAddCoupon = useCallback(async (code: string) => {
    setIsAddingCoupon(true);
    try {
        const addedCoupon = await api.addUserCoupon(code);
        setUserCoupons(prev => [...prev, addedCoupon]);
        alert(`Cupom "${addedCoupon.code}" adicionado com sucesso!`);
    } catch (error) {
        alert((error as Error).message);
    } finally {
        setIsAddingCoupon(false);
    }
  }, []);

  const handleApplyCoupon = useCallback(async (code: string) => {
    setIsCouponLoading(true);
    setCouponError('');
    try {
        const coupon = await api.validateCoupon(code);
        setAppliedCoupon(coupon);
    } catch (error) {
        setAppliedCoupon(null);
        setCouponError((error as Error).message || 'Cupom inválido.');
    } finally {
        setIsCouponLoading(false);
    }
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError('');
  }, []);


  // --- User / Employee Authentication ---
  useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [
                userAddresses, 
                userPaymentMethods, 
                userCouponsData,
                initialOrders,
                initialFavorites
            ] = await Promise.all([
                api.getAddresses(),
                api.getPaymentMethods(),
                api.getUserCoupons(),
                api.getOrders(),
                api.getFavoriteRestaurants()
            ]);

            setAddresses(userAddresses);
            setPaymentMethods(userPaymentMethods);
            setUserCoupons(userCouponsData);
            setOrders(initialOrders);
            setFavoriteRestaurants(initialFavorites);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            // Optionally set an error state to display a message
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
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
  
  const handleEmployeeLogin = useCallback(async (pin: string) => {
    try {
      const employee = await api.employeeLogin(pin);
      if (employee) {
        setCurrentEmployee(employee);
        navigate(ROUTE_PATHS.EMPLOYEE_DASHBOARD, { replace: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Employee login failed", error);
      return false;
    }
  }, [navigate]);

  const handleEmployeeLogout = useCallback(() => {
      setCurrentEmployee(null);
      navigate(ROUTE_PATHS.PROFILE, { replace: true });
  }, [navigate]);

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
                handleRemoveCoupon();
                return [{ product, quantity, selectedOptions: selectedOptions || [], observations, totalPrice: quantity * priceWithOptions }];
            }
            return prevCart;
        }
        return [...prevCart, { product, quantity, selectedOptions: selectedOptions || [], observations, totalPrice: quantity * priceWithOptions }];
      }
    });
  }, [handleRemoveCoupon]);

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
    handleRemoveCoupon();
    closeSideCart();
  }, [closeSideCart, handleRemoveCoupon]);

  const placeOrder = useCallback(async (paymentMethod: string) => {
    if (!currentUser || !currentAddress || cart.length === 0) {
      alert("Não é possível finalizar o pedido. Verifique seu login, endereço e carrinho.");
      return;
    }

    const restaurantId = cart[0]?.product.restaurantId;
    const restaurant = restaurantId ? await api.getRestaurantById(restaurantId) : null;

    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryFee = deliveryType === 'DELIVERY' ? (restaurant?.deliveryFee ?? 0) : 0;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'fixed') {
        discount = appliedCoupon.discountValue;
      } else { // percentage
        discount = subtotal * (appliedCoupon.discountValue / 100);
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: currentUser.id,
      restaurantId: restaurantId || 'unknown-rest',
      restaurantName: restaurant?.name || 'Restaurante',
      items: cart,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: OrderStatus.PLACED,
      deliveryAddress: currentAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      trackingLog: [{ status: OrderStatus.PLACED, timestamp: new Date().toISOString() }],
      deliveryType,
      isLocal: false,
      customerName: currentUser.name,
    };

    try {
        const placedOrder = await api.placeOrder(newOrder);
        setOrders(prevOrders => [placedOrder, ...prevOrders]);
        clearCart();
        navigate(ROUTE_PATHS.ORDER_TRACKING.replace(':orderId', placedOrder.id));
    } catch (error) {
        console.error("Failed to place order:", error);
        alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  }, [cart, currentUser, currentAddress, deliveryType, appliedCoupon, clearCart, navigate]);

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
            <Route path={ROUTE_PATHS.CART} element={currentUser ? <CartScreen cartItems={cart} updateCartItemQuantity={updateCartItemQuantity} removeFromCart={removeFromCartHandler} clearCart={clearCart} deliveryType={deliveryType} onDeliveryTypeChange={handleDeliveryTypeChange} appliedCoupon={appliedCoupon} couponError={couponError} onApplyCoupon={handleApplyCoupon} onRemoveCoupon={handleRemoveCoupon} isCouponLoading={isCouponLoading}/> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.CHECKOUT} element={currentUser && currentAddress ? <CheckoutScreen cartItems={cart} deliveryAddress={currentAddress} paymentMethods={paymentMethods} onPlaceOrder={placeOrder} deliveryType={deliveryType} user={currentUser} appliedCoupon={appliedCoupon} couponError={couponError} onApplyCoupon={handleApplyCoupon} onRemoveCoupon={handleRemoveCoupon} isCouponLoading={isCouponLoading}/> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ORDER_TRACKING} element={currentUser ? <OrderTrackingScreen orders={orders} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.PROFILE} element={currentUser ? <ProfileScreen user={currentUser} onLogout={handleLogout} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            
            <Route path={ROUTE_PATHS.FAVORITES} element={currentUser ? <FavoritesScreen favoriteRestaurants={favoriteRestaurants} onToggleFavorite={toggleFavoriteRestaurant} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ORDER_HISTORY} element={currentUser ? <OrderHistoryScreen orders={orders} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.ADDRESS_MANAGEMENT} element={currentUser ? <AddressManagementScreen addresses={addresses} onSetDefault={handleSetDefaultAddress} onAdd={handleAddAddress} onUpdate={handleUpdateAddress} onDelete={handleDeleteAddress} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.PAYMENT_MANAGEMENT} element={currentUser ? <PaymentManagementScreen paymentMethods={paymentMethods} onSetDefault={handleSetDefaultPaymentMethod} onAdd={handleAddPaymentMethod} onDelete={handleDeletePaymentMethod} user={currentUser}/> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.COUPONS} element={currentUser ? <CouponsScreen userCoupons={userCoupons} onAddCoupon={handleAddCoupon} isLoading={isAddingCoupon}/> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.APP_SETTINGS} element={currentUser ? <AppSettingsScreen /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />
            <Route path={ROUTE_PATHS.HELP_CENTER} element={currentUser ? <HelpCenterScreen user={currentUser} /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />} />

            {/* Company Routes: Protected by currentUser */}
            <Route element={currentUser ? <CompanyLayout /> : <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />}>
                <Route path={ROUTE_PATHS.COMPANY_DASHBOARD} element={<CompanyDashboardScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_MENU} element={<MenuManagementScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_INFO} element={<StoreInfoScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_PROMOTIONS} element={<PromotionsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_CLIENTS} element={<ClientsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_REPORTS} element={<ReportsScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_WHATSAPP} element={<WhatsappScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_WHATSAPP_BOT} element={<WhatsappBotScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_EMPLOYEES} element={<EmployeeManagementScreen />} />
                <Route path={ROUTE_PATHS.COMPANY_TABLES} element={<TableManagementScreen />} />
            </Route>

            {/* Employee Routes: Protected by currentEmployee */}
            <Route path={ROUTE_PATHS.EMPLOYEE_LOGIN} element={<EmployeeLoginScreen onLogin={handleEmployeeLogin} />} />
            <Route element={currentEmployee ? <EmployeeLayout employee={currentEmployee} onLogout={handleEmployeeLogout} /> : <Navigate to={ROUTE_PATHS.EMPLOYEE_LOGIN} state={{ from: location }} replace />}>
              <Route path={ROUTE_PATHS.EMPLOYEE_DASHBOARD} element={<TableOverviewScreen />} />
              <Route path={ROUTE_PATHS.EMPLOYEE_TABLE_DETAIL} element={<TableDetailScreen />} />
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
        appliedCoupon={appliedCoupon}
        couponError={couponError}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        isCouponLoading={isCouponLoading}
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