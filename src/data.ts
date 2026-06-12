import { Product, Coupon, Address, PaymentMethod, Order, UserProfile, BlogArticle } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "L'Atelier Cashmere Overcoat",
    brand: "VÉLARE Atelier",
    description: "Indulge in absolute modern refinement. Handcrafted from dense, ultra-soft grade-A Italian cashmere, this overcoat balances historic tailoring with structured modern lapels. Fully lined in signature heavy silk jacquard.",
    category: "Men",
    subcategory: "Jackets",
    price: 890,
    originalPrice: 1150,
    images: [
      "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 38,
    reviews: [
      {
        id: "rev-1-1",
        username: "Alexander V.",
        rating: 5,
        date: "2026-05-18",
        comment: "The drape and weight are absolutely supreme. Feels like classic SAVILE ROW tailoring updated for the contemporary wardrobe. Worth every cent.",
        helpfulCount: 14
      },
      {
        id: "rev-1-2",
        username: "Julian K.",
        rating: 4.8,
        date: "2026-06-01",
        comment: "Excellent warmth without the heavy bulk. The silk lining slides effortlessly over knitwear.",
        helpfulCount: 5
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal Noir", hex: "#1C1C1C" },
      { name: "Cinder Caramel", hex: "#C29B70" },
      { name: "Atelier Navy", hex: "#1E293B" }
    ],
    material: "90% Italian Virgin Cashmere, 10% Mulberry Silk",
    stock: 12,
    isTrending: true,
    isNewArrival: true,
    discount: 22,
    sku: "VEL-MC-001",
    gender: "men",
    specifications: [
      { label: "Fabric Origin", value: "Tuscany, Italy" },
      { label: "Weight", value: "520 GSM" },
      { label: "Fit", value: "Tailored drape, true to size" },
      { label: "Care", value: "Dry clean only by leather & wool specialists" }
    ],
    shippingInfo: "Complimentary premium carbon-neutral priority shipping with custom dust cover.",
    story: "Born in our Milanese pattern room, the Atelier Overcoat spent 18 months in prototype testing to guarantee a canvas that moves as a natural extension of the wearer's shoulders."
  },
  {
    id: "prod-2",
    name: "Aura Pleated Crêpe Silk Dress",
    brand: "VÉLARE Atelier",
    description: "A cascade of fluid micro-pleats that dances with every step. Made from hand-harvested mulberry silk crêpe-de-chine, this architectural gown features a subtle asymmetric neckline, structured hidden corsetry, and an raw edge hem.",
    category: "Women",
    subcategory: "Dresses",
    price: 720,
    originalPrice: 720,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 24,
    reviews: [
      {
        id: "rev-2-1",
        username: "Eliza M.",
        rating: 5,
        date: "2026-04-12",
        comment: "Stunning movement. Wore it to an art gala and received continuous compliments. The pleats are incredibly resilient and do not crease easily.",
        helpfulCount: 19
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Imperial Marigold", hex: "#EAB308" },
      { name: "Atelier Alabaster", hex: "#FAFAFA" },
      { name: "Noir Onyx", hex: "#0F172A" }
    ],
    material: "100% Organic Mulberry Silk",
    stock: 8,
    isTrending: true,
    discount: 0,
    sku: "VEL-WD-002",
    gender: "women",
    specifications: [
      { label: "Pleat Type", value: "Permanent geometric fold accordion" },
      { label: "Closure", value: "Concealed side zipper" },
      { label: "Lining", value: "Double layered silk chiffon floor lining" },
      { label: "Origin", value: "Lyon, France" }
    ],
    shippingInfo: "Shipped in climate-controlled signature flat keepsake boxes with luxury hangers.",
    story: "Designed to capture the soft breeze of early summer in Amalfi. Our lead pattern-maker molded this silhouette from a single, continuous sweep of silk to minimize seams."
  },
  {
    id: "prod-3",
    name: "Classic Heritage Leather Biker Jacket",
    brand: "VÉLARE Atelier",
    description: "Crafted from hand-selected full-grain lambskin that molds uniquely to your frame over time. Features custom brass hardware coated in matte gold, structured shoulder articulators, and dynamic zippered utility pockets.",
    category: "Men",
    subcategory: "Jackets",
    price: 650,
    originalPrice: 850,
    images: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewsCount: 56,
    reviews: [
      {
        id: "rev-3-1",
        username: "Marcus T.",
        rating: 5,
        date: "2026-03-30",
        comment: "This leather is like butter. Heavy but incredibly soft right out of the box. True modern luxury.",
        helpfulCount: 8
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Midnight Raven", hex: "#111827" },
      { name: "Burnt Coffee", hex: "#451A03" }
    ],
    material: "100% Full-Grain Napa Lambskin Leather, Satin-Twill Lining",
    stock: 5,
    isTrending: true,
    isFlashSale: true,
    discount: 23,
    sku: "VEL-MJ-003",
    gender: "men",
    specifications: [
      { label: "Hardware", value: "YKK bespoke matte brass, nickel-plated" },
      { label: "Leather Weight", value: "1.2mm robust premium lambskin" },
      { label: "Internal Pockets", value: "Twin passport security pockets" }
    ],
    shippingInfo: "Complimentary luxury delivery with dedicated leather-care treatment cream included.",
    story: "An homage to raw mid-century rebellion, elevated through Parisian silhouette contours."
  },
  {
    id: "prod-4",
    name: "The Monaco Hand-Stitched Leather Watch",
    brand: "VÉLARE Horology",
    description: "An absolute masterclass in luxury horology. Features a fully mechanical automatic movement with 42-hour reserve, custom hand-carved minimalist face, sapphire crystal glass, and a deployment strap carved from vegetable-dyed Tuscan leather.",
    category: "Accessories",
    subcategory: "Watches",
    price: 1250,
    originalPrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 16,
    reviews: [
      {
        id: "rev-4-1",
        username: "Christopher G.",
        rating: 5,
        date: "2026-05-02",
        comment: "The sweeping seconds hand is exceptionally smooth. Keeps perfect time. The skeleton back showcasing the movement is mesmerizing.",
        helpfulCount: 22
      }
    ],
    sizes: ["Unisize (40mm face)"],
    colors: [
      { name: "Gold Accent Slate", hex: "#D4AF37" },
      { name: "Silver Accent Obsidian", hex: "#94A3B8" }
    ],
    material: "316L Surgical Stainless Steel, Vegetable-Tanned Italian Leather, Sapphire Crystal",
    stock: 3,
    isNewArrival: true,
    discount: 16,
    sku: "VEL-AC-004",
    gender: "unisex",
    specifications: [
      { label: "Caliber", value: "Atelier Automatic Cal. 9015" },
      { label: "Power Reserve", value: "42 Hours" },
      { label: "Water Resistance", value: "50m (5 ATM)" },
      { label: "Glass", value: "Double-domed anti-reflective Sapphire" }
    ],
    shippingInfo: "Ships via fully-insured armored courier in a lockable lacquer wooden presentation chest.",
    story: "Crafted in glass-walled clean rooms in Switzerland, individual Monaco watch builds take 72 hours of meticulous micro-assembly."
  },
  {
    id: "prod-5",
    name: "Aviator Riviera Gold Sunglasses",
    brand: "VÉLARE Optics",
    description: "Inspired by the classic coastal jet-set lifestyle. Constructed with an exceptionally light titanium-wire chassis flashed in 18k yellow gold, featuring luxury Japanese polarized nylon lenses with multi-layer back anti-reflective coating.",
    category: "Accessories",
    subcategory: "Sunglasses",
    price: 340,
    originalPrice: 340,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.6,
    reviewsCount: 41,
    reviews: [
      {
        id: "rev-5-1",
        username: "Sophia L.",
        rating: 5,
        date: "2026-05-22",
        comment: "Incredibly light! Forgot they were even on my face. Lenses offer unparalleled clarity and contrast, especially near water.",
        helpfulCount: 7
      }
    ],
    sizes: ["Unisize"],
    colors: [
      { name: "18k Brushed Gold", hex: "#D4AF37" },
      { name: "Polished Acetate Black", hex: "#111827" }
    ],
    material: "Pure Titanium Chassis, 18k Premium Gold Plating, Japanese Nylon Lenses",
    stock: 15,
    isTrending: true,
    discount: 0,
    sku: "VEL-AS-005",
    gender: "unisex",
    specifications: [
      { label: "UV Rating", value: "100% UVA/UVB category 3 filter" },
      { label: "Weight", value: "11 grams (ultra-featherweight)" },
      { label: "Temples", value: "Adjustable comfort bent ear pads" }
    ],
    shippingInfo: "Shipped in hand-stitched leather folding pocket case with cleaning cloth.",
    story: "Bringing a luxurious edge to standard protective eyewear, handcrafted entirely in Fukui, Japan."
  },
  {
    id: "prod-6",
    name: "Classic Chelsea Cognac Boots",
    brand: "VÉLARE Footwear",
    description: "Constructed utilizing the historic Goodyear welt technique, making these boots recraftable for decades. Formed from hand-burnished French calfskin leather with a secure studded rubber outsole, tailored elastic side gores, and sleek leather pull tabs.",
    category: "Footwear",
    subcategory: "Formal Shoes",
    price: 495,
    originalPrice: 495,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 33,
    reviews: [
      {
        id: "rev-6-1",
        username: "Ethan R.",
        rating: 5,
        date: "2026-04-20",
        comment: "Excellent support and sleek toe profile. Easily pairs with sleek evening suits or premium denim.",
        helpfulCount: 11
      }
    ],
    sizes: ["8", "9", "10", "11", "12"],
    colors: [
      { name: "Amber Cognac", hex: "#9F522 B" }, // Amber brown
      { name: "Velvet Obsidian", hex: "#000000" }
    ],
    material: "Premium French Calfskin Leather, Cork Layer Fill, Goodyear Welt",
    stock: 7,
    isNewArrival: true,
    discount: 0,
    sku: "VEL-FF-006",
    gender: "men",
    specifications: [
      { label: "Sole", value: "Bespoke stacked premium leather with rubber protectors" },
      { label: "Construction", value: "Goodyear welt 270-degree stitch" },
      { label: "Lining", value: "Soft vachetta leather breathable liner" }
    ],
    shippingInfo: "Complimentary premium priority delivery in custom flannel travel sleeves.",
    story: "Crafted in a family-run workshop in Spain using hides that are traceably sourced from free-range Alpine pastures."
  },
  {
    id: "prod-7",
    name: "Atelier Suede Bucket Bag",
    brand: "VÉLARE Atelier",
    description: "The epitome of effortless daytime sophistication. Handcrafted from velvety Italian split suede leather with a durable full-grain calfskin structural base, magnetic closure, and high-contrast dual-length removable straps.",
    category: "Accessories",
    subcategory: "Bags",
    price: 520,
    originalPrice: 650,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewsCount: 19,
    reviews: [
      {
        id: "rev-7-1",
        username: "Clara S.",
        rating: 4,
        date: "2026-05-15",
        comment: "Love the buttery texture! It is spacious enough for a small tablet, wallet, keys and makeup. Only wish there was a zippered internal dividing pocket.",
        helpfulCount: 3
      }
    ],
    sizes: ["Standard Medium"],
    colors: [
      { name: "Tuscan Ochre", hex: "#B45309" },
      { name: "Nera Matte", hex: "#1E293B" }
    ],
    material: "Premium Italian Suede Leather, Full-Grain Vachetta Leather base, polished hardware",
    stock: 4,
    isTrending: true,
    isFlashSale: true,
    discount: 20,
    sku: "VEL-AB-007",
    gender: "women",
    specifications: [
      { label: "Closure", value: "Premium magnetic clasp and toggle drawcord" },
      { label: "Strap Drop", value: "Adustable 35cm to 55cm" },
      { label: "Internal details", value: "Suede-backed slide patch pocket" }
    ],
    shippingInfo: "Package includes fully-traceable luxury courier delivery and protective brushed cotton care envelope.",
    story: "An exercise in soft sculpture, our bucket bag eliminates rigid framing so the leather contours naturally to your pose."
  },
  {
    id: "prod-8",
    name: "Runner Avant-Garde Minimal Sneakers",
    brand: "VÉLARE Footwear",
    description: "A flawless athletic silhouette stripped of any unnecessary branding. Produced from premium water-repellent performance knitwear paired with full-grain leather details and an ultra-bouncy, hand-molded foam/rubber modular outsole.",
    category: "Footwear",
    subcategory: "Sneakers",
    price: 280,
    originalPrice: 280,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.5,
    reviewsCount: 61,
    reviews: [
      {
        id: "rev-8-1",
        username: "Derrick J.",
        rating: 5,
        date: "2026-06-03",
        comment: "Like walking on absolute clouds, but is structured enough for dinner dates. Fits like a custom glove.",
        helpfulCount: 9
      }
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Alabaster Aura", hex: "#F3F4F6" },
      { name: "Obsidian Core", hex: "#111827" }
    ],
    material: "Recycled Ocean Knitwear, Full-Grain Leather, Bio-based TPU foam Outsole",
    stock: 14,
    isTrending: true,
    discount: 0,
    sku: "VEL-FS-008",
    gender: "unisex",
    specifications: [
      { label: "Water Resistance", value: "DWR nanotechnology water-repellent coating" },
      { label: "Weight", value: "210g per shoe" },
      { label: "Insole", value: "Memory foam with bamboo fiber lining" }
    ],
    shippingInfo: "Shipped in ecological recycled fiber container boxes with carbon filter freshening inserts.",
    story: "Crafted to blend high performance and high fashion, transitioning effortlessly from active morning sessions to formal executive meetings."
  },
  {
    id: "prod-9",
    name: "Elite Silk Satin Kurti Set",
    brand: "VÉLARE Ethnic",
    description: "A celebration of modern heritage. Made from extremely lustrous heavy silk satin, this kurti features meticulous hand-carved zardozi gold bullion embroidery at the collar and cuff boundaries, matched with sleek straight-leg trousers.",
    category: "Women",
    subcategory: "Kurtis",
    price: 380,
    originalPrice: 480,
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 12,
    reviews: [
      {
        id: "rev-9-1",
        username: "Priya S.",
        rating: 5,
        date: "2026-05-19",
        comment: "The silk quality is top-tier (heavy and beautiful sheen). Embroidery is incredibly fine. Absolute perfection for festive events.",
        helpfulCount: 10
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Emerald Splendor", hex: "#065F46" },
      { name: "Royal Magenta", hex: "#9D174D" }
    ],
    material: "100% Pure Banarasi Silk-Satin, Zari bullions",
    stock: 6,
    isNewArrival: true,
    discount: 21,
    sku: "VEL-WK-009",
    gender: "women",
    specifications: [
      { label: "Embroidery Type", value: "Handcrafted Zardozi bullion finish" },
      { label: "Length", value: "44 inches (Calf Length)" },
      { label: "Pant fabric", value: "Straight comfort stretch silk pants" }
    ],
    shippingInfo: "Ships with custom garment dust cover and high-end golden brand clasp hangers.",
    story: "Fused with traditional looms and ultra-modern straight-cut minimal patterns fit for the contemporary world global stage."
  },
  {
    id: "prod-10",
    name: "Youth Premium Denim Trench Coat",
    brand: "VÉLARE Petite",
    description: "A playful take on high-end streetwear for younger trendsetters. Expertly constructed from heavy-washed Japanese selvedge denim, featuring oversized metallic buttons, twin storm flaps, and a secure fabric belt.",
    category: "Kids",
    subcategory: "Boys",
    price: 180,
    originalPrice: 220,
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewsCount: 15,
    reviews: [
      {
        id: "rev-10-1",
        username: "Maya G.",
        rating: 5,
        date: "2026-05-01",
        comment: "Extremely rugged yet stylish! My son looks so classy in it and it washes like a dream. Highly recommend.",
        helpfulCount: 4
      }
    ],
    sizes: ["4-5 yrs", "6-7 yrs", "8-9 yrs", "10-11 yrs"],
    colors: [
      { name: "Bleached Indigo", hex: "#3B82F6" },
      { name: "Deep Charcoal Wash", hex: "#374151" }
    ],
    material: "100% Cotton Selvedge Denim, Brushed Cotton lining",
    stock: 9,
    isNewArrival: true,
    discount: 18,
    sku: "VEL-KC-010",
    gender: "kids",
    specifications: [
      { label: "Denim Weight", value: "11.5 oz robust canvas" },
      { label: "Pockets", value: "Twin front utility deep hand pockets" },
      { label: "Buttons", value: "Signature logo engraved zinc snaps" }
    ],
    shippingInfo: "Packed in children's organic cotton tote bag packaging.",
    story: "Bringing tailoring excellence down to children's wear so families can coordinates silhouettes across generations."
  },
  {
    id: "prod-11",
    name: "Petite Linen Summer Peplum Set",
    brand: "VÉLARE Petite",
    description: "Incredible summertime breathability for girls. Hand-loomed from European flax-linen, this set comprises a button-down peplum bodice with matching ruffled hem-drawstring casual shorts.",
    category: "Kids",
    subcategory: "Girls",
    price: 140,
    originalPrice: 140,
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.6,
    reviewsCount: 8,
    reviews: [],
    sizes: ["4-5 yrs", "6-7 yrs", "8-9 yrs"],
    colors: [
      { name: "Soft Sage", hex: "#A7F3D0" },
      { name: "Sand Dune Cream", hex: "#FEF3C7" }
    ],
    material: "100% Belgian Flax Organic Linen",
    stock: 11,
    discount: 0,
    sku: "VEL-KS-011",
    gender: "kids",
    specifications: [
      { label: "Fabric Type", value: "Naturally softened organic flax-linen" },
      { label: "Hypoallergenic", value: "Tested dermatologically, zero chemicals used" },
      { label: "Drying", value: "Air dry recommended for linen preservation" }
    ],
    shippingInfo: "Ecom carbon-neutral express envelope delivery.",
    story: "Crafted specifically with extra-wide hem room to keep playtime entirely active while retaining structured elegance."
  },
  {
    id: "prod-12",
    name: "Botanical Restoring Elixir Face Serum",
    brand: "VÉLARE Beauty",
    description: "The crown jewel of modern skincare. A high-potency lightweight restoring elixir containing advanced bio-identical peptides, cold-pressed white truffle extract, and organic camellia flower oil. Delivers supreme skin elasticity and instant hydration.",
    category: "Beauty",
    subcategory: "Skincare",
    price: 145,
    originalPrice: 145,
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 72,
    reviews: [
      {
        id: "rev-12-1",
        username: "Valerie P.",
        rating: 5,
        date: "2026-05-29",
        comment: "This has flattened dry lines around my eyes in 2 weeks. The smell is incredibly therapeutic like an expensive Alpine spa.",
        helpfulCount: 26
      }
    ],
    sizes: ["50ml", "100ml"],
    colors: [
      { name: "Amber Glass Pipette", hex: "#B45309" }
    ],
    material: "Bio-Peptides, White Truffle Ferment, Organic Camellia Extract",
    stock: 20,
    isTrending: true,
    discount: 0,
    sku: "VEL-BS-012",
    gender: "unisex",
    specifications: [
      { label: "Skin Type", value: "Suitable for sensitive, dry and aged skin patterns" },
      { label: "pH Level", value: "5.5 balanced" },
      { label: "Formula", value: "Cruelty-free, paraben-free, 98.7% botanical organic" }
    ],
    shippingInfo: "Ships in heavy shock-resistant white foam cases protecting active compounds from light.",
    story: "Constructed in our Swiss laboratory using low-temperature micro-encapsulation to keep active peptides fully intact until application."
  },
  {
    id: "prod-13",
    name: "Voyager Leather Weekender Duffle",
    brand: "VÉLARE Travel",
    description: "Crafted for luxurious cross-border escapes. This duffle is formed from robust, wax-coated oiled cowhide leather, featuring heavy hand-hammered steel buckles, a massive canvas spacious interior, passport slot, and dedicated wet-shoes compartment.",
    category: "Lifestyle",
    subcategory: "Travel Essentials",
    price: 520,
    originalPrice: 650,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 17,
    reviews: [
      {
        id: "rev-13-1",
        username: "James B.",
        rating: 5,
        date: "2026-06-08",
        comment: "Fits outstandingly in any overhead bin. The leather has developed a stunning espresso-colored patina already after 3 flights. Superb hardware.",
        helpfulCount: 4
      }
    ],
    sizes: ["45L Cabin Approved"],
    colors: [
      { name: "Espresso Waxed Brown", hex: "#5C3A21" },
      { name: "Sleek Matte Obsidian", hex: "#1A1A1A" }
    ],
    material: "Full-Grain Oiled Pull-Up Cowhide, Heavy Military-Grade Duck Canvas lining",
    stock: 6,
    isTrending: true,
    isFlashSale: true,
    discount: 20,
    sku: "VEL-LT-013",
    gender: "unisex",
    specifications: [
      { label: "Dimensions", value: "52cm x 28cm x 26cm" },
      { label: "Cabin Sizing", value: "FAA & IATA carry-on maximum limit compliant" },
      { label: "Shoulder Strap", value: "Heavy-padded 4cm wide removable leather sling" }
    ],
    shippingInfo: "Ships via premium priority delivery including a leather identification luggage tag.",
    story: "Designed to replace bulky hard-cases, giving your weekend getaways a classic, soft, jet-setter vintage luxury feel."
  },
  {
    id: "prod-14",
    name: "Ribbed Luxury Lounge Set",
    brand: "VÉLARE Atelier",
    description: "A beautiful, premium ribbed loungeset for women, offering unmatched breathability and comfort. Perfect for elegant home decay, travel commutes or morning rituals.",
    category: "Women",
    subcategory: "Tops",
    price: 190,
    originalPrice: 240,
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewsCount: 31,
    reviews: [
      {
        id: "rev-14-1",
        username: "Charlotte H.",
        rating: 5,
        date: "2026-05-11",
        comment: "Unbelievably soft ribbing. The fabric has a gorgeous weight that hangs effortlessly.",
        helpfulCount: 8
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sand Aura Cream", hex: "#EAE6DF" },
      { name: "Matte Sage Grey", hex: "#A4ADA5" }
    ],
    material: "92% Organic Lenzing MicroModal, 8% Lycra Elastane",
    stock: 12,
    discount: 20,
    sku: "VEL-WI-014",
    gender: "women",
    specifications: [
      { label: "Knit Type", value: "4x4 rib alignment, lightweight bounce" },
      { label: "Pockets", value: "Concealed micro side seams inside pants" },
      { label: "Fabric weight", value: "280 GSM cozy drape" }
    ],
    shippingInfo: "Shipped in reusable bio-plastic storage sleeves.",
    story: "Bridging the line between loungewear and daywear so the urban commuter is always enveloped in cloud-like comfort."
  }
];

export const BLOGS: BlogArticle[] = [
  {
    id: "post-1",
    title: "The Savile Row Paradigm: Restructuring the Modern Overcoat",
    excerpt: "Discover the structural evolution of outerwear detailing and why Italian virgin cashmere remains the absolute pinnacle of luxury performance.",
    content: "The overcoat is more than a defense mechanism against late autumn wind chill—it is the outermost definition of personal sculpture. Historically, Savile Row relied on heavy canvases made of stiff horsehair and coarse wool to build broad, authoritative shoulder contours. Today, VÉLARE re-interprets this paradigm.\n\nBy matching grade-A Italian cashmere with micro-stitched double-face seams, we eliminate the heavy, bulky internal layers of traditional menswear. The result is an overcoat that retains dramatic architectural lines while flowing like silk drape. A real garment should mold to the movement of its host, gaining unique creases and story lines over decades of flight and travel.",
    date: "2026-05-24",
    author: "Elena Geller (Creative Director)",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    category: "Style Guides"
  },
  {
    id: "post-2",
    title: "Eco-Luxe: Our Journey to Carbon-Neutral Italian Cashmere",
    excerpt: "A transparent look into VÉLARE's traceability, from free-range Alpine pastures to our renewable-energy Lyon textile mills.",
    content: "Sustainability is not a marketing subtitle at VÉLARE—it is the foundational constraint of our design room. Typical volume clothing manufacturing generates enormous fiber waste and toxic dye runoff. We set out to prove that luxury could exist in absolute harmony with the natural biosphere.\n\nOur cashmere is harvested exclusively from certified nomadic Cooperatives in the Outer Mongolian peaks, where water reserves and soil health are strictly monitored via satellite sensors. The yarn is then colored in Tuscan mills running on 100% solar capture, using zero heavy metal colors or chemical softeners. By treating the materials with natural bio-compounds, we lock in original luster and water repellency permanently, making your investment piece fully biogradeable and circular.",
    date: "2026-06-03",
    author: "Richard Lin (Sustainability Lead)",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    category: "Sustainability"
  }
];

export const COUPONS: Coupon[] = [
  {
    code: "VELARE20",
    discountPercent: 20,
    description: "Enjoy 20% off your entire cart on first premium purchase",
    minSpend: 200,
    expiryDate: "2026-12-31"
  },
  {
    code: "ATELIERGOLD",
    discountPercent: 25,
    description: "Exclusive 25% off for Elite Vault members",
    minSpend: 500,
    expiryDate: "2026-08-31"
  },
  {
    code: "FLASHY10",
    discountPercent: 10,
    description: "Additional 10% off for Flash items",
    minSpend: 100,
    expiryDate: "2026-07-15"
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "Marcus Aurelius",
  email: "damayanthisri7@gmail.com",
  phone: "+1 (555) 019-2834",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  loyaltyPoints: 1250,
  tier: "Gold",
  memberSince: "Nov 2024",
  referralCode: "VEL-MARC-834"
};

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Marcus Aurelius (Primary)",
    street: "182 Fifth Avenue, Flatiron Suite 12B",
    city: "New York",
    zipCode: "10010",
    country: "United States",
    phone: "+1 (555) 019-2834",
    isDefault: true
  },
  {
    id: "addr-2",
    name: "Marcus Vacation Home",
    street: "Località Riviera, Villa Aurelia 5",
    city: "Portofino",
    zipCode: "16034",
    country: "Italy",
    phone: "+39 0185 26909",
    isDefault: false
  }
];

export const INITIAL_PAYMENTS: PaymentMethod[] = [
  {
    id: "pay-1",
    cardholder: "MARCUS AURELIUS",
    last4: "4242",
    expiry: "12/29",
    brand: "Visa Black Card",
    isDefault: true
  },
  {
    id: "pay-2",
    cardholder: "MARCUS AURELIUS",
    last4: "8889",
    expiry: "06/28",
    brand: "American Express Centurion",
    isDefault: false
  }
];

export const FAQS = [
  {
    q: "How does the size exchange guarantee work?",
    a: "We provide an unconditional, courier-assisted size exchange program. Simply request an exchange on your order dashboard within 30 days. We send a local courier with the replacement size to swap the items right at your doorstep, absolutely free of charge."
  },
  {
    q: "Does VÉLARE offer customized alterations?",
    a: "Our physical luxury stores in Milan, London, and New York offer complimentary custom hand-alterations for all items. Online purchases can be brought to any Atelier location with your digital order summary for personalized tailor fittings."
  },
  {
    q: "What makes your silk sustainable?",
    a: "Our silk is organic mulberry silk, traceably woven by hand-rearing silkworms on wild mulberry plants in the hills of Lyon. We process without harsh chemicals and utilize biological softeners, which results in a material that is fully safe for sensitive skin and completely biological."
  },
  {
    q: "How do I care for my cashmeres and leather garments?",
    a: "We advise dry-cleaning cashmeres only with certified wool specialists, or extremely light handwashing with neutral organic baby shampoo. Leather jackets must be conditioned twice a year with the complimentary wax cream included in your delivery box."
  }
];
