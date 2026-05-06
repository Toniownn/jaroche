export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  tone?: string;
  tag?: string;
  label?: string;
  material?: string;
  madeBy?: string;
  createdAt: string;
}
