import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Check, Clock, X, ChevronRight, MapPin } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/types';
import { useLanguage, translateOrderStatus, formatDate, translateDeliveryType, translatePaymentMethod } from '@/i18n';

export function OrdersPage() {
  const { state } = useApp();
  const { t, language } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-white/40" />;
    }
  };

  const getStatusText = (status: Order['status']) => translateOrderStatus(status, language);
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'confirmed':
      case 'processing':
        return 'text-blue-500 bg-blue-500/10';
      case 'shipped':
        return 'text-purple-500 bg-purple-500/10';
      case 'delivered':
        return 'text-green-500 bg-green-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-white/40 bg-white/5';
    }
  };

  const orders = state.userOrders.length > 0 ? state.userOrders : state.orders.filter(o => o.userId === state.user?.id);

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <p className="micro-label mb-2">{t('ACCOUNT')}</p>
          <h1 className="heading-section text-white">
            {t('MY')} <span className="text-gradient-gold">{t('ORDERS')}</span>
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold text-white mb-2">
              {t('No orders yet')}
            </h2>
            <p className="text-white/60 mb-6">
              {t('Start shopping to see your orders here')}
            </p>
            <Link to="/shop">
              <Button className="btn-primary">
                {t('Start Shopping')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="card-luxury p-6 cursor-pointer hover:border-gold/30 transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-white font-mono">{order.id}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">
                      {formatDate(order.createdAt, language)}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white/60 text-sm">{order.items.length} {language === 'ar' ? 'منتج' : 'items'}</p>
                      <p className="text-gold font-bold">EGP {order.total.toLocaleString()}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div key={index} className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-white/40 text-xs">
                      {item.size}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-white/40 text-xs">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-cheetah-dark border-white/10 max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-white font-heading">
              {t('Order Details')}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-white/60 text-sm">{t('Order Number')}</p>
                  <p className="text-white font-mono">{selectedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">{t('Status')}</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">{t('Items')}</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p data-no-translate="true" className="text-white">{item.name}</p>
                        <p className="text-white/60 text-sm">{item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-gold">EGP {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-4 border-b border-white/10">
                <h3 className="text-white font-medium mb-3">{language === 'ar' ? 'التوصيل' : 'Delivery'}</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-white">{translateDeliveryType(selectedOrder.deliveryType, language)}</p>
                    {selectedOrder.address && (
                      <p className="text-white/60 text-sm">
                        {selectedOrder.address.building}, {selectedOrder.address.street},<br />
                        {selectedOrder.address.area}, {selectedOrder.address.city}<br />
                        {t('Phone')}: {selectedOrder.address.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pb-4 border-b border-white/10">
                <h3 className="text-white font-medium mb-3">{t('Payment Method')}</h3>
                <p className="text-white/60">{translatePaymentMethod(selectedOrder.paymentMethod, language)}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-white font-bold text-lg">{t('Total')}</p>
                <p className="text-gold font-bold text-xl">EGP {selectedOrder.total.toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
