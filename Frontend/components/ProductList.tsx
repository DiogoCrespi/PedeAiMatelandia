import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h3>Produtos</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - R$ {p.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
} 