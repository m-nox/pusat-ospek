import { useState, useEffect } from 'react';
import { getItem } from '../../lib/storage';
import type { LeadOrder, Product } from '../../types';
import { useAuth } from '../../context/AuthContext';

const PerformancePage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const allLeads = getItem<LeadOrder[]>('leads', []);
    setLeads(allLeads.filter(l => l.assignedSalesId === user?.id));
    setProducts(getItem<Product[]>('products', []));
  }, [user]);

  const wonLeads = leads.filter(l => l.status === 'Closed Won');
  
  const estimatedCommission = wonLeads.reduce((acc, lead) => {
    const product = products.find(p => p.id === lead.productId);
    return acc + ((product?.price || 0) * lead.quantity * 0.1);
  }, 0);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">My Performance</h1>
      <div className="grid grid-cols-1 md-grid-cols-2 gap-6 mb-8">
        <div className="card text-center py-8 border-t-4" style={{borderTopColor: 'var(--primary)'}}>
          <h3 className="text-muted uppercase tracking-wider mb-2">Total Closed Won</h3>
          <p className="text-4xl font-bold text-primary">{wonLeads.length}</p>
        </div>
        <div className="card text-center py-8 border-t-4" style={{borderTopColor: 'var(--success)'}}>
          <h3 className="text-muted uppercase tracking-wider mb-2">Estimated Commission (10%)</h3>
          <p className="text-4xl font-bold text-success">Rp {estimatedCommission.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};
export default PerformancePage;
