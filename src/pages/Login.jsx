import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('student'); // 'student' | 'business'
  const [isCreating, setIsCreating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isCreating) {
        const metadata =
          tab === 'student'
            ? { name }
            : {
                business_name: businessName,
                business_address: businessAddress,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
              };

        await signUp(email, password, tab, metadata);
      } else {
        await signIn(email, password);
      }

      navigate(tab === 'student' ? '/deals' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <UtensilsCrossed className="h-10 w-10 text-scarlet mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isCreating ? 'Create Account' : 'Welcome Back'}
          </h1>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setTab('student')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === 'student'
                ? 'bg-white text-scarlet shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setTab('business')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              tab === 'business'
                ? 'bg-white text-scarlet shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Restaurant
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@osu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
            />
          </div>

          {/* Student extra fields */}
          {isCreating && tab === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
              />
            </div>
          )}

          {/* Business extra fields */}
          {isCreating && tab === 'business' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buckeye Bites"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 High St, Columbus, OH"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="39.9985"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-83.0060"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5"
          >
            {loading
              ? 'Please wait...'
              : isCreating
                ? 'Create Account'
                : 'Sign In'}
          </Button>
        </form>

        {/* Toggle link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isCreating ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsCreating(!isCreating);
              setError(null);
            }}
            className="font-medium text-scarlet hover:underline"
          >
            {isCreating ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  );
}
