import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AppBootSkeleton from '../components/AppBootSkeleton';
import supabase from '../lib/supabase';

const AuthContext = createContext(null);

async function fetchProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) console.warn('[Auth] fetchProfile error:', error.message);
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const initDone = useRef(false);

  const finishLoading = useCallback(() => {
    initDone.current = true;
    setLoading(false);
  }, []);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    const p = await fetchProfile(userId);
    if (p) {
      setProfile(p);
    } else {
      // First login — auto-create profile row
      const { error } = await supabase.from('profiles').upsert({ id: userId, role: 'user' });
      if (error) {
        console.error('[Auth] auto-create profile failed:', error.message);
      } else {
        setProfile({ role: 'user' });
      }
    }
  }, []);

  // On mount, check for existing session
  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
        };
        setUser(u);
        await loadProfile(u.id);
      }
    }).catch((err) => {
      console.warn('[Auth] getSession failed:', err);
    }).finally(() => {
      if (!cancelled) finishLoading();
    });

    // Safety timeout: never let the boot spinner block the app forever
    const timeout = setTimeout(() => {
      if (!cancelled) finishLoading();
    }, 5000);

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
        };
        setUser(u);
        await loadProfile(u.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      if (!initDone.current) finishLoading();
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [loadProfile, finishLoading]);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (loading) {
    return <AppBootSkeleton />;
  }

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: profile?.role === 'admin', isSuperAdmin: profile?.role === 'super_admin', login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export default AuthContext;
