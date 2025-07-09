import React, { useState } from 'react';
import { pingBackend } from '../api';

export default function PingTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePing = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pingBackend();
      setResult(JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, margin: 16 }}>
      <h3>Teste de comunicação com o backend</h3>
      <button onClick={handlePing} disabled={loading}>
        {loading ? 'Testando...' : 'Testar /ping'}
      </button>
      {result && <div style={{ marginTop: 8 }}>Resposta: <code>{result}</code></div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>Erro: {error}</div>}
    </div>
  );
} 