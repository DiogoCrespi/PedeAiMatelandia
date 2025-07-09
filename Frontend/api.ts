export const API_URL = import.meta.env.VITE_API_URL;

export async function pingBackend() {
  const res = await fetch(`${API_URL}/ping`);
  if (!res.ok) throw new Error('Erro ao conectar ao backend');
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
} 