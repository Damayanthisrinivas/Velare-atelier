import React, { useState } from "react";
import { X, Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { CartItem, Coupon } from "../types";
import { COUPONS } from "../data";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  appliedCoupon,
  onApplyCoupon,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon 
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) 
    : 0;

  const afterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(afterDiscount * 0.08); // 8% luxury sales tax
  const shippingFee = afterDiscount > 300 || subtotal === 0 ? 0 : 25; // free priority over $300
  const totalAmount = afterDiscount + taxAmount + shippingFee;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode) return;

    const matched = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!matched) {
      setCouponError("Invalid promo code. Please verify.");
      return;
    }

    if (subtotal < matched.minSpend) {
      setCouponError(`Min spend for ${matched.code} is $${matched.minSpend}.`);
      return;
    }

    onApplyCoupon(matched);
    setCouponSuccess(`Coupon code applied successfully! Enjoy ${matched.discountPercent}% OFF.`);
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      {/* Backdrop Closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Actual Drawer panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-slide z-10 border-l border-neutral-100">
        
        {/* Header bar */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-neutral-900">
              Your Atelier Configuration ({cartItems.length})
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-neutral-400 hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Cart item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-xs uppercase tracking-widest text-neutral-400">Atelier pouch is currently empty.</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-black text-white hover:bg-[#D4AF37] text-[10px] uppercase tracking-widest font-mono rounded"
              >
                Go Browse Runway
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 p-3 border border-neutral-100 rounded-sm hover:border-[#D4AF37]/40 hover:shadow-sm transition-all"
              >
                <img 
                  referrerPolicy="no-referrer"
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-16 h-20 object-cover object-top rounded-sm bg-neutral-50 shrink-0 border border-neutral-200"
                />
                
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono block">
                    {item.product.brand}
                  </span>
                  <h3 className="text-xs font-serif-luxury italic text-neutral-900 truncate mt-0.5" title={item.product.name}>
                    {item.product.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 text-[10px] text-neutral-500 font-mono mt-1">
                    <span>Size: {item.selectedSize}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      Color: <span className="inline-block w-2.5 h-2.5 rounded-full border border-neutral-200" style={{ backgroundColor: item.selectedColor.hex }}></span> {item.selectedColor.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-neutral-200 rounded-sm">
                      <button 
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-xs text-neutral-500 hover:text-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono text-neutral-900 border-x border-neutral-200 bg-neutral-50">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-neutral-500 hover:text-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-neutral-950 font-mono">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-neutral-300 hover:text-red-500 cursor-pointer self-start p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Promo code & Totals Footer screen */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
            
            {/* Promo Code Coupon Form */}
            <form onSubmit={handleCouponSubmit} className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-wider text-neutral-600 font-bold">
                Coupon Code
              </label>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code e.g. VELARE20"
                    className="flex-1 bg-white border border-neutral-300 rounded-sm p-2 text-xs focus:outline-none uppercase tracking-wider font-mono"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="bg-amber-400/10 border border-amber-400/20 p-2 rounded-sm flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-mono font-bold flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> {appliedCoupon.code} Applied
                  </span>
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon}
                    className="text-[10px] text-red-500 tracking-wider uppercase underline font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {couponError && <p className="text-[10px] text-red-500 font-mono mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-500 font-mono mt-1">{couponSuccess}</p>}
              
              {!appliedCoupon && !couponError && !couponSuccess && (
                <p className="text-[9px] text-neutral-400 font-mono">Tip: Try code <span className="font-semibold text-neutral-700 font-mono">VELARE20</span> for 20% OFF!</p>
              )}
            </form>

            {/* Calculations summaries */}
            <div className="space-y-2 border-t border-neutral-200 pt-3 text-xs">
              <div className="flex justify-between text-neutral-600 font-light">
                <span>Atelier Subtotal</span>
                <span>${subtotal}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Exclusive Discount ({appliedCoupon?.discountPercent}%)</span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600 font-light">
                <span>Luxury Sales Tax (8%)</span>
                <span>${taxAmount}</span>
              </div>

              <div className="flex justify-between text-neutral-600 font-light">
                <span>White-Glove Priority Shipping</span>
                <span>{shippingFee === 0 ? "Complimentary" : `$${shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-neutral-950 font-bold text-sm pt-2 border-t border-dashed border-neutral-300">
                <span>Total Amount Due</span>
                <span>${totalAmount}</span>
              </div>
            </div>

            {/* Checkout CTA button */}
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-black hover:bg-[#D4AF37] text-white text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              Configure to Shipping <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
