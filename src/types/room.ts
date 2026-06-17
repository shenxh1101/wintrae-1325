export interface Room {
  id: string;
  name: string;
  type: 'standard' | 'deluxe' | 'vip' | 'suite';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  facilities: string[];
  size: string;
  capacity: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}
