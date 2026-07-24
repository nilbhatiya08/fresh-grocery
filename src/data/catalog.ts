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
};

export type City = {
  slug: string;
  name: string;
  live: boolean;
  pincode?: string[]; // sample prefixes
  eta?: string;
};

const img = (id: string, w = 900) => {
  return `/images/avatars/${id}.svg`;
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
  { slug: "vegetables", name: "Fresh Vegetables", image: "/images/categories/vegetables.png", count: 84, accent: "from-emerald-200 to-emerald-100" },
  { slug: "fruits", name: "Fresh Fruits", image: "/images/categories/fruits.png", count: 62, accent: "from-amber-200 to-orange-100" },
  { slug: "leafy-greens", name: "Leafy Greens", image: "/images/categories/leafy-greens.png", count: 28, accent: "from-lime-200 to-green-100" },
  { slug: "exotic", name: "Exotic Vegetables", image: "/images/categories/exotic.png", count: 19, accent: "from-purple-200 to-fuchsia-100" },
  { slug: "organic", name: "Organic Produce", image: "/images/categories/organic.png", count: 41, accent: "from-green-200 to-teal-100" },
  { slug: "seasonal", name: "Seasonal Fruits", image: "/images/categories/seasonal.png", count: 23, accent: "from-rose-200 to-pink-100" },
  { slug: "dairy", name: "Milk & Dairy", image: "/images/categories/dairy.png", count: 34, accent: "from-sky-200 to-blue-100" },
  { slug: "bakery", name: "Bakery", image: "/images/categories/bakery.png", count: 22, accent: "from-yellow-200 to-amber-100" },
  { slug: "snacks", name: "Healthy Snacks", image: "/images/categories/snacks.png", count: 38, accent: "from-orange-200 to-amber-100" },
  { slug: "juices", name: "Cold Pressed Juices", image: "/images/categories/juices.png", count: 14, accent: "from-red-200 to-rose-100" },
  { slug: "dry-fruits", name: "Dry Fruits", image: "/images/categories/dry-fruits.png", count: 27, accent: "from-amber-200 to-yellow-100" },
  { slug: "essentials", name: "Cooking Essentials", image: "/images/categories/essentials.png", count: 49, accent: "from-stone-200 to-neutral-100" },
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
  image: `/images/products/${id}.svg`,
  gallery: [`/images/products/${id}.svg`],
  weights,
  rating: 4.5,
  reviews: 128,
  stock: 40,
  benefits: [
    "Hand-picked at peak ripeness",
    "Residue-tested in our in-house lab",
    "Cold-chain logistics for maximum shelf life",
  ],
  storage: "Refrigerate at 2–4°C. Best consumed within 3 days of delivery.",
  origin: "Partner Farms, Ahmedabad District",
  farm: "Shree Hari Organics",
  harvestDate: "This morning",
  shelfLife: "5–7 days refrigerated",
  nutrition: [
    { label: "Energy", value: "52 kcal" },
    { label: "Carbs", value: "14 g" },
    { label: "Fibre", value: "2.4 g" },
    { label: "Protein", value: "0.3 g" },
  ],
  tags: [subcategory, category],
  modes,
  ...meta,
});

// ──────────────────────── Products ────────────────────────
export const products: Product[] = [
  p(
    "tomato-hybrid",
    "Vine-Ripened Tomatoes",
    "vegetables",
    "Fresh Vegetables",
    "Plump, sun-blushed & bursting with umami",
    img("photo-1592924357228-91a4daadcfea"),
    [img("photo-1592924357228-91a4daadcfea"), img("photo-1582284540020-8acbe3576c91"), img("photo-1561136594-7f68413baa99")],
    [
      { label: "500 g", grams: 500, price: 38, mrp: 55, bulk: { moq: 10, unit: 68, discount: 12 }, subscription: 34 },
      { label: "1 kg", grams: 1000, price: 72, mrp: 110, bulk: { moq: 10, unit: 128, discount: 12 }, subscription: 65 },
    ],
    ["instant", "bulk", "subscription"],
    { rating: 4.7, reviews: 412, bestSeller: true, stock: 68, organic: true }
  ),
  p(
    "spinach-bunch",
    "Baby Spinach Bunch",
    "leafy-greens",
    "Leafy Greens",
    "Tender leaves, earthy sweetness",
    img("photo-1576045057995-568f588f82fb"),
    [img("photo-1576045057995-568f588f82fb"), img("photo-1608797178974-ee539d678d4a")],
    [{ label: "250 g", grams: 250, price: 32, mrp: 45, subscription: 28 }],
    ["instant", "subscription"],
    { rating: 4.6, reviews: 218, stock: 32, organic: true }
  ),
  p(
    "alphonso-mango",
    "Alphonso Mango · Ratnagiri",
    "seasonal",
    "Seasonal Fruits",
    "The king of mangoes, GI-tagged",
    img("photo-1553279768-865429fa0078"),
    [img("photo-1553279768-865429fa0078"), img("photo-1591073113125-e46713c829ed")],
    [
      { label: "1 dozen", grams: 2400, price: 649, mrp: 899, bulk: { moq: 5, unit: 580, discount: 18 } },
      { label: "6 pcs", grams: 1200, price: 349, mrp: 499 },
    ],
    ["instant", "bulk"],
    { rating: 4.9, reviews: 1284, bestSeller: true, newArrival: true, stock: 12 }
  ),
  p(
    "banana-robusta",
    "Robusta Banana",
    "fruits",
    "Fresh Fruits",
    "Creamy, naturally sweet & energy-dense",
    img("photo-1603833665858-e61d17a80224"),
    [img("photo-1603833665858-e61d17a80224"), img("photo-1574228396684-25b4a709e71d")],
    [{ label: "6 pcs", grams: 900, price: 48, mrp: 65, subscription: 42 }],
    ["instant", "subscription"],
    { rating: 4.5, reviews: 520, stock: 120 }
  ),
  p(
    "broccoli",
    "Broccoli Crown",
    "exotic",
    "Exotic Vegetables",
    "Crunchy florets, nutrient powerhouse",
    img("photo-1459411552884-841db9b3cc2a"),
    [img("photo-1459411552884-841db9b3cc2a")],
    [{ label: "350 g", grams: 350, price: 68, mrp: 95 }],
    ["instant", "bulk"],
    { rating: 4.4, reviews: 176, stock: 22, organic: true }
  ),
  p(
    "greek-yogurt",
    "Greek Yogurt · Unsweetened",
    "dairy",
    "Milk & Dairy",
    "High protein, velvety smooth",
    img("photo-1488477181946-6428a0291777"),
    [img("photo-1488477181946-6428a0291777")],
    [{ label: "400 g", grams: 400, price: 145, mrp: 180, subscription: 128 }],
    ["instant", "subscription"],
    { rating: 4.8, reviews: 302, bestSeller: true, stock: 44 }
  ),
  p(
    "sourdough",
    "Artisan Sourdough Loaf",
    "bakery",
    "Bakery",
    "36-hour fermented, stone-baked",
    img("photo-1509440159596-0249088772ff"),
    [img("photo-1509440159596-0249088772ff")],
    [{ label: "450 g", grams: 450, price: 220, mrp: 260 }],
    ["instant"],
    { rating: 4.7, reviews: 418, newArrival: true, stock: 18 }
  ),
  p(
    "almonds-california",
    "California Almonds",
    "dry-fruits",
    "Dry Fruits",
    "Crunchy, heart-healthy, premium grade",
    img("photo-1599599810769-bcde5a160d32"),
    [img("photo-1599599810769-bcde5a160d32")],
    [
      { label: "250 g", grams: 250, price: 285, mrp: 360, bulk: { moq: 5, unit: 240, discount: 15 } },
      { label: "500 g", grams: 500, price: 545, mrp: 720, bulk: { moq: 5, unit: 470, discount: 15 } },
    ],
    ["instant", "bulk"],
    { rating: 4.6, reviews: 612, bestSeller: true, stock: 90 }
  ),
  p(
    "cold-pressed-orange",
    "Cold-Pressed Orange Juice",
    "juices",
    "Cold Pressed Juices",
    "100% Nagpur oranges, no added sugar",
    img("photo-1622597467836-f3285f2131b8"),
    [img("photo-1622597467836-f3285f2131b8")],
    [{ label: "1 L", grams: 1000, price: 199, mrp: 249 }],
    ["instant"],
    { rating: 4.5, reviews: 254, stock: 36, organic: true }
  ),
  p(
    "makhana-roasted",
    "Foxnuts · Himalayan Pink Salt",
    "snacks",
    "Healthy Snacks",
    "Guilt-free, protein-rich crunch",
    img("photo-1606312619070-d48b4c652a52"),
    [img("photo-1606312619070-d48b4c652a52")],
    [{ label: "150 g", grams: 150, price: 149, mrp: 199 }],
    ["instant", "bulk"],
    { rating: 4.4, reviews: 189, stock: 60 }
  ),
  p(
    "basil-bunch",
    "Sweet Basil · Thai",
    "leafy-greens",
    "Leafy Greens",
    "Aromatic, freshly cut this morning",
    img("photo-1600692095132-814c2a38f11e"),
    [img("photo-1600692095132-814c2a38f11e")],
    [{ label: "100 g", grams: 100, price: 28, mrp: 40 }],
    ["instant"],
    { rating: 4.3, reviews: 102, stock: 18, organic: true }
  ),
  p(
    "avocado-hass",
    "Hass Avocado · Ready to Eat",
    "exotic",
    "Exotic Vegetables",
    "Buttery, perfectly ripe",
    img("photo-1523049673857-eb18f1d722d3"),
    [img("photo-1523049673857-eb18f1d722d3")],
    [{ label: "2 pcs", grams: 400, price: 249, mrp: 320 }],
    ["instant"],
    { rating: 4.6, reviews: 288, newArrival: true, stock: 14 }
  ),
  p(
    "tonic-ginger",
    "Ginger-Turmeric Immunity Shot",
    "juices",
    "Cold Pressed Juices",
    "60 ml daily kick, cold-pressed",
    img("photo-1622597467836-f3285f2131b8"),
    [img("photo-1622597467836-f3285f2131b8")],
    [{ label: "6 × 60 ml", grams: 360, price: 299, mrp: 380, subscription: 265 }],
    ["instant", "subscription"],
    { rating: 4.7, reviews: 342, bestSeller: true, stock: 48 }
  ),
  p(
    "ghee-a2",
    "A2 Cultured Cow Ghee",
    "dairy",
    "Milk & Dairy",
    "Bilona-churned, single origin",
    img("photo-1631209121750-a9f656d74028"),
    [img("photo-1631209121750-a9f656d74028")],
    [{ label: "500 ml", grams: 500, price: 649, mrp: 799, bulk: { moq: 5, unit: 580, discount: 12 } }],
    ["instant", "bulk", "subscription"],
    { rating: 4.9, reviews: 512, stock: 26, organic: true }
  ),
  p(
    "milk-farm-fresh",
    "Farm-Fresh Toned Milk",
    "dairy",
    "Milk & Dairy",
    "Delivered every morning, before your chai",
    img("photo-1563636619-e9143da7973b"),
    [img("photo-1563636619-e9143da7973b")],
    [
      { label: "500 ml", grams: 500, price: 32, mrp: 36, subscription: 28 },
      { label: "1 L", grams: 1000, price: 60, mrp: 72, subscription: 54 },
    ],
    ["instant", "subscription"],
    { rating: 4.8, reviews: 1240, bestSeller: true, stock: 200 }
  ),
  p(
    "basmati-rice",
    "Aged Basmati Rice · Premium",
    "essentials",
    "Cooking Essentials",
    "1121 steam, aged 24 months",
    img("photo-1586201375761-83865001e31c"),
    [img("photo-1586201375761-83865001e31c")],
    [
      { label: "1 kg", grams: 1000, price: 180, mrp: 220, bulk: { moq: 10, unit: 155, discount: 14 } },
      { label: "5 kg", grams: 5000, price: 820, mrp: 1050, bulk: { moq: 10, unit: 720, discount: 14 } },
    ],
    ["instant", "bulk"],
    { rating: 4.7, reviews: 620, bestSeller: true, stock: 110 }
  ),
  p(
    "paneer-fresh",
    "Malai Paneer · Fresh",
    "dairy",
    "Milk & Dairy",
    "Soft cubes from whole buffalo milk",
    img("photo-1631209121750-a9f656d74028"),
    [img("photo-1631209121750-a9f656d74028")],
    [{ label: "200 g", grams: 200, price: 85, mrp: 110, subscription: 78 }],
    ["instant", "subscription"],
    { rating: 4.4, reviews: 156, stock: 30 }
  ),
  p(
    "strawberry",
    "Mahabaleshwar Strawberries",
    "seasonal",
    "Seasonal Fruits",
    "Plump, ruby-red & sweetly tart",
    img("photo-1518635017498-87f514b751ba"),
    [img("photo-1518635017498-87f514b751ba")],
    [{ label: "250 g", grams: 250, price: 129, mrp: 160 }],
    ["instant"],
    { rating: 4.5, reviews: 210, newArrival: true, stock: 20 }
  ),
];

// ──────────────────────── Recipes ────────────────────────
export const recipes = [
  {
    slug: "green-goddess-bowl",
    title: "Green Goddess Grain Bowl",
    time: "20 min",
    difficulty: "Easy",
    serves: 2,
    image: "/images/recipes/green-goddess-bowl.svg",
    tags: ["High Fibre", "Vegan"],
    ingredients: ["Baby Spinach", "Avocado", "Broccoli", "Almonds"],
    excerpt:
      "A vibrant, nutrient-dense bowl layered with nutty grains, crisp greens and a lemon-tahini drizzle.",
  },
  {
    slug: "mango-lassi",
    title: "Alphonso Mango Lassi",
    time: "5 min",
    difficulty: "Easy",
    serves: 2,
    image: "/images/recipes/mango-lassi.svg",
    tags: ["No Refined Sugar"],
    ingredients: ["Alphonso Mango", "Greek Yogurt", "Cardamom"],
    excerpt: "Seasonal mango meets thick yogurt and a whisper of cardamom — summer in a glass.",
  },
  {
    slug: "sourdough-tartine",
    title: "Tomato & Basil Tartine",
    time: "15 min",
    difficulty: "Easy",
    serves: 2,
    image: "/images/recipes/sourdough-tartine.svg",
    tags: ["Vegetarian"],
    ingredients: ["Sourdough", "Tomatoes", "Basil", "A2 Ghee"],
    excerpt: "Stone-baked sourdough rubbed with ghee, topped with vine-ripened tomato and torn basil.",
  },
  {
    slug: "berry-smoothie",
    title: "Strawberry Oat Smoothie",
    time: "5 min",
    difficulty: "Easy",
    serves: 1,
    image: "/images/recipes/berry-smoothie.svg",
    tags: ["High Protein"],
    ingredients: ["Strawberries", "Greek Yogurt", "Almonds"],
    excerpt: "Creamy, filling and ready before the kettle boils. A post-workout favourite.",
  },
];

// ──────────────────────── Testimonials ────────────────────────
export const testimonials = [
  {
    name: "Ananya Raghavan",
    location: "Satellite, Ahmedabad",
    avatar: "/images/avatars/photo-1494790108377-be9c29b29330.svg",
    rating: 5,
    text: "The difference is in the details — stems are crisp, berries aren't bruised, and the delivery window actually arrives on time. Farmora replaced my weekend market run.",
    verified: true,
  },
  {
    name: "Vikram Desai",
    location: "Vastrapur, Ahmedabad",
    avatar: "/images/avatars/photo-1507003211169-0a1dd7228f2d.svg",
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

export const bestSellers = products.filter((p) => p.bestSeller);
export const newArrivals = products.filter((p) => p.newArrival);
export const organic = products.filter((p) => p.organic);
export const subscriptionProducts = products.filter((p) => p.modes.includes("subscription"));
export const bulkProducts = products.filter((p) => p.modes.includes("bulk"));
export const instantProducts = products.filter((p) => p.modes.includes("instant"));

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
