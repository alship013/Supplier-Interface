export interface Contract {
  id: string;
  supplierId: string;
  startDate: string;
  endDate: string;
  terms: string;
  volume: number;
  price: number;
  status: 'active' | 'expired' | 'pending';
}

export interface FeedstockRecord {
  id: string;
  supplierId: string;
  date: string;
  volume: number;
  quality: {
    moisture: number;
    purity: number;
    contamination: number;
  };
  location: string;
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  certificateUrl?: string;
}

export interface Activity {
  id: string;
  type: 'registration' | 'delivery' | 'contract' | 'quality_check';
  description: string;
  timestamp: string;
  entityId: string;
  entityName: string;
}

export interface DashboardStats {
  totalSuppliers: number;
  totalFarmers: number;
  activeSuppliers: number;
  totalVolume: number;
  averageQuality: number;
  pendingRegistrations: number;
  recentActivity: Activity[];
}

export interface Supplier {
  id: string;
  name: string;
  type: 'supplier' | 'farmer';
  email: string;
  phone: string;
  location: {
    address: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalVolume: number;
  averageQuality: number;
  complianceStatus: 'compliant' | 'non-compliant' | 'pending';
  contracts: Contract[];
  feedstockHistory: FeedstockRecord[];
  performance: {
    reliability: number;
    quality: number;
    delivery: number;
  };
}