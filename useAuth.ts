import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const fetchRoles = async (userId: string) => {
      const { data } = await supabase
        .from('user_roles').select('role').eq('user_id', userId);
      if (mountedRef.current) {
        setRoles(data?.map(r => r.role) ?? []);
      }
    };

    // Initialize from current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchRoles(u.id).finally(() => {
          if (mountedRef.current) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Subscribe to future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await fetchRoles(u.id);
      } else {
        setRoles([]);
      }
      if (mountedRef.current) setLoading(false);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    roles,
    isAdmin: roles.includes('admin'),
    isGrowerOrAdmin: roles.includes('admin') || roles.length > 0,
    signOut: () => supabase.auth.signOut(),
  };
}
