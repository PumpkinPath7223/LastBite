import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import DealForm from '../components/business/DealForm';

export default function PostDeal() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ensureProfile = async () => {
    const { error: upsertError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        name: user.business_name || user.name || user.email.split('@')[0],
        user_type: 'business',
        business_name: user.business_name || user.email.split('@')[0],
        business_address: user.business_address || '',
        lat: user.lat || null,
        lng: user.lng || null,
      },
      { onConflict: 'id', ignoreDuplicates: false }
    );
    if (upsertError) {
      console.error('Profile upsert failed:', upsertError);
      throw new Error('Failed to create profile: ' + upsertError.message);
    }
  };

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);

    try {
      await ensureProfile();
      await refreshProfile();

      // Calculate expires_at from expires_in hours
      const expiresAt = new Date(
        Date.now() + values.expires_in * 60 * 60 * 1000
      ).toISOString();

      const { error: insertError } = await supabase.from('listings').insert({
        business_id: user.id,
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

      if (insertError) {
        setError(insertError.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to post deal. Please try again.');
    } finally {
      setLoading(false);
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
