export interface DonationLocation {
  name: string;
  address: string;
  city: string;
  type: 'pickup' | 'dropoff';
  description: string;
  mapsQuery: string;
}

export interface DonationFeature {
  badge: string;
  title: string;
  description: string;
}

export interface DonationItem {
  id: number;
  title: string;
  quantityKg: number;
  status: 'Scheduled' | 'In transit' | 'Delivered';
  pickupTime: string;
  location: DonationLocation;
  features: string[];
}
