import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Upload, Shirt, ArrowRight, Loader2 } from "lucide-react";
import { Product, ChatMessage } from "../types";

interface AiStylistProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: any) => void;
}

export default function AiStylist({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}: AiStylistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "wel-1",
      sender: "assistant",
      text: "Welcome to VÉLARE Atelier! I am Elena Geller, your AI Visual Director & Personal Stylist. Tell me what event or silhouette structure you are matching today, or upload any look to match with our catalog details.",
      timestamp: "Just Now",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Ready presets for visual search matchmaking
  const stylePresets = [
    {
      name: "Savile Overcoat Elegance",
      image: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&q=80&w=200",
      description: "Elegant trench coat style",
      mime: "image/jpeg"
    },
    {
      name: "Tuscan Day Suede Outfits",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
      description: "Warm leather accessories look",
      mime: "image/jpeg"
    },
    {
      name: "Minimalist High Sport",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=200",
      description: "Futuristic footwear styling",
      mime: "image/jpeg"
    }
  ];

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Text Chat dispatch to /api/chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error("Chat api failed");
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: "ast-" + Date.now(),
        sender: "assistant",
        text: data.text,
        products: data.products,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "err-" + Date.now(),
        sender: "assistant",
        text: "Pardon me, my neural fabric requires fine balancing. Please verify your internet connection or check your GEMINI_API_KEY.",
        timestamp: "Just Now"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert image URL or uploaded file to base64 for /api/visual-search
  const triggerVisualSearch = async (imageUrl: string, mimeType: string, isPreset: boolean = false) => {
    setVisualLoading(true);
    
    // Add user placeholder message
    const userMsg: ChatMessage = {
      id: "user-vis-" + Date.now(),
      sender: "user",
      text: `[Visual Reference Scanned]: Looking for products similar to ${isPreset ? imageUrl : "your uploaded look"}...`,
      timestamp: "Just Now"
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      let base64Data = "";
      if (isPreset) {
        // Fetch preset image and convert to Base64
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(blob);
        });
      } else {
        base64Data = imageUrl.split(",")[1];
      }

      const searchResp = await fetch("/api/visual-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mimeType: mimeType })
      });

      if (!searchResp.ok) {
        throw new Error("Visual search api failed");
      }

      const data = await searchResp.json();
      setMessages(prev => [...prev, {
        id: "ast-vis-" + Date.now(),
        sender: "assistant",
        text: `[Visual Search Match Completed] ${data.analysis}`,
        products: data.products,
        timestamp: "Just Now",
        type: "visual_analysis"
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "err-vis-" + Date.now(),
        sender: "assistant",
        text: "Pardon, I could not scan that precise resolution. Try scanning again with a smaller file size or select from our standard design presets below.",
        timestamp: "Just Now"
      }]);
    } finally {
      setVisualLoading(false);
    }
  };

  // File Upload input element selector handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type;
    const reader = new FileReader();
    reader.onloadend = () => {
      triggerVisualSearch(reader.result as string, mimeType, false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      {/* Backdrop Closer */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Actual Drawer Container */}
      <div className="relative w-full max-w-lg bg-neutral-950 text-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-800 animate-fade-slide">
        
        {/* Chat Drawer Header */}
        <div className="p-6 border-b border-neutral-900 bg-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400 text-black rounded-full">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Elena Geller</h2>
              <p className="text-[9px] font-mono text-amber-400 tracking-wider uppercase">VÉLARE AI VISUAL DIRECTOR</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-500 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message feed stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
              <div 
                className={`max-w-[85%] rounded-sm p-4 text-xs leading-relaxed ${
                  m.sender === "user" 
                    ? "bg-[#D4AF37] text-black font-medium rounded-tr-none" 
                    : "bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-tl-none whitespace-pre-line"
                }`}
              >
                {m.text}

                {/* Inline products attached to stylist suggestions */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-3">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-semibold">Matched Silhouette Items:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {m.products.map((p) => (
                        <div 
                          key={p.id}
                          className="p-2.5 bg-black rounded border border-neutral-800 flex gap-2.5 items-center hover:border-[#D4AF37] transition-all cursor-pointer"
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                        >
                          <img referrerPolicy="no-referrer" src={p.images[0]} alt="" className="w-10 h-12 object-cover object-top rounded-sm shrink-0 bg-neutral-900" />
                          <div className="min-w-0">
                            <h4 className="text-[11px] truncate font-serif-luxury italic text-neutral-100">{p.name}</h4>
                            <span className="text-[10px] font-semibold text-neutral-300 font-mono">${p.price}</span>
                            <span className="block text-[8px] text-amber-500 uppercase font-mono">View →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-neutral-600 font-mono mt-1.5 px-1">{m.timestamp}</span>
            </div>
          ))}

          {/* Load indicator */}
          {(isLoading || visualLoading) && (
            <div className="flex items-center gap-2 bg-neutral-900/60 p-3 rounded-sm w-36 text-neutral-400 text-xs font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing look...</span>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Visual presets scanner console */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-900 space-y-3">
          <span className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
            ⚡ Option 1: Live Visual Match (Upload or Select Style Silhouette)
          </span>
          
          <div className="flex gap-2 items-center overflow-x-auto pb-1">
            
            {/* Real File Upload click trigger */}
            <label className="flex flex-col items-center justify-center p-2.5 rounded border border-dashed border-neutral-800 hover:border-amber-400 bg-neutral-900/30 text-neutral-400 hover:text-white cursor-pointer shrink-0 transition-colors w-24">
              <Upload className="w-4 h-4 mb-1 text-amber-400" />
              <span className="text-[9px] uppercase tracking-wider">Device Image</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden" 
              />
            </label>

            {/* Presets loops */}
            {stylePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => triggerVisualSearch(preset.image, "image/jpeg", true)}
                className="flex items-center gap-2 p-1.5 rounded border border-neutral-900 hover:border-[#D4AF37]/50 bg-neutral-900/10 text-left shrink-0 transition-all cursor-pointer group"
              >
                <img referrerPolicy="no-referrer" src={preset.image} alt="" className="w-8 h-8 rounded-sm object-cover" />
                <div className="max-w-[80px]">
                  <p className="text-[9px] text-neutral-300 font-medium truncate group-hover:text-amber-400 leading-tight">{preset.name}</p>
                  <p className="text-[8px] text-neutral-500 truncate leading-none">{preset.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text chat input form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-black border-t border-neutral-900">
          <span className="block text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
            💡 Option 2: Live Conversation
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask: 'Recommend a winter dress suite' or 'Is cashmere dry clean only?'"
              className="flex-1 bg-neutral-900 border border-neutral-800 text-xs rounded-sm p-3.5 focus:outline-none focus:border-[#D4AF37] placeholder-neutral-500 text-white"
            />
            <button
              type="submit"
              className="bg-white hover:bg-amber-400 text-black p-3.5 rounded-sm cursor-pointer transition-colors"
              title="Send message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
