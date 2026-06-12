import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ShoppingBag, ChevronRight } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface LookbookSectionProps {
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: any) => void;
}

export default function LookbookSection({ onSelectProduct, onAddToCart }: LookbookSectionProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Define Hotspot positions & coordinate matches to our products
  const hotspots = [
    {
      id: 1,
      x: "48%",
      y: "32%",
      product: PRODUCTS[0], // Cashmere coat
      title: "The Atelier Cashmere Look",
      coordsText: "Italian Cashmere Overcoat styled with Onyx Turtleneck"
    },
    {
      id: 2,
      x: "55%",
      y: "75%",
      product: PRODUCTS[5], // Chelsea cognac boots
      title: "Artisanal Footwear",
      coordsText: "Goodyear-welt Chelsea Leather Boots"
    },
    {
      id: 3,
      x: "30%",
      y: "50%",
      product: PRODUCTS[6], // Suede bucket bag
      title: "Daytime Accessories",
      coordsText: "Buttery split suede bucket bag in Tuscan Ochre"
    }
  ];

  return (
    <div id="lookbook" className="my-20 bg-black text-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-400 font-mono text-xs tracking-widest uppercase block mb-2">Editorial Looks</span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white uppercase">
              VÉLARE Atelier Lookbook
            </h2>
            <p className="text-gray-400 max-w-xl mt-3 text-sm font-light">
              Interactive cinematic captures from our Milan exhibition. Hover or click on the brass luxury anchors to reveal the curated tailored garments.
            </p>
          </div>
          <div className="mt-4 md:mt-0 font-light text-xs text-amber-500 tracking-wider flex items-center gap-1">
            EXPLORE IN 360° CINEMATIC STYLING <ChevronRight className="w-3 s-3" />
          </div>
        </div>

        <div className="grid grid-col-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Lookbook Stage */}
          <div className="lg:col-span-8 relative rounded-sm overflow-hidden bg-neutral-900 border border-neutral-800">
            <img 
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1500" 
              alt="Luxury editorial coat display" 
              className="w-full max-h-[640px] object-cover opacity-85 transition-transform duration-1000 hover:scale-105"
            />
            {/* Absolute Hotspot markers */}
            {hotspots.map((spot) => (
              <div 
                key={spot.id}
                className="absolute"
                style={{ top: spot.y, left: spot.x }}
              >
                <div className="relative">
                  <button 
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all outline-none"
                    title={spot.title}
                  >
                    <Plus className={`w-4 h-4 transition-transform duration-300 ${activeHotspot === spot.id ? 'rotate-45' : ''}`} />
                  </button>
                  {/* Pulse wave overlay */}
                  <span className="absolute -inset-1.5 rounded-full border border-amber-400 opacity-75 animate-ping pointer-events-none"></span>

                  {/* Hotspot details card popup */}
                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-64 bg-white text-black p-4 rounded-sm shadow-xl border border-neutral-200"
                      >
                        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-600 block mb-1">Curated Match</span>
                        <h4 className="font-sans font-medium text-xs text-neutral-900 line-clamp-1">{spot.product.name}</h4>
                        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{spot.coordsText}</p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                          <span className="font-sans font-semibold text-xs text-neutral-900">${spot.product.price}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(spot.product);
                            }}
                            className="bg-black text-white hover:bg-neutral-800 px-3 py-1 text-[10px] rounded-sm flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <ShoppingBag className="w-2.5 h-2.5" /> Wear Look
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* Lookbook editorial details sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-l border-amber-400 pl-4 py-2">
              <h3 className="font-sans font-semibold text-lg text-white uppercase tracking-wider">The Milan Corridor</h3>
              <p className="text-gray-400 text-xs font-light mt-1">Ref. Milan Autumn/Winter Catalogue</p>
            </div>
            
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              Tailoring should always represent confidence, architecture, and discretion. VÉLARE Atelier merges Italian handwork with premium structural cashmere.
            </p>

            <div className="space-y-4">
              {hotspots.map((h) => (
                <div 
                  key={h.id}
                  onClick={() => {
                    setActiveHotspot(h.id);
                    onSelectProduct(h.product);
                  }}
                  className={`p-3 rounded-sm border cursor-pointer transition-all ${
                    activeHotspot === h.id 
                    ? 'border-amber-400 bg-neutral-900/80 shadow-md' 
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      referrerPolicy="no-referrer"
                      src={h.product.images[0]} 
                      alt={h.product.name} 
                      className="w-12 h-12 rounded-sm object-cover border border-neutral-800" 
                    />
                    <div>
                      <span className="bg-amber-400/10 text-amber-400 text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-sm">Hotspot #0{h.id}</span>
                      <h4 className="text-xs font-medium text-white line-clamp-1 mt-1">{h.product.name}</h4>
                      <div className="flex gap-2 items-center text-[10px] text-gray-400 mt-0.5">
                        <span className="text-white font-semibold">${h.product.price}</span>
                        <span>•</span>
                        <span>{h.product.brand}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-amber-500 font-mono tracking-wider text-center uppercase border border-amber-400/25 p-2 rounded-sm bg-amber-400/5">
              🎟️ Apply code: <span className="font-bold">VELARE20</span> for 20% on any item
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
