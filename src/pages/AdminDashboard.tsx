import { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Plus, Edit2, Trash2, 
  Search, Filter, AlertTriangle,
  TrendingUp, DollarSign, Box, User
} from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Product, Order } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage, translateCategory, translateType, translateOrderStatus, formatDate } from '@/i18n';

export function AdminDashboard() {
  const { state } = useApp();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');

  const totalOrders = state.orders.length;
  const totalRevenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  const totalProducts = state.products.length;
  const lowStockProducts = state.products.filter(p => p.stock <= 5);
  const pendingOrders = state.orders.filter(o => o.status === 'pending');

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="micro-label mb-2">{t('ADMIN PANEL')}</p>
            <h1 className="heading-section text-white">
              {t('Dashboard')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">{t('Welcome,')}</span>
            <span className="text-gold font-medium">{state.user?.firstName}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'dashboard', label: t('Dashboard'), icon: LayoutDashboard },
            { id: 'products', label: t('Products'), icon: Package },
            { id: 'orders', label: t('Orders'), icon: ShoppingCart },
            { id: 'users', label: t('Users'), icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gold text-cheetah-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <DashboardTab 
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            totalProducts={totalProducts}
            lowStockCount={lowStockProducts.length}
            pendingOrders={pendingOrders.length}
          />
        )}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}

function DashboardTab({ 
  totalOrders, 
  totalRevenue, 
  totalProducts, 
  lowStockCount,
  pendingOrders 
}: { 
  totalOrders: number; 
  totalRevenue: number; 
  totalProducts: number; 
  lowStockCount: number;
  pendingOrders: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-luxury p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8 text-gold" />
            <span className="text-green-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-white/60 text-sm">{t('Total Orders')}</p>
          <p className="text-3xl font-heading font-bold text-white">{totalOrders}</p>
        </div>

        <div className="card-luxury p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-gold" />
            <span className="text-green-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-white/60 text-sm">{t('Total Revenue')}</p>
          <p className="text-3xl font-heading font-bold text-white">
            EGP {(totalRevenue / 1000).toFixed(1)}K
          </p>
        </div>

        <div className="card-luxury p-6">
          <div className="flex items-center justify-between mb-4">
            <Box className="w-8 h-8 text-gold" />
          </div>
          <p className="text-white/60 text-sm">{t('Products')}</p>
          <p className="text-3xl font-heading font-bold text-white">{totalProducts}</p>
        </div>

        <div className="card-luxury p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className={`w-8 h-8 ${lowStockCount > 0 ? 'text-red-400' : 'text-gold'}`} />
          </div>
          <p className="text-white/60 text-sm">{t('Low Stock Alert')}</p>
          <p className={`text-3xl font-heading font-bold ${lowStockCount > 0 ? 'text-red-400' : 'text-white'}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-luxury p-6">
          <h3 className="font-heading font-bold text-lg text-white mb-4">
            {t('Pending Orders')} ({pendingOrders})
          </h3>
          <div className="space-y-3">
            {pendingOrders > 0 ? (
              <p className="text-white/60">{t('Pending Orders')}: {pendingOrders}</p>
            ) : (
              <p className="text-white/60">{t('No pending orders')}</p>
            )}
          </div>
        </div>

        <div className="card-luxury p-6">
          <h3 className="font-heading font-bold text-lg text-white mb-4">
            {t('Low Stock Products')}
          </h3>
          <div className="space-y-3 max-h-60 overflow-auto">
            {lowStockCount > 0 ? (
              <p className="text-white/60">{lowStockCount} {t('Products')}</p>
            ) : (
              <p className="text-white/60">{t('All products are well stocked')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const { state, dispatch } = useApp();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const filteredProducts = state.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (productId: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذا العطر؟' : 'Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      toast.success(t('Product deleted'));
    }
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      toast.success(t('Product updated'));
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      toast.success(t('Product added'));
    }
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-12"
            placeholder={t('Search products...')}
          />
        </div>
        <Button onClick={() => setIsAddingProduct(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('Add Product')}
        </Button>
      </div>

      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">{t('Product')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Category')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Price')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Stock')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Status')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p data-no-translate="true" className="text-white font-medium">{product.name}</p>
                        <p className="text-white/40 text-sm">{translateType(product.type, language)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 capitalize">{translateCategory(product.category, language)}</td>
                  <td className="p-4 text-gold">EGP {product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`${product.stock <= 5 ? 'text-red-400' : 'text-white/60'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.stock === 0 ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">{t('Out of Stock')}</span>
                    ) : product.stock <= 5 ? (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">{t('Low Stock')}</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">{t('In Stock')}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editingProduct || isAddingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ 
  product, 
  onSave, 
  onClose 
}: { 
  product: Product | null; 
  onSave: (product: Product) => void; 
  onClose: () => void;
}) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      id: `product-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      category: 'men',
      type: 'woody',
      images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'],
      rating: 5,
      reviewCount: 0,
      stock: 10,
      sizes: [{ size: '100ml', price: 0, stock: 10 }],
      notes: { top: [], middle: [], base: [] },
      createdAt: new Date().toISOString()
    }
  );
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || '');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setImageUrl(result);
      setFormData(prev => ({ ...prev, images: [result] }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = imageUrl?.trim() || formData.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80';
    const normalizedProduct: Product = {
      id: formData.id || `product-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      price: Number(formData.price || 0),
      category: (formData.category as Product['category']) || 'men',
      type: (formData.type as Product['type']) || 'woody',
      images: [finalImage],
      rating: Number(formData.rating || 5),
      reviewCount: Number(formData.reviewCount || 0),
      stock: Number(formData.stock || 0),
      sizes: formData.sizes?.length ? formData.sizes.map(size => ({
        size: size.size,
        price: Number(size.price),
        stock: Number(size.stock),
      })) : [{ size: `${String((formData as any).volumeMl || 100)}ml`, price: Number(formData.price || 0), stock: Number(formData.stock || 0) }],
      notes: formData.notes || { top: [], middle: [], base: [] },
      isNew: formData.isNew,
      isBestseller: formData.isBestseller,
      createdAt: formData.createdAt || new Date().toISOString(),
    };
    onSave(normalizedProduct);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-cheetah-dark border-white/10 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-white font-heading">
            {product ? t('Edit Product') : t('Add Product')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">{t('Name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-luxury w-full"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">{t('Description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-luxury w-full h-24"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">{t('Image')}</label>
            <div className="space-y-3">
              {imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2">
                  <img
                    src={imageUrl}
                    alt={t('Selected image preview')}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input-luxury w-full file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-gold file:text-cheetah-black"
              />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setFormData({ ...formData, images: [e.target.value] });
                }}
                placeholder={t('Or paste an image URL')}
                className="input-luxury w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">{t('Category')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="input-luxury w-full"
              >
                <option value="men">{language === 'ar' ? 'رجالي' : 'Men'}</option>
                <option value="women">{language === 'ar' ? 'نسائي' : 'Women'}</option>
                <option value="unisex">{language === 'ar' ? 'للجنسين' : 'Unisex'}</option>
                <option value="luxury">{language === 'ar' ? 'فاخر' : 'Luxury'}</option>
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">{t('Type')}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="input-luxury w-full"
              >
                <option value="woody">{language === 'ar' ? 'خشبي' : 'Woody'}</option>
                <option value="floral">{language === 'ar' ? 'زهري' : 'Floral'}</option>
                <option value="amber">{language === 'ar' ? 'عنبر' : 'Amber'}</option>
                <option value="citrus">{language === 'ar' ? 'حمضي' : 'Citrus'}</option>
                <option value="oriental">{language === 'ar' ? 'شرقي' : 'Oriental'}</option>
                <option value="fresh">{language === 'ar' ? 'منعش' : 'Fresh'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">{t('Base Price')}</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value), sizes: [{ size: `${String((formData as any).volumeMl || 100)}ml`, price: Number(e.target.value), stock: Number(formData.stock || 0) }] })}
                className="input-luxury w-full"
                required
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">{t('Stock')}</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value), sizes: [{ size: `${String((formData as any).volumeMl || 100)}ml`, price: Number(formData.price || 0), stock: Number(e.target.value) }] })}
                className="input-luxury w-full"
                required
              />
            </div>
          </div>


          <div>
            <label className="block text-white/60 text-sm mb-2">{t('Bottle Size (ml)')}</label>
            <input
              type="number"
              min="1"
              value={Number(String(formData.sizes?.[0]?.size || '100').replace(/[^0-9]/g, '') || 100)}
              onChange={(e) => {
                const mlValue = Number(e.target.value || 0);
                setFormData({
                  ...formData,
                  sizes: [{ size: `${mlValue}ml`, price: Number(formData.price || 0), stock: Number(formData.stock || 0) }]
                });
              }}
              className="input-luxury w-full"
              required
            />
            <p className="text-white/40 text-xs mt-2">{t('This is the bottle size shown to customers')}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              {t('Cancel')}
            </Button>
            <Button type="submit" className="flex-1 btn-primary">
              {product ? t('Update Product') : t('Add Product')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OrdersTab() {
  const { state, dispatch } = useApp();
  const { t, language } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' 
    ? state.orders 
    : state.orders.filter(o => o.status === filterStatus);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    toast.success(language === 'ar' ? `تم تحديث حالة الطلب إلى ${translateOrderStatus(status, language)}` : `Order status updated to ${status}`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'confirmed': return 'text-blue-500 bg-blue-500/10';
      case 'processing': return 'text-purple-500 bg-purple-500/10';
      case 'shipped': return 'text-indigo-500 bg-indigo-500/10';
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Filter className="w-5 h-5 text-white/40" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-luxury"
        >
          <option value="all">{t('All Orders')}</option>
          <option value="pending">{translateOrderStatus('pending', language)}</option>
          <option value="confirmed">{translateOrderStatus('confirmed', language)}</option>
          <option value="processing">{translateOrderStatus('processing', language)}</option>
          <option value="shipped">{translateOrderStatus('shipped', language)}</option>
          <option value="delivered">{translateOrderStatus('delivered', language)}</option>
          <option value="cancelled">{translateOrderStatus('cancelled', language)}</option>
        </select>
      </div>

      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">Order ID</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Customer')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Items')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Total')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Status')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-mono text-sm">{order.id}</td>
                  <td className="p-4 text-white/60">{order.userId}</td>
                  <td className="p-4 text-white/60">{order.items.length}</td>
                  <td className="p-4 text-gold">EGP {order.total.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {translateOrderStatus(order.status, language)}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="input-luxury text-sm py-1"
                    >
                      <option value="pending">{translateOrderStatus('pending', language)}</option>
                      <option value="confirmed">{translateOrderStatus('confirmed', language)}</option>
                      <option value="processing">{translateOrderStatus('processing', language)}</option>
                      <option value="shipped">{translateOrderStatus('shipped', language)}</option>
                      <option value="delivered">{translateOrderStatus('delivered', language)}</option>
                      <option value="cancelled">{translateOrderStatus('cancelled', language)}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const { t, language } = useLanguage();
  const users = JSON.parse(localStorage.getItem('cheetah-users') || '[]');

  return (
    <div className="space-y-6">
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">{t('Name')}</th>
                <th className="text-left p-4 text-white/60 font-medium">Email</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Phone')}</th>
                <th className="text-left p-4 text-white/60 font-medium">{t('Joined')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gold" />
                      </div>
                      <span className="text-white">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60">{user.email}</td>
                  <td className="p-4 text-white/60">{user.phone || '-'}</td>
                  <td className="p-4 text-white/60">
                    {formatDate(user.createdAt, language)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
