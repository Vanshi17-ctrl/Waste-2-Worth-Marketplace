import type { Category, Condition, Listing } from '@/types';

const CATEGORIES: Category[] = [
  'Clothes', 'Books', 'Electronics', 'Bags', 'Toys', 'Furniture', 'Footwear', 'Home Items',
];

// Real product photos from Pexels (license-free). Consistent landscape sizing.
const P = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&fit=crop`;

const PHOTOS: Record<string, string[]> = {
  // Clothing
  kurta: [P('5938772'), P('8489761')],
  dress: [P('8619007'), P('30922974')],
  shirt: [P('297933'), P('18533673')],
  jeans: [P('4109755'), P('10133275')],
  // Books
  book1: [P('8762862'), P('1383379')],
  book2: [P('18847269'), P('13288524')],
  book3: [P('448835'), P('46275')],
  // Electronics
  laptop: [P('34804001'), P('265101')],
  phone: [P('11494897'), P('13844013')],
  headphones: [P('815494'), P('3394666')],
  earbuds: [P('3921864'), P('8858287')],
  keyboard: [P('34877295'), P('5152261')],
  // Bags
  backpack: [P('346767'), P('4922686')],
  handbag: [P('14806252'), P('30975839')],
  // Toys
  blocks: [P('31061847'), P('33971335')],
  teddy: [P('35153296'), P('20692469')],
  // Furniture
  chair: [P('10892990'), P('29917912')],
  table: [P('12278554'), P('6265942')],
  // Footwear
  sneakers: [P('1456733'), P('260044')],
  // Home
  lamp: [P('6045094'), P('5400775')],
};

function make(
  i: number,
  partial: Omit<Listing, 'id' | 'createdAt' | 'status'> & { status?: Listing['status'] }
): Listing {
  return {
    id: `seed-${i}`,
    createdAt: Date.now() - i * 86400000 * 2,
    status: 'available',
    ...partial,
  };
}

export const SEED_LISTINGS: Listing[] = [
  make(1, { sellerId: 'seed-seller-1', sellerName: 'Ananya Rao', shopName: 'ReThread Boutique', contactPhone: '9999999999', email: 'ananya@demo.in', pickupAddress: '12 MG Road, Indiranagar', city: 'Bengaluru', pincode: '560038', productName: 'Floral Cotton Kurta — Size M', category: 'Clothes', condition: 'Like New', description: 'Worn twice. Handwoven cotton kurta with floral block print. No stains or tears.', price: 499, quantity: 1, brand: 'FabIndia', productAge: '6 months', images: PHOTOS.kurta, mode: 'sell', defects: 'Minor thread looseness near hem.' }),
  make(2, { sellerId: 'seed-seller-2', sellerName: 'Rahul Mehta', shopName: 'PageTurners', contactPhone: '9999999998', email: 'rahul@demo.in', pickupAddress: '45 Park Street', city: 'Kolkata', pincode: '700016', productName: 'Atomic Habits — Paperback', category: 'Books', condition: 'Good', description: 'Lightly used paperback. Some margin notes in pencil, easily erasable.', price: 220, quantity: 1, brand: 'Penguin', productAge: '1 year', images: PHOTOS.book1, mode: 'sell', defects: 'Pencil notes on a few pages.' }),
  make(3, { sellerId: 'seed-seller-3', sellerName: 'Sneha Iyer', contactPhone: '9999999997', email: 'sneha@demo.in', pickupAddress: 'Anna Nagar', city: 'Chennai', pincode: '600040', productName: 'Dell Inspiron 15 Laptop', category: 'Electronics', condition: 'Good', description: 'i5 10th gen, 8GB RAM, 256GB SSD. Battery holds ~4hrs. Reset to factory settings.', price: 18500, quantity: 1, brand: 'Dell', productAge: '3 years', images: PHOTOS.laptop, mode: 'sell', defects: 'One USB port slightly loose.' }),
  make(4, { sellerId: 'seed-seller-1', sellerName: 'Ananya Rao', shopName: 'ReThread Boutique', contactPhone: '9999999999', email: 'ananya@demo.in', pickupAddress: 'Indiranagar', city: 'Bengaluru', pincode: '560038', productName: 'Red Summer Dress — Size S', category: 'Clothes', condition: 'Like New', description: 'Cotton blend summer dress, worn once for an event.', price: 650, quantity: 1, brand: 'H&M', productAge: '4 months', images: PHOTOS.dress, mode: 'sell' }),
  make(5, { sellerId: 'seed-seller-4', sellerName: 'Vikram Singh', shopName: 'GadgetGully', contactPhone: '9999999996', email: 'vikram@demo.in', pickupAddress: 'Sector 18', city: 'Noida', pincode: '201301', productName: 'Sony WH-CH510 Wireless Headphones', category: 'Electronics', condition: 'Fair', description: 'Working condition. Cushions slightly worn. 12hr battery life.', price: 1200, quantity: 1, brand: 'Sony', productAge: '2 years', images: PHOTOS.headphones, mode: 'sell', defects: 'Ear cushion peeling on left side.' }),
  make(6, { sellerId: 'seed-seller-2', sellerName: 'Rahul Mehta', shopName: 'PageTurners', contactPhone: '9999999998', email: 'rahul@demo.in', pickupAddress: 'Park Street', city: 'Kolkata', pincode: '700016', productName: 'Wings of Fire — A.P.J Abdul Kalam', category: 'Books', condition: 'Like New', description: 'Autobiography in excellent condition. No markings.', price: 180, quantity: 2, brand: 'Universities Press', productAge: '5 months', images: PHOTOS.book2, mode: 'sell' }),
  make(7, { sellerId: 'seed-seller-5', sellerName: 'Priya Nair', contactPhone: '9999999995', email: 'priya@demo.in', pickupAddress: 'Banjara Hills', city: 'Hyderabad', pincode: '500034', productName: 'Wildcraft Trail Backpack 30L', category: 'Bags', condition: 'Good', description: 'Sturdy hiking backpack. One zip pocket repaired.', price: 950, quantity: 1, brand: 'Wildcraft', productAge: '1.5 years', images: PHOTOS.backpack, mode: 'sell', defects: 'Repaired inner zip pocket.' }),
  make(8, { sellerId: 'seed-seller-6', sellerName: 'Arjun Pillai', shopName: 'TinyTots Toys', contactPhone: '9999999994', email: 'arjun@demo.in', pickupAddress: 'Kochi Marine Drive', city: 'Kochi', pincode: '682031', productName: 'Wooden Building Blocks Set (50 pcs)', category: 'Toys', condition: 'Good', description: 'Natural wood blocks, no paint chipping. Great for ages 3+.', price: 0, quantity: 1, brand: 'Skola', productAge: '2 years', images: PHOTOS.blocks, mode: 'free' }),
  make(9, { sellerId: 'seed-seller-3', sellerName: 'Sneha Iyer', contactPhone: '9999999997', email: 'sneha@demo.in', pickupAddress: 'Anna Nagar', city: 'Chennai', pincode: '600040', productName: 'Wooden Accent Chair', category: 'Furniture', condition: 'Fair', description: 'Solid wood chair, sturdy frame. Could use a re-polish.', price: 750, quantity: 1, productAge: '5 years', images: PHOTOS.chair, mode: 'sell', defects: 'Surface scratches on armrest.' }),
  make(10, { sellerId: 'seed-seller-7', sellerName: 'Meera Joshi', contactPhone: '9999999993', email: 'meera@demo.in', pickupAddress: 'Pune Camp', city: 'Pune', pincode: '411001', productName: 'Nike Running Shoes — Size 8', category: 'Footwear', condition: 'Good', description: 'Lightly used running shoes. Soles intact.', price: 1400, quantity: 1, brand: 'Nike', productAge: '1 year', images: PHOTOS.sneakers, mode: 'sell', defects: 'Minor scuff on toe box.' }),
  make(11, { sellerId: 'seed-seller-5', sellerName: 'Priya Nair', contactPhone: '9999999995', email: 'priya@demo.in', pickupAddress: 'Banjara Hills', city: 'Hyderabad', pincode: '500034', productName: 'Brass Table Lamp', category: 'Home Items', condition: 'Like New', description: 'Vintage brass lamp with linen shade. Works perfectly.', price: 0, quantity: 1, productAge: '8 months', images: PHOTOS.lamp, mode: 'free' }),
  make(12, { sellerId: 'seed-seller-4', sellerName: 'Vikram Singh', shopName: 'GadgetGully', contactPhone: '9999999996', email: 'vikram@demo.in', pickupAddress: 'Sector 18', city: 'Noida', pincode: '201301', productName: 'Redmi Note 9 (4GB/64GB)', category: 'Electronics', condition: 'Fair', description: 'Functional phone, screen has a small crack in corner. Battery okay.', price: 3200, quantity: 1, brand: 'Redmi', productAge: '4 years', images: PHOTOS.phone, mode: 'sell', defects: 'Cracked screen corner.' }),
  make(13, { sellerId: 'seed-seller-1', sellerName: 'Ananya Rao', shopName: 'ReThread Boutique', contactPhone: '9999999999', email: 'ananya@demo.in', pickupAddress: 'Indiranagar', city: 'Bengaluru', pincode: '560038', productName: 'Leather Sling Handbag — Brown', category: 'Bags', condition: 'Good', description: 'Genuine leather sling bag, minor wear at corners.', price: 850, quantity: 1, brand: 'Lavie', productAge: '2 years', images: PHOTOS.handbag, mode: 'sell' }),
  make(14, { sellerId: 'seed-seller-6', sellerName: 'Arjun Pillai', shopName: 'TinyTots Toys', contactPhone: '9999999994', email: 'arjun@demo.in', pickupAddress: 'Marine Drive', city: 'Kochi', pincode: '682031', productName: 'Plush Teddy Bear (Large)', category: 'Toys', condition: 'Like New', description: 'Soft, clean, freshly washed. Free to a good home.', price: 0, quantity: 1, images: PHOTOS.teddy, mode: 'free' }),
  make(15, { sellerId: 'seed-seller-3', sellerName: 'Sneha Iyer', contactPhone: '9999999997', email: 'sneha@demo.in', pickupAddress: 'Anna Nagar', city: 'Chennai', pincode: '600040', productName: 'Blue Cotton Shirt — Size L', category: 'Clothes', condition: 'Good', description: 'Classic fit shirt. Worn a few times, no defects.', price: 350, quantity: 2, brand: 'Peter England', productAge: '1 year', images: PHOTOS.shirt, mode: 'sell' }),
  make(16, { sellerId: 'seed-seller-7', sellerName: 'Meera Joshi', contactPhone: '9999999993', email: 'meera@demo.in', pickupAddress: 'Pune Camp', city: 'Pune', pincode: '411001', productName: 'Folding Study Table', category: 'Furniture', condition: 'Good', description: 'Compact foldable study table, metal frame + wood top.', price: 1100, quantity: 1, productAge: '2 years', images: PHOTOS.table, mode: 'sell' }),
  make(17, { sellerId: 'seed-seller-2', sellerName: 'Rahul Mehta', shopName: 'PageTurners', contactPhone: '9999999998', email: 'rahul@demo.in', pickupAddress: 'Park Street', city: 'Kolkata', pincode: '700016', productName: 'The Alchemist — Hardcover', category: 'Books', condition: 'Like New', description: 'Beautiful hardcover edition, unread.', price: 0, quantity: 1, brand: 'HarperCollins', productAge: '3 months', images: PHOTOS.book3, mode: 'free' }),
  make(18, { sellerId: 'seed-seller-5', sellerName: 'Priya Nair', contactPhone: '9999999995', email: 'priya@demo.in', pickupAddress: 'Banjara Hills', city: 'Hyderabad', pincode: '500034', productName: 'Boat Bassbuds Earbuds', category: 'Electronics', condition: 'Fair', description: 'Working earbuds with case. Right bud battery drains faster.', price: 0, quantity: 1, brand: 'Boat', productAge: '1.5 years', images: PHOTOS.earbuds, mode: 'free', defects: 'Right bud faster battery drain.' }),
];

export const CATEGORY_LIST = CATEGORIES;

export const CATEGORY_ICONS: Record<Category, string> = {
  Clothes: 'Shirt',
  Books: 'BookOpen',
  Electronics: 'Laptop',
  Bags: 'ShoppingBag',
  Toys: 'Gamepad2',
  Furniture: 'Armchair',
  Footwear: 'Footprints',
  'Home Items': 'Lamp',
};

export const CONDITIONS: Condition[] = ['Like New', 'Good', 'Fair'];

export const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Noida', 'Kochi', 'Jaipur'];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}
