import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Check,
  ChevronLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage, translateCategory, translateType } from '@/i18n';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { state, addToCart } = useApp();
  const { language } = useLanguage();

  const product = useMemo(
    () => state.products.find((item) => item.id === (id || '')),
    [state.products, id]
  );

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-cheetah-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            {language === 'ar' ? 'العطر غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/shop" className="text-gold hover:underline">
            {language === 'ar' ? 'العودة إلى المتجر' : 'Back to Shop'}
          </Link>
        </div>
      </div>
    );
  }

  const selectedSize = product.sizes[0]?.size || '';
  const currentPrice = product.sizes[0]?.price || product.price;
  const stock = product.sizes[0]?.stock ?? product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 3;

  const relatedProducts = state.products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    setIsAdding(true);
    const success = addToCart(product, selectedSize, quantity);

    if (success) {
      toast.success(
        language === 'ar' ? 'تمت إضافة المنتج إلى السلة' : `${product.name} added to cart`
      );
    } else {
      toast.error(
        language === 'ar'
          ? 'تعذر إضافة المنتج إلى السلة'
          : 'Unable to add to cart. Item may be out of stock.'
      );
    }

    setTimeout(() => setIsAdding(false), 500);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20 premium-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
          <Link to="/" className="hover:text-gold transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link to="/shop" className="hover:text-gold transition-colors">
            {language === 'ar' ? 'المتجر' : 'Shop'}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link
            to={`/shop/${product.category}`}
            className="hover:text-gold transition-colors capitalize"
          >
            {translateCategory(product.category, language)}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span data-no-translate="true" className="text-white">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <img
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-gold' : 'border-white/10'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-burnt-orange text-white text-sm font-semibold rounded">
                  {language === 'ar' ? 'جديد' : 'NEW'}
                </span>
              )}
              {product.isBestseller && (
                <span className="px-3 py-1 bg-gold text-cheetah-black text-sm font-semibold rounded">
                  {language === 'ar' ? 'الأكثر مبيعًا' : 'BESTSELLER'}
                </span>
              )}
            </div>

            <div>
              <h1 data-no-translate="true" className="font-heading font-black text-4xl text-white mb-2">
                {product.name}
              </h1>
              <p className="text-white/60 capitalize">
                {translateType(product.type, language)} • {translateCategory(product.category, language)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-medium">{product.rating}</span>
              <span className="text-white/40">
                ({product.reviewCount} {language === 'ar' ? 'مراجعة' : 'reviews'})
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gold">
                EGP {currentPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-white/40 line-through">
                  EGP {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-white/70 leading-relaxed">{product.description}</p>

            <div>
              <label className="block text-white font-medium mb-3">
                {language === 'ar' ? 'حجم الزجاجة' : 'Bottle Size'}
              </label>
              <div className="inline-flex rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 text-gold font-medium">
                {selectedSize}
              </div>
              {isLowStock && (
                <p className="text-burnt-orange text-sm mt-2">
                  {language === 'ar' ? `متبقي ${stock} فقط` : `Only ${stock} left in stock`}
                </p>
              )}
              {isOutOfStock && (
                <p className="text-red-400 text-sm mt-2">
                  {language === 'ar' ? 'نفد من المخزون' : 'Out of stock'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                {language === 'ar' ? 'الكمية' : 'Quantity'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-medium text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`flex-1 py-6 text-lg font-semibold ${
                  isOutOfStock ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'btn-primary'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'تمت الإضافة' : 'Added'}
                  </>
                ) : isOutOfStock ? (
                  language === 'ar' ? 'نفد من المخزون' : 'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="px-4 border-white/20 text-white hover:bg-white/10"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="px-4 border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {language === 'ar' ? 'أصلي' : 'Authentic'}
                </p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {language === 'ar' ? 'إرجاع سهل' : 'Easy Returns'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="heading-section text-white mb-8">
            {language === 'ar' ? 'مكونات' : 'FRAGRANCE'}{' '}
            <span className="text-gradient-gold">
              {language === 'ar' ? 'العطر' : 'NOTES'}
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-luxury p-6">
              <h3 className="font-heading font-bold text-xl text-gold mb-4">
                {language === 'ar' ? 'المقدمة' : 'Top Notes'}
              </h3>
              <p className="text-white/70">{product.notes.top.join(', ') || '-'}</p>
            </div>
            <div className="card-luxury p-6">
              <h3 className="font-heading font-bold text-xl text-gold mb-4">
                {language === 'ar' ? 'القلب' : 'Middle Notes'}
              </h3>
              <p className="text-white/70">{product.notes.middle.join(', ') || '-'}</p>
            </div>
            <div className="card-luxury p-6">
              <h3 className="font-heading font-bold text-xl text-gold mb-4">
                {language === 'ar' ? 'القاعدة' : 'Base Notes'}
              </h3>
              <p className="text-white/70">{product.notes.base.join(', ') || '-'}</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="heading-section text-white mb-8">
              {language === 'ar' ? 'قد يعجبك' : 'YOU MAY ALSO'}{' '}
              <span className="text-gradient-gold">
                {language === 'ar' ? 'أيضًا' : 'LIKE'}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
