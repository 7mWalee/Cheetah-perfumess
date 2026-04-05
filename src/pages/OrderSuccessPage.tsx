import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check, Package, Truck, Clock, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';
import { useLanguage, formatDate } from '@/i18n';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;
  const { t, language } = useLanguage();
  
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);
  
  if (!order) return null;
  
  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="font-heading font-black text-4xl text-white mb-4">
          {t('ORDER CONFIRMED!')}
        </h1>
        <p className="text-white/60 text-lg mb-8">
          {t('Thank you for your purchase. Your order has been placed successfully.')}
        </p>
        
        {/* Order Details */}
        <div className="card-luxury p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
              <p className="text-white/60 text-sm">{t('Order Number')}</p>
              <p className="text-white font-mono text-lg">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">{t('Order Date')}</p>
              <p className="text-white">{formatDate(order.createdAt, language)}</p>
            </div>
          </div>
          
          {/* Items */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-white/60 text-sm">{item.size} × {item.quantity}</p>
                </div>
                <p className="text-gold">EGP {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          {/* {t('Total')} */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-white font-bold text-lg">{t('Total')}</p>
              <p className="text-gold font-bold text-xl">EGP {order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card-luxury p-4">
            <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-white font-medium">{t('Order Placed')}</p>
            <p className="text-white/60 text-sm">{t('Confirmed')}</p>
          </div>
          <div className="card-luxury p-4">
            <Package className="w-6 h-6 text-white/40 mx-auto mb-2" />
            <p className="text-white/60 font-medium">{t('Processing')}</p>
            <p className="text-white/40 text-sm">{t('In queue')}</p>
          </div>
          <div className="card-luxury p-4">
            <Truck className="w-6 h-6 text-white/40 mx-auto mb-2" />
            <p className="text-white/60 font-medium">{t('Delivery')}</p>
            <p className="text-white/40 text-sm">{t('Pending')}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button className="btn-primary flex items-center gap-2">
              {t('View My Orders')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('Back to Home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
