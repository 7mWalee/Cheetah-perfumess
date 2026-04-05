import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Predator Noir',
    description: 'A bold and mysterious fragrance that commands attention. Dark woods blend with smoky incense and leather notes, creating an aura of power and sophistication. Perfect for evening occasions and making a lasting impression.',
    price: 2850,
    originalPrice: 3200,
    category: 'men',
    type: 'woody',
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    sizes: [
      { size: '50ml', price: 2850, stock: 8 },
      { size: '100ml', price: 4200, stock: 5 },
      { size: '150ml', price: 5500, stock: 2 }
    ],
    notes: {
      top: ['Bergamot', 'Black Pepper', 'Saffron'],
      middle: ['Oud', 'Cedarwood', 'Patchouli'],
      base: ['Leather', 'Amber', 'Musk', 'Vanilla']
    },
    isBestseller: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Velvet Huntress',
    description: 'An elegant and sensual fragrance that embodies feminine power. Rich florals dance with warm amber and musk, creating a captivating scent that lingers beautifully on the skin.',
    price: 2650,
    category: 'women',
    type: 'floral',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'],
    rating: 4.9,
    reviewCount: 186,
    stock: 23,
    sizes: [
      { size: '50ml', price: 2650, stock: 12 },
      { size: '100ml', price: 3800, stock: 8 },
      { size: '150ml', price: 4900, stock: 3 }
    ],
    notes: {
      top: ['Rose', 'Jasmine', 'Bergamot'],
      middle: ['Iris', 'Orange Blossom', 'Ylang-Ylang'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Vanilla']
    },
    isNew: true,
    createdAt: '2024-03-01'
  },
  {
    id: '3',
    name: 'Savannah Gold',
    description: 'A unisex treasure that captures the golden warmth of the savannah. Bright citrus opens to a heart of exotic spices, settling into a base of precious woods and amber.',
    price: 3100,
    category: 'unisex',
    type: 'amber',
    images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80'],
    rating: 4.7,
    reviewCount: 89,
    stock: 8,
    sizes: [
      { size: '50ml', price: 3100, stock: 4 },
      { size: '100ml', price: 4500, stock: 3 },
      { size: '150ml', price: 5800, stock: 1 }
    ],
    notes: {
      top: ['Bergamot', 'Mandarin', 'Pink Pepper'],
      middle: ['Cardamom', 'Cinnamon', 'Nutmeg'],
      base: ['Amber', 'Sandalwood', 'Tonka Bean', 'Musk']
    },
    isBestseller: true,
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Midnight Sprint',
    description: 'Fresh and energetic, this fragrance captures the thrill of the chase. Citrus and aquatic notes combine with aromatic herbs for a scent that keeps up with your pace.',
    price: 2200,
    category: 'men',
    type: 'citrus',
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80'],
    rating: 4.6,
    reviewCount: 156,
    stock: 32,
    sizes: [
      { size: '50ml', price: 2200, stock: 15 },
      { size: '100ml', price: 3200, stock: 12 },
      { size: '150ml', price: 4200, stock: 5 }
    ],
    notes: {
      top: ['Lemon', 'Grapefruit', 'Mint'],
      middle: ['Lavender', 'Rosemary', 'Marine Notes'],
      base: ['Cedarwood', 'Ambergris', 'Musk']
    },
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'Golden Mane',
    description: 'The pinnacle of luxury. This exclusive fragrance features rare ingredients sourced from around the world, creating a truly unique olfactory experience.',
    price: 8500,
    category: 'luxury',
    type: 'oriental',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80'],
    rating: 5.0,
    reviewCount: 42,
    stock: 5,
    sizes: [
      { size: '50ml', price: 8500, stock: 3 },
      { size: '100ml', price: 12000, stock: 2 }
    ],
    notes: {
      top: ['Saffron', 'Truffle', 'Ylang-Ylang'],
      middle: ['Rose', 'Jasmine', 'Orris'],
      base: ['Oud', 'Amber', 'Musk', 'Vanilla', 'Sandalwood']
    },
    isNew: true,
    createdAt: '2024-03-15'
  },
  {
    id: '6',
    name: 'Desert Mirage',
    description: 'A fresh and airy fragrance inspired by the cool desert night. Crisp notes of cucumber and melon blend with delicate florals and clean musk.',
    price: 1950,
    category: 'women',
    type: 'fresh',
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80'],
    rating: 4.5,
    reviewCount: 98,
    stock: 18,
    sizes: [
      { size: '50ml', price: 1950, stock: 10 },
      { size: '100ml', price: 2800, stock: 6 },
      { size: '150ml', price: 3600, stock: 2 }
    ],
    notes: {
      top: ['Cucumber', 'Melon', 'Bamboo'],
      middle: ['Lotus', 'Lily of the Valley', 'Freesia'],
      base: ['White Musk', 'Amber', 'Sandalwood']
    },
    createdAt: '2024-02-20'
  },
  {
    id: '7',
    name: 'Royal Prowl',
    description: 'A commanding presence in every drop. This sophisticated blend of royal oud, precious resins, and exotic spices creates an unforgettable signature scent.',
    price: 5500,
    category: 'luxury',
    type: 'woody',
    images: ['https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=800&q=80'],
    rating: 4.9,
    reviewCount: 67,
    stock: 10,
    sizes: [
      { size: '50ml', price: 5500, stock: 5 },
      { size: '100ml', price: 7800, stock: 4 },
      { size: '150ml', price: 9500, stock: 1 }
    ],
    notes: {
      top: ['Saffron', 'Cardamom', 'Nutmeg'],
      middle: ['Royal Oud', 'Cedarwood', 'Sandalwood'],
      base: ['Amber', 'Myrrh', 'Frankincense', 'Musk']
    },
    isBestseller: true,
    createdAt: '2024-01-10'
  },
  {
    id: '8',
    name: 'Citrus Chase',
    description: 'Energizing and vibrant, this fragrance captures the spirit of the hunt. Bright citrus notes blend with aromatic herbs and a woody base for lasting freshness.',
    price: 2100,
    category: 'unisex',
    type: 'citrus',
    images: ['https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800&q=80'],
    rating: 4.4,
    reviewCount: 112,
    stock: 28,
    sizes: [
      { size: '50ml', price: 2100, stock: 15 },
      { size: '100ml', price: 3000, stock: 10 },
      { size: '150ml', price: 3900, stock: 3 }
    ],
    notes: {
      top: ['Lemon', 'Mandarin', 'Grapefruit'],
      middle: ['Basil', 'Thyme', 'Neroli'],
      base: ['Vetiver', 'Cedarwood', 'Musk']
    },
    createdAt: '2024-02-05'
  },
  {
    id: '9',
    name: 'Amber Dawn',
    description: 'Warm and inviting, this fragrance captures the golden hour of the savannah. Rich amber and vanilla blend with exotic spices for a comforting yet sophisticated scent.',
    price: 2450,
    category: 'women',
    type: 'amber',
    images: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80'],
    rating: 4.7,
    reviewCount: 134,
    stock: 20,
    sizes: [
      { size: '50ml', price: 2450, stock: 10 },
      { size: '100ml', price: 3500, stock: 7 },
      { size: '150ml', price: 4500, stock: 3 }
    ],
    notes: {
      top: ['Mandarin', 'Almond', 'Pink Pepper'],
      middle: ['Heliotrope', 'Jasmine', 'Orange Blossom'],
      base: ['Amber', 'Vanilla', 'Sandalwood', 'Musk']
    },
    createdAt: '2024-01-25'
  },
  {
    id: '10',
    name: 'Spotted Elegance',
    description: 'A refined and polished fragrance for the modern gentleman. Classic barbershop notes meet contemporary sophistication in this timeless scent.',
    price: 2750,
    category: 'men',
    type: 'fresh',
    images: ['https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80'],
    rating: 4.6,
    reviewCount: 78,
    stock: 14,
    sizes: [
      { size: '50ml', price: 2750, stock: 7 },
      { size: '100ml', price: 3900, stock: 5 },
      { size: '150ml', price: 5000, stock: 2 }
    ],
    notes: {
      top: ['Bergamot', 'Lemon', 'Lavender'],
      middle: ['Geranium', 'Iris', 'Violet'],
      base: ['Sandalwood', 'Oakmoss', 'Amber', 'Musk']
    },
    createdAt: '2024-02-15'
  },
  {
    id: '11',
    name: 'Oriental Spots',
    description: 'An exotic journey in every spray. This oriental masterpiece blends rare spices, precious resins, and rich woods for a truly mesmerizing experience.',
    price: 4200,
    category: 'luxury',
    type: 'oriental',
    images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80'],
    rating: 4.8,
    reviewCount: 56,
    stock: 7,
    sizes: [
      { size: '50ml', price: 4200, stock: 4 },
      { size: '100ml', price: 6000, stock: 2 },
      { size: '150ml', price: 7500, stock: 1 }
    ],
    notes: {
      top: ['Saffron', 'Cinnamon', 'Cardamom'],
      middle: ['Rose', 'Oud', 'Patchouli'],
      base: ['Amber', 'Vanilla', 'Tonka Bean', 'Musk']
    },
    isNew: true,
    createdAt: '2024-03-10'
  },
  {
    id: '12',
    name: 'Wild Blossom',
    description: 'A celebration of wildflowers in full bloom. This delicate yet lasting fragrance captures the essence of a meadow at sunrise.',
    price: 2300,
    category: 'women',
    type: 'floral',
    images: ['https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=800&q=80'],
    rating: 4.5,
    reviewCount: 103,
    stock: 25,
    sizes: [
      { size: '50ml', price: 2300, stock: 12 },
      { size: '100ml', price: 3300, stock: 9 },
      { size: '150ml', price: 4200, stock: 4 }
    ],
    notes: {
      top: ['Peony', 'Freesia', 'Apple Blossom'],
      middle: ['Rose', 'Jasmine', 'Magnolia'],
      base: ['White Musk', 'Cedarwood', 'Amber']
    },
    createdAt: '2024-02-25'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getProductsByType = (type: string): Product[] => {
  return products.filter(p => p.type === type);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isBestseller || p.isNew).slice(0, 6);
};

export const filterProducts = (filters: {
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}): Product[] => {
  let result = [...products];
  
  if (filters.category && filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  
  if (filters.type && filters.type !== 'all') {
    result = result.filter(p => p.type === filters.type);
  }
  
  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters.sortBy) {
    switch (filters.sortBy) {
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
  }
  
  return result;
};
