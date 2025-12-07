import { Product } from '@/types';

// Import all product images
import espressoImg from '@/assets/products/espresso.jpg';
import doubleEspressoImg from '@/assets/products/double-espresso.jpg';
import cappuccinoImg from '@/assets/products/cappuccino.jpg';
import latteImg from '@/assets/products/latte.jpg';
import flatWhiteImg from '@/assets/products/flat-white.jpg';
import mochaImg from '@/assets/products/mocha.jpg';
import americanoImg from '@/assets/products/americano.jpg';
import coldBrewImg from '@/assets/products/cold-brew.jpg';
import icedLatteImg from '@/assets/products/iced-latte.jpg';
import icedMochaImg from '@/assets/products/iced-mocha.jpg';
import frappuccinoImg from '@/assets/products/frappuccino.jpg';
import affogatoImg from '@/assets/products/affogato.jpg';
import gingerbreadLatteImg from '@/assets/products/gingerbread-latte.jpg';
import peppermintMochaImg from '@/assets/products/peppermint-mocha.jpg';
import eggnogLatteImg from '@/assets/products/eggnog-latte.jpg';
import hotChocolateImg from '@/assets/products/hot-chocolate.jpg';
import chaiLatteImg from '@/assets/products/chai-latte.jpg';
import matchaLatteImg from '@/assets/products/matcha-latte.jpg';
import caramelMacchiatoImg from '@/assets/products/caramel-macchiato.jpg';
import vanillaLatteImg from '@/assets/products/vanilla-latte.jpg';

const productImages: Record<string, string> = {
  'Espresso': espressoImg,
  'Double Espresso': doubleEspressoImg,
  'Cappuccino': cappuccinoImg,
  'Latte': latteImg,
  'Flat White': flatWhiteImg,
  'Mocha': mochaImg,
  'Americano': americanoImg,
  'Cold Brew': coldBrewImg,
  'Iced Latte': icedLatteImg,
  'Iced Mocha': icedMochaImg,
  'Frappuccino': frappuccinoImg,
  'Affogato': affogatoImg,
  'Gingerbread Latte': gingerbreadLatteImg,
  'Peppermint Mocha': peppermintMochaImg,
  'Eggnog Latte': eggnogLatteImg,
  'Hot Chocolate': hotChocolateImg,
  'Chai Latte': chaiLatteImg,
  'Matcha Latte': matchaLatteImg,
  'Caramel Macchiato': caramelMacchiatoImg,
  'Vanilla Latte': vanillaLatteImg,
};

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

export const products: Product[] = coffeeData.map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  main_image: productImages[item.name] || espressoImg,
  images: [productImages[item.name] || espressoImg],
  price: 4.50 + (item.id % 5) * 0.75,
  description: descriptions[item.name] || `Premium ${item.name} crafted with care and expertise.`,
  tastingNotes: tastingNotes[item.name] || ['Aromatic', 'Balanced'],
  ingredients: ['Premium Coffee Beans', 'Filtered Water', 'Fresh Milk']
}));

export const christmasProducts = products.filter(p => p.category === 'Christmas');

export const categories = [...new Set(products.map(p => p.category))];
