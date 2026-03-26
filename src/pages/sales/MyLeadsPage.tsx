import { useState, useEffect } from 'react';
import { LeadTable } from '../../components/LeadTable';
import { getItem } from '../../lib/storage';
import type { LeadOrder } from '../../types';
import { useAuth } from '../../context/AuthContext';

const MyLeadsPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadOrder[]>([]);

  useEffect(() => {
    const allLeads = getItem<LeadOrder[]>('leads', []);
    setLeads(allLeads.filter(l => l.assignedSalesId === user?.id));
  }, [user]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">My Leads & Orders</h1>
      <LeadTable leads={leads} isSales={true} />
    </div>
  );
};
export default MyLeadsPage;
