export type Condition = 'Like New' | 'Good' | 'Fair';
export type ListingMode = 'sell' | 'free';
export type OrderStatus = 'Order Placed' | 'Order Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
export type ClaimStatus = 'Requested' | 'Accepted' | 'Handed Over' | 'Cancelled';
export type PaymentMethod = 'COD' | 'Online (Demo)';

export type Category =
  | 'Clothes'
  | 'Books'
  | 'Electronics'
  | 'Bags'
  | 'Toys'
  | 'Furniture'
  | 'Footwear'
  | 'Home Items';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  createdAt: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  shopName?: string;
  contactPhone: string;
  email: string;
  pickupAddress: string;
  city: string;
  pincode: string;
  productName: string;
  category: Category;
  condition: Condition;
  description: string;
  price: number;
  quantity: number;
  brand?: string;
  productAge?: string;
  images: string[];
  mode: ListingMode;
  status: 'available' | 'sold' | 'handed-over';
  createdAt: number;
  defects?: string;
}

export interface OrderItem {
  listingId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  condition: Condition;
  sellerName: string;
  city: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  pincode: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: number }[];
  createdAt: number;
}

export interface Claim {
  id: string;
  listingId: string;
  claimerId: string;
  claimerName: string;
  status: ClaimStatus;
  createdAt: number;
  updatedAt: number;
}
