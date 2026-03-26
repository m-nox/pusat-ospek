import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Tag, Package, FileText, Activity } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  
  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/leads', icon: <FileText size={20} />, label: 'Leads & Orders' },
    { to: '/admin/sales', icon: <Users size={20} />, label: 'Sales Management' },
    { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { to: '/admin/reports', icon: <Activity size={20} />, label: 'Reports' },
  ];

  const salesLinks = [
    { to: '/sales', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/sales/leads', icon: <FileText size={20} />, label: 'My Leads' },
    { to: '/sales/referral', icon: <Tag size={20} />, label: 'My Referral' },
    { to: '/sales/performance', icon: <Activity size={20} />, label: 'Performance' },
  ];

  const links = user?.role === 'admin' ? adminLinks : salesLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Pusatospek</h2>
        <span className="badge">{user?.role}</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={link.to === '/admin' || link.to === '/sales'}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
