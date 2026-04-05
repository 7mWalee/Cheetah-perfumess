import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, Smartphone, Building, ArrowLeft, Copy, Wallet } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Address } from '@/types';
import { useLanguage } from '@/i18n';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { state, getCartTotal, addOrder, clearCart } = useApp();
  const { language } = useLanguage();
  
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'cod'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [instaPayCode, setInstaPayCode] = useState('');
  const [showInstaPayModal, setShowInstaPayModal] = useState(false);
  
  const [address, setAddress] = useState<Partial<Address>>({
    city: '',
    area: '',
    street: '',
    building: '',
    apartment: '',
    phone: state.user?.phone || ''
  });
  
  
  const cartTotal = getCartTotal();
  const shipping = deliveryType === 'delivery' ? 50 : 0;
  const total = cartTotal + shipping;
  
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const generateInstaPayCode = () => {
    return 'INS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (deliveryType === 'delivery') {
      if (!address.city || !address.area || !address.street || !address.building || !address.phone) {
        toast.error('Please fill in all address fields');
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (paymentMethod === 'instapay') {
      const code = generateInstaPayCode();
      setInstaPayCode(code);
      setShowInstaPayModal(true);
      setIsProcessing(false);
      return;
    }
    
    // Create order
    const orderItems = state.cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.sizes.find(s => s.size === item.size)?.price || item.product.price,
      quantity: item.quantity,
      size: item.size
    }));
    
    const fullAddress: Address | undefined = deliveryType === 'delivery' ? {
      id: `addr-${Date.now()}`,
      type: 'delivery',
      city: address.city!,
      area: address.area!,
      street: address.street!,
      building: address.building!,
      apartment: address.apartment,
      phone: address.phone!,
      isDefault: true
    } : undefined;
    
    const order = await addOrder({
      items: orderItems,
      total: total,
      deliveryType,
      address: fullAddress,
      paymentMethod
    });
    
    if (order) {
      clearCart();
      navigate('/order-success', { state: { order } });
    } else {
      toast.error('Failed to place order');
    }
    
    setIsProcessing(false);
  };
  
  const handleInstaPayComplete = async () => {
    setShowInstaPayModal(false);
    
    const orderItems = state.cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.sizes.find(s => s.size === item.size)?.price || item.product.price,
      quantity: item.quantity,
      size: item.size
    }));
    
    const fullAddress: Address | undefined = deliveryType === 'delivery' ? {
      id: `addr-${Date.now()}`,
      type: 'delivery',
      city: address.city!,
      area: address.area!,
      street: address.street!,
      building: address.building!,
      apartment: address.apartment,
      phone: address.phone!,
      isDefault: true
    } : undefined;
    
    const order = await addOrder({
      items: orderItems,
      total: total,
      deliveryType,
      address: fullAddress,
      paymentMethod: 'instapay'
    });
    
    if (order) {
      clearCart();
      navigate('/order-success', { state: { order } });
    }
  };
  
  const copyInstaPayCode = () => {
    navigator.clipboard.writeText(`InstaPay Number: 01119929540\nReference: ${instaPayCode}`);
    toast.success('Code copied to clipboard');
  };
  
  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-cheetah-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            Your cart is empty
          </h1>
          <Button onClick={() => navigate('/shop')} className="btn-primary">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
        
        <h1 className="heading-section text-white mb-8">
          CHECK<span className="text-gradient-gold">OUT</span>
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Type */}
            <div className="card-luxury p-6">
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                Delivery Options
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <Truck className={`w-6 h-6 mb-2 ${deliveryType === 'delivery' ? 'text-gold' : 'text-white/60'}`} />
                  <p className="font-medium text-white">Home Delivery</p>
                  <p className="text-white/60 text-sm">EGP 50 • 2-4 business days</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <Building className={`w-6 h-6 mb-2 ${deliveryType === 'pickup' ? 'text-gold' : 'text-white/60'}`} />
                  <p className="font-medium text-white">Store Pickup</p>
                  <p className="text-white/60 text-sm">Free • Same day available</p>
                </button>
              </div>
            </div>
            
            {/* Address Form */}
            {deliveryType === 'delivery' && (
              <div className="card-luxury p-6">
                <h2 className="font-heading font-bold text-xl text-white mb-4">
                  Delivery Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="Cairo"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Area</label>
                    <input
                      type="text"
                      value={address.area}
                      onChange={(e) => handleAddressChange('area', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="Nasr City"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-white/60 text-sm mb-2">Street</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="Street name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Building</label>
                    <input
                      type="text"
                      value={address.building}
                      onChange={(e) => handleAddressChange('building', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="Building number"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Apartment (Optional)</label>
                    <input
                      type="text"
                      value={address.apartment}
                      onChange={(e) => handleAddressChange('apartment', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="Apt 5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-white/60 text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="input-luxury w-full"
                      placeholder="+20 11 1992 9540"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Method */}
            <div className="card-luxury p-6">
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 ${paymentMethod === 'instapay' ? 'text-gold' : 'text-white/60'}`} />
                  <div className="text-left">
                    <p className="font-medium text-white">{language === 'ar' ? 'إنستاباي' : 'InstaPay'}</p>
                    <p className="text-white/60 text-sm">{language === 'ar' ? 'حوّل المبلغ إلى رقم إنستاباي 01119929540' : 'Send your payment to InstaPay number 01119929540'}</p>
                  </div>
                </button>
<button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <MapPin className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-gold' : 'text-white/60'}`} />
                  <div className="text-left">
                    <p className="font-medium text-white">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
                    <p className="text-white/60 text-sm">{language === 'ar' ? 'ادفع عند الاستلام' : 'Pay when you receive'}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'} */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-6 sticky top-24">
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-auto">
                {state.cart.map((item) => {
                  const sizePrice = item.product.sizes.find(s => s.size === item.size)?.price || item.product.price;
                  return (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.product.name}</p>
                        <p className="text-white/60 text-xs">{item.size} × {item.quantity}</p>
                        <p className="text-gold text-sm">EGP {(sizePrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-white/60">
                  <span>{language === 'ar' ? 'الإجمالي الفرعي' : 'Subtotal'}</span>
                  <span>EGP {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span>{shipping === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `EGP ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-gold">EGP {total.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full btn-primary py-6 mt-6"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {language === 'ar' ? 'جارٍ المعالجة...' : 'Processing...'}
                  </span>
                ) : (
                  `${language === 'ar' ? 'تأكيد الطلب' : 'Place Order'} • EGP ${total.toLocaleString()}`
                )}
              </Button>
              
              <p className="text-white/40 text-xs text-center mt-4">
                {language === 'ar' ? 'بإتمام هذا الطلب فأنت توافق على الشروط والأحكام' : 'By placing this order, you agree to our Terms of Service'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* InstaPay Modal */}
      {showInstaPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-cheetah-dark border border-white/10 rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-white mb-2">
                {language === 'ar' ? 'دفع إنستاباي' : 'InstaPay Payment'}
              </h2>
              <p className="text-white/60 mb-6">
                {language === 'ar' ? 'حوّل المبلغ إلى رقم إنستاباي 01119929540 ثم احتفظ بالكود المرجعي لطلبك' : 'Send your payment to InstaPay number 01119929540, then keep this reference code for your order'}
              </p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-white/60 text-sm mb-2">{language === 'ar' ? 'الكود المرجعي' : 'Reference Code'}</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl font-mono text-gold">{instaPayCode}</code>
                  <button
                    onClick={copyInstaPayCode}
                    className="p-2 text-white/60 hover:text-white"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-left bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-white font-medium mb-2">{language === 'ar' ? 'طريقة الدفع:' : 'How to pay:'}</p>
                <ol className="text-white/60 text-sm space-y-1 list-decimal list-inside">
                  <li>{language === 'ar' ? 'افتح تطبيق إنستاباي وحوّل المبلغ إلى 01119929540' : 'Open your InstaPay app and send the payment to 01119929540'}</li>
                  <li>{language === 'ar' ? 'احتفظ بالكود المرجعي' : 'Provide the reference code'}</li>
                  <li>{language === 'ar' ? `ادفع EGP ${total.toLocaleString()}` : `Pay EGP ${total.toLocaleString()}`}</li>
                  <li>{language === 'ar' ? 'سيتم تأكيد طلبك بعد المراجعة' : 'Your order will be confirmed'}</li>
                </ol>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowInstaPayModal(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInstaPayComplete}
                  className="flex-1 btn-primary"
                >
                  I've Paid
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
