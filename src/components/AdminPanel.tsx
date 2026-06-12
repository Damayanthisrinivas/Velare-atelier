import React, { useState } from "react";
import { X, TrendingUp, DollarSign, Package, ShoppingCart, Loader2, Trash, Plus, Pencil, Tag, RefreshCcw } from "lucide-react";
import { Product, Order, Coupon } from "../types";
import { COUPONS } from "../data";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onAddCoupon: (c: Coupon) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddCoupon,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "coupons">("analytics");

  // Product Add state form
  const [newProd, setNewProd] = useState({
    name: "",
    brand: "VÉLARE Atelier",
    category: "Men",
    subcategory: "Shirts",
    price: 350,
    originalPrice: 350,
    description: "",
    material: "100% Virgin Cotton",
    stock: 25,
    sizes: "S, M, L, XL",
    colorName: "Nero Black",
    colorHex: "#000000",
    image: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&q=80&w=850",
    sku: "VEL-MC-NEW",
    gender: "men" as const
  });

  // Coupon state form
  const [newCoup, setNewCoup] = useState({
    code: "",
    discount: 15,
    minSpend: 150,
    desc: "Additional limited 15% VIP discount",
  });

  if (!isOpen) return null;

  // Compute key business metrics
  const totalIncome = orders.reduce((acc, o) => acc + o.finalTotal, 0);
  const conversionRate = 8.4; // 8.4%
  const averagePurchaseVal = orders.length > 0 ? Math.round(totalIncome / orders.length) : 0;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.image) return;

    const created: Product = {
      id: "prod-" + Date.now(),
      name: newProd.name,
      brand: newProd.brand,
      description: newProd.description || "A pristine contemporary design curated with premium global textile foundations.",
      category: newProd.category,
      subcategory: newProd.subcategory,
      price: newProd.price,
      originalPrice: newProd.originalPrice,
      images: [newProd.image],
      rating: 5.0,
      reviewsCount: 1,
      reviews: [],
      sizes: newProd.sizes.split(",").map(s => s.trim()),
      colors: [{ name: newProd.colorName, hex: newProd.colorHex }],
      material: newProd.material,
      stock: newProd.stock,
      discount: newProd.originalPrice > newProd.price ? Math.round(((newProd.originalPrice - newProd.price) / newProd.originalPrice) * 100) : 0,
      sku: newProd.sku + "-" + Math.floor(Math.random() * 80 + 10),
      gender: newProd.gender,
      specifications: [
        { label: "Fabric Blend", value: newProd.material },
        { label: "Handcrafted Origin", value: "Milano pattern labs" }
      ],
      shippingInfo: "Complimentary priority dispatch.",
    };

    onAddProduct(created);
    alert(`Success: Product "${created.name}" is logged on real-time collection grids!`);
    setNewProd({
      name: "",
      brand: "VÉLARE Atelier",
      category: "Men",
      subcategory: "Shirts",
      price: 350,
      originalPrice: 350,
      description: "",
      material: "100% Virgin Cotton",
      stock: 25,
      sizes: "S, M, L, XL",
      colorName: "Nero Black",
      colorHex: "#000000",
      image: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&q=80&w=850",
      sku: "VEL-MC-NEW",
      gender: "men"
    });
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoup.code) return;

    const created: Coupon = {
      code: newCoup.code.toUpperCase(),
      discountPercent: newCoup.discount,
      minSpend: newCoup.minSpend,
      description: newCoup.desc,
      expiryDate: "2026-12-31"
    };

    onAddCoupon(created);
    alert(`Success: Marketing promo code "${created.code}" is integrated live.`);
    setNewCoup({ code: "", discount: 15, minSpend: 150, desc: "Additional limited 15% VIP discount" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Stage frame */}
      <div className="bg-white text-black w-full max-w-5xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col h-[85vh] border border-neutral-100 animate-fade-slide">
        
        {/* Top Header Controls bar */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-950 text-white">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono block">Enterprise Operations Vault</span>
              <h2 className="text-sm uppercase tracking-[0.2em] font-sans font-bold">VÉLARE Board Management Controls</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white cursor-pointer hover:scale-110 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Sub Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 gap-6">
          {[
            { id: "analytics", label: "Sales Analytics" },
            { id: "products", label: "Catalog Engine" },
            { id: "orders", label: "Vessel Orders Dispatch" },
            { id: "coupons", label: "Promo Management" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all relative cursor-pointer ${
                activeTab === tab.id ? "text-neutral-950 font-bold border-b-2 border-[#D4AF37]" : "text-neutral-400 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Core content stages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Analytics stage */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-5 border border-neutral-100 rounded bg-[#FAF9F5] shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-400/10 rounded-full text-amber-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Total Net Revenue</span>
                    <span className="text-2xl font-bold font-mono">${totalIncome}</span>
                  </div>
                </div>

                <div className="p-5 border border-neutral-100 rounded bg-[#FAF9F5] shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-neutral-900/10 rounded-full text-neutral-800">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Completed Orders</span>
                    <span className="text-2xl font-bold font-mono">{orders.length}</span>
                  </div>
                </div>

                <div className="p-5 border border-neutral-100 rounded bg-[#FAF9F5] shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-red-400/10 rounded-full text-red-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Conversion Rates</span>
                    <span className="text-xl font-bold font-mono">{conversionRate}%</span>
                  </div>
                </div>

                <div className="p-5 border border-neutral-100 rounded bg-[#FAF9F5] shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-400/10 rounded-full text-emerald-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Avg Order Value</span>
                    <span className="text-xl font-bold font-mono">${averagePurchaseVal}</span>
                  </div>
                </div>
              </div>

              {/* Progress/Graph simulations */}
              <div className="p-6 border border-neutral-100 rounded-sm bg-neutral-50">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800 mb-4">Traffic Conversion Timeline</h3>
                <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-neutral-200">
                  {[45, 60, 52, 78, 65, 95, totalIncome > 1000 ? 110 : 85].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-[#D4AF37] font-semibold transition-opacity">${val * 24}</span>
                      <div 
                        style={{ height: `${val * 1.2}px` }} 
                        className="w-full bg-neutral-900 hover:bg-[#D4AF37] rounded-t-sm transition-all duration-500"
                      />
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">Day 0{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catalog Operations stage */}
          {activeTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Form creator */}
              <div className="lg:col-span-5 bg-neutral-50 p-6 rounded border border-neutral-100">
                <h3 className="font-serif-luxury text-base italic text-neutral-900 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" /> Log Custom Product Piece
                </h3>
                
                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={newProd.name}
                      onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                      placeholder="e.g. Soho Premium Wool Gilet"
                      className="w-full p-2.5 border bg-white focus:outline-none rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1 font-mono">Retail Price ($)</label>
                      <input
                        type="number"
                        required
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 border bg-white font-mono rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1 font-mono">Original MSRP ($)</label>
                      <input
                        type="number"
                        required
                        value={newProd.originalPrice}
                        onChange={(e) => setNewProd({ ...newProd, originalPrice: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 border bg-white font-mono rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1">Core Gender</label>
                      <select
                        value={newProd.gender}
                        onChange={(e) => setNewProd({ ...newProd, gender: e.target.value as any })}
                        className="w-full p-2.5 border bg-white rounded-sm"
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                        <option value="unisex">Unisex/Premium</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1">Catalog Section</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full p-2.5 border bg-white rounded-sm"
                      >
                        <option value="Men">Men Section</option>
                        <option value="Women">Women Section</option>
                        <option value="Kids">Kids Section</option>
                        <option value="Footwear">Footwear Section</option>
                        <option value="Accessories">Accessories Section</option>
                        <option value="Beauty">Beauty Section</option>
                        <option value="Lifestyle">Lifestyle Section</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1 font-mono">Display Image URL</label>
                    <input
                      type="text"
                      required
                      value={newProd.image}
                      onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                      className="w-full p-2.5 border bg-white font-mono rounded-sm text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-950 hover:bg-[#D4AF37] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm mt-3 transition-colors cursor-pointer"
                  >
                    Insert New Entry Into Stream
                  </button>
                </form>
              </div>

              {/* Right Catalog manager log */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">Live Showroom Catalog ({products.length})</h3>
                
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 border border-neutral-100 rounded-sm hover:border-red-200 transition-colors flex items-center justify-between text-xs bg-white">
                      <div className="flex gap-3 items-center min-w-0">
                        <img referrerPolicy="no-referrer" src={p.images[0]} alt="" className="w-8 h-10 object-cover rounded bg-neutral-100" />
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate">{p.name}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">Category: {p.category} • SKU: {p.sku}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 items-center shrink-0">
                        <span className="font-bold text-neutral-950 font-mono">${p.price}</span>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors cursor-pointer"
                          title="Purge product piece"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vessel dispatch Orders manager */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">Direct Checkout Receipts ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <p className="text-xs text-neutral-400 uppercase tracking-widest py-10 text-center">No ship tokens active currently.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((or) => (
                    <div key={or.id} className="p-5 border border-neutral-100 rounded bg-neutral-50/50 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-100 pb-3 gap-2">
                        <div>
                          <span className="text-neutral-900 text-xs font-semibold">TOKEN: <span className="font-mono text-[#D4AF37] font-bold">{or.id}</span></span>
                          <span className="text-[10px] text-neutral-400 font-mono ml-4">Placed: {or.date}</span>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-700">Milestone:</span>
                          
                          <select
                            value={or.status}
                            onChange={(e) => onUpdateOrderStatus(or.id, e.target.value as any)}
                            className="bg-white border rounded p-1 text-[10px] uppercase tracking-wider font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped Courier</option>
                            <option value="Delivered">Delivered Home</option>
                            <option value="Returned">Returned Back</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                        <div>
                          <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-1">Configured Client</h4>
                          <p className="font-medium">{or.address.name}</p>
                          <p>{or.address.street}</p>
                          <p>{or.address.city}, {or.address.zipCode}</p>
                          <p className="font-mono text-neutral-500 mt-1">{or.address.phone}</p>
                        </div>

                        <div>
                          <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-1">Purchased Lines ({or.items.length})</h4>
                          <div className="space-y-1">
                            {or.items.map((it, i) => (
                              <p key={i} className="text-[11px] text-neutral-600 truncate">
                                {it.product.name} (x{it.quantity}) • {it.selectedSize}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-1">Transaction Balance</h4>
                          <p>Subtotal: ${or.subtotal}</p>
                          <p className="text-red-600">Discount: -${or.discount}</p>
                          <p>Priority Shipping: ${or.shipping}</p>
                          <p className="font-bold text-neutral-900 border-t border-neutral-100 pt-1 mt-1 text-sm">Debited: ${or.finalTotal}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Marketing Coupons Dashboard */}
          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              <div className="bg-neutral-50 p-6 rounded border border-neutral-100 space-y-4">
                <h3 className="font-serif-luxury text-base italic text-neutral-900 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" /> Create Custom Promotion Coupon
                </h3>
                
                <form onSubmit={handleAddCouponSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1">Campaign Code</label>
                    <input
                      type="text"
                      required
                      value={newCoup.code}
                      onChange={(e) => setNewCoup({ ...newCoup, code: e.target.value })}
                      placeholder="e.g. SOHOVIP30"
                      className="w-full p-2.5 border bg-white focus:outline-none rounded-sm font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1 font-mono">Discount Percent (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="80"
                        required
                        value={newCoup.discount}
                        onChange={(e) => setNewCoup({ ...newCoup, discount: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 border bg-white font-mono rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1 font-mono">Min Spend ($)</label>
                      <input
                        type="number"
                        required
                        value={newCoup.minSpend}
                        onChange={(e) => setNewCoup({ ...newCoup, minSpend: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 border bg-white font-mono rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-neutral-700 mb-1">Description Campaign Detail</label>
                    <input
                      type="text"
                      required
                      value={newCoup.desc}
                      onChange={(e) => setNewCoup({ ...newCoup, desc: e.target.value })}
                      className="w-full p-2.5 border bg-white rounded-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-950 hover:bg-[#D4AF37] text-white text-[10px] uppercase tracking-widest font-bold rounded-sm mt-2 transition-colors cursor-pointer"
                  >
                    Deploy Marketing Promo
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">Active Campaign Vouchers</h3>
                <div className="grid grid-cols-1 gap-3">
                  {COUPONS.map((co) => (
                    <div key={co.code} className="p-4 border border-dashed border-amber-300 rounded bg-amber-400/5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-neutral-900 bg-amber-400 px-2 py-0.5 rounded text-xs leading-none">{co.code}</span>
                        <p className="text-[11px] text-neutral-600 mt-2 font-medium">{co.description}</p>
                        <span className="text-[9px] text-neutral-400 font-mono block mt-1">Min Spend Required: ${co.minSpend}</span>
                      </div>
                      <span className="text-amber-600 font-bold text-lg font-mono">{co.discountPercent}% OFF</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
