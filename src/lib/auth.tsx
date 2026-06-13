import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useDataStore } from '@/lib/store';
import { loadAllData } from '@/data/repo';
import { registerForPushNotifications } from '@/lib/notifications';
import { demoUsers } from '@/data/mock';
import type { Role, User } from '@/data/types';

/** Shared password for the seeded demo accounts. */
export const DEMO_PASSWORD = 'Almaarefa#2026';

interface AuthState {
  user: User | null;
  initializing: boolean;
  signInAs: (role: Role) => Promise<void>;
  signInWithId: (id: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

function mapProfileToUser(p: any): User {
  return {
    id: p.id,
    universityId: p.university_id,
    nameEn: p.name_en,
    nameAr: p.name_ar,
    role: p.role,
    email: p.email ?? '',
    department: p.department ?? undefined,
    programEn: p.program_en ?? undefined,
    programAr: p.program_ar ?? undefined,
    level: p.level ?? undefined,
    gpa: p.gpa != null ? Number(p.gpa) : undefined,
    avatarColor: p.avatar_color ?? '#00ADCA',
    avatarUrl: p.avatar_url ?? undefined,
  };
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const loadForSession = useCallback(async (uid: string) => {
    // Hydrate the store BEFORE setting the user, so the redirect into the tabs
    // (which is triggered by `user` becoming non-null) only happens once data is ready.
    const [{ data: profile }, data] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      loadAllData(uid),
    ]);
    useDataStore.getState().set(data);
    if (profile) setUser(mapProfileToUser(profile));
    void registerForPushNotifications(uid);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && event !== 'SIGNED_OUT') {
        // Defer Supabase calls out of the auth callback to avoid lock contention.
        const uid = session.user.id;
        setTimeout(() => {
          loadForSession(uid).finally(() => setInitializing(false));
        }, 0);
      } else {
        setUser(null);
        useDataStore.getState().reset();
        setInitializing(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadForSession]);

  const signInAs = useCallback(async (role: Role) => {
    await supabase.auth.signInWithPassword({ email: demoUsers[role].email, password: DEMO_PASSWORD });
  }, []);

  const signInWithId = useCallback(async (idOrEmail: string, password: string) => {
    const key = idOrEmail.trim().toLowerCase();
    const match = Object.values(demoUsers).find(
      (u) => u.universityId.toLowerCase() === key || u.email.toLowerCase() === key,
    );
    const email = key.includes('@') ? idOrEmail.trim() : match?.email ?? `${idOrEmail.trim()}@um.edu.sa`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: password || DEMO_PASSWORD });
    return !error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    useDataStore.getState().reset();
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, signInAs, signInWithId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
