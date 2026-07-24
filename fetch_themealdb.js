const fs = require('fs');
const path = require('path');
const https = require('https');

const items = {
  products: {
    "tomato-hybrid": "Tomato",
    "spinach-bunch": "Spinach",
    "alphonso-mango": "Mango",
    "banana-robusta": "Banana",
    "broccoli": "Broccoli",
    "greek-yogurt": "Greek Yogurt",
    "sourdough": "Bread",
    "almonds-california": "Almonds",
    "cold-pressed-orange": "Orange Juice",
    "makhana-roasted": "Peanuts",
    "basil-bunch": "Basil",
    "avocado-hass": "Avocado",
    "tonic-ginger": "Ginger",
    "ghee-a2": "Butter",
    "milk-farm-fresh": "Milk",
    "basmati-rice": "Basmati Rice",
    "paneer-fresh": "Paneer",
    "strawberry": "Strawberries"
  },
  categories: {
    "vegetables": "Carrots",
    "fruits": "Apples",
    "leafy-greens": "Lettuce",
    "exotic": "Asparagus",
    "organic": "Mushrooms",
    "seasonal": "Peaches",
    "dairy": "Milk",
    "bakery": "Bread",
    "snacks": "Cashew Nuts",
    "juices": "Orange Juice",
    "dry-fruits": "Almonds",
    "essentials": "Olive Oil"
  },
  recipes: {
    "green-goddess-bowl": "Lettuce",
    "mango-lassi": "Mango",
    "sourdough-tartine": "Bread",
    "berry-smoothie": "Strawberries"
  }
};

async function downloadImage(ingredient, filepath) {
  const url = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient)}.png`;
  const res = await fetch(url);
  if (!res.ok) {
    // fallback to a generic image if not found
    const fallbackUrl = `https://www.themealdb.com/images/ingredients/Salt.png`;
    const fallbackRes = await fetch(fallbackUrl);
    const buffer = await fallbackRes.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return;
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function run() {
  for (const [folder, group] of Object.entries(items)) {
    for (const [name, ingredient] of Object.entries(group)) {
      const p = path.join(__dirname, 'public', 'images', folder, name + '.png');
      console.log(`Downloading ${name} (${ingredient})...`);
      try {
        await downloadImage(ingredient, p);
      } catch(e) {
        console.log('Error', name, e.message);
      }
    }
  }
  console.log('Done downloading .png images!');
}
run();
