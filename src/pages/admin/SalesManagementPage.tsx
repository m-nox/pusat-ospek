import { useState, useEffect } from 'react';
import { getItem, setItem } from '../../lib/storage';
import { type User, type LeadOrder, type ReferralCode } from '../../types';
import { Eye, EyeOff, Plus, Edit2, Trash2 } from 'lucide-react';

const SalesManagementPage = () => {
  const [sales, setSales] = useState<User[]>([]);
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Track visible passwords by user ID
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = getItem<User[]>('users', []);
    setSales(users.filter(u => u.role === 'sales'));
    setLeads(getItem<LeadOrder[]>('leads', []));
    setReferrals(getItem<ReferralCode[]>('referralCodes', []));
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewPassword(user.password || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sales agent?")) return;
    
    // Remove user
    const users = getItem<User[]>('users', []);
    setItem('users', users.filter(u => u.id !== id));
    
    // Remove referral codes linked to this user
    const refCodes = getItem<ReferralCode[]>('referralCodes', []);
    setItem('referralCodes', refCodes.filter(r => r.salesId !== id));

    // Unassign leads
    const allLeads = getItem<LeadOrder[]>('leads', []);
    const updatedLeads = allLeads.map(l => {
      if(l.assignedSalesId === id) return { ...l, assignedSalesId: undefined };
      return l;
    });
    setItem('leads', updatedLeads);

    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getItem<User[]>('users', []);
    const refCodes = getItem<ReferralCode[]>('referralCodes', []);
    
    // Check if email exists for other users
    const existing = users.find(u => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== editingId);
    if (existing) {
      alert('Email already exists');
      return;
    }

    if (editingId) {
      // Update
      const updatedUsers = users.map(u => {
        if (u.id === editingId) {
          return { ...u, name: newName, email: newEmail, password: newPassword };
        }
        return u;
      });
      setItem('users', updatedUsers);
    } else {
      // Create
      const newUserId = 's' + Date.now();
      const newUser: User = {
        id: newUserId,
        email: newEmail,
        name: newName,
        role: 'sales',
        password: newPassword
      };
      
      const newRefCode: ReferralCode = {
        id: 'r' + Date.now(),
        code: newName.toUpperCase().replace(/\s+/g, '') + '-' + Math.floor(Math.random() * 1000),
        salesId: newUserId,
        createdAt: new Date().toISOString()
      };

      setItem('users', [...users, newUser]);
      setItem('referralCodes', [...refCodes, newRefCode]);
    }
    
    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setEditingId(null);
    setShowForm(false);
    
    // Reload local state
    loadData();
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewName('');
            setNewEmail('');
            setNewPassword('');
            setShowForm(!showForm);
          }} 
          className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add Sales Agent</>}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="font-bold mb-4">{editingId ? 'Edit Sales Agent' : 'Add New Sales Agent'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md-grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-bold block mb-1">Name</label>
              <input 
                type="text" 
                required 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Agent Name"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="agent@pusatospek.local"
              />
            </div>
            <div>
              <label className="text-sm font-bold block mb-1">Password</label>
              <input 
                type="text" 
                required 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div>
              <button type="submit" className="btn btn-success w-full">{editingId ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Referral Code</th>
              <th>Total Assigned Leads</th>
              <th>Won Leads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => {
              const assigned = leads.filter(l => l.assignedSalesId === s.id);
              const won = assigned.filter(l => l.status === 'Closed Won');
              const isVisible = visiblePasswords[s.id];
              const refLog = referrals.find(r => r.salesId === s.id);

              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: isVisible ? 'inherit' : 'monospace' }}>
                        {isVisible ? (s.password || 'none') : '••••••••'}
                      </span>
                      <button 
                        onClick={() => togglePassword(s.id)} 
                        className="text-muted"
                        title={isVisible ? "Hide Password" : "Show Password"}
                      >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td><span className="font-bold">{refLog ? refLog.code : '-'}</span></td>
                  <td>{assigned.length}</td>
                  <td>{won.length}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(s)} className="btn btn-outline text-sm" style={{padding: '0.4rem 0.6rem'}} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="btn text-sm" style={{padding: '0.4rem 0.6rem', color: 'var(--danger)', borderColor: 'var(--danger)', border: '1px solid var(--danger)'}} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SalesManagementPage;
