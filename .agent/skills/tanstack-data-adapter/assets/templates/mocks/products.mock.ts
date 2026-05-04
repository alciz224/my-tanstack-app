import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'local_prod_1',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones with 30hr battery',
    price: 299.99,
    category: 'electronics',
    inStock: true,
  },
  {
    id: 'local_prod_2',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainably sourced, ultra-soft everyday tee',
    price: 34.99,
    category: 'clothing',
    inStock: true,
  },
  {
    id: 'local_prod_3',
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable switches, RGB backlighting',
    price: 149.99,
    category: 'electronics',
    inStock: false,
  },
];
