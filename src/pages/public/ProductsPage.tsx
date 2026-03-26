import { useEffect, useState } from 'react';
import { getItem } from '../../lib/storage';
import { type Product } from '../../types';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getItem<Product[]>('products', []));
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="card">
            <h3 className="font-bold mb-2">{p.name}</h3>
            <p className="text-muted mb-4">{p.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold">Rp {p.price.toLocaleString('id-ID')}</span>
              <Link to="/order" className="btn btn-primary">Order</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
