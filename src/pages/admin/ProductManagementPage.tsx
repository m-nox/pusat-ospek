import { useState, useEffect } from 'react';
import { getItem } from '../../lib/storage';
import { type Product } from '../../types';

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getItem<Product[]>('products', []));
  }, []);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Catalog</h1>
      </div>
      <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="card">
            <h3 className="font-bold mb-2">{p.name}</h3>
            <p className="text-muted mb-4">{p.description}</p>
            <div className="text-lg font-bold text-primary">Rp {p.price.toLocaleString('id-ID')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductManagementPage;
