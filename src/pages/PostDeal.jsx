import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import DealForm from '../components/business/DealForm';

export default function PostDeal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);

    // Calculate expires_at from expires_in hours
    const expiresAt = new Date(
      Date.now() + values.expires_in * 60 * 60 * 1000
    ).toISOString();

    const { error: insertError } = await supabase.from('listings').insert({
      user_id: user.id,
      title: values.title,
      description: values.description,
      photo_url: values.photo_url,
      category: values.category,
      original_price: parseFloat(values.original_price),
      deal_price: parseFloat(values.deal_price),
      quantity_total: parseInt(values.quantity_total, 10),
      quantity_remaining: parseInt(values.quantity_total, 10),
      expires_at: expiresAt,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Post a New Deal
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DealForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
