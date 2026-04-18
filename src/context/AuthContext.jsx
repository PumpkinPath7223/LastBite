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
      .single();
    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
    return data;
  };

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile ? { ...session.user, ...profile } : session.user);
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const profile = await fetchProfile(session.user.id);
            setUser(profile ? { ...session.user, ...profile } : session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
