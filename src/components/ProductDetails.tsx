import React, { useState } from "react";
import { Star, Heart, ShoppingBag, Truck, Info, ArrowLeft, RotateCw, Check, Plus, MessageSquare } from "lucide-react";
import { Product, Review } from "../types";
import { PRODUCTS } from "../data";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, size: string, color: any, qty: number) => void;
  onBuyNow: (p: Product, size: string, color: any, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  allProducts,
  onSelectProduct,
  onAddReview,
}: ProductDetailsProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping" | "reviews">("desc");

  // Interactive 360° View mode simulation state
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  // New review input state
  const [revUser, setRevUser] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revUser || !revComment) {
      setReviewMessage("Please complete all review fields.");
      return;
    }
    const newRev: Review = {
      id: "rev-user-" + Date.now(),
      username: revUser,
      rating: revRating,
      date: new Date().toISOString().split("T")[0],
      comment: revComment,
      helpfulCount: 0,
    };
    onAddReview(product.id, newRev);
    setRevUser("");
    setRevComment("");
    setReviewMessage("Thank you! Your verified review has been posted successfully.");
    setTimeout(() => {
      setReviewMessage("");
    }, 5000);
  };

  // Find 3 related products matching the same category/gender
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 3);

  // Simulated 360 images (we shift filter/rotate based on range slider)
  const rotationDegrees = rotationIndex * 30; // 12 steps x 30 = 360

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-slide">
      {/* Return button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-black mb-8 text-[11px] uppercase tracking-widest font-mono cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Product Media Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-sm overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center aspect-[4/5] p-2">
            
            {!is360Mode ? (
              <img
                referrerPolicy="no-referrer"
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top max-h-[600px]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full relative">
                <span className="absolute top-4 left-4 bg-black text-white text-[9px] tracking-widest uppercase font-mono px-2 py-0.5 rounded-sm">
                  360° Studio View
                </span>
                <img
                  referrerPolicy="no-referrer"
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    transform: `rotate(${rotationDegrees}deg)`,
                    filter: `hue-rotate(${rotationIndex * 15}deg) saturate(${(rotationIndex % 3 === 0) ? '1.1' : '1.0'})`,
                    transition: "transform 0.15s ease-out, filter 0.15s ease-out"
                  }}
                  className="w-4/5 object-cover max-h-[480px]"
                />
                <div className="absolute bottom-6 w-11/12 bg-white/90 backdrop-blur-sm p-4 rounded border border-neutral-200 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-neutral-500 tracking-widest font-mono uppercase flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" /> Slide to Rotate Silhouette
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={rotationIndex}
                    onChange={(e) => setRotationIndex(parseInt(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between w-full text-[9px] font-mono text-neutral-400">
                    <span>Front (0°)</span>
                    <span>Profile (90°)</span>
                    <span>Back (180°)</span>
                    <span>Side (270°)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Float Action for 360 mode */}
            <button
              onClick={() => setIs360Mode(!is360Mode)}
              className="absolute top-4 right-4 bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 border border-neutral-200 shadow-md p-2 rounded-full cursor-pointer flex items-center justify-center transition-colors"
              title="Activate 360 Virtual View"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Gallery Row */}
          {!is360Mode && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 h-24 rounded-sm overflow-hidden bg-neutral-100 border cursor-pointer transition-all ${
                    activeImageIdx === i ? "border-[#D4AF37] scale-95 shadow-md" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <img src={img} alt="Product Thumbnail" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Actions Column */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-mono leading-none block font-semibold mb-2">
            {product.brand}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif-luxury text-neutral-950 font-light italic tracking-tight leading-tight mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${product.rating > idx ? "fill-current" : ""}`}
                />
              ))}
              <span className="text-xs text-neutral-900 font-semibold font-mono ml-1.5">{product.rating}</span>
            </div>
            <span className="text-neutral-400">|</span>
            <span className="text-xs text-neutral-500 font-mono tracking-widest uppercase">SKU: {product.sku}</span>
          </div>

          <div className="p-3 bg-neutral-50 inline-block border border-neutral-100 rounded-sm mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-neutral-950">${product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-neutral-400 line-through">${product.originalPrice}</span>
                  <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
                    -{product.discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-neutral-600 font-light text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="space-y-6 pb-8 border-b border-neutral-100">
            {/* Color Swatches */}
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold text-neutral-800">
                Finish: <span className="text-neutral-500 font-light">{selectedColor?.name}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 border-neutral-100 transition-all cursor-pointer ${
                      selectedColor?.name === color.name ? "scale-110 shadow-md ring-1 ring-amber-400" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === "#FAFAFA" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selectors */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-800">
                  Size Selection
                </span>
                <span className="text-[10px] underline text-neutral-500 cursor-pointer hover:text-black">
                  Fit Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border font-mono rounded-sm cursor-pointer transition-all ${
                      selectedSize === sz
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Tracker */}
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold text-neutral-800">
                Quantity
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-neutral-200 text-neutral-600 rounded-sm hover:border-neutral-400 cursor-pointer text-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-10 border-y border-neutral-200 font-mono text-center text-sm focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-neutral-200 text-neutral-600 rounded-sm hover:border-neutral-400 cursor-pointer text-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Big Actions Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                className="flex-1 py-4 bg-white border border-neutral-900 hover:bg-neutral-50 text-neutral-950 text-xs uppercase tracking-[0.2em] font-bold rounded-sm cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all gold-border-glow"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                className="flex-1 py-4 bg-black hover:bg-[#D4AF37] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
              >
                Instant Buy
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-4 border rounded-sm cursor-pointer transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? "border-red-200 text-red-500 bg-red-50"
                    : "border-neutral-200 text-neutral-800 hover:border-neutral-400 bg-white"
                }`}
                title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Premium Shipping Guarantee Badge */}
          <div className="mt-4 p-3 bg-[#FAFAFA] border border-neutral-100 rounded-sm flex gap-3.5 items-start">
            <Truck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">VÉLARE White-Glove Guarantee</h4>
              <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                Carbon-neutral delivery in reusable cedar bags. Free courier-assisted size-exchanges directly at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment: Description, Specs, Reviews, Shipping */}
      <div className="mt-16 border-t border-neutral-100 pt-10">
        <div className="flex border-b border-neutral-100 gap-8 justify-center lg:justify-start">
          {[
            { id: "desc", label: "Brand Story" },
            { id: "specs", label: "Specifications" },
            { id: "shipping", label: "Shipping & Return Policy" },
            { id: "reviews", label: `Reviews (${product.reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-all relative cursor-pointer ${
                activeTab === tab.id ? "text-neutral-950 font-bold" : "text-neutral-400 hover:text-black"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]"></span>
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "desc" && (
            <div className="max-w-3xl space-y-4">
              <blockquote className="font-serif-luxury text-xl italic font-light text-[#D4AF37] leading-relaxed">
                “{product.story || "A garment should exist as is, a tailored structure that speaks only of quality and quiet restraint.”"}
              </blockquote>
              <p className="text-sm font-light text-neutral-600 leading-relaxed pt-2">
                Every piece created at VÉLARE is developed transparently. From fiber extraction through our zero-waste looms in Lyon and Florence, down to custom hand-embroidery done under verified ethical conditions. It is comfort and luxury engineered to last generational timelines.
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl bg-neutral-50 rounded-sm border border-neutral-100">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="p-4 text-xs uppercase font-semibold text-neutral-700 tracking-wider">Composition</td>
                    <td className="p-4 text-xs text-neutral-600">{product.material}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="p-4 text-xs uppercase font-semibold text-neutral-700 tracking-wider">Standard SKU</td>
                    <td className="p-4 text-xs text-neutral-600 font-mono">{product.sku}</td>
                  </tr>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className="border-b border-neutral-200 last:border-0">
                      <td className="p-4 text-xs uppercase font-semibold text-neutral-700 tracking-wider">{spec.label}</td>
                      <td className="p-4 text-xs text-neutral-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="max-w-3xl space-y-4 text-sm text-neutral-600 font-light leading-relaxed">
              <p className="font-semibold text-neutral-800 uppercase tracking-widest text-[11px]">Free Worldwide Delivery</p>
              <p>{product.shippingInfo}</p>
              <p>We provide easy 30-day premium returns. Simply declare a return request inside your dashboard, and our white-glove shipping courier will pick up the item and care pouch from your home at your convenience absolutely free.</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Existing Reviews list */}
              <div className="lg:col-span-7 space-y-6">
                {product.reviews.length === 0 ? (
                  <p className="text-neutral-400 text-xs tracking-wider uppercase">No reviews yet. Be the first to advise clients!</p>
                ) : (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-5 border border-neutral-100 rounded-sm bg-neutral-50/50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{rev.username}</h4>
                          <span className="text-[10px] text-neutral-400 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${rev.rating > idx ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed">
                        {rev.comment}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono pt-1">
                        <span>Was this review helpful?</span>
                        <button className="text-[#D4AF37] hover:underline cursor-pointer">Helpful ({rev.helpfulCount})</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add feedback reviews Form */}
              <div className="lg:col-span-5 bg-neutral-50 p-6 rounded border border-neutral-100">
                <h3 className="font-serif-luxury text-lg italic text-neutral-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" /> Review this Product
                </h3>
                
                {reviewMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded mb-4">
                    {reviewMessage}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={revUser}
                      onChange={(e) => setRevUser(e.target.value)}
                      placeholder="e.g. Aurelius Marcus"
                      className="w-full bg-white border border-neutral-200 text-xs p-3 focus:outline-none focus:border-amber-400 rounded-sm uppercase tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">Overall Rating</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(parseInt(e.target.value))}
                      className="w-full bg-white border border-neutral-200 text-xs p-3 focus:outline-none rounded"
                    >
                      <option value="5">★★★★★ - Perfect luxury</option>
                      <option value="4">★★★★☆ - Great fabric</option>
                      <option value="3">★★★☆☆ - Average</option>
                      <option value="2">★★☆☆☆ - Below expectations</option>
                      <option value="1">★☆☆☆☆ - Not recommended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-700 font-semibold mb-1">Detailed Comment</label>
                    <textarea
                      rows={4}
                      required
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="Describe the textile weight, fit, drape, and stitch..."
                      className="w-full bg-white border border-neutral-200 text-xs p-3 focus:outline-none focus:border-amber-400 rounded-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white hover:bg-[#D4AF37] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm transition-all cursor-pointer"
                  >
                    Post Verified Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products shelf */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-neutral-100 pt-16">
          <h2 className="text-xl md:text-2xl font-serif-luxury italic font-light tracking-tight text-neutral-950 mb-8 text-center md:text-left">
            Elevate Your Configuration: Related Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((p) => {
              const displayImg = p.images[0];
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer border border-neutral-100 hover:border-amber-400 rounded-sm overflow-hidden p-4 bg-white hover:shadow-lg transition-all text-center"
                >
                  <img src={displayImg} alt={p.name} className="w-full aspect-[4/5] object-cover object-top max-h-80" />
                  <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono mt-3 block">{p.brand}</span>
                  <h3 className="font-serif-luxury italic text-neutral-900 mt-1 line-clamp-1">{p.name}</h3>
                  <span className="text-xs font-bold text-neutral-900 block mt-1">${p.price}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
