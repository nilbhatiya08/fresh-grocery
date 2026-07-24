const fs = require('fs');
const path = require('path');
const https = require('https');

const products = {
  "tomato-hybrid": "tomato,fresh",
  "spinach-bunch": "spinach,leaf",
  "alphonso-mango": "mango,fruit",
  "banana-robusta": "banana,fruit",
  "broccoli": "broccoli,fresh",
  "greek-yogurt": "yogurt,food",
  "sourdough": "sourdough,bread",
  "almonds-california": "almonds,nuts",
  "cold-pressed-orange": "orange,juice",
  "makhana-roasted": "makhana,snack",
  "basil-bunch": "basil,leaves",
  "avocado-hass": "avocado,fresh",
  "tonic-ginger": "ginger,drink",
  "ghee-a2": "ghee,butter",
  "milk-farm-fresh": "milk,bottle",
  "basmati-rice": "rice,grain",
  "paneer-fresh": "paneer,cheese",
  "strawberry": "strawberry,fruit"
};

const categories = {
  "vegetables": "vegetables,market",
  "fruits": "fruits,market",
  "leafy-greens": "leafy,greens",
  "exotic": "exotic,vegetables",
  "organic": "organic,farm",
  "seasonal": "seasonal,fruits",
  "dairy": "dairy,products",
  "bakery": "bakery,bread",
  "snacks": "snacks,healthy",
  "juices": "juice,bottles",
  "dry-fruits": "dryfruits,nuts",
  "essentials": "cooking,spices"
};

const recipes = {
  "green-goddess-bowl": "salad,bowl",
  "mango-lassi": "lassi,mango",
  "sourdough-tartine": "bruschetta,bread",
  "berry-smoothie": "smoothie,berry"
};

const avatars = {
  "photo-1494790108377-be9c29b29330": "portrait,woman",
  "photo-1507003211169-0a1dd7228f2d": "portrait,man",
  "photo-1438761681033-6461ffad8d80": "portrait,farmer",
  "photo-1500648767791-00dcc994a43e": "portrait,worker"
};

async function downloadImage(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ' + res.statusText);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function run() {
  const all = [
    ...Object.entries(products).map(([k,v]) => ({name: k, term: v, folder: 'products'})),
    ...Object.entries(categories).map(([k,v]) => ({name: k, term: v, folder: 'categories'})),
    ...Object.entries(recipes).map(([k,v]) => ({name: k, term: v, folder: 'recipes'})),
    ...Object.entries(avatars).map(([k,v]) => ({name: k, term: v, folder: 'avatars'})),
  ];

  for (const item of all) {
    const url = `https://loremflickr.com/800/800/${item.term}`;
    const p = path.join(__dirname, 'public', 'images', item.folder, item.name + '.jpg');
    console.log(`Downloading ${item.name}...`);
    try {
      await downloadImage(url, p);
    } catch(e) {
      console.log('Error', item.name, e.message);
    }
  }
  console.log('Done!');
}
run();
