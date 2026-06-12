import React, { useState } from "react";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: any, qty?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  // Get active display image (fallback to primary)
  const displayImage = 
    hovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div 
      className="group relative flex flex-col bg-white border border-neutral-100 hover:border-amber-400/50 hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual Badge Indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
            Save {product.discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#D4AF37] text-white text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm">
            New Arrival
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-black text-white text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm animate-pulse">
            Flash Sale
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full border shadow-sm cursor-pointer transition-all duration-300 ${
          isWishlisted
            ? "bg-red-50 text-red-500 border-red-200"
            : "bg-white/80 text-neutral-800 hover:text-red-500 border-neutral-200"
        }`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      {/* Product Image Stage with Custom Micro-interact */}
      <div 
        onClick={() => onSelect(product)}
        className="w-full aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative cursor-pointer"
      >
        <img
          referrerPolicy="no-referrer"
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Floating Quick Action Rail */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 bg-white text-neutral-950 hover:bg-[#D4AF37] hover:text-white rounded-full cursor-pointer transition-colors shadow-lg"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Default to first size and color
              const defaultSize = product.sizes[0] || "M";
              const defaultColor = product.colors[0] || { name: "Onyx", hex: "#000000" };
              onAddToCart(product, defaultSize, defaultColor);
            }}
            className="p-2.5 bg-[#D4AF37] text-white hover:bg-neutral-900 rounded-full cursor-pointer transition-colors shadow-lg flex items-center justify-center"
            title="Instant Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Descriptive Copy */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono leading-none font-semibold">
          {product.brand}
        </span>
        
        <h3 
          onClick={() => onSelect(product)}
          className="text-neutral-950 font-serif-luxury text-base font-light italic mt-1.5 hover:text-[#D4AF37] cursor-pointer transition-colors line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Rating Meter */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, idx) => (
              <Star 
                key={idx} 
                className={`w-3 h-3 ${product.rating > idx ? "fill-current" : ""}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">({product.reviewsCount})</span>
        </div>

        {/* Pricing tag */}
        <div className="mt-3 pt-3 border-t border-neutral-50 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-950">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] text-amber-600 font-mono font-medium animate-pulse">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[10px] text-red-500 font-mono font-semibold">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
