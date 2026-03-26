import { useState, useEffect } from 'react';
import { getItem } from '../../lib/storage';
import type { ReferralCode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Copy, Check } from 'lucide-react';

const MyReferralPage = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const allCodes = getItem<ReferralCode[]>('referralCodes', []);
    setCodes(allCodes.filter(c => c.salesId === user?.id));
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">My Referral Codes</h1>
      <div className="grid grid-cols-1 md-grid-cols-2 gap-6">
        {codes.map(c => {
          const link = `${window.location.origin}/order?ref=${c.code}`;
          return (
            <div key={c.id} className="card">
              <h3 className="font-bold text-xl mb-4 text-primary">{c.code}</h3>
              <p className="text-sm text-muted mb-2">Share this link to your leads:</p>
              <div className="flex gap-2">
                <input type="text" readOnly value={link} className="bg-background" />
                <button onClick={() => copyToClipboard(link)} className="btn btn-primary" title="Copy Link">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          );
        })}
        {codes.length === 0 && <p className="text-muted">You do not have any referral codes assigned.</p>}
      </div>
    </div>
  );
};
export default MyReferralPage;
