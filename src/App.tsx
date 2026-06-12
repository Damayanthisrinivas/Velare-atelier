import React, { useState, useEffect } from "react";
import { 
  Heart, ShoppingBag, ArrowRight, Star, Clock, Compass, AlertCircle, Sparkles, Check, 
  MapPin, HelpCircle, Mail, Phone, ChevronRight, User, ShieldCheck, Gift, History, RotateCcw
} from "lucide-react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AiStylist from "./components/AiStylist";
import AdminPanel from "./components/AdminPanel";
import LookbookSection from "./components/LookbookSection";
import { Product, CartItem, Order, Coupon, UserProfile, Address, BlogArticle } from "./types";
import { PRODUCTS, BLOGS, COUPONS, INITIAL_PROFILE, INITIAL_ADDRESSES, FAQS } from "./data";

export default function App() {
  // Page Navigation State
  const [activePage, setActivePage] = useState<string>("home");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Storage States
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // User States
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newsLetterEmail, setNewsLetterEmail] = useState("");
  const [newsLetterJoined, setNewsLetterJoined] = useState(false);

  // Listing filter parameters
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterPriceRange, setFilterPriceRange] = useState<number>(1500);
  const [filterColor, setFilterColor] = useState<string>("");
  const [filterSize, setFilterSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Contact States
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Flash Sale Countdown simulated state
  const [timeLeft, setTimeLeft] = useState({ hr: 4, min: 38, sec: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { hr: prev.hr, min: prev.min - 1, sec: 59 };
        if (prev.hr > 0) return { hr: prev.hr - 1, min: 59, sec: 59 };
        return { hr: 0, min: 0, sec: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateQty = (itemId: string, qty: number) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleApplyCoupon = (coup: Coupon | null) => {
    setAppliedCoupon(coup);
  };

  const handleToggleWishlist = (p: Product) => {
    const exists = wishlist.some(item => item.id === p.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== p.id));
    } else {
      setWishlist(prev => [...prev, p]);
    }
  };

  const handleAddToCart = (p: Product, size: string, color: any, qty: number = 1) => {
    // Generate distinct config token based on selections
    const configId = `${p.id}-${size}-${color?.name || "default"}`;
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.id === configId);
      if (idx > -1) {
        const replacement = [...prev];
        replacement[idx].quantity += qty;
        return replacement;
      }
      return [...prev, {
        id: configId,
        product: p,
        selectedSize: size || p.sizes[0] || "Standard",
        selectedColor: color || p.colors[0] || { name: "Onyx", hex: "#000000" },
        quantity: qty
      }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (p: Product, size: string, color: any, qty: number = 1) => {
    handleAddToCart(p, size, color, qty);
    setActivePage("checkout");
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Award loyalty points
    setProfile(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + newOrder.loyaltyPointsEarned
    }));
    // Clear cart item lines upon check outputs
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleAddProduct = (created: Product) => {
    setProducts(prev => [created, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddCoupon = (newCoup: Coupon) => {
    COUPONS.push(newCoup); // push to static data reference
  };

  const handleAddReview = (productId: string, newReview: any) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [newReview, ...p.reviews];
        // Re-avg overall rating
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: parseFloat(avg.toFixed(1))
        };
      }
      return p;
    }));
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    // Search matching
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Category matching
    if (activeCategory && p.category !== activeCategory && p.subcategory !== activeCategory) {
      return false;
    }
    // Gender matching
    if (filterGender !== "all" && p.gender !== filterGender && p.gender !== "unisex") {
      return false;
    }
    // Price matching
    if (p.price > filterPriceRange) {
      return false;
    }
    // Size matching
    if (filterSize && !p.sizes.includes(filterSize)) {
      return false;
    }
    // Color matching
    if (filterColor && !p.colors.some(c => c.name.toLowerCase().includes(filterColor.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Sorting matches
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") return b.discount - a.discount;
    return 0; // Default Featured fallback
  });

  // Derived metrics for cart
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? Math.round(cartSubtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const afterDiscount = cartSubtotal - cartDiscount;
  const cartTax = Math.round(afterDiscount * 0.08); // 8% Luxury Tax
  const cartShipping = afterDiscount > 300 || cartSubtotal === 0 ? 0 : 25;
  const cartFinalTotal = afterDiscount + cartTax + cartShipping;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col relative selection:bg-amber-400 selection:text-black">
      
      {/* Promotional Global Ribbon Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-[10px] uppercase tracking-[0.3em] font-mono select-none overflow-hidden border-b border-neutral-800">
        <span className="inline-block animate-pulse text-[#D4AF37] mr-2">✦ EDITORAL UPDATE ✦</span>
        FREE WORLDWIDE COURIER DELIVERY FOR COMMISSIONS OVER $300 • CUSTOM CHASSIS INTEGRATIONS • USE CODE <span className="font-bold underline text-[#D4AF37]">VELARE20</span> FOR 20% OFF
      </div>

      {/* Main Navigation Component */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSearch={setSearchTerm}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchTerm("");
        }}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onToggleStylist={() => setIsStylistOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
      />

      {/* Page Routing Stage renderers */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activePage === "home" && (
          <div className="space-y-16 animate-fade-slide">
            
            {/* Elegant Hero Slider (The Art of Simplicity) */}
            <section className="relative w-full h-[85vh] bg-[#F5F5F5] overflow-hidden flex items-center">
              <div className="absolute inset-0">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=2200" 
                  alt="Aurelius Runway Collection Background"
                  className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
                <div className="max-w-xl space-y-6">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] block font-semibold">
                    New Milanese Collection / Edition 02
                  </span>
                  
                  <h1 className="text-5xl md:text-7xl font-serif-luxury font-light italic leading-none tracking-tighter text-neutral-950">
                    The Art of <br />
                    <span className="not-italic font-bold text-neutral-900 border-b-2 border-black/10 pb-1">Simplicity</span>
                  </h1>

                  <p className="text-neutral-600 text-sm font-light leading-relaxed max-w-md">
                    Structured with pure cashmere composites and organic Lyonese mulberry silk. Designed for the global citizen where discretion takes absolute priority.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => {
                        setActiveCategory("");
                        setActivePage("catalog");
                      }}
                      className="px-8 py-4.5 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-4 cursor-pointer shadow-lg"
                    >
                      <span>Shop Runway</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>

                    <button
                      onClick={() => setIsStylistOpen(true)}
                      className="px-8 py-4.5 bg-white text-black border border-neutral-200 text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm gold-border-glow"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Configure Look</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative side block matching Artistic Flair Design prompt template */}
              <div className="absolute right-0 top-0 w-28 h-full bg-[#D4AF37] opacity-5 pointer-events-none hidden lg:block"></div>
            </section>

            {/* Quick Categories Bento Grid Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 pb-4 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">Curated Edits</span>
                  <h2 className="text-2xl md:text-3xl font-serif-luxury text-neutral-950 italic font-light">Explore Showroom Sections</h2>
                </div>
                <button 
                  onClick={() => { setActiveCategory(""); setActivePage("catalog"); }}
                  className="text-neutral-400 hover:text-black hover:underline underline-offset-4 text-xs font-mono tracking-widest uppercase cursor-pointer"
                >
                  View All Collections →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { name: "Men", icon: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&q=80&w=400" },
                  { name: "Women", icon: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" },
                  { name: "Kids", icon: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400" },
                  { name: "Footwear", icon: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
                  { name: "Accessories", icon: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400" },
                  { name: "Beauty", icon: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400" },
                  { name: "Lifestyle", icon: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400" },
                ].map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setActiveCategory(item.name);
                      setActivePage("catalog");
                    }}
                    className="group relative cursor-pointer aspect-square rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200/50"
                  >
                    <img referrerPolicy="no-referrer" src={item.icon} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95" />
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/40 transition-colors flex flex-col justify-end p-3 text-center">
                      <span className="text-white text-[11px] tracking-widest font-bold uppercase drop-shadow-sm group-hover:text-amber-300">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Collection with Countdowns */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 pb-4 border-b border-border text-center md:text-left">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">Seasonal Selection</span>
                  <p className="text-2xl md:text-3xl font-serif-luxury text-neutral-950 italic font-light">The Trending Vault</p>
                </div>

                {/* Simulated Ticker */}
                <div className="flex gap-4 items-center bg-black text-white p-3.5 border-l-2 border-[#D4AF37] font-mono mt-4 md:mt-0 shadow-md">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-[10px] tracking-widest uppercase">Flash Sale Counter:</span>
                  <div className="flex gap-1.5 font-bold text-xs">
                    <span>{timeLeft.hr.toString().padStart(2, "0")}h</span>
                    <span>:</span>
                    <span>{timeLeft.min.toString().padStart(2, "0")}m</span>
                    <span>:</span>
                    <span>{timeLeft.sec.toString().padStart(2, "0")}s</span>
                  </div>
                </div>
              </div>

              {/* Grid cards listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {products.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("details");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onQuickView={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("details");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    isWishlisted={wishlist.some(w => w.id === p.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            </section>

            {/* Interactive Lookbook Component */}
            <LookbookSection 
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setActivePage("details");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onAddToCart={handleAddToCart}
            />

            {/* Brand Story and Sustainability focus */}
            <section className="bg-neutral-50 py-20 border-y border-neutral-100">
              <div className="max-w-5xl mx-auto px-4 md:px-8 text-center space-y-8">
                <span className="text-[10px] font-mono tracking-[0.35em] text-[#D4AF37] uppercase font-bold">Traceable Luxury</span>
                
                <h2 className="text-3xl md:text-5xl font-serif-luxury italic font-light text-neutral-950 leading-tight">
                  “Our design constraint is simple: construct pieces that exist in absolute harmony with the natural biosphere.”
                </h2>

                <p className="text-neutral-500 font-light text-sm max-w-2xl mx-auto leading-relaxed">
                  Every gram of our Italian virgin cashmere and French silk satin is traced directly back to vetted nomadic cooperatives. There is zero heavy chemical additives or synthetics in our weave — comfort engineered to decompose safely into organic earth layers decades down the timeline.
                </p>

                <div className="pt-4">
                  <button 
                    onClick={() => setActivePage("about")}
                    className="text-xs uppercase tracking-widest font-mono text-neutral-900 border-b border-black hover:text-[#D4AF37] hover:border-amber-400 pb-1 cursor-pointer transition-all inline-flex items-center gap-2"
                  >
                    Read Our Green Philosophy Book <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Customer Testimonials reviews carousel */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] text-center mb-10">Client Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Countess Sofia Castiglione", text: "The cashmere overcoat drape is absolutely supreme. It feels as light as silk while stopping the early morning breeze at Portofino cliffs instantly.", location: "Portofino, Italy" },
                  { name: "Sir Julian Sterling", text: "Absolute flawless tailor specifications. I brought it to their physical salon in Milan for custom alterations, and they treated me with supreme white-glove respect.", location: "London, UK" },
                  { name: "Lady Genevieve V.", text: "This Pleated Crêpe Dress is fluid poetry in motion. Unbelievably soft accordion stitching that survives heavy transatlantic travel without a single fold crease.", location: "New York, USA" }
                ].map((test, i) => (
                  <div key={i} className="p-8 border border-neutral-100 rounded bg-[#FAFAFA] relative space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                    </div>
                    <blockquote className="font-serif-luxury font-light italic text-[#1c1c1c] text-base leading-relaxed">
                      “{test.text}”
                    </blockquote>
                    <div className="border-t border-neutral-100 pt-4 flex justify-between items-baseline text-xs">
                      <span className="font-bold text-neutral-900">{test.name}</span>
                      <span className="text-neutral-400 text-[10px] font-mono uppercase">{test.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Styled Fashion Editorial Instagram Gallery */}
            <section className="max-w-7xl mx-auto px-4 md:px-8">
              <p className="text-xs font-mono uppercase tracking-widest text-center text-neutral-400 mb-2">✦ ATELIER INSTANT LOOKS ✦</p>
              <h2 className="text-2xl font-serif-luxury italic text-neutral-950 font-light text-center mb-8">#VELARE_ATELIER</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  "https://images.unsplash.com/photo-1490223424508-0f514468f79a?auto=format&fit=crop&q=80&w=350",
                  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=350",
                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=350",
                  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=350",
                  "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=350",
                  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=350"
                ].map((img, i) => (
                  <div key={i} className="group relative overflow-hidden bg-neutral-100 aspect-[3/4]-deprecated rounded-sm h-64 border border-neutral-200">
                    <img referrerPolicy="no-referrer" src={img} alt="Bespoke fashion shot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white border border-white text-[9px] tracking-widest font-mono uppercase px-3 py-1.5 rounded-sm hover:bg-[#D4AF37] hover:border-[#D4AF37]">
                        Shop Look
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Artistic Flair Luxury Newsletter Signup */}
            <section className="bg-black text-white p-12 md:p-20 relative overflow-hidden border-t-2 border-amber-400">
              <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-mono font-bold block">Exclusive Inner Circle</span>
                
                <h3 className="text-3xl md:text-5xl font-serif-luxury italic font-light">Join The VÉLARE Ledger</h3>
                
                <p className="text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                  Secure early access to limited capsule runway launches, sustainability journals, and bespoke tailoring appointments.
                </p>

                {newsLetterJoined ? (
                  <div className="bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 p-4 rounded text-xs inline-block max-w-sm font-mono tracking-wider">
                    🎉 Welcome. Your access credentials token was logged. Check your inbox.
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); if (newsLetterEmail) setNewsLetterJoined(true); }}
                    className="flex border-b border-neutral-600 pb-2 max-w-md mx-auto pt-4"
                  >
                    <input
                      type="email"
                      required
                      placeholder="ENTER EMAIL ADDRESS"
                      value={newsLetterEmail}
                      onChange={(e) => setNewsLetterEmail(e.target.value)}
                      className="bg-transparent border-none text-[11px] tracking-widest text-white w-full focus:outline-none placeholder-neutral-500 uppercase font-mono"
                    />
                    <button type="submit" className="text-[#D4AF37] text-[11px] tracking-widest uppercase font-bold cursor-pointer hover:text-white transition-colors">
                      Join
                    </button>
                  </form>
                )}
              </div>
              <div className="absolute -right-16 -bottom-16 w-56 h-56 border-8 border-neutral-800 rounded-full opacity-10"></div>
            </section>

          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOG PAGE */}
        {activePage === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-slide">
            
            {/* Header description */}
            <div className="mb-10 text-center md:text-left">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono font-bold block mb-1">Interactive Catalog</span>
              <h1 className="text-3xl md:text-4.5xl font-serif-luxury italic font-light text-neutral-950">
                {activeCategory ? `${activeCategory} Collection` : "The Entire Showroom Runway"}
              </h1>
              <p className="text-neutral-500 text-xs font-light tracking-wide mt-2">
                Showing {sortedProducts.length} certified sustainable high-end pieces tailored to your filters.
              </p>
            </div>

            {/* Filter Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left filter side controls */}
              <div className="lg:col-span-3 space-y-6">
                <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-sm space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                    <h3 className="text-xs uppercase tracking-widest font-bold">Refine Options</h3>
                    <button 
                      onClick={() => {
                        setFilterGender("all");
                        setFilterPriceRange(1500);
                        setFilterSize("");
                        setFilterColor("");
                        setSearchTerm("");
                        setActiveCategory("");
                      }}
                      className="text-[9px] text-[#D4AF37] underline tracking-widest font-mono uppercase cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Gender Option */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-700 mb-2.5">Target Gender</label>
                    <div className="space-y-1.5 text-xs text-neutral-600 font-light">
                      {["all", "men", "women", "kids"].map((gen) => (
                        <label key={gen} className="flex items-center gap-2 cursor-pointer hover:text-black">
                          <input
                            type="radio"
                            name="gender"
                            checked={filterGender === gen}
                            onChange={() => setFilterGender(gen)}
                            className="accent-[#D4AF37]"
                          />
                          <span className="capitalize">{gen}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="block text-[10px] uppercase font-bold text-neutral-700">Max Pricing</label>
                      <span className="text-xs font-mono font-bold text-neutral-950">${filterPriceRange}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1500"
                      step="50"
                      value={filterPriceRange}
                      onChange={(e) => setFilterPriceRange(parseInt(e.target.value))}
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-700 mb-2">Size Metric</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["XS", "S", "M", "L", "XL", "XXL", "Unisize"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setFilterSize(filterSize === sz ? "" : sz)}
                          className={`px-2 py-1 text-[10px] border font-mono rounded-sm transition-all ${
                            filterSize === sz ? "bg-black text-white border-black" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color tag */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-700 mb-2">Primary Colorways</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Charcoal", "Gold", "Navy", "Onyx", "Ochre", "Denim", "Emerald", "Cream", "Sage"].map((col) => (
                        <button
                          key={col}
                          onClick={() => setFilterColor(filterColor === col ? "" : col)}
                          className={`px-2 py-1 text-[9px] border uppercase rounded-sm transition-all ${
                            filterColor === col ? "bg-amber-400 text-black border-amber-400" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-700 mb-2">Arangement</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2.5 border bg-white rounded text-xs text-neutral-700 focus:outline-none"
                    >
                      <option value="featured">Featured Looks</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="discount">Largest Seasonal Discount</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right products Grid container */}
              <div className="lg:col-span-9">
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-24 bg-neutral-50 rounded border border-neutral-100">
                    <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-xs uppercase tracking-widest text-neutral-400">No matching products found.</p>
                    <button 
                      onClick={() => {
                        setFilterGender("all");
                        setFilterPriceRange(1500);
                        setActiveCategory("");
                        setSearchTerm("");
                      }}
                      className="mt-4 px-5 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest rounded cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onSelect={(prod) => {
                          setSelectedProduct(prod);
                          setActivePage("details");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onQuickView={(prod) => {
                          setSelectedProduct(prod);
                          setActivePage("details");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        onAddToCart={handleAddToCart}
                        isWishlisted={wishlist.some(w => w.id === p.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAILS PAGE */}
        {activePage === "details" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={wishlist.some(w => w.id === selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            allProducts={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddReview={handleAddReview}
          />
        )}

        {/* VIEW 4: WISHLIST DISPLAY */}
        {activePage === "wishlist" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-slide">
            <h1 className="text-2xl md:text-3xl font-serif-luxury text-neutral-950 italic font-light mb-2">My Curated Wishlist</h1>
            <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest border-b border-neutral-100 pb-4 mb-8">
              Logged Items: ({wishlist.length})
            </p>

            {wishlist.length === 0 ? (
              <div className="text-center py-24 bg-neutral-50 rounded border border-neutral-100">
                <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-xs uppercase tracking-widest text-neutral-400">Your wishlist drawer is currently bare.</p>
                <button
                  onClick={() => setActivePage("catalog")}
                  className="mt-4 px-6 py-3 bg-black text-white text-[10px] tracking-widest uppercase rounded cursor-pointer"
                >
                  Explore Collection Runway
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {wishlist.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("details");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onQuickView={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("details");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    isWishlisted={true}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: USER ACCOUNT / PROFILE DASHBOARD */}
        {activePage === "account" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-slide">
            
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Profile Card Side panel */}
              <div className="lg:col-span-4 lg:w-80 shrink-0 space-y-6">
                <div className="p-6 border border-neutral-150 bg-neutral-50 text-center rounded">
                  <img src={profile.avatar} alt="User Avatar" className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-400 mb-4" />
                  <span className="px-3 py-1 bg-amber-400 text-black font-semibold uppercase tracking-widest text-[9px] rounded-full inline-block font-mono">
                    ✦ {profile.tier} Client ✦
                  </span>
                  <h2 className="text-base font-serif-luxury italic font-light text-neutral-900 mt-3">{profile.name}</h2>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{profile.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-200">
                    <div>
                      <span className="block text-[9px] text-neutral-400 uppercase">Loyalty Reward</span>
                      <span className="text-sm font-bold text-[#D4AF37] font-mono">{profile.loyaltyPoints} PTS</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-neutral-400 uppercase">Member Since</span>
                      <span className="text-xs font-semibold font-mono text-neutral-800">{profile.memberSince}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-dashed border-neutral-300 rounded text-center bg-amber-400/5 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase">My Invite Referral Code</span>
                  <h4 className="text-xs font-bold text-neutral-900 font-mono">{profile.referralCode}</h4>
                  <p className="text-[9px] text-neutral-500 leading-none pt-1">Refer a client to receive 500 Loyalty points!</p>
                </div>
              </div>

              {/* Account orders log + Addresses */}
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-800 border-b border-neutral-200 pb-3 font-mono flex items-center gap-2">
                    <History className="w-4 h-4 text-[#D4AF37]" /> Historical Commissions log ({orders.length})
                  </h2>
                  
                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-neutral-400 text-xs uppercase tracking-widest bg-neutral-50/50 border rounded mt-4">
                      No matching historical dispatches located.
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      {orders.map((or) => (
                        <div key={or.id} className="p-4 border border-neutral-100 rounded bg-[#FAFAFA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-neutral-900">ORDER ID: <span className="font-mono text-amber-600">{or.id}</span></span>
                            <div className="text-[11px] text-neutral-500">
                              <span>Placed: {or.date}</span>
                              <span className="mx-2">•</span>
                              <span className="font-semibold text-neutral-800">${or.finalTotal} total</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 font-mono leading-tight">Items: {or.items.map(it => `${it.product.name} (x${it.quantity})`).join(", ")}</p>
                          </div>

                          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                            <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-400">Milestone</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                              or.status === "Processing" ? "bg-amber-400/10 text-[#D4AF37]" : "bg-neutral-900 text-white animate-pulse"
                            }`}>
                              ● {or.status}
                            </span>
                            {or.status === "Delivered" && (
                              <button 
                                onClick={() => {
                                  alert(`Return Request logged for Order token ${or.id}. A curated courier will pick up from your home coordinates in NY within 24 hours.`);
                                  handleUpdateOrderStatus(or.id, "Returned");
                                }}
                                className="text-[9px] text-[#D4AF37] hover:underline flex items-center gap-0.5 mt-1 font-mono uppercase tracking-widest cursor-pointer"
                              >
                                <RotateCcw className="w-2.5 h-2.5" /> Book Return pick-up
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* My Addresses */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-800 border-b border-neutral-200 pb-3 font-mono flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" /> Registered Coordinates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="p-4 border border-neutral-100 rounded-sm bg-neutral-50 relative">
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 text-[8px] uppercase tracking-widest font-mono font-bold bg-[#D4AF37] text-white px-1.5 py-0.5 rounded-sm">
                            Primary
                          </span>
                        )}
                        <p className="text-xs font-semibold text-neutral-900">{addr.name}</p>
                        <p className="text-[11px] text-neutral-600 mt-1">{addr.street}</p>
                        <p className="text-[11px] text-neutral-600">{addr.city}, {addr.zipCode}</p>
                        <p className="text-[11px] text-neutral-600">{addr.country}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-2">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: PHILOSOPHY & ABOUT US */}
        {activePage === "about" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 animate-fade-slide leading-relaxed">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-mono font-bold block text-center">THE VÉLARE ESSENCE</span>
            
            <h1 className="text-4xl md:text-6xl font-serif-luxury italic font-light text-neutral-950 text-center leading-tight">
              A Living Blueprint of <br />Sustainable Refinement
            </h1>

            <div className="h-64 bg-neutral-100 rounded-sm overflow-hidden relative border border-neutral-200">
              <img 
                referrerPolicy="no-referrer"
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200" 
                alt="Green sustainable factory loom process" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-neutral-600 font-light">
              <div className="space-y-4">
                <h3 className="font-serif-luxury italic text-neutral-950 text-xl font-medium">01. Infinite Traceability</h3>
                <p>
                  At VÉLARE, sustainability is not an afterthought, it is the initial configuration. Each fiber in our luxury double-face cashmere coats is tracked via low-frequency satellite beacons, recording pasture health, vegetation density, and pure clean water tables.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif-luxury italic text-neutral-950 text-xl font-medium">02. Ethical Zero-Waste Looms</h3>
                <p>
                  Our textile mills in Milan, Tuscany, and Lyon utilize only 100% clean solar capture. By integrating bespoke hand-embroiderers and pattern designers directly into clean environments, we guarantee human dignity while ensuring standard zero mechanical waste.
                </p>
              </div>
            </div>

            <blockquote className="p-6 bg-neutral-50 border-l-2 border-[#D4AF37] text-base font-serif-luxury text-[#D4AF37] italic font-light">
              “True luxury isn’t transient. It's a permanent configuration designed to be styled, cherished, and layered across multiple generations before safely returning to the earth.” — Elena Geller, Director
            </blockquote>
          </div>
        )}

        {/* VIEW 7: ATELIER DESK / CONTACT US */}
        {activePage === "contact" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-slide">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left desk FAQs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono block">Atelier Help Center</span>
                  <h2 className="text-2xl md:text-3xl font-serif-luxury italic text-neutral-950 font-light mt-1 mb-6">Frequently Advised Queries</h2>
                </div>

                <div className="space-y-4">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="p-5 border border-neutral-100 rounded bg-neutral-50/50 space-y-2">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0" /> {faq.q}
                      </h4>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed pl-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Desk support form */}
              <div className="lg:col-span-5 bg-[#FAF9F5] p-6 md:p-8 rounded border border-neutral-150">
                <h3 className="font-serif-luxury text-base italic text-neutral-950 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" /> Commision Support Ticket
                </h3>
                <p className="text-[11px] text-neutral-500 mb-6 leading-relaxed">
                  Our customer visual officers respond within 2 hours of ticket dispatch.
                </p>

                {contactSuccess ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded font-mono">
                    🎉 Your service ticket is successfully generated. Our visual concierge will contact you shortly!
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }}
                    className="space-y-4 text-xs"
                  >
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-white p-3 border focus:outline-none focus:border-amber-400"
                        placeholder="MARCUS SMITH"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 mb-1">Contact Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-white p-3 border focus:outline-none focus:border-amber-400"
                        placeholder="client@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 mb-1">Inquiry Description</label>
                      <textarea
                        rows={5}
                        required
                        value={contactForm.msg}
                        onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                        className="w-full bg-white p-3 border focus:outline-none focus:border-amber-400"
                        placeholder="Tell us about sizing exchange details or bespoke store layouts..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-black hover:bg-[#D4AF37] text-white text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors cursor-pointer"
                    >
                      Dispatch Concierge Ticket
                    </button>
                  </form>
                )}

                <div className="mt-8 pt-6 border-t border-neutral-200 text-xs space-y-3 font-mono text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span>HQ Milan Hot Desk: +39 02 8139744</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>Salon: 12 Via Borgospesso, Milan, Italy</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 border-t border-neutral-900 mt-20 text-xs font-light">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif-luxury italic tracking-tighter text-[#D4AF37]">
              VÉLARE <span className="text-[9px] not-italic uppercase tracking-[0.3em] font-mono block mt-1">Atelier</span>
            </h2>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Curating architectural tailoring and certified bio-degradable Tuscan cashmere collections for modern luxury connoisseurs.
            </p>
            <div className="text-[#D4AF37] font-serif-luxury italic text-xs">
              Milano • London • New York
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Collections</h4>
            <ul className="space-y-1.5 text-neutral-400 hover:text-white transition-colors">
              <li><button onClick={() => { setActiveCategory("Women"); setActivePage("catalog"); }} className="hover:text-amber-400 text-left">Women Eveningwear</button></li>
              <li><button onClick={() => { setActiveCategory("Men"); setActivePage("catalog"); }} className="hover:text-amber-400 text-left">Men Tailored Suiting</button></li>
              <li><button onClick={() => { setActiveCategory("Kids"); setActivePage("catalog"); }} className="hover:text-amber-400 text-left">Petite Capsule</button></li>
              <li><button onClick={() => { setActiveCategory("Footwear"); setActivePage("catalog"); }} className="hover:text-amber-400 text-left">Artisanal Shoes</button></li>
              <li><button onClick={() => { setActiveCategory("Accessories"); setActivePage("catalog"); }} className="hover:text-amber-400 text-left">Accessories & Optics</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Atelier Guides</h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li><button onClick={() => setActivePage("about")} className="hover:text-amber-400">Our Green Carbon Philosophy</button></li>
              <li><button onClick={() => setActivePage("contact")} className="hover:text-amber-400">Doorstep Alteration Services</button></li>
              <li><button onClick={() => setActivePage("contact")} className="hover:text-amber-400">Exchange Standard Guidelines</button></li>
              <li><a href="#lookbook" className="hover:text-amber-400 block">360° Milanese Lookbook</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Secure Sockets</h4>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Securely integrated in compliance with 256-bit bank SSL transaction codes & GDPR digital standards.
            </p>
            <div className="flex gap-2 text-neutral-300 font-mono text-[9px] uppercase hover:text-white pt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>GDPR Certified Secure Applet</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row justify-between text-neutral-500 text-[10px] uppercase tracking-widest font-mono">
          <p>© 2026 VÉLARE Atelier Fashion House. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Instagram</span>
            <span>Vimeo</span>
            <span>Pinterest</span>
          </div>
        </div>
      </footer>

      {/* FLOATING DRAWERS & MODALS MOUNT UNITS */}
      
      {/* Shopping Cart Drawer backdrop component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setActivePage("checkout");
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
      />

      {/* Floating AI Stylist drawer */}
      <AiStylist
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setActivePage("details");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAddToCart={(p, sz, col) => handleAddToCart(p, sz, col, 1)}
      />

      {/* Checkout Wizard Drawer Modal */}
      {activePage === "checkout" && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setActivePage("home")}
          cartItems={cartItems}
          subtotal={cartSubtotal}
          discount={cartDiscount}
          tax={cartTax}
          shipping={cartShipping}
          total={cartFinalTotal}
          onOrderPlaced={handleOrderPlaced}
          userPoints={profile.loyaltyPoints}
        />
      )}

      {/* Management Admin Panel component */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddCoupon={handleAddCoupon}
      />

    </div>
  );
}
