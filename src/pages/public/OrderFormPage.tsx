import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getItem, setItem } from '../../lib/storage';
import { UNIVERSITIES } from '../../lib/seed';
import { validateReferralCode } from '../../lib/referral';
import { type Product, type PickupPoint, type LeadOrder } from '../../types';

const OrderFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    university: '',
    facultyMajor: '',
    city: '',
    productId: '',
    quantity: 1,
    pickupPointId: '',
    notes: '',
    referralCode: searchParams.get('ref') || '',
    privacyCheckbox: false
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setProducts(getItem<Product[]>('products', []));
    setPickupPoints(getItem<PickupPoint[]>('pickupPoints', []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.privacyCheckbox) {
      setError('You must agree to the privacy consent.');
      return;
    }

    let assignedSalesId: string | undefined = undefined;
    
    if (formData.referralCode) {
      const code = validateReferralCode(formData.referralCode);
      if (!code) {
        setError('Invalid referral code. Please check or leave empty.');
        return;
      }
      assignedSalesId = code.salesId;
    }

    const newLead: LeadOrder = {
      id: `l${Date.now()}`,
      fullName: formData.fullName,
      whatsapp: formData.whatsapp,
      email: formData.email,
      university: formData.university,
      facultyMajor: formData.facultyMajor,
      city: formData.city,
      productId: formData.productId,
      quantity: Number(formData.quantity),
      pickupPointId: formData.pickupPointId,
      notes: formData.notes,
      referralCode: formData.referralCode,
      assignedSalesId,
      status: 'New',
      history: [{
        date: new Date().toISOString(),
        status: 'New',
        note: 'Order placed by customer',
        changedBy: 'System'
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const leads = getItem<LeadOrder[]>('leads', []);
    setItem('leads', [...leads, newLead]);

    navigate('/thank-you');
  };

  return (
    <div className="container py-8">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Order Your Ospek Needs</h1>
        
        {error && (
          <div className="bg-danger text-white p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
            <div>
              <label className="font-bold mb-2 block">Full Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <label className="font-bold mb-2 block">WhatsApp Number *</label>
              <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} />
            </div>
            <div>
              <label className="font-bold mb-2 block">Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="font-bold mb-2 block">City *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <label className="font-bold mb-2 block">University *</label>
              <select name="university" required value={formData.university} onChange={handleChange}>
                <option value="">Select University</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="font-bold mb-2 block">Faculty/Major (Optional)</label>
              <input type="text" name="facultyMajor" value={formData.facultyMajor} onChange={handleChange} />
            </div>
          </div>

          <h3 className="font-bold text-xl mt-4 border-t pt-4">Order Details</h3>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
            <div>
              <label className="font-bold mb-2 block">Product *</label>
              <select name="productId" required value={formData.productId} onChange={handleChange}>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>)}
              </select>
            </div>
            <div>
              <label className="font-bold mb-2 block">Quantity *</label>
              <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleChange} />
            </div>
            <div>
              <label className="font-bold mb-2 block">Pickup Point *</label>
              <select name="pickupPointId" required value={formData.pickupPointId} onChange={handleChange}>
                <option value="">Select Pickup Point</option>
                {pickupPoints.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-bold mb-2 block">Referral Code (Optional)</label>
              <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="e.g. SALES1-A" />
            </div>
          </div>

          <div>
            <label className="font-bold mb-2 block">Notes/Message</label>
            <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange}></textarea>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="privacyCheckbox" id="privacy" style={{width: 'auto'}} checked={formData.privacyCheckbox} onChange={handleChange} />
            <label htmlFor="privacy">I agree to the privacy policy and consent to being contacted regarding this order.</label>
          </div>

          <button type="submit" className="btn btn-primary mt-6 text-lg w-full">Submit Order</button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormPage;
