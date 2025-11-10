import { Supplier, DashboardStats, Contract, FeedstockRecord } from '../types';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PT. Agro Lestari',
    type: 'supplier',
    email: 'contact@agrolestari.com',
    phone: '+62 21 5555 1234',
    location: {
      address: 'Jl. Merdeka No. 123, Jakarta',
      region: 'Jakarta',
      coordinates: { lat: -6.2088, lng: 106.8456 }
    },
    registrationDate: '2024-01-15',
    status: 'active',
    totalVolume: 150000,
    averageQuality: 92,
    complianceStatus: 'compliant',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 95,
      quality: 92,
      delivery: 88
    }
  },
  {
    id: '2',
    name: 'Santo Farmer Group',
    type: 'farmer',
    email: 'santo@farmercoop.id',
    phone: '+62 361 5555 5678',
    location: {
      address: 'Desa Tegal Sari, Bali',
      region: 'Bali',
      coordinates: { lat: -8.4095, lng: 115.1889 }
    },
    registrationDate: '2024-02-20',
    status: 'active',
    totalVolume: 75000,
    averageQuality: 88,
    complianceStatus: 'compliant',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 90,
      quality: 88,
      delivery: 92
    }
  },
  {
    id: '3',
    name: 'CV. Harvest Indonesia',
    type: 'supplier',
    email: 'info@harvestindo.com',
    phone: '+62 22 5555 9012',
    location: {
      address: 'Jl. Industri No. 45, Bandung',
      region: 'West Java',
      coordinates: { lat: -6.9175, lng: 107.6191 }
    },
    registrationDate: '2024-03-10',
    status: 'pending',
    totalVolume: 45000,
    averageQuality: 85,
    complianceStatus: 'pending',
    contracts: [],
    feedstockHistory: [],
    performance: {
      reliability: 85,
      quality: 85,
      delivery: 80
    }
  }
];

export const mockContracts: Contract[] = [
  {
    id: 'c1',
    supplierId: '1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    terms: 'Monthly delivery of 10,000 tons',
    volume: 120000,
    price: 850,
    status: 'active'
  },
  {
    id: 'c2',
    supplierId: '2',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    terms: 'Bi-weekly delivery of 3,000 tons',
    volume: 72000,
    price: 820,
    status: 'active'
  }
];

export const mockFeedstockRecords: FeedstockRecord[] = [
  {
    id: 'f1',
    supplierId: '1',
    date: '2024-11-08',
    volume: 8500,
    quality: {
      moisture: 12,
      purity: 94,
      contamination: 2
    },
    location: 'Jakarta Collection Point',
    photos: ['/photos/delivery1.jpg', '/photos/delivery2.jpg'],
    status: 'approved',
    certificateUrl: '/certs/quality1.pdf'
  },
  {
    id: 'f2',
    supplierId: '2',
    date: '2024-11-07',
    volume: 3200,
    quality: {
      moisture: 14,
      purity: 90,
      contamination: 3
    },
    location: 'Bali Collection Point',
    photos: ['/photos/delivery3.jpg'],
    status: 'pending'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalSuppliers: 145,
  totalFarmers: 2840,
  activeSuppliers: 132,
  totalVolume: 2450000,
  averageQuality: 89.5,
  pendingRegistrations: 12,
  recentActivity: [
    {
      id: 'a1',
      type: 'delivery',
      description: 'New delivery received from PT. Agro Lestari',
      timestamp: '2024-11-08T10:30:00Z',
      entityId: '1',
      entityName: 'PT. Agro Lestari'
    },
    {
      id: 'a2',
      type: 'registration',
      description: 'New supplier registration: CV. Harvest Indonesia',
      timestamp: '2024-11-08T09:15:00Z',
      entityId: '3',
      entityName: 'CV. Harvest Indonesia'
    },
    {
      id: 'a3',
      type: 'quality_check',
      description: 'Quality check completed for Santo Farmer Group',
      timestamp: '2024-11-07T15:45:00Z',
      entityId: '2',
      entityName: 'Santo Farmer Group'
    }
  ]
};