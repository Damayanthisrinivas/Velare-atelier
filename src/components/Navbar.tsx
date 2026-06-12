import React, { useState } from "react";
import { Search, Heart, ShoppingBag, User, Settings2, Menu, X } from "lucide-react";
import { Product } from "../types";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (page: string) => void;
  onSearch: (term: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onToggleCart: () => void;
  onToggleStylist: () => void;
  openAdmin: () => void;
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onNavigate,
  onSearch,
  activeCategory,
  onSelectCategory,
  onToggleCart,
  onToggleStylist,
  openAdmin,
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onNavigate("catalog");
  };

  const categories = ["All", "Women", "Men", "Kids", "Footwear", "Accessories", "Beauty", "Lifestyle"];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-900 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Elegant Category Navigation (Left side on Desktop) */}
          <div className="hidden md:flex gap-6 lg:gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onNavigate("catalog");
                }}
                className={`hover:text-[#D4AF37] transition-colors cursor-pointer relative py-1 ${
                  (cat === "All" && activeCategory === "") || activeCategory === cat
                    ? "text-neutral-950 font-semibold"
                    : ""
                }`}
              >
                {cat}
                {((cat === "All" && activeCategory === "") || activeCategory === cat) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]"></span>
                )}
              </button>
            ))}
          </div>

          {/* VÉLARE Atelier Brand Logo (Absolute center on Desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button 
              onClick={() => {
                onSelectCategory("");
                onNavigate("home");
              }}
              className="text-2xl md:text-3.5xl font-serif-luxury italic font-light tracking-tighter cursor-pointer text-neutral-950 hover:opacity-85 transition-opacity"
            >
              VÉLARE <span className="text-[10px] not-italic uppercase tracking-[0.4em] font-mono font-medium text-[#D4AF37]">Atelier</span>
            </button>
          </div>

          {/* Right Menu Icons */}
          <div className="flex gap-4 md:gap-6 items-center">
            
            {/* Search Container bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center border-b border-neutral-300 pb-1 w-44 hover:border-neutral-800 transition-colors">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-[11px] tracking-widest focus:outline-none placeholder-neutral-400 uppercase w-full pr-6"
              />
              <button type="submit" className="absolute right-0 text-neutral-600 hover:text-[#D4AF37]">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* AI Stylist Prompt Trigger Button */}
            <button
              onClick={onToggleStylist}
              className="relative px-3 py-1.5 border border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 text-[#D4AF37] text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Speak with Live AI Stylist"
            >
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping"></span>
              AI Stylist
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => onNavigate("wishlist")}
              className="relative text-neutral-800 hover:text-[#D4AF37] cursor-pointer transition-colors"
            >
              <Heart className="w-5 h-5 font-light" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={onToggleCart}
              className="relative text-neutral-800 hover:text-[#D4AF37] cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-5 h-5 font-light" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dashboard Navigation */}
            <button 
              onClick={() => onNavigate("account")}
              className="text-neutral-800 hover:text-[#D4AF37] cursor-pointer transition-colors"
              title="My Account"
            >
              <User className="w-5 h-5 font-light" />
            </button>

            {/* Control Panel Toggle */}
            <button 
              onClick={openAdmin}
              className="text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors hidden md:block"
              title="Admin Panel"
            >
              <Settings2 className="w-5 h-5 font-light" />
            </button>
          </div>
        </div>

        {/* Secondary Category SubNavigation for Large Screen */}
        <div className="hidden md:flex justify-center border-t border-neutral-50 py-3 gap-6 lg:gap-10 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {categories.slice(4).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onNavigate("catalog");
              }}
              className={`hover:text-[#D4AF37] cursor-pointer transition-colors ${
                activeCategory === cat ? "text-neutral-950 font-semibold" : ""
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => onNavigate("about")} 
            className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
          >
            Philosophy
          </button>
          <button 
            onClick={() => onNavigate("contact")} 
            className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
          >
            Atelier Desk
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-4 space-y-4 shadow-lg animate-fade-slide absolute left-0 w-full z-40">
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-neutral-200 rounded-sm px-3 py-2">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-[11px] tracking-widest focus:outline-none placeholder-neutral-400 uppercase w-full"
            />
            <button type="submit" className="text-neutral-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-3 font-semibold text-xs uppercase tracking-widest text-[#1c1c1c]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat === "All" ? "" : cat);
                  setMobileMenuOpen(false);
                  onNavigate("catalog");
                }}
                className="text-left py-1.5 hover:text-[#D4AF37] transition-all"
              >
                {cat} Clothing & Gear
              </button>
            ))}
          </div>
          <div className="border-t border-neutral-100 pt-3 flex flex-col gap-3">
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate("about"); }}
              className="text-left text-neutral-500 hover:text-black text-[11px] uppercase tracking-widest"
            >
              Brand Story
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavigate("contact"); }}
              className="text-left text-neutral-500 hover:text-black text-[11px] uppercase tracking-widest"
            >
              Contact Support
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); openAdmin(); }}
              className="text-left text-[#D4AF37] hover:text-[#b89327] text-[11px] uppercase tracking-widest font-bold"
            >
              Admin Cockpit ⚙️
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
