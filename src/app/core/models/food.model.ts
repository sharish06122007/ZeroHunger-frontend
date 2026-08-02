// core/models/food.model.ts
export type FoodStatus = 'available' | 'reserved' | 'collected' | 'expired';
export type FoodCategory = 'cooked' | 'raw' | 'packaged' | 'beverage' | 'bakery' | 'dairy' | 'other';

export interface Food {
  _id: string;
  title: string;
  description?: string;
  category: FoodCategory;
  quantity: string;
  quantityUnit?: string;
  images: string[];
  status: FoodStatus;
  expiryTime: string;
  pickupTime?: string;
  pickupAddress?: string;
  city?: string;
  restaurantName?: string;
  donatedBy: { _id: string; fullName: string; email?: string; organizationName?: string; phone?: string; };
  reservedBy?: { _id: string; fullName: string; email?: string; } | null;
  collectedBy?: { _id: string; fullName: string; email?: string; } | null;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
