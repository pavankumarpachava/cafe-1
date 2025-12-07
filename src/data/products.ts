import { Product } from '@/types';

const coffeeData = [
  { id: 1, name: "Espresso", category: "Espresso" },
  { id: 2, name: "Double Espresso", category: "Espresso" },
  { id: 3, name: "Cappuccino", category: "Espresso" },
  { id: 4, name: "Latte", category: "Espresso" },
  { id: 5, name: "Flat White", category: "Espresso" },
  { id: 6, name: "Mocha", category: "Specialty" },
  { id: 7, name: "Americano", category: "Espresso" },
  { id: 8, name: "Cold Brew", category: "Iced" },
  { id: 9, name: "Iced Latte", category: "Iced" },
  { id: 10, name: "Iced Mocha", category: "Iced" },
  { id: 11, name: "Frappuccino", category: "Iced" },
  { id: 12, name: "Affogato", category: "Specialty" },
  { id: 13, name: "Gingerbread Latte", category: "Christmas" },
  { id: 14, name: "Peppermint Mocha", category: "Christmas" },
  { id: 15, name: "Eggnog Latte", category: "Christmas" },
  { id: 16, name: "Hot Chocolate", category: "Specialty" },
  { id: 17, name: "Chai Latte", category: "Specialty" },
  { id: 18, name: "Matcha Latte", category: "Specialty" },
  { id: 19, name: "Caramel Macchiato", category: "Specialty" },
  { id: 20, name: "Vanilla Latte", category: "Specialty" },
];

const descriptions: Record<string, string> = {
  'Espresso': 'Pure, concentrated coffee perfection. A bold single shot that delivers an intense, rich flavor experience.',
  'Double Espresso': 'Double the intensity, double the satisfaction. For those who crave a stronger coffee moment.',
  'Cappuccino': 'The perfect harmony of espresso, steamed milk, and airy foam.',
  'Latte': 'Smooth and creamy, with espresso gently embraced by silky steamed milk.',
  'Flat White': 'Velvety microfoam meets bold espresso for a luxuriously smooth experience.',
  'Mocha': 'Decadent chocolate meets robust espresso, crowned with whipped cream.',
  'Americano': 'Espresso elongated with hot water for a clean, bold taste.',
  'Cold Brew': 'Slow-steeped for 20 hours, delivering smooth, naturally sweet coffee.',
  'Iced Latte': 'Chilled espresso and milk over ice for a refreshing caffeine boost.',
  'Iced Mocha': 'Cool, chocolatey indulgence with espresso and cold milk.',
  'Frappuccino': 'Blended coffee perfection with ice, milk, and your choice of flavors.',
  'Affogato': 'Hot espresso poured over cold vanilla gelato. Simple. Divine.',
  'Gingerbread Latte': 'Warm gingerbread spices meet creamy latte for holiday magic.',
  'Peppermint Mocha': 'Cool peppermint and rich chocolate create festive perfection.',
  'Eggnog Latte': 'Creamy eggnog and espresso, a holiday tradition in a cup.',
  'Hot Chocolate': 'Rich, velvety chocolate topped with pillowy whipped cream.',
  'Chai Latte': 'Aromatic spices and bold tea, softened with steamed milk.',
  'Matcha Latte': 'Premium ceremonial matcha whisked with creamy milk.',
  'Caramel Macchiato': 'Vanilla, steamed milk, espresso, and buttery caramel drizzle.',
  'Vanilla Latte': 'Classic latte elevated with Madagascar vanilla.',
};

const tastingNotes: Record<string, string[]> = {
  'Espresso': ['Bold', 'Intense', 'Caramel'],
  'Cappuccino': ['Balanced', 'Creamy', 'Nutty'],
  'Latte': ['Smooth', 'Mild', 'Sweet'],
  'Cold Brew': ['Smooth', 'Chocolatey'],
  'Mocha': ['Chocolate', 'Rich', 'Sweet'],
  'Gingerbread Latte': ['Spicy', 'Warm', 'Festive'],
  'Peppermint Mocha': ['Minty', 'Chocolate'],
  'Eggnog Latte': ['Creamy', 'Spiced', 'Rich'],
};

const getImage = (name: string) => `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80`;

export const products: Product[] = coffeeData.map((item, i) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  main_image: `https://images.unsplash.com/photo-${1509042239860 + i * 1000}-f550ce710b93?w=600&q=80`,
  images: [
    `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80`,
    `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80`,
    `https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80`,
  ],
  price: 4.50 + (item.id % 5) * 0.75,
  description: descriptions[item.name] || `Premium ${item.name} crafted with care and expertise.`,
  tastingNotes: tastingNotes[item.name] || ['Aromatic', 'Balanced'],
  ingredients: ['Premium Coffee Beans', 'Filtered Water', 'Fresh Milk']
}));

export const christmasProducts = products.filter(p => p.category === 'Christmas');

export const categories = [...new Set(products.map(p => p.category))];
