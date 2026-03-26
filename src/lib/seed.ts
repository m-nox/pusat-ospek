import { getItem, setItem } from './storage';
import { type User, type Product, type PickupPoint, type ReferralCode, type LeadOrder } from '../types';

export const UNIVERSITIES = [
  'Universitas Brawijaya',
  'Universitas Negeri Malang',
  'UIN Maulana Malik Ibrahim Malang',
  'Polinema',
  'Universitas Muhammadiyah Malang',
  'Other'
];

export const seedData = () => {
  const isSeeded = getItem('isSeeded', false);
  if (isSeeded) return;

  const users: User[] = [
    { id: '1', email: 'admin@pusatospek.local', name: 'Admin', role: 'admin', password: 'admin' },
    { id: '2', email: 'sales1@pusatospek.local', name: 'Sales One', role: 'sales', password: 'sales' },
    { id: '3', email: 'sales2@pusatospek.local', name: 'Sales Two', role: 'sales', password: 'sales' }
  ];

  const products: Product[] = [
    { id: 'p1', name: 'Paket Ospek Basic', price: 150000, description: 'Basic orientation needs.' },
    { id: 'p2', name: 'Paket Ospek Standard', price: 200000, description: 'Standard orientation pack.' },
    { id: 'p3', name: 'Paket Ospek Premium', price: 300000, description: 'Premium orientation pack with all extras.' },
    { id: 'p4', name: 'Kaos Ospek', price: 85000, description: 'Official orientation t-shirt.' },
    { id: 'p5', name: 'Name Tag Kit', price: 25000, description: 'Complete name tag requirements.' },
    { id: 'p6', name: 'Topi Ospek', price: 35000, description: 'Campus orientation hat.' },
    { id: 'p7', name: 'Tote Bag Kampus', price: 45000, description: 'Durable campus tote bag.' },
    { id: 'p8', name: 'Alat Tulis Paket Maba', price: 50000, description: 'Stationery set for new students.' }
  ];

  const pickupPoints: PickupPoint[] = [
    { id: 'pk1', name: 'Outlet Soekarno Hatta' },
    { id: 'pk2', name: 'Outlet Dinoyo' },
    { id: 'pk3', name: 'Outlet Lowokwaru' },
    { id: 'pk4', name: 'Outlet Veteran' },
    { id: 'pk5', name: 'COD Kampus UB' },
    { id: 'pk6', name: 'COD Kampus UM' },
    { id: 'pk7', name: 'COD Kampus UIN Malang' }
  ];

  const referralCodes: ReferralCode[] = [
    { id: 'r1', code: 'SALES1-A', salesId: '2', createdAt: new Date().toISOString() },
    { id: 'r2', code: 'SALES2-B', salesId: '3', createdAt: new Date().toISOString() }
  ];

  const leads: LeadOrder[] = [
    {
      id: 'l1',
      fullName: 'Budi Santoso',
      whatsapp: '081234567890',
      email: 'budi@example.com',
      university: 'Universitas Brawijaya',
      city: 'Malang',
      productId: 'p1',
      quantity: 1,
      pickupPointId: 'pk5',
      referralCode: 'SALES1-A',
      assignedSalesId: '2',
      status: 'New',
      history: [{ date: new Date().toISOString(), status: 'New', note: 'Order placed', changedBy: 'System' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  setItem('users', users);
  setItem('products', products);
  setItem('pickupPoints', pickupPoints);
  setItem('referralCodes', referralCodes);
  setItem('leads', leads);
  setItem('isSeeded', true);
};
