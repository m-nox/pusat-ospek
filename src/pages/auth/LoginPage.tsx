import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserByEmail } from '../../lib/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = getUserByEmail(email);
    
    // Support legacy demo accounts that might not have a password stored in localStorage yet
    const expectedPassword = user?.password || (user?.role === 'admin' ? 'admin' : 'sales');

    if (user && password === expectedPassword) {
      login(user);
      navigate(user.role === 'admin' ? '/admin' : '/sales');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="container py-16 flex justify-center">
      <div className="card w-full" style={{ maxWidth: '400px' }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Pusatospek</h1>
        
        {error && <div className="bg-danger text-white p-3 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="font-bold block mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@pusatospek.local"
            />
          </div>
          <div>
            <label className="font-bold block mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="admin123"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">Login</button>
        </form>

        <div className="mt-8 text-sm text-muted bg-background p-4 rounded">
          <p><strong>Demo Accounts:</strong></p>
          <ul className="mt-2 text-left" style={{listStyle: 'disc', paddingLeft: '20px'}}>
            <li>Admin: admin@pusatospek.local (pwd: admin)</li>
            <li>Sales 1: sales1@pusatospek.local (pwd: sales)</li>
            <li>Sales 2: sales2@pusatospek.local (pwd: sales)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
