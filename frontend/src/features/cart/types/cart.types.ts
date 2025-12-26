export interface CartItem {
  productId: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
