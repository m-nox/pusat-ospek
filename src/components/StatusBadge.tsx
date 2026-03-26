import { type OrderStatus } from '../types';

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  let color = 'secondary';
  switch(status) {
    case 'New': color = 'primary'; break;
    case 'Confirmed': color = 'success'; break;
    case 'Paid': color = 'primary'; break;
    case 'Picked Up': color = 'success'; break;
    case 'Closed Won': color = 'success'; break;
    case 'Closed Lost': color = 'danger'; break;
    case 'Contacted':
    case 'Follow Up': color = 'warning'; break;
  }
  
  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      borderRadius: '0.25rem',
      backgroundColor: `var(--${color})`,
      color: 'white'
    }}>
      {status}
    </span>
  );
};
