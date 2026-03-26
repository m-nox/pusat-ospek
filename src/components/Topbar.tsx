import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-search">
        {/* Placeholder for search */}
      </div>
      <div className="topbar-user">
        <div className="user-info">
          <UserIcon size={20} />
          <span>{user?.name}</span>
        </div>
        <button onClick={logout} className="btn-logout" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
