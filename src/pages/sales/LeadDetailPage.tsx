import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, setItem } from '../../lib/storage';
import type { LeadOrder, OrderStatus, Product, PickupPoint } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';

const LeadDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lead, setLead] = useState<LeadOrder | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null);

  useEffect(() => {
    const leads = getItem<LeadOrder[]>('leads', []);
    const found = leads.find(l => l.id === id && l.assignedSalesId === user?.id);
    if (found) {
      setLead(found);
      const products = getItem<Product[]>('products', []);
      setProduct(products.find(p => p.id === found.productId) || null);
      
      const pickupPoints = getItem<PickupPoint[]>('pickupPoints', []);
      setPickupPoint(pickupPoints.find(p => p.id === found.pickupPointId) || null);
    }
  }, [id, user]);

  const handleStatusUpdate = (newStatus: OrderStatus, note: string) => {
    if (!lead) return;
    const leads = getItem<LeadOrder[]>('leads', []);
    const updated = leads.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: newStatus,
          history: [...l.history, {
            date: new Date().toISOString(),
            status: newStatus,
            note,
            changedBy: user?.name || 'Sales'
          }],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });
    setItem('leads', updated);
    setLead(updated.find(l => l.id === lead.id) || null);
  };

  if (!lead) return <div className="container py-6">Lead not found or unauthorized.</div>;

  return (
    <div className="container py-6">
      <button className="btn btn-outline mb-4" onClick={() => navigate('/sales/leads')}>&larr; Back to Leads</button>
      <div className="card">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Lead Details: {lead.fullName}</h1>
          <StatusBadge status={lead.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold mb-2">Contact Information</h3>
            <p><strong>WhatsApp:</strong> {lead.whatsapp}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>City:</strong> {lead.city}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Order Information</h3>
            <p><strong>Product:</strong> {product?.name}</p>
            <p><strong>Quantity:</strong> {lead.quantity}</p>
            <p><strong>University:</strong> {lead.university}</p>
            <p><strong>Pickup Point:</strong> {pickupPoint?.name || lead.pickupPointId}</p>
            <p><strong>Notes:</strong> {lead.notes || '-'}</p>
          </div>
        </div>

        <div className="mb-6 border-t pt-4">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => handleStatusUpdate('Contacted', 'Reached out to lead')} className="btn btn-outline">Mark as Contacted</button>
            <button onClick={() => handleStatusUpdate('Follow Up', 'Requires follow up')} className="btn" style={{backgroundColor: 'var(--warning)', color: 'white'}}>Needs Follow Up</button>
            <button onClick={() => handleStatusUpdate('Paid', 'Payment received')} className="btn btn-primary">Mark as Paid</button>
            <button onClick={() => handleStatusUpdate('Picked Up', 'Order picked up by customer')} className="btn btn-success">Mark as Picked Up</button>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">History</h3>
          <ul className="flex flex-col gap-2">
            {lead.history.map((h, i) => (
              <li key={i} className="text-sm border-l-2 border-primary pl-4 py-1" style={{ borderLeftColor: 'var(--primary)', borderLeftWidth: '2px', borderLeftStyle: 'solid' }}>
                <span className="text-muted">{new Date(h.date).toLocaleString()}</span> - <strong>{h.status}</strong> by {h.changedBy}
                <p className="text-muted mt-1">{h.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LeadDetailPage;
