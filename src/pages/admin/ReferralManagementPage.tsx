import { useState, useEffect } from 'react';
import { getItem } from '../../lib/storage';
import { type ReferralCode, type User } from '../../types';

const ReferralManagementPage = () => {
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  const [sales, setSales] = useState<User[]>([]);

  useEffect(() => {
    setReferrals(getItem<ReferralCode[]>('referralCodes', []));
    const users = getItem<User[]>('users', []);
    setSales(users.filter(u => u.role === 'sales'));
  }, []);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referral Codes</h1>
      </div>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Assigned Sales</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(r => {
              const sale = sales.find(s => s.id === r.salesId);
              return (
                <tr key={r.id}>
                  <td className="font-bold">{r.code}</td>
                  <td>{sale ? sale.name : 'Unknown'}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReferralManagementPage;
