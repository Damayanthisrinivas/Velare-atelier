export interface Review {
  id: string;
  username: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
  helpfulCount: number;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  material: string;
  stock: number;
  isTrending?: boolean;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  discount: number; // percentage
  story?: string;
  specifications: Specification[];
  shippingInfo: string;
  sku: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
}

export interface CartItem {
  id: string; // SKU or dynamic ID (productId + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
  savedForLater?: boolean;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  cardholder: string;
  last4: string;
  expiry: string;
  brand: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  finalTotal: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  address: Address;
  payment: string;
  trackingNumber?: string;
  canReturn?: boolean;
  loyaltyPointsEarned: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
  expiryDate: string;
  isApplied?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  memberSince: string;
  referralCode: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'text' | 'recommendations' | 'visual_analysis';
  products?: Product[];
}
