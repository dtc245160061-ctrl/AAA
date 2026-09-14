const fs = require('fs');
const content = fs.readFileSync('src/data/mockData.ts', 'utf8');
const units = JSON.parse(content.replace('export const mockApartmentUnits: ApartmentUnit[] = ', '').replace(/;\s*$/, ''));

console.log('Total units:', units.length);
const firstImages = units.map(u => u.images[0]);
const uniqueFirstImages = new Set(firstImages);
console.log('Unique first images:', uniqueFirstImages.size, 'out of', units.length);

const allImages = units.flatMap(u => u.images);
console.log('Total images:', allImages.length, 'Unique total images:', new Set(allImages).size);
