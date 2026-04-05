import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useApp } from '@/store';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage, translateCategory, translateType } from '@/i18n';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.size || '');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    const success = addToCart(product, selectedSize, 1);

    if (success) {
      toast.success(`${product.name} ${language === 'ar' ? 'تمت إضافته إلى السلة' : 'added to cart'}`);
    } else {
      toast.error(t('Unable to add to cart. Item may be out of stock.'));
    }

    setTimeout(() => setIsAdding(false), 500);
  };

  const sizeData = product.sizes.find(s => s.size === selectedSize);
  const currentPrice = sizeData?.price || product.price;
  const stock = sizeData?.stock || 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="group card-luxury overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-burnt-orange text-white text-xs font-semibold rounded">
              {t('NEW')}
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-1 bg-gold text-cheetah-black text-xs font-semibold rounded">
              {t('BESTSELLER')}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
              {t('OUT OF STOCK')}
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-medium">{t('View Details')}</span>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 data-no-translate="true" className="font-heading font-bold text-white text-lg mb-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-white/60 text-sm mb-2 capitalize">
          {translateType(product.type, language)} • {translateCategory(product.category, language)}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="text-white text-sm font-medium">{product.rating}</span>
          <span className="text-white/40 text-sm">({product.reviewCount})</span>
        </div>

        <div className="flex gap-2 mb-3">
          {product.sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => setSelectedSize(size.size)}
              disabled={size.stock === 0}
              className={`px-2 py-1 text-xs rounded border transition-all ${
                selectedSize === size.size
                  ? 'border-gold bg-gold/20 text-gold'
                  : size.stock === 0
                  ? 'border-white/10 text-white/30 cursor-not-allowed'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              {size.size}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-gold font-bold text-lg">EGP {currentPrice.toLocaleString()}</p>
            {!isOutOfStock && (
              <p className="text-white/40 text-xs">
                {language === 'ar' ? `متوفر ${stock} قطعة` : `${stock} in stock`}
              </p>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="btn-primary min-w-[120px]"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t('Added')}
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t('Add to Cart')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
