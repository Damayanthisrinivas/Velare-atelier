import React, { useState } from "react";
import { X, CheckCircle, CreditCard, ShieldCheck, Cpu, Box, Truck } from "lucide-react";
import { CartItem, Address, PaymentMethod, Order } from "../types";
import { INITIAL_ADDRESSES, INITIAL_PAYMENTS } from "../data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  onOrderPlaced: (order: Order) => void;
  userPoints: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  onOrderPlaced,
  userPoints,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_ADDRESSES[0].id);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    street: "",
    city: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);

  // Payment State
  const [selectedPaymentId, setSelectedPaymentId] = useState(INITIAL_PAYMENTS[0].id);
  const [paymentType, setPaymentType] = useState<"card" | "upi" | "cod">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  });

  // Delivery Speed State
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "armored">("armored");

  if (!isOpen) return null;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      id: "addr-" + Date.now(),
      name: newAddr.name,
      street: newAddr.street,
      city: newAddr.city,
      zipCode: newAddr.zipCode,
      country: newAddr.country,
      phone: newAddr.phone,
      isDefault: false,
    };
    setAddresses([...addresses, created]);
    setSelectedAddressId(created.id);
    setIsAddingAddress(false);
    setNewAddr({ name: "", street: "", city: "", zipCode: "", country: "United States", phone: "" });
  };

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handlePlaceOrder = () => {
    // Generate order confirmation details
    const earnedPoints = Math.round(total / 10);
    const mockOrder: Order = {
      id: "VEL-" + Math.floor(Math.random() * 900000 + 100000),
      date: new Date().toISOString().split("T")[0],
      items: [...cartItems],
      subtotal,
      discount,
      tax,
      shipping: deliveryMethod === "armored" ? shipping + 15 : shipping,
      finalTotal: deliveryMethod === "armored" ? total + 15 : total,
      status: "Processing",
      address: currentAddress,
      payment: paymentType === "card" ? "Credit Card (Visa ending in 4242)" : paymentType === "upi" ? "UPI Instant Gateway" : "Cash on Delivery",
      trackingNumber: "TRK-" + Math.floor(Math.random() * 90000000 + 10000000),
      canReturn: true,
      loyaltyPointsEarned: earnedPoints,
    };

    onOrderPlaced(mockOrder);
    setStep(4); // navigate to success view
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      {/* Modal Stage container */}
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col md:flex-row border border-neutral-100 max-h-[90vh]">
        
        {/* Left main form details */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* Header Close triggers */}
          <div className="flex justify-between items-center mb-8 pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono block">Secured checkout gate</span>
              <h2 className="text-xl font-serif-luxury italic font-light text-neutral-900">Configure Delivery Arrangement</h2>
            </div>
            {step < 4 && (
              <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Status Indicators */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-8">
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm ${step === 1 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'}`}>1. Shipping</span>
              <span className="text-neutral-300">/</span>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm ${step === 2 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'}`}>2. Delivery Method</span>
              <span className="text-neutral-300">/</span>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm ${step === 3 ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500'}`}>3. Encrypted Payment</span>
            </div>
          )}

          {/* Step 1: Shipping Address selection */}
          {step === 1 && (
            <div className="space-y-6">
              {!isAddingAddress ? (
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">Select Registered Destination</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 border rounded-sm cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-black bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <p className="text-xs font-semibold text-neutral-900 mb-1">{addr.name}</p>
                        <p className="text-[11px] text-neutral-600 font-light">{addr.street}</p>
                        <p className="text-[11px] text-neutral-600 font-light">{addr.city}, {addr.zipCode}</p>
                        <p className="text-[11px] text-neutral-600 font-light">{addr.country}</p>
                        <p className="text-[11px] text-neutral-500 font-mono mt-2">{addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full py-3 border border-dashed border-neutral-300 hover:border-black rounded-sm text-xs font-semibold uppercase tracking-widest text-neutral-600 hover:text-black cursor-pointer bg-white"
                  >
                    + Add New Destination Address
                  </button>

                  <div className="pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 bg-black hover:bg-[#D4AF37] text-white text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm transition-all cursor-pointer"
                    >
                      Process Delivery Methods
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800">New Delivery Coordinates</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Addressee Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none uppercase"
                        placeholder="MARCUS SMITH"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Mobile Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none font-mono"
                        placeholder="+1 (555) 0192"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Street Residence Address</label>
                    <input
                      type="text"
                      required
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none"
                      placeholder="e.g. 182 Fifth Avenue, Suite 12B"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Postal Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddr.zipCode}
                        onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none font-mono"
                        placeholder="10010"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">City District</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Sovereign Country</label>
                      <input
                        type="text"
                        required
                        value={newAddr.country}
                        onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 py-3 border border-neutral-300 hover:border-black text-neutral-850 text-xs uppercase tracking-widest font-mono rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-bold rounded"
                    >
                      Save Coordinates
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Step 2: Delivery Method */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800 mb-4">Choose Carriage Speed</h3>
              
              <div className="space-y-3">
                <div
                  onClick={() => setDeliveryMethod("standard")}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex gap-4 ${
                    deliveryMethod === "standard"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex justify-between items-baseline w-full">
                      <span className="text-xs font-semibold text-neutral-900">White-Glove Standard priority Courier</span>
                      <span className="text-xs font-bold text-neutral-900">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Sustainably packaged in luxury recycled cardboard and custom canvas bags. Arrives in 3-5 business days.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryMethod("armored")}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex gap-4 ${
                    deliveryMethod === "armored"
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <Box className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex justify-between items-baseline w-full">
                      <span className="text-xs font-semibold text-neutral-900">Locked Armored Cedar Vault Courier</span>
                      <span className="text-xs font-bold text-[#D4AF37]">+$15 (Priority)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Hand-delivered in a locked structural cedar wood travel organizer with signature conditioning wax. Arrives in 24-48 hours with personal ID handover.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-neutral-300 hover:border-black text-neutral-800 text-xs uppercase tracking-widest font-mono rounded"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-black hover:bg-[#D4AF37] text-white text-xs uppercase tracking-widest font-bold rounded"
                >
                  Configure Secure Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Secure Payment options */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-800 mb-4">Secured Premium Gate</h3>
              
              <div className="flex bg-neutral-100 rounded p-1 mb-4">
                <button
                  onClick={() => setPaymentType("card")}
                  className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded ${paymentType === "card" ? "bg-white text-black shadow-sm" : "text-neutral-500"}`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentType("upi")}
                  className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded ${paymentType === "upi" ? "bg-white text-black shadow-sm" : "text-neutral-500"}`}
                >
                  UPI Portal
                </button>
                <button
                  onClick={() => setPaymentType("cod")}
                  className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded ${paymentType === "cod" ? "bg-white text-black shadow-sm" : "text-neutral-500"}`}
                >
                  Pay on Handover
                </button>
              </div>

              {paymentType === "card" && (
                <div className="space-y-4">
                  <div className="bg-neutral-900 text-white p-5 rounded-md relative overflow-hidden gold-glow">
                    <div className="relative z-10 flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-mono">VÉLARE Atelier Member Card</span>
                        <Cpu className="w-8 h-8 text-amber-300" />
                      </div>
                      <div className="text-base tracking-widest font-mono">•••• •••• •••• 4242</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="block text-[8px] text-neutral-400 uppercase font-mono">Card Holder</span>
                          <span className="text-xs font-mono tracking-wider uppercase">Marcus Aurelius</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-neutral-400 uppercase font-mono">Expiry</span>
                          <span className="text-xs font-mono">12/29</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Standard Card Number</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none font-mono"
                        placeholder="4242 4242 4242 4242"
                        defaultValue="4242424242424242"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Expiry Frame</label>
                        <input
                          type="text"
                          required
                          className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none font-mono"
                          placeholder="MM/YY"
                          defaultValue="12/29"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-neutral-700 tracking-wider mb-1">Security CVV Code</label>
                        <input
                          type="password"
                          required
                          className="w-full border border-neutral-300 p-2.5 text-xs rounded-sm focus:outline-none font-mono"
                          placeholder="•••"
                          defaultValue="555"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentType === "upi" && (
                <div className="text-center py-6 space-y-4">
                  <span className="inline-block bg-amber-400/10 text-[#D4AF37] px-3 py-1 text-[10px] tracking-widest uppercase font-mono rounded">
                    Instant Bank QR Node active
                  </span>
                  <div className="w-40 h-40 bg-zinc-200 mx-auto rounded border border-neutral-300 flex items-center justify-center p-2">
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center border border-dashed border-neutral-400 font-mono text-[9px] text-neutral-400 text-center">
                      <span className="font-bold text-neutral-800 text-xs">VÉLARE PAY</span>
                      <span>Scan to pay ${deliveryMethod === "armored" ? total + 15 : total}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400">Scan via BHIM, GPay, PhonePe or any dynamic bank app.</p>
                </div>
              )}

              {paymentType === "cod" && (
                <div className="bg-amber-400/5 border border-amber-400/20 p-5 rounded-sm space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Atelier cash/card on pickup</h4>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Ensure matching billing physical details and active mobile communication. Our delivery handler expects physical credit card capture or exact cash balance upon premium Cedar box handover.
                  </p>
                </div>
              )}

              <div className="flex gap-2 items-center text-[10px] text-neutral-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Your funds are secured with 256-bit industrial SSL encryption standards.</span>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-neutral-300 hover:border-black text-neutral-800 text-xs uppercase tracking-widest font-mono rounded"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-black hover:bg-[#D4AF37] text-white text-xs uppercase tracking-widest font-bold rounded"
                >
                  Commit Order: ${deliveryMethod === "armored" ? total + 15 : total}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success View */}
          {step === 4 && (
            <div className="text-center py-10 space-y-6">
              <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto animate-bounce" />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 block">Transaction complete</span>
                <h3 className="text-2xl font-serif-luxury italic text-neutral-900 mt-1">Thank you. Your bespoke order is dispatched.</h3>
                <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
                  We have forwarded your purchase ticket and white-glove tracker directly to your email <span className="font-semibold text-neutral-800">damayanthisri7@gmail.com</span>.
                </p>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded border border-neutral-150 inline-block text-left w-full max-w-md space-y-2">
                <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-800 border-b border-neutral-200 pb-2">Purchase Details</h4>
                <div className="flex justify-between text-xs text-neutral-600 mt-2">
                  <span>Standard Dispatch ID:</span>
                  <span className="font-mono text-neutral-900 font-semibold">VEL-{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Loyalty Points Added:</span>
                  <span className="text-amber-500 font-mono font-bold text-neutral-900">+{Math.round(total / 10)} PTS</span>
                </div>
                <div className="flex justify-between text-xs text-[#1c1c1c] font-bold">
                  <span>Total Debit:</span>
                  <span>${deliveryMethod === "armored" ? total + 15 : total}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 bg-black hover:bg-neutral-900 text-white text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm transition-all cursor-pointer"
                >
                  Return to Salon Runway
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right order summary sidebar (hidden in success step) */}
        {step < 4 && (
          <div className="w-full md:w-80 bg-neutral-50 border-t md:border-t-0 md:border-l border-neutral-100 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-800 border-b border-neutral-200 pb-3 font-mono">Bespoke Summary</h3>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img referrerPolicy="no-referrer" src={item.product.images[0]} alt="" className="w-10 h-12 object-cover rounded bg-neutral-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif-luxury italic truncate text-neutral-950 font-medium">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Qty: {item.quantity} • Size: {item.selectedSize}</p>
                    </div>
                    <span className="font-mono text-neutral-800 font-semibold shrink-0">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-4 text-xs">
              <div className="flex justify-between text-neutral-600 font-light">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 font-light">
                <span>Sales Tax (8%)</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between text-neutral-600 font-light">
                <span>Priority Shipping</span>
                <span>{shipping === 0 ? "Complimentary" : `$${shipping}`}</span>
              </div>
              {deliveryMethod === "armored" && (
                <div className="flex justify-between text-[#D4AF37] font-semibold">
                  <span>Cedar Wood Box Upgrade</span>
                  <span>+$15</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-950 font-bold text-sm pt-2 border-t border-neutral-300">
                <span>Total Due</span>
                <span>${deliveryMethod === "armored" ? total + 15 : total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
