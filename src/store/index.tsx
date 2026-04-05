import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, User, Order, Address, Notification } from '@/types';
import { products as initialProducts } from '@/data/products';

// State interfaces
interface AppState {
  // Products
  products: Product[];
  
  // Cart
  cart: CartItem[];
  
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Orders
  orders: Order[];
  userOrders: Order[];
  
  // Notifications
  notifications: Notification[];
  
  // UI State
  isCartOpen: boolean;
  searchQuery: string;
  
  // Loading states
  isLoading: boolean;
}

// Action types
type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOGIN'; payload: { user: User; isAdmin?: boolean } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };


const normalizeProducts = (products: Product[]): Product[] =>
  products.map((product) => {
    const firstSize = product.sizes?.[0] || { size: '100ml', price: product.price, stock: product.stock || 0 };
    return {
      ...product,
      sizes: [
        {
          size: firstSize.size || '100ml',
          price: Number(firstSize.price ?? product.price ?? 0),
          stock: Number(firstSize.stock ?? product.stock ?? 0),
        },
      ],
      price: Number(firstSize.price ?? product.price ?? 0),
      stock: Number(firstSize.stock ?? product.stock ?? 0),
    };
  });


// Initial state
const initialState: AppState = {
  products: normalizeProducts(initialProducts),
  cart: [],
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  orders: [],
  userOrders: [],
  notifications: [],
  isCartOpen: false,
  searchQuery: '',
  isLoading: false,
};

// Load state from localStorage
const loadState = (): AppState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const savedState = localStorage.getItem('cheetah-perfumes-state');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        ...initialState,
        ...parsed,
        products: normalizeProducts(parsed.products || initialProducts),
      };
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
  
  return initialState;
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'UPDATE_STOCK': {
      const { productId, size, quantity } = action.payload;
      return {
        ...state,
        products: state.products.map(p => {
          if (p.id === productId) {
            const updatedSizes = p.sizes.map(s => 
              s.size === size ? { ...s, stock: Math.max(0, s.stock - quantity) } : s
            );
            const totalStock = updatedSizes.reduce((sum, s) => sum + s.stock, 0);
            return { ...p, sizes: updatedSizes, stock: totalStock };
          }
          return p;
        })
      };
    }
    
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return { ...state, cart: [...state.cart, action.payload] };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.product.id === action.payload.productId && item.size === action.payload.size)
        )
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_CART_OPEN':
      return { ...state, isCartOpen: action.payload };
    
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin || false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        cart: []
      };
    
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_ADDRESS':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload]
        }
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        userOrders: state.user?.id === action.payload.userId 
          ? [action.payload, ...state.userOrders]
          : state.userOrders
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
        userOrders: state.userOrders.map(o =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        )
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        )
      };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  addToCart: (product: Product, size: string, quantity: number) => boolean;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  addOrder: (orderData: OrderData) => Promise<Order | null>;
  updateProductStock: (productId: string, size: string, quantity: number) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface OrderData {
  items: { productId: string; name: string; price: number; quantity: number; size: string }[];
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address?: Address;
  paymentMethod: 'instapay' | 'cod';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, loadState());
  
  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      products: state.products,
      orders: state.orders,
      cart: state.cart,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAdmin: state.isAdmin,
      userOrders: state.userOrders,
      notifications: state.notifications,
    };
    localStorage.setItem('cheetah-perfumes-state', JSON.stringify(stateToSave));
  }, [state.products, state.orders, state.cart, state.user, state.isAuthenticated, state.isAdmin, state.userOrders, state.notifications]);
  
  // Helper functions
  const addToCart = (product: Product, size: string, quantity: number): boolean => {
    const sizeData = product.sizes.find(s => s.size === size);
    if (!sizeData || sizeData.stock < quantity) {
      return false;
    }
    
    const existingItem = state.cart.find(
      item => item.product.id === product.id && item.size === size
    );
    
    const totalQuantity = (existingItem?.quantity || 0) + quantity;
    if (totalQuantity > sizeData.stock) {
      return false;
    }
    
    dispatch({ type: 'ADD_TO_CART', payload: { product, size, quantity } });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
    return true;
  };
  
  const removeFromCart = (productId: string, size: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size } });
  };
  
  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, size, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      const sizePrice = item.product.sizes.find(s => s.size === item.size)?.price || item.product.price;
      return total + sizePrice * item.quantity;
    }, 0);
  };
  
  const getCartCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  const login = async (phoneOrEmail: string, _password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('cheetah-users') || '[]');
    const user = users.find((u: User) => u.phone === phoneOrEmail || u.email === phoneOrEmail || u.email === `${phoneOrEmail}@phone.local`);
    
    if (user) {
      dispatch({ type: 'LOGIN', payload: { user, isAdmin: false } });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };
  
  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === 'admin' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@cheetahperfumes.com',
        firstName: 'Fahd',
        lastName: 'Ahmed',
        addresses: [],
        orders: [],
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      dispatch({ type: 'LOGIN', payload: { user: adminUser, isAdmin: true } });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };
  
  const register = async (userData: RegisterData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('cheetah-users') || '[]');
    
    if (users.find((u: User) => (userData.phone && u.phone === userData.phone) || u.email === userData.email)) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('cheetah-users', JSON.stringify(users));
    localStorage.setItem(`cheetah-password-${userData.email}`, userData.password);
    
    dispatch({ type: 'LOGIN', payload: { user: newUser } });
    dispatch({ type: 'SET_LOADING', payload: false });
    return true;
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const addOrder = async (orderData: OrderData): Promise<Order | null> => {
    if (!state.user) return null;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: state.user.id,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
      paymentMethod: orderData.paymentMethod,
      deliveryType: orderData.deliveryType,
      address: orderData.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Update stock
    orderData.items.forEach(item => {
      dispatch({
        type: 'UPDATE_STOCK',
        payload: { productId: item.productId, size: item.size, quantity: item.quantity }
      });
    });
    
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    
    // Add notification
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: state.user.id,
      title: 'Order Placed Successfully',
      message: `Your order ${newOrder.id} has been placed and is being processed.`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return newOrder;
  };
  
  const updateProductStock = (productId: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { productId, size, quantity } });
  };
  
  const value: AppContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    login,
    loginAdmin,
    register,
    logout,
    addOrder,
    updateProductStock
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
