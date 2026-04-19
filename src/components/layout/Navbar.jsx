import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mealsSaved, setMealsSaved] = useState(0);

  useEffect(() => {
    async function fetchImpact() {
      const { count } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true });
      if (count != null) setMealsSaved(count);
    }
    fetchImpact();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <UtensilsCrossed className="h-6 w-6 text-scarlet" />
            <span className="text-xl font-bold text-scarlet">LastBite</span>
          </Link>

          {/* Impact counter */}
          <div className="hidden sm:block text-sm text-gray-600">
            <span className="font-semibold text-scarlet">{mealsSaved}</span> meals saved
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            {!user && (
              <>
                <Link to="/deals" className="text-gray-700 hover:text-scarlet transition-colors">
                  Deals
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-scarlet text-white font-medium hover:bg-scarlet-dark transition-colors"
                >
                  Login
                </Link>
              </>
            )}

            {user && user?.user_type !== 'business' && (
              <>
                <Link to="/deals" className="text-gray-700 hover:text-scarlet transition-colors">
                  Deals
                </Link>
                <Link to="/my-claims" className="flex items-center gap-1 text-gray-700 hover:text-scarlet transition-colors">
                  <ShoppingBag className="h-4 w-4" /> My Claims
                </Link>
                <Link to="/favorites" className="flex items-center gap-1 text-gray-700 hover:text-scarlet transition-colors">
                  <Heart className="h-4 w-4" /> Favorites
                </Link>
                <span className="text-sm text-gray-500">{user.email}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-700 hover:text-scarlet transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}

            {user?.user_type === 'business' && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-scarlet transition-colors">
                  Dashboard
                </Link>
                <Link to="/post-deal" className="text-gray-700 hover:text-scarlet transition-colors">
                  Post Deal
                </Link>
                <span className="text-sm text-gray-500">{user.email}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-700 hover:text-scarlet transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-scarlet"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 pb-4 pt-2 space-y-2">
          <div className="text-sm text-gray-600 pb-2">
            <span className="font-semibold text-scarlet">{mealsSaved}</span> meals saved
          </div>

          {!user && (
            <>
              <Link to="/deals" onClick={closeMobile} className="block py-2 text-gray-700 hover:text-scarlet">
                Deals
              </Link>
              <Link to="/login" onClick={closeMobile} className="block py-2 text-gray-700 hover:text-scarlet">
                Login
              </Link>
            </>
          )}

          {user && user?.user_type !== 'business' && (
            <>
              <Link to="/deals" onClick={closeMobile} className="block py-2 text-gray-700 hover:text-scarlet">
                Deals
              </Link>
              <Link to="/my-claims" onClick={closeMobile} className="flex items-center gap-1 py-2 text-gray-700 hover:text-scarlet">
                <ShoppingBag className="h-4 w-4" /> My Claims
              </Link>
              <Link to="/favorites" onClick={closeMobile} className="flex items-center gap-1 py-2 text-gray-700 hover:text-scarlet">
                <Heart className="h-4 w-4" /> Favorites
              </Link>
              <span className="block py-2 text-sm text-gray-500">{user.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 py-2 text-gray-700 hover:text-scarlet">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}

          {user?.user_type === 'business' && (
            <>
              <Link to="/dashboard" onClick={closeMobile} className="block py-2 text-gray-700 hover:text-scarlet">
                Dashboard
              </Link>
              <Link to="/post-deal" onClick={closeMobile} className="block py-2 text-gray-700 hover:text-scarlet">
                Post Deal
              </Link>
              <span className="block py-2 text-sm text-gray-500">{user.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 py-2 text-gray-700 hover:text-scarlet">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
