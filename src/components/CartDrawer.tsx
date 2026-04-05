import { Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';

export function CartDrawer() {
  const { state, dispatch, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useApp();
  const { t, language } = useLanguage();

  const handleRemove = (productId: string, size: string, name: string) => {
    removeFromCart(productId, size);
    toast.success(language === 'ar' ? `تم حذف ${name} من السلة` : `${name} removed from cart`);
  };

  const handleUpdateQuantity = (productId: string, size: string, newQuantity: number, stock: number) => {
    if (newQuantity > stock) {
      toast.error(language === 'ar' ? `المتوفر فقط ${stock} قطعة` : `Only ${stock} items available`);
      return;
    }
    updateCartQuantity(productId, size, newQuantity);
  };

  const total = getCartTotal();

  const handleCheckoutClick = () => {
    if (!state.isAuthenticated) {
      dispatch({ type: 'SET_CART_OPEN', payload: false });
      navigate('/login');
      return;
    }
    dispatch({ type: 'SET_CART_OPEN', payload: false });
    navigate('/checkout');
  };
  const itemCount = state.cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <Sheet open={state.isCartOpen} onOpenChange={(open) => dispatch({ type: 'SET_CART_OPEN', payload: open })}>
      <SheetContent className="w-full sm:max-w-lg bg-cheetah-dark border-l border-white/10 flex flex-col">
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="flex items-center gap-2 text-white font-heading">
            <ShoppingBag className="w-5 h-5 text-gold" />
            {t('Your Cart')} ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {state.cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              {t('Your cart is empty')}
            </h3>
            <p className="text-white/60 mb-6">
              {t('Discover our collection of luxury fragrances')}
            </p>
            <Link to="/shop" onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}>
              <Button className="btn-primary">
                {t('Start Shopping')}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {state.cart.map((item) => {
                const sizeData = item.product.sizes.find(s => s.size === item.size);
                const price = sizeData?.price || item.product.price;
                const maxStock = sizeData?.stock || 0;

                return (
                  <div 
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 data-no-translate="true" className="font-semibold text-white text-sm">
                            {item.product.name}
                          </h4>
                          <p className="text-white/60 text-xs">
                            {t('Size')}: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product.id, item.size, item.product.name)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity - 1, maxStock)}
                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.size, item.quantity + 1, maxStock)}
                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <p className="text-gold font-medium">
                          EGP {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">{t('Total')}</span>
                <span className="text-gold font-bold text-xl">EGP {total.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {language === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
                </Button>
                <Link to="/checkout" onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}>
                  <Button className="btn-primary w-full">
                    {language === 'ar' ? 'إتمام الشراء' : 'Checkout'}
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
