import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
    return data;
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async (session) => {
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted) {
            setUser(profile ? { ...session.user, ...profile } : session.user);
          }
        } else {
          if (mounted) setUser(null);
        }
      } catch (err) {
        console.error('Session load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadSession(session);
    });

    // Listen for auth changes (skip INITIAL_SESSION to avoid double-fetch)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'INITIAL_SESSION') return;
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          return;
        }
        loadSession(session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', error.message, error);
      throw error;
    }
    console.log('Sign in success:', data.user?.id);
    return data;
  };

  const signUp = async (email, password, userType = 'student', metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Insert into public users table
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        user_type: userType,
        ...metadata,
      });
      if (profileError) {
        console.error('Error creating user profile:', profileError.message);
      }
    }

    return data;
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setUser(profile ? { ...session.user, ...profile } : session.user);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut: handleSignOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
