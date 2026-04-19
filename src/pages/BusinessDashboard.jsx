import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import ActiveDealRow from '../components/business/ActiveDealRow';
import ImpactCounter from '../components/business/ImpactCounter';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClaims, setTotalClaims] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const { data: dealData } = await supabase
          .from('listings')
          .select('*')
          .eq('business_id', user.id)
          .order('created_at', { ascending: false });

        const dealIds = (dealData || []).map((d) => d.id);
        let count = 0;
        if (dealIds.length > 0) {
          const { count: claimCount } = await supabase
            .from('claims')
            .select('*', { count: 'exact', head: true })
            .in('listing_id', dealIds);
          count = claimCount || 0;
        }

        if (!cancelled) {
          setDeals(dealData || []);
          setTotalClaims(count || 0);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  const activeDeals = deals.filter(
    (d) =>
      new Date(d.expires_at) > new Date() && d.quantity_remaining > 0
  );

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.business_name || 'Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your deals</p>
        </div>
        <Link to="/post-deal">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Deal
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Deals</p>
          <p className="text-3xl font-bold text-scarlet mt-1">
            {activeDeals.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Claims</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {totalClaims}
          </p>
        </div>

        <ImpactCounter count={totalClaims} />
      </div>

      {/* Deals list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Your Deals</h2>
        </div>

        {deals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No deals yet. Post your first deal to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {deals.map((deal) => (
              <ActiveDealRow
                key={deal.id}
                deal={deal}
                onCancel={(id) =>
                  setDeals((prev) =>
                    prev.map((d) =>
                      d.id === id
                        ? { ...d, expires_at: new Date().toISOString(), quantity_remaining: 0 }
                        : d
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
