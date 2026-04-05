import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/store';
import type { Product } from '@/types';

export function HomePage() {
  const { state } = useApp();
  const featuredProducts = [...state.products]
    .sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller) || b.rating - a.rating)
    .slice(0, 6);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Featured Products */}
      <FeaturedSection products={featuredProducts} />
      
      {/* Scent Quiz CTA */}
      <ScentQuizSection />
      
      {/* Brand Story */}
      <BrandStorySection />
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    
    // Entrance animation
    const elements = hero.querySelectorAll('.hero-animate');
    elements.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      setTimeout(() => {
        (el as HTMLElement).style.transition = 'all 0.8s ease-out';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 200 + i * 100);
    });
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden premium-mesh"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1920&q=80"
          alt="Cheetah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-radial-vignette" />
        <div className="absolute inset-0 bg-gradient-to-r from-cheetah-black/90 via-cheetah-black/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <div className="max-w-2xl">
          <p className="hero-animate micro-label mb-4">
            EST. 2026 — EAU DE LUXE
          </p>
          <h1 className="hero-animate heading-hero text-white mb-6">
            UNLEASH YOUR <span className="text-gradient-gold">SCENT</span>
          </h1>
          <p className="hero-animate text-white/70 text-lg md:text-xl mb-8 max-w-lg">
            Bold fragrances crafted for predators who move fast and leave a trail.
          </p>
          <div className="hero-animate flex flex-wrap gap-4">
            <Link to="/shop">
              <Button className="btn-primary flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/shop/luxury">
              <Button className="btn-secondary">
                Luxury Line
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm micro-label">
        SCROLL
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    {
      title: 'FOR HIM',
      subtitle: "Men's Fragrances",
      description: 'Wood, smoke, and leather—composed to cut through the noise.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      link: '/shop/men'
    },
    {
      title: 'FOR HER',
      subtitle: "Women's Fragrances",
      description: 'Velvet florals, amber, and musk—designed to linger.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      link: '/shop/women'
    },
    {
      title: 'LUXURY',
      subtitle: 'Exclusive Collection',
      description: 'Rare ingredients, exceptional craftsmanship, unforgettable presence.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      link: '/shop/luxury'
    }
  ];
  
  return (
    <section className="py-24 bg-cheetah-black premium-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="micro-label mb-4">DISCOVER</p>
          <h2 className="heading-section text-white">
            CHOOSE YOUR <span className="text-gradient-gold">PATH</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.title}
              to={cat.link}
              className="group relative h-[500px] overflow-hidden rounded-xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cheetah-black via-cheetah-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-left-readability opacity-60" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="micro-label text-white/60 mb-2">{cat.subtitle}</p>
                <h3 className="font-heading font-black text-3xl text-white mb-2 group-hover:text-gold transition-colors">
                  {cat.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 text-gold font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSection({ products }: { products: Product[] }) {
  return (
    <section className="py-24 bg-cheetah-dark premium-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="micro-label mb-4">FEATURED</p>
            <h2 className="heading-section text-white">
              BESTSELLING <span className="text-gradient-gold">SCENTS</span>
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-gold hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/shop">
            <Button className="btn-secondary">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ScentQuizSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&q=80"
          alt="Perfume"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cheetah-black/80" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="micro-label mb-4">SCENT QUIZ</p>
          <h2 className="heading-section text-white mb-6">
            FIND YOUR <span className="text-gradient-gold">SIGNATURE</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Answer a few questions and discover the perfect fragrance that matches your personality and style.
          </p>
          <Link to="/shop">
            <Button className="btn-primary">
              Take the Quiz
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section className="py-24 bg-cheetah-black premium-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="micro-label mb-4">OUR STORY</p>
            <h2 className="heading-section text-white mb-6">
              CRAFTED WITH <span className="text-gradient-gold">PASSION</span>
            </h2>
            <p className="text-white/70 mb-4">
              Cheetah Perfumes was born from a desire to create fragrances that embody speed, power, and elegance. 
              Each scent is meticulously crafted using the finest ingredients sourced from around the world.
            </p>
            <p className="text-white/70 mb-6">
              Our master perfumers combine traditional techniques with modern innovation to create 
              fragrances that are bold, long-lasting, and unmistakably unique.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-heading font-black text-gold">50+</p>
                <p className="text-white/60 text-sm">Fragrances</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-black text-gold">20K+</p>
                <p className="text-white/60 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-black text-gold">4.8</p>
                <p className="text-white/60 text-sm">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80"
              alt="Perfume craftsmanship"
              className="rounded-xl shadow-luxury"
            />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold/20 rounded-xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
