import { useEffect, useState } from 'react';
import { StatCard } from '../../components/StatCard';
import { LeadTable } from '../../components/LeadTable';
import { getItem } from '../../lib/storage';
import { type LeadOrder } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { FileText, Package, AlertCircle } from 'lucide-react';

const SalesDashboardPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadOrder[]>([]);

  useEffect(() => {
    const allLeads = getItem<LeadOrder[]>('leads', []);
    setLeads(allLeads.filter(l => l.assignedSalesId === user?.id));
  }, [user]);

  const totalLeads = leads.length;
  const requireAction = leads.filter(l => ['New', 'Follow Up'].includes(l.status)).length;
  const closedWon = leads.filter(l => l.status === 'Closed Won').length;

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-8">
        <StatCard title="My Total Leads" value={totalLeads} icon={<FileText size={32} />} color="primary" />
        <StatCard title="Requires Action" value={requireAction} icon={<AlertCircle size={32} />} color="warning" />
        <StatCard title="Closed Won" value={closedWon} icon={<Package size={32} />} color="success" />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Referrals</h2>
      <LeadTable leads={leads.slice(-5).reverse()} isSales={true} />
    </div>
  );
};

export default SalesDashboardPage;
