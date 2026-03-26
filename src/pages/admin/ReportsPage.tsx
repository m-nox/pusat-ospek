import { useState, useEffect } from 'react';
import { getItem } from '../../lib/storage';
import { type LeadOrder, type Product } from '../../types';

const ReportsPage = () => {
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLeads(getItem<LeadOrder[]>('leads', []));
    setProducts(getItem<Product[]>('products', []));
  }, []);

  const wonLeads = leads.filter(l => l.status === 'Closed Won');
  
  const revenue = wonLeads.reduce((acc, lead) => {
    const product = products.find(p => p.id === lead.productId);
    return acc + ((product?.price || 0) * lead.quantity);
  }, 0);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 md-grid-cols-2 gap-6 mb-8">
        <div className="card text-center py-8 border-t-4" style={{borderTopColor: 'var(--success)'}}>
          <h3 className="text-muted uppercase tracking-wider mb-2">Total Confirmed Revenue</h3>
          <p className="text-4xl font-bold text-success">Rp {revenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="card text-center py-8 border-t-4" style={{borderTopColor: 'var(--primary)'}}>
          <h3 className="text-muted uppercase tracking-wider mb-2">Conversion Rate</h3>
          <p className="text-4xl font-bold text-primary">
            {leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;
