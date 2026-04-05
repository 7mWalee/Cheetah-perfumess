import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const { state } = useApp();
  const products = state.products;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Category filter
    if (category) {
      result = result.filter(p => p.category === category);
    }
    
    // Search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }
    
    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type));
    }
    
    // Price filter
    result = result.filter(p => {
      const minPrice = Math.min(...p.sizes.map(s => s.price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return result;
  }, [category, state.searchQuery, selectedTypes, priceRange, sortBy]);
  
  const fragranceTypes = [
    { value: 'woody', label: 'Woody' },
    { value: 'floral', label: 'Floral' },
    { value: 'amber', label: 'Amber' },
    { value: 'citrus', label: 'Citrus' },
    { value: 'oriental', label: 'Oriental' },
    { value: 'fresh', label: 'Fresh' },
  ];
  
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setPriceRange([0, 15000]);
  };
  
  const hasActiveFilters = selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 15000;
  
  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Fragrances';
  
  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20 premium-mesh">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 premium-panel p-6 md:p-8">
          <p className="micro-label mb-2">SHOP</p>
          <h1 className="heading-section text-white mb-4">
            {state.searchQuery ? (
              <>SEARCH: <span className="text-gradient-gold">"{state.searchQuery}"</span></>
            ) : (
              <>{categoryTitle} <span className="text-gradient-gold">COLLECTION</span></>
            )}
          </h1>
          <p className="text-white/60">
            {filteredProducts.length} products found
          </p>
        </div>
        
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 premium-panel">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden border-white/20 text-white hover:bg-white/10">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-cheetah-dark border-r border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-white">Filters</SheetTitle>
                </SheetHeader>
                <FilterContent 
                  fragranceTypes={fragranceTypes}
                  selectedTypes={selectedTypes}
                  toggleType={toggleType}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                />
              </SheetContent>
            </Sheet>
            
            {/* Desktop Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex border-white/20 text-white hover:bg-white/10"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-5 h-5 bg-burnt-orange rounded-full text-xs flex items-center justify-center">
                  {selectedTypes.length + (priceRange[0] > 0 || priceRange[1] < 15000 ? 1 : 0)}
                </span>
              )}
            </Button>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-cheetah-dark border-white/10">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {selectedTypes.map(type => (
              <span 
                key={type}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 text-gold text-sm rounded-full"
              >
                {fragranceTypes.find(t => t.value === type)?.label}
                <button onClick={() => toggleType(type)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 15000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 text-gold text-sm rounded-full">
                EGP {priceRange[0].toLocaleString()} - EGP {priceRange[1].toLocaleString()}
                <button onClick={() => setPriceRange([0, 15000])}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-white/60 hover:text-white text-sm underline"
            >
              Clear all
            </button>
          </div>
        )}
        
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          {showFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterContent 
                  fragranceTypes={fragranceTypes}
                  selectedTypes={selectedTypes}
                  toggleType={toggleType}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  clearFilters={clearFilters}
                />
              </div>
            </aside>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">No products found</p>
                <button 
                  onClick={clearFilters}
                  className="text-gold hover:underline mt-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterContent({ 
  fragranceTypes, 
  selectedTypes, 
  toggleType, 
  priceRange, 
  setPriceRange,
  clearFilters 
}: {
  fragranceTypes: { value: string; label: string }[];
  selectedTypes: string[];
  toggleType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  clearFilters: () => void;
}) {
  return (
    <div className="space-y-8 py-4">
      {/* Fragrance Type */}
      <div>
        <h4 className="font-semibold text-white mb-4">Fragrance Type</h4>
        <div className="space-y-3">
          {fragranceTypes.map((type) => (
            <label 
              key={type.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => toggleType(type.value)}
                className="border-white/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <span className="text-white/80">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-white mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={15000}
          step={100}
          className="mb-4"
        />
        <div className="flex justify-between text-white/60 text-sm">
          <span>EGP {priceRange[0].toLocaleString()}</span>
          <span>EGP {priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      
      <Button 
        onClick={clearFilters}
        variant="outline"
        className="w-full border-white/20 text-white hover:bg-white/10"
      >
        Clear Filters
      </Button>
    </div>
  );
}
