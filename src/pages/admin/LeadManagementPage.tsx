import { useState, useEffect } from 'react';
import { LeadTable } from '../../components/LeadTable';
import { getItem, setItem } from '../../lib/storage';
import { type LeadOrder, type OrderStatus, type Product, type User, type PickupPoint } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

const LeadManagementPage = () => {
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<User[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);

  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPickupPoint, setFilterPickupPoint] = useState<string>('');
  const [filterUniversity, setFilterUniversity] = useState<string>('');
  const [filterReferralCode, setFilterReferralCode] = useState<string>('');
  
  const [editingLead, setEditingLead] = useState<LeadOrder | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const detailId = searchParams.get('id');

  useEffect(() => {
    setLeads(getItem<LeadOrder[]>('leads', []));
    setProducts(getItem<Product[]>('products', []));
    setSales(getItem<User[]>('users', []).filter(u => u.role === 'sales'));
    setPickupPoints(getItem<PickupPoint[]>('pickupPoints', []));
  }, []);

  const handleStatusChange = (leadId: string, newStatus: OrderStatus) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          history: [...l.history, {
            date: new Date().toISOString(),
            status: newStatus,
            note: 'Status updated by Admin',
            changedBy: 'Admin'
          }],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });
    setLeads(updated);
    setItem('leads', updated);
  };

  const handleSalesAssignment = (leadId: string, newSalesId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          assignedSalesId: newSalesId || undefined,
          history: [...l.history, {
            date: new Date().toISOString(),
            status: l.status,
            note: newSalesId ? 'Assigned to Sales Agent' : 'Unassigned from Sales Agent',
            changedBy: 'Admin'
          }],
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });
    setLeads(updated);
    setItem('leads', updated);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    setItem('leads', updated);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    
    // Create new history entry marking the edit
    const modifiedLead = {
      ...editingLead,
      history: [...editingLead.history, {
        date: new Date().toISOString(),
        status: editingLead.status,
        note: 'Lead details manually updated by Admin',
        changedBy: 'Admin'
      }],
      updatedAt: new Date().toISOString()
    };

    const updated = leads.map(l => (l.id === modifiedLead.id ? modifiedLead : l));
    setLeads(updated);
    setItem('leads', updated);
    setEditingLead(null);
  };

  if (detailId) {
    const lead = leads.find(l => l.id === detailId);
    if (!lead) return <div className="container py-6">Lead not found.</div>;
    const product = products.find(p => p.id === lead.productId);
    const assigned = sales.find(s => s.id === lead.assignedSalesId);
    const pickupPoint = pickupPoints.find(p => p.id === lead.pickupPointId);

    return (
      <div className="container py-6">
        <button className="btn btn-outline mb-4" onClick={() => window.location.href = '/admin/leads'}>&larr; Back</button>
        <div className="card">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold">Lead Details: {lead.fullName}</h1>
            <StatusBadge status={lead.status} />
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-muted text-sm mb-2">Contact Info</p>
              <p><strong>WhatsApp:</strong> {lead.whatsapp}</p>
              <p><strong>Email:</strong> {lead.email}</p>
              <p><strong>City:</strong> {lead.city}</p>
            </div>
            <div>
              <p className="text-muted text-sm mb-2">Order Info</p>
              <p><strong>Product:</strong> {product?.name || lead.productId} (Qty: {lead.quantity})</p>
              <p><strong>University:</strong> {lead.university}</p>
              <p><strong>Pickup Point:</strong> {pickupPoint?.name || lead.pickupPointId}</p>
              <p><strong>Assigned Sales:</strong> {assigned?.name || 'Unassigned'}</p>
              <p><strong>Referral Code:</strong> {lead.referralCode || 'None'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-bold mb-2 block">Update Status:</label>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value as OrderStatus)}
                style={{ maxWidth: '300px' }}
              >
                <option value="New">New</option>
                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Paid">Paid</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
            <div>
              <label className="font-bold mb-2 block">Assign Sales Agent:</label>
              <select 
                value={lead.assignedSalesId || ''}
                onChange={(e) => handleSalesAssignment(lead.id, e.target.value)}
                style={{ maxWidth: '300px' }}
              >
                <option value="">-- Unassigned --</option>
                {sales.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
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
  }

  const filteredLeads = leads.filter(l => {
    const matchStatus = filterStatus ? l.status === filterStatus : true;
    const matchPickup = filterPickupPoint ? l.pickupPointId === filterPickupPoint : true;
    const matchUniv = filterUniversity ? l.university.toLowerCase().includes(filterUniversity.toLowerCase()) : true;
    const matchRef = filterReferralCode ? (l.referralCode || '').toLowerCase().includes(filterReferralCode.toLowerCase()) : true;
    return matchStatus && matchPickup && matchUniv && matchRef;
  });

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Leads & Orders Management</h1>
      
      <div className="card mb-6">
        <h3 className="font-bold mb-4">Filter by</h3>
        <div className="grid grid-cols-1 md-grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-bold block mb-1">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Paid">Paid</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>
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

      <LeadTable leads={filteredLeads} onEdit={setEditingLead} onDelete={handleDelete} />

      {editingLead && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-xl">Edit Lead Details</h3>
              <button type="button" onClick={() => setEditingLead(null)} className="text-muted font-bold text-2xl" style={{background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1}}>&times;</button>
            </div>
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md-grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">Full Name</label>
                <input type="text" required value={editingLead.fullName} onChange={e => setEditingLead({...editingLead, fullName: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">WhatsApp</label>
                <input type="text" required value={editingLead.whatsapp} onChange={e => setEditingLead({...editingLead, whatsapp: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Email</label>
                <input type="email" required value={editingLead.email} onChange={e => setEditingLead({...editingLead, email: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">City</label>
                <input type="text" required value={editingLead.city} onChange={e => setEditingLead({...editingLead, city: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">University</label>
                <input type="text" required value={editingLead.university} onChange={e => setEditingLead({...editingLead, university: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Referral Code</label>
                <input type="text" value={editingLead.referralCode || ''} onChange={e => setEditingLead({...editingLead, referralCode: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Product</label>
                <select value={editingLead.productId} onChange={e => setEditingLead({...editingLead, productId: e.target.value})}>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Pickup Point</label>
                <select value={editingLead.pickupPointId} onChange={e => setEditingLead({...editingLead, pickupPointId: e.target.value})}>
                  {pickupPoints.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <button type="submit" className="btn btn-primary w-full mt-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadManagementPage;
