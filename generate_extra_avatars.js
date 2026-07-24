const fs = require('fs');
const path = require('path');

const avatars = [
  "photo-1438761681033-6461ffad8d80", "photo-1500648767791-00dcc994a43e"
];

function generateSVG(name, folder) {
  const hue1 = Math.floor(Math.random() * 360);
  const hue2 = (hue1 + 40) % 360;
  
  const textName = name.replace(/-/g, ' ').toUpperCase();
  
  const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue1}, 80%, 85%);stop-opacity:1" />
      <stop offset="100%" style="stop-color:hsl(${hue2}, 80%, 75%);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${name})" />
  <text x="50%" y="50%" font-family="sans-serif" font-size="36" font-weight="bold" fill="#333" text-anchor="middle" dominant-baseline="middle">
    ${textName}
  </text>
</svg>`;
  
  const filePath = path.join(__dirname, 'public', 'images', folder, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
}

avatars.forEach(a => generateSVG(a, 'avatars'));

console.log('Extra avatars generated successfully!');
