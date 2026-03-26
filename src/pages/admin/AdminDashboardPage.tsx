import { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard';
import { LeadTable } from '../../components/LeadTable';
import { getItem } from '../../lib/storage';
import { type LeadOrder, type User, type PickupPoint } from '../../types';
import { Users, FileText, Package } from 'lucide-react';

const AdminDashboardPage = () => {
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [sales, setSales] = useState<User[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);

  const [filterPickupPoint, setFilterPickupPoint] = useState<string>('');
  const [filterUniversity, setFilterUniversity] = useState<string>('');
  const [filterReferralCode, setFilterReferralCode] = useState<string>('');

  useEffect(() => {
    setLeads(getItem<LeadOrder[]>('leads', []));
    const allUsers = getItem<User[]>('users', []);
    setSales(allUsers.filter(u => u.role === 'sales'));
    setPickupPoints(getItem<PickupPoint[]>('pickupPoints', []));
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchPickup = filterPickupPoint ? l.pickupPointId === filterPickupPoint : true;
    const matchUniv = filterUniversity ? l.university.toLowerCase().includes(filterUniversity.toLowerCase()) : true;
    const matchRef = filterReferralCode ? (l.referralCode || '').toLowerCase().includes(filterReferralCode.toLowerCase()) : true;
    return matchPickup && matchUniv && matchRef;
  });

  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter(l => l.status === 'New').length;
  const closedWon = filteredLeads.filter(l => l.status === 'Closed Won').length;

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="card mb-8">
        <h3 className="font-bold mb-4">Filter by</h3>
        <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-bold block mb-1">Pickup Point</label>
            <select value={filterPickupPoint} onChange={e => setFilterPickupPoint(e.target.value)}>
              <option value="">All Locations</option>
              {pickupPoints.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold block mb-1">University</label>
            <input 
              type="text" 
              placeholder="Search university..." 
              value={filterUniversity} 
              onChange={e => setFilterUniversity(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-bold block mb-1">Referral Code</label>
            <input 
              type="text" 
              placeholder="Search referral code..." 
              value={filterReferralCode} 
              onChange={e => setFilterReferralCode(e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md-grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Leads/Orders" value={totalLeads} icon={<FileText size={32} />} color="primary" />
        <StatCard title="New Leads" value={newLeads} icon={<FileText size={32} />} color="warning" />
        <StatCard title="Closed Won" value={closedWon} icon={<Package size={32} />} color="success" />
        <StatCard title="Total Sales Agents" value={sales.length} icon={<Users size={32} />} color="secondary" />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Leads</h2>
      <LeadTable leads={filteredLeads.slice(-5).reverse()} />
    </div>
  );
};

export default AdminDashboardPage;
