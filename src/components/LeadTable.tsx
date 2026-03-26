import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type LeadOrder, type PickupPoint } from '../types';
import { StatusBadge } from './StatusBadge';
import { Edit2, Trash2 } from 'lucide-react';
import { getItem } from '../lib/storage';

interface LeadTableProps {
  leads: LeadOrder[];
  isSales?: boolean;
  onEdit?: (lead: LeadOrder) => void;
  onDelete?: (id: string) => void;
}

type SortField = 'createdAt' | 'fullName' | 'productId' | 'university' | 'pickupPointId' | 'referralCode' | 'status';
type SortDirection = 'asc' | 'desc';

export const LeadTable = ({ leads, isSales, onEdit, onDelete }: LeadTableProps) => {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    setPickupPoints(getItem<PickupPoint[]>('pickupPoints', []));
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="opacity-30 inline-block ml-1" style={{opacity: 0.3}}>↕</span>;
    return sortDirection === 'asc' ? <span className="inline-block ml-1">↑</span> : <span className="inline-block ml-1">↓</span>;
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let valA = String(a[sortField] || '').toLowerCase();
    let valB = String(b[sortField] || '').toLowerCase();

    // Map PickupPoint ID to Name for proper alphabet sorting
    if (sortField === 'pickupPointId') {
      const pA = pickupPoints.find(p => p.id === a.pickupPointId);
      const pB = pickupPoints.find(p => p.id === b.pickupPointId);
      valA = pA ? pA.name.toLowerCase() : valA;
      valB = pB ? pB.name.toLowerCase() : valB;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="card table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('createdAt')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Date">
              Date {getSortIcon('createdAt')}
            </th>
            <th onClick={() => handleSort('fullName')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Name">
              Name {getSortIcon('fullName')}
            </th>
            <th onClick={() => handleSort('productId')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Product">
              Product {getSortIcon('productId')}
            </th>
            <th onClick={() => handleSort('university')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by University">
              University {getSortIcon('university')}
            </th>
            <th onClick={() => handleSort('pickupPointId')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Pickup Point">
              Pickup Point {getSortIcon('pickupPointId')}
            </th>
            <th onClick={() => handleSort('referralCode')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Referral Code">
              Referral Code {getSortIcon('referralCode')}
            </th>
            <th onClick={() => handleSort('status')} style={{cursor: 'pointer', userSelect: 'none'}} title="Sort by Status">
              Status {getSortIcon('status')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeads.map(lead => {
            const pickupPoint = pickupPoints.find(p => p.id === lead.pickupPointId);
            return (
              <tr key={lead.id}>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>{lead.fullName}</td>
                <td>{lead.productId}</td>
                <td>{lead.university}</td>
                <td>{pickupPoint ? pickupPoint.name : lead.pickupPointId}</td>
                <td>{lead.referralCode || '-'}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link to={isSales ? `/sales/leads/${lead.id}` : `/admin/leads?id=${lead.id}`} className="btn btn-outline text-sm" style={{padding: '0.4rem 0.6rem'}}>
                      View
                    </Link>
                    {onEdit && (
                      <button onClick={() => onEdit(lead)} className="btn btn-outline text-sm" style={{padding: '0.4rem 0.6rem'}} title="Edit">
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(lead.id)} className="btn text-sm" style={{padding: '0.4rem 0.6rem', color: 'var(--danger)', borderColor: 'var(--danger)', border: '1px solid var(--danger)'}} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {sortedLeads.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-muted">No leads found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
