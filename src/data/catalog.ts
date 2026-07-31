// Multi-mode product catalog: Instant / Bulk / Subscription

export type DeliveryMode = "instant" | "bulk" | "subscription";

export type Weight = {
  label: string;
  grams: number;
  price: number;
  mrp: number;
  // bulk price tier (optional)
  bulk?: { moq: number; unit: number; discount: number };
  // subscription recurring price (optional)
  subscription?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  weights: Weight[];
  rating: number;
  reviews: number;
  stock: number;
  organic?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  benefits: string[];
  storage: string;
  origin: string;
  farm?: string;
  harvestDate?: string;
  shelfLife?: string;
  nutrition: { label: string; value: string }[];
  tags: string[];
  // Which ordering modes are available for this product
  modes: DeliveryMode[];
};

export type Category = {
  slug: string;
  name: string;
  image: string;
  count: number;
  accent: string;
  status?: "Active" | "Coming Soon" | "Hidden";
};

export type City = {
  slug: string;
  name: string;
  live: boolean;
  pincode?: string[]; // sample prefixes
  eta?: string;
};

const img = (id: string, w = 900) => {
  return `/images/avatars/${id}.jpg`;
};
// ──────────────────────── Cities ────────────────────────
export const cities: City[] = [
  { slug: "ahmedabad", name: "Ahmedabad", live: true, pincode: ["3800"], eta: "30-40 min" },
  { slug: "gandhinagar", name: "Gandhinagar", live: true, pincode: ["3820"], eta: "30-40 min" },
  { slug: "surat", name: "Surat", live: false },
  { slug: "vadodara", name: "Vadodara", live: false },
  { slug: "rajkot", name: "Rajkot", live: false },
  { slug: "anand", name: "Anand", live: false },
  { slug: "mehsana", name: "Mehsana", live: false },
];

// ──────────────────────── Categories ────────────────────────
export const categories: Category[] = [
  { slug: "vegetables", name: "Fresh Vegetables", image: "/images/categories/vegetables.png", count: 23, accent: "from-emerald-200 to-emerald-100", status: "Active" },
  { slug: "fruits", name: "Fresh Fruits", image: "/images/categories/fruits.png", count: 62, accent: "from-amber-200 to-orange-100", status: "Coming Soon" },
  { slug: "leafy-greens", name: "Leafy Greens", image: "/images/categories/leafy-greens.png", count: 28, accent: "from-lime-200 to-green-100", status: "Coming Soon" },
  { slug: "exotic", name: "Exotic Vegetables", image: "/images/categories/exotic.png", count: 19, accent: "from-purple-200 to-fuchsia-100", status: "Coming Soon" },
  { slug: "organic", name: "Organic Produce", image: "/images/categories/organic.png", count: 41, accent: "from-green-200 to-teal-100", status: "Coming Soon" },
  { slug: "seasonal", name: "Seasonal Fruits", image: "/images/categories/seasonal.png", count: 23, accent: "from-rose-200 to-pink-100", status: "Coming Soon" },
  { slug: "dairy", name: "Milk & Dairy", image: "/images/categories/dairy.png", count: 34, accent: "from-sky-200 to-blue-100", status: "Coming Soon" },
  { slug: "bakery", name: "Bakery", image: "/images/categories/bakery.png", count: 22, accent: "from-yellow-200 to-amber-100", status: "Coming Soon" },
];

// ──────────────────────── Product factory ────────────────────────
const p = (
  id: string,
  name: string,
  category: string,
  subcategory: string,
  tagline: string,
  image: string,
  gallery: string[],
  weights: Weight[],
  modes: DeliveryMode[],
  meta: Partial<Product> = {}
): Product => ({
  id,
  slug: id,
  name,
  category,
  subcategory,
  tagline,
  description:
    "Sourced from trusted partner farms within 120 km of our sorting facility. Hand-graded the morning of dispatch, tested for residues, and cold-chained to your door.",
  image: image || `/images/products/${id}.jpg`,
  gallery: gallery && gallery.length > 0 ? gallery : [image || `/images/products/${id}.jpg`],
  weights,
  rating: 4.6,
  reviews: Math.floor(Math.random() * 300) + 80,
  stock: Math.floor(Math.random() * 240) + 10,
  benefits: [
    "Hand-picked at peak ripeness and freshness",
    "Residue-tested in our in-house quality lab",
    "Cold-chain logistics for maximum shelf life & nutrition",
  ],
  storage: "Refrigerate at 2–4°C in a perforated bag. Best consumed within 3–5 days of delivery.",
  origin: "Partner Farms, Gujarat",
  farm: "Shree Hari Organics",
  harvestDate: "This morning",
  shelfLife: "5–7 days refrigerated",
  nutrition: [
    { label: "Energy", value: "28 kcal" },
    { label: "Carbs", value: "6 g" },
    { label: "Fibre", value: "2.1 g" },
    { label: "Protein", value: "1.2 g" },
  ],
  tags: [subcategory, category],
  modes,
  ...meta,
});

// ──────────────────────── Products ────────────────────────
export const products: Product[] = [
  // ── 23 Phase 1 Vegetables (Active) ──
  p(
    "cucumber",
    "Fresh English Cucumber / Khira Kakdi",
    "vegetables",
    "Fresh Vegetables",
    "Crisp, hydrating & farm-fresh",
    "/images/products/cucumber.jpg",
    ["/images/products/cucumber.jpg"],
    [
      { label: "500 g", grams: 500, price: 18, mrp: 22, subscription: 16 },
      { label: "1 kg", grams: 1000, price: 35, mrp: 44, bulk: { moq: 10, unit: 30, discount: 15 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 115, bestSeller: true, organic: true }
  ),
  p(
    "okra",
    "Tender Green Okra / Bhindi",
    "vegetables",
    "Fresh Vegetables",
    "Hand-graded, crisp & tender pods",
    "/images/products/okra.jpg",
    ["/images/products/okra.jpg"],
    [
      { label: "500 g", grams: 500, price: 12, mrp: 15, subscription: 11 },
      { label: "1 kg", grams: 1000, price: 23, mrp: 30, bulk: { moq: 10, unit: 20, discount: 15 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 64, organic: true }
  ),
  p(
    "bitter-gourd",
    "Fresh Karela / Bitter Gourd",
    "vegetables",
    "Fresh Vegetables",
    "Deep green, rich in antioxidants",
    "/images/products/bitter-gourd.jpg",
    ["/images/products/bitter-gourd.jpg"],
    [
      { label: "500 g", grams: 500, price: 12, mrp: 15, subscription: 11 },
      { label: "1 kg", grams: 1000, price: 23, mrp: 30 },
    ],
    ["instant", "subscription"],
    { stock: 42, organic: true }
  ),
  p(
    "bottle-gourd",
    "Fresh Dudhi / Bottle Gourd / Lauki",
    "vegetables",
    "Fresh Vegetables",
    "Tender, naturally sweet & cooling",
    "/images/products/bottle-gourd.jpg",
    ["/images/products/bottle-gourd.jpg"],
    [
      { label: "1 pc (approx 600g-800g)", grams: 700, price: 16, mrp: 20, subscription: 14 },
    ],
    ["instant", "subscription"],
    { stock: 88, newArrival: true }
  ),
  p(
    "sponge-gourd",
    "Fresh Galka / Ridge Gourd / Turiya",
    "vegetables",
    "Fresh Vegetables",
    "Soft texture, farm-picked this morning",
    "/images/products/sponge-gourd.jpg",
    ["/images/products/sponge-gourd.jpg"],
    [
      { label: "500 g", grams: 500, price: 8, mrp: 10, subscription: 7 },
      { label: "1 kg", grams: 1000, price: 15, mrp: 20 },
    ],
    ["instant", "subscription"],
    { stock: 35 }
  ),
  p(
    "brinjal",
    "Fresh Ringan / Brinjal / Eggplant",
    "vegetables",
    "Fresh Vegetables",
    "Glossy purple, perfect for bhartha or curry",
    "/images/products/brinjal.jpg",
    ["/images/products/brinjal.jpg"],
    [
      { label: "500 g", grams: 500, price: 6, mrp: 8, subscription: 5 },
      { label: "1 kg", grams: 1000, price: 11, mrp: 16, bulk: { moq: 10, unit: 9, discount: 20 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 95, bestSeller: true }
  ),
  p(
    "carrot",
    "Fresh Red Carrot / Desi Gajar",
    "vegetables",
    "Fresh Vegetables",
    "Sweet, crunchy & rich in beta-carotene",
    "/images/products/carrot.jpg",
    ["/images/products/carrot.jpg"],
    [
      { label: "500 g", grams: 500, price: 22, mrp: 26, subscription: 20 },
      { label: "1 kg", grams: 1000, price: 42, mrp: 52, bulk: { moq: 10, unit: 38, discount: 15 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 150, bestSeller: true, organic: true, newArrival: true }
  ),
  p(
    "beetroot",
    "Fresh Red Beetroot / Beet",
    "vegetables",
    "Fresh Vegetables",
    "Earthy sweetness, high iron & folate",
    "/images/products/beetroot.jpg",
    ["/images/products/beetroot.jpg"],
    [
      { label: "500 g", grams: 500, price: 24, mrp: 28, subscription: 22 },
      { label: "1 kg", grams: 1000, price: 46, mrp: 56 },
    ],
    ["instant", "subscription"],
    { stock: 75, newArrival: true, organic: true }
  ),
  p(
    "green-chilli",
    "Spicy Green Chilli / Hari Mirch / Marcha",
    "vegetables",
    "Fresh Vegetables",
    "Fiery heat, hand-sorted dark green pods",
    "/images/products/green-chilli.jpg",
    ["/images/products/green-chilli.jpg"],
    [
      { label: "100 g", grams: 100, price: 52, mrp: 60, subscription: 48 },
      { label: "250 g", grams: 250, price: 125, mrp: 150 },
    ],
    ["instant", "subscription"],
    { stock: 28 }
  ),
  p(
    "sweet-corn",
    "Sweet Corn Cobs / Makai",
    "vegetables",
    "Fresh Vegetables",
    "Juicy, golden kernels bursting with sweetness",
    "/images/products/sweet-corn.jpg",
    ["/images/products/sweet-corn.jpg"],
    [
      { label: "2 pcs (approx 500g)", grams: 500, price: 15, mrp: 18, subscription: 14 },
      { label: "4 pcs (approx 1kg)", grams: 1000, price: 28, mrp: 36, bulk: { moq: 10, unit: 25, discount: 15 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 110, bestSeller: true, newArrival: true }
  ),
  p(
    "cabbage",
    "Fresh Green Cabbage / Kobij",
    "vegetables",
    "Fresh Vegetables",
    "Tightly packed, crisp & sweet heads",
    "/images/products/cabbage.jpg",
    ["/images/products/cabbage.jpg"],
    [
      { label: "1 head (approx 800g-1kg)", grams: 900, price: 12, mrp: 15, subscription: 11 },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 180, bestSeller: true }
  ),
  p(
    "green-leafy-bhaji",
    "Green Amaranth Bhaji / Chaulai",
    "vegetables",
    "Fresh Vegetables",
    "Tender leafy greens, nutrient-dense",
    "/images/products/green-leafy-bhaji.jpg",
    ["/images/products/green-leafy-bhaji.jpg"],
    [
      { label: "1 bunch (approx 250g)", grams: 250, price: 16, mrp: 20, subscription: 14 },
    ],
    ["instant", "subscription"],
    { stock: 45, organic: true }
  ),
  p(
    "spinach",
    "Baby Spinach Bunch / Palak",
    "vegetables",
    "Fresh Vegetables",
    "Tender green leaves, earthy sweetness",
    "/images/products/spinach.jpg",
    ["/images/products/spinach.jpg"],
    [
      { label: "1 bunch (approx 250g)", grams: 250, price: 11, mrp: 14, subscription: 10 },
      { label: "500 g", grams: 500, price: 20, mrp: 28 },
    ],
    ["instant", "subscription"],
    { stock: 85, bestSeller: true, organic: true }
  ),
  p(
    "cluster-beans",
    "Fresh Cluster Beans / Gawar Fali",
    "vegetables",
    "Fresh Vegetables",
    "Traditional green beans, rich in dietary fiber",
    "/images/products/cluster-beans.jpg",
    ["/images/products/cluster-beans.jpg"],
    [
      { label: "500 g", grams: 500, price: 55, mrp: 65, subscription: 50 },
      { label: "1 kg", grams: 1000, price: 105, mrp: 130 },
    ],
    ["instant", "subscription"],
    { stock: 30, newArrival: true }
  ),
  p(
    "potato",
    "Farm-Fresh Potatoes / Bataka / Aloo",
    "vegetables",
    "Fresh Vegetables",
    "Regular brown potatoes, versatile & clean",
    "/images/products/potato.jpg",
    ["/images/products/potato.jpg"],
    [
      { label: "1 kg", grams: 1000, price: 11, mrp: 14, subscription: 10 },
      { label: "2 kg", grams: 2000, price: 21, mrp: 28, bulk: { moq: 10, unit: 19, discount: 15 } },
      { label: "5 kg", grams: 5000, price: 50, mrp: 70, bulk: { moq: 5, unit: 45, discount: 20 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 240, bestSeller: true }
  ),
  p(
    "onion",
    "Red Onions / Dungari / Pyaaz",
    "vegetables",
    "Fresh Vegetables",
    "Firm, pungent & dry-cured red onions",
    "/images/products/onion.jpg",
    ["/images/products/onion.jpg"],
    [
      { label: "1 kg", grams: 1000, price: 19, mrp: 23, subscription: 17 },
      { label: "2 kg", grams: 2000, price: 37, mrp: 46, bulk: { moq: 10, unit: 34, discount: 15 } },
      { label: "5 kg", grams: 5000, price: 90, mrp: 115, bulk: { moq: 5, unit: 82, discount: 18 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 210, bestSeller: true }
  ),
  p(
    "tomato",
    "Vine-Ripened Tomatoes / Tameta",
    "vegetables",
    "Fresh Vegetables",
    "Plump, sun-blushed & bursting with umami",
    "/images/products/tomato.jpg",
    ["/images/products/tomato.jpg"],
    [
      { label: "500 g", grams: 500, price: 20, mrp: 25, subscription: 18 },
      { label: "1 kg", grams: 1000, price: 38, mrp: 50, bulk: { moq: 10, unit: 34, discount: 15 } },
      { label: "2 kg", grams: 2000, price: 74, mrp: 100, bulk: { moq: 5, unit: 66, discount: 18 } },
    ],
    ["instant", "bulk", "subscription"],
    { stock: 190, bestSeller: true, organic: true }
  ),
  p(
    "cauliflower",
    "White Cauliflower / Phool Gobi / Fulevar",
    "vegetables",
    "Fresh Vegetables",
    "Snow-white florets, tightly packed heads",
    "/images/products/cauliflower.jpg",
    ["/images/products/cauliflower.jpg"],
    [
      { label: "1 head (approx 500g-700g)", grams: 600, price: 19, mrp: 24, subscription: 17 },
    ],
    ["instant", "subscription"],
    { stock: 70, organic: true }
  ),
  p(
    "green-peas",
    "Fresh Green Peas / Vatana / Matar",
    "vegetables",
    "Fresh Vegetables",
    "Sweet, popping green peas in the pod",
    "/images/products/green-peas.jpg",
    ["/images/products/green-peas.jpg"],
    [
      { label: "250 g", grams: 250, price: 110, mrp: 130, subscription: 100 },
      { label: "500 g", grams: 500, price: 215, mrp: 260 },
    ],
    ["instant", "subscription"],
    { stock: 38, bestSeller: true, newArrival: true }
  ),
  p(
    "coriander-leaves",
    "Fresh Coriander Bunch / Dhana / Kothmir",
    "vegetables",
    "Fresh Vegetables",
    "Highly aromatic, freshly harvested green leaves",
    "/images/products/coriander-leaves.jpg",
    ["/images/products/coriander-leaves.jpg"],
    [
      { label: "100 g", grams: 100, price: 160, mrp: 190, subscription: 150 },
      { label: "250 g", grams: 250, price: 390, mrp: 475 },
    ],
    ["instant", "subscription"],
    { stock: 18, bestSeller: true, organic: true }
  ),
  p(
    "fenugreek-leaves",
    "Fresh Fenugreek Leaves / Methi Bhaji",
    "vegetables",
    "Fresh Vegetables",
    "Tender methi leaves, classic slightly bitter aroma",
    "/images/products/fenugreek-leaves.jpg",
    ["/images/products/fenugreek-leaves.jpg"],
    [
      { label: "1 bunch (approx 200g)", grams: 200, price: 85, mrp: 100, subscription: 78 },
    ],
    ["instant", "subscription"],
    { stock: 25, organic: true }
  ),
  p(
    "capsicum",
    "Green Capsicum / Bell Pepper",
    "vegetables",
    "Fresh Vegetables",
    "Glossy, crunchy & mild green bell peppers",
    "/images/products/capsicum.jpg",
    ["/images/products/capsicum.jpg"],
    [
      { label: "250 g", grams: 250, price: 65, mrp: 75, subscription: 60 },
      { label: "500 g", grams: 500, price: 125, mrp: 150 },
    ],
    ["instant", "subscription"],
    { stock: 48, bestSeller: true }
  ),
  p(
    "picador-chilli",
    "Bhavnagari Marcha / Picador Salad Chilli",
    "vegetables",
    "Fresh Vegetables",
    "Mild, thick-skinned long chillies perfect for stuffing or frying",
    "/images/products/picador-chilli.jpg",
    ["/images/products/picador-chilli.jpg"],
    [
      { label: "250 g", grams: 250, price: 45, mrp: 55, subscription: 40 },
      { label: "500 g", grams: 500, price: 88, mrp: 110 },
    ],
    ["instant", "subscription"],
    { stock: 22, newArrival: true }
  ),

  // ── Future Category Products (Coming Soon - Preserved for Multi-Category Future Readiness) ──
  p(
    "alphonso-mango",
    "Alphonso Mango · Ratnagiri",
    "seasonal",
    "Seasonal Fruits",
    "The king of mangoes, GI-tagged",
    "/images/products/alphonso-mango.png",
    ["/images/products/alphonso-mango.png"],
    [
      { label: "1 dozen", grams: 2400, price: 649, mrp: 899 },
      { label: "6 pcs", grams: 1200, price: 349, mrp: 499 },
    ],
    ["instant", "bulk"],
    { stock: 12 }
  ),
  p(
    "banana-robusta",
    "Robusta Banana",
    "fruits",
    "Fresh Fruits",
    "Creamy, naturally sweet & energy-dense",
    "/images/products/banana-robusta.png",
    ["/images/products/banana-robusta.png"],
    [{ label: "6 pcs", grams: 900, price: 48, mrp: 65 }],
    ["instant", "subscription"],
    { stock: 120 }
  ),
  p(
    "greek-yogurt",
    "Greek Yogurt · Unsweetened",
    "dairy",
    "Milk & Dairy",
    "High protein, velvety smooth",
    "/images/products/greek-yogurt.png",
    ["/images/products/greek-yogurt.png"],
    [{ label: "400 g", grams: 400, price: 145, mrp: 180 }],
    ["instant", "subscription"],
    { stock: 44 }
  ),
  p(
    "sourdough",
    "Artisan Sourdough Loaf",
    "bakery",
    "Bakery",
    "36-hour fermented, stone-baked",
    "/images/products/sourdough.png",
    ["/images/products/sourdough.png"],
    [{ label: "450 g", grams: 450, price: 220, mrp: 260 }],
    ["instant"],
    { stock: 18 }
  ),
  p(
    "almonds-california",
    "California Almonds",
    "dry-fruits",
    "Dry Fruits",
    "Crunchy, heart-healthy, premium grade",
    "/images/products/almonds-california.png",
    ["/images/products/almonds-california.png"],
    [{ label: "500 g", grams: 500, price: 545, mrp: 720 }],
    ["instant", "bulk"],
    { stock: 90 }
  ),
  p(
    "cold-pressed-orange",
    "Cold-Pressed Orange Juice",
    "juices",
    "Cold Pressed Juices",
    "100% Nagpur oranges, no added sugar",
    "/images/products/cold-pressed-orange.png",
    ["/images/products/cold-pressed-orange.png"],
    [{ label: "1 L", grams: 1000, price: 199, mrp: 249 }],
    ["instant"],
    { stock: 36 }
  ),
  p(
    "makhana-roasted",
    "Foxnuts · Himalayan Pink Salt",
    "snacks",
    "Healthy Snacks",
    "Guilt-free, protein-rich crunch",
    "/images/products/makhana-roasted.png",
    ["/images/products/makhana-roasted.png"],
    [{ label: "150 g", grams: 150, price: 149, mrp: 199 }],
    ["instant", "bulk"],
    { stock: 60 }
  ),
  p(
    "ghee-a2",
    "A2 Cultured Cow Ghee",
    "dairy",
    "Milk & Dairy",
    "Bilona-churned, single origin",
    "/images/products/ghee-a2.png",
    ["/images/products/ghee-a2.png"],
    [{ label: "500 ml", grams: 500, price: 649, mrp: 799 }],
    ["instant", "bulk", "subscription"],
    { stock: 26 }
  ),
  p(
    "milk-farm-fresh",
    "Farm-Fresh Toned Milk",
    "dairy",
    "Milk & Dairy",
    "Delivered every morning, before your chai",
    "/images/products/milk-farm-fresh.png",
    ["/images/products/milk-farm-fresh.png"],
    [{ label: "1 L", grams: 1000, price: 60, mrp: 72 }],
    ["instant", "subscription"],
    { stock: 200 }
  ),
  p(
    "basmati-rice",
    "Aged Basmati Rice · Premium",
    "essentials",
    "Cooking Essentials",
    "1121 steam, aged 24 months",
    "/images/products/basmati-rice.png",
    ["/images/products/basmati-rice.png"],
    [{ label: "5 kg", grams: 5000, price: 820, mrp: 1050 }],
    ["instant", "bulk"],
    { stock: 110 }
  ),
];

// ──────────────────────── Recipes ────────────────────────
export const recipes = [
  {
    slug: "spinach-corn-curry",
    title: "Palak Paneer / Spinach Corn Curry",
    time: "20 min",
    difficulty: "Easy",
    serves: 2,
    image: "/images/products/spinach.jpg",
    tags: ["High Iron", "Vegetarian"],
    ingredients: ["Baby Spinach", "Sweet Corn", "Tomatoes", "Green Chilli"],
    excerpt: "Farm-fresh spinach blanched with sweet corn kernels and tempered with green chillies and cumin.",
  },
  {
    slug: "picador-chilli-fry",
    title: "Bhavnagari Marcha / Picador Chilli Fry",
    time: "15 min",
    difficulty: "Easy",
    serves: 4,
    image: "/images/products/picador-chilli.jpg",
    tags: ["Traditional Snack"],
    ingredients: ["Picador Chilli", "Gram Flour", "Coriander Leaves", "Spices"],
    excerpt: "Pan-fried mild green chillies stuffed with seasoned chickpea flour and fresh coriander.",
  },
  {
    slug: "roasted-lauki-sabzi",
    title: "Roasted Lauki & Dhaniya Sabzi",
    time: "25 min",
    difficulty: "Easy",
    serves: 3,
    image: "/images/products/bottle-gourd.jpg",
    tags: ["Low Calorie", "Healthy"],
    ingredients: ["Bottle Gourd", "Coriander Leaves", "Tomatoes", "Green Chilli"],
    excerpt: "Tender bottle gourd slow-cooked with fresh green coriander, tomatoes and aromatic spices.",
  },
  {
    slug: "fresh-aloo-sabzi",
    title: "Gujarati Bataka Poha / Aloo Sabzi",
    time: "15 min",
    difficulty: "Easy",
    serves: 2,
    image: "/images/products/potato.jpg",
    tags: ["Comfort Food"],
    ingredients: ["Potatoes", "Onions", "Green Chilli", "Curry Leaves"],
    excerpt: "Classic farm-fresh potatoes tempered with mustard seeds, curry leaves and green chillies.",
  },
];

// ──────────────────────── Testimonials ────────────────────────
export const testimonials = [
  {
    name: "Ananya Raghavan",
    location: "Satellite, Ahmedabad",
    avatar: "/images/avatars/photo-1494790108377-be9c29b29330.jpg",
    rating: 5,
    text: "The difference is in the details — stems are crisp, berries aren't bruised, and the delivery window actually arrives on time. Farmora replaced my weekend market run.",
    verified: true,
  },
  {
    name: "Vikram Desai",
    location: "Vastrapur, Ahmedabad",
    avatar: "/images/avatars/photo-1507003211169-0a1dd7228f2d.jpg",
    rating: 5,
    text: "My morning chai gets its milk before I wake up — that subscription is honestly the best ₹54 I spend every month.",
    verified: true,
  },
  {
    name: "Priya Nair",
    location: "Gandhinagar Sector 21",
    avatar: img("photo-1438761681033-6461ffad8d80", 200),
    rating: 5,
    text: "As a chef, I care about sourcing. The residue reports Farmora shares with each order genuinely set them apart from every other app I've tried.",
    verified: true,
  },
  {
    name: "Arjun Mehta",
    location: "SG Highway, Ahmedabad",
    avatar: img("photo-1500648767791-00dcc994a43e", 200),
    rating: 4,
    text: "Our office pantry moved to Farmora's bulk plan — invoicing is clean, GST is auto-applied, and the account manager actually answers the phone.",
    verified: true,
  },
];

// ──────────────────────── Accessors ────────────────────────
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (cat: string) => products.filter((p) => p.category === cat);

export const activeProducts = products.filter((p) => p.category === "vegetables");
export const bestSellers = activeProducts.filter((p) => p.bestSeller);
export const newArrivals = activeProducts.filter((p) => p.newArrival);
export const organic = activeProducts.filter((p) => p.organic);
export const subscriptionProducts = activeProducts.filter((p) => p.modes.includes("subscription"));
export const bulkProducts = activeProducts.filter((p) => p.modes.includes("bulk"));
export const instantProducts = activeProducts.filter((p) => p.modes.includes("instant"));

// ──────────────────────── Farmers ────────────────────────
export const farmers = [
  {
    name: "Rameshbhai Patel",
    farm: "Shree Hari Organics",
    location: "Sanand, Ahmedabad",
    since: "2018",
    image: img("photo-1507003211169-0a1dd7228f2d", 800),
    quote:
      "We switched to natural farming five years ago. Today our tomatoes taste like the ones my grandmother grew — and Farmora delivers them the same day.",
    produce: ["Tomatoes", "Okra", "Brinjal"],
    certification: "India Organic · NPOP",
  },
  {
    name: "Meera Ben",
    farm: "Amrut Valley Dairy",
    location: "Kalol, Gandhinagar",
    since: "2020",
    image: img("photo-1438761681033-6461ffad8d80", 800),
    quote:
      "Our Gir cows graze freely and we bottle the milk within two hours of milking. That's why your morning chai tastes different.",
    produce: ["A2 Milk", "Curd", "Paneer"],
    certification: "FSSAI · Goshala Certified",
  },
  {
    name: "Harshad Solanki",
    farm: "Greenfield Leafy Farms",
    location: "Dehgam, Gandhinagar",
    since: "2019",
    image: img("photo-1500648767791-00dcc994a43e", 800),
    quote:
      "I grow 22 varieties of leafy greens in shade-net houses. No pesticides, no shortcuts — and my kids eat the same produce I sell.",
    produce: ["Spinach", "Methi", "Basil", "Kale"],
    certification: "PGS Organic",
  },
];
