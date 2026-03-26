import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <header className="public-header container">
        <div className="logo">
          <Link to="/"><h2>Pusatospek</h2></Link>
        </div>
        <nav className="public-nav">
          <Link to="/products">Products</Link>
          <Link to="/features">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/order" className="btn btn-primary">Order Now</Link>
          <Link to="/login" className="btn btn-outline" style={{ marginLeft: '1rem' }}>Login</Link>
        </nav>
      </header>
      <main className="public-content">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="container text-center text-muted">
          &copy; {new Date().getFullYear()} Pusatospek. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
