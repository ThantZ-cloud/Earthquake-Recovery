import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

const AuthContext = createContext(null);

function annotateError(error) {
  if (error && isAuthRetryableFetchError(error)) {
    const e = new Error('NETWORK_ERROR');
    e.code = 'NETWORK_ERROR';
    e.cause = error;
    return e;
  }
  return error;
}

async function fetchProfile(userId) {
  if (!userId) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()
      .abortSignal(controller.signal);
    clearTimeout(timer);
    if (error) console.warn('[Auth] fetchProfile error:', error.message);
    return data;
  } catch (err) {
    console.warn('[Auth] fetchProfile failed:', err?.message);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading] = useState(false); // Start false — don't block app on auth

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

  // On mount, check for existing session — non-blocking, app renders immediately
  useEffect(() => {
    let cancelled = false;

    // Load auth in background (app already visible)
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
    });

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
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw annotateError(error);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw annotateError(error);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

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
