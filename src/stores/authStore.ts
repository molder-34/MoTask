import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { auth, supabase } from '../services/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // State management
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Initialization
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      // Auth actions
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await auth.signIn(email, password);
          
          if (error) {
            throw error;
          }
          
          if (data.user && data.session) {
            set({ 
              user: data.user, 
              session: data.session,
              isAuthenticated: true 
            });
            
            // Fetch user profile
            await get().fetchProfile();
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign in failed',
            isAuthenticated: false 
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (email: string, password: string, fullName?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await auth.signUp(email, password, fullName);
          
          if (error) {
            throw error;
          }
          
          // Note: User needs to confirm email before they can sign in
          if (data.user) {
            set({ user: data.user });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign up failed' 
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { error } = await auth.signOut();
          
          if (error) {
            throw error;
          }
          
          set({ 
            user: null, 
            profile: null,
            session: null,
            isAuthenticated: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign out failed' 
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const { error } = await auth.resetPassword(email);
          
          if (error) {
            throw error;
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed' 
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // State management
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Initialization
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Get current session
          const { data: { session }, error } = await auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (session?.user) {
            set({ 
              user: session.user, 
              session,
              isAuthenticated: true 
            });
            
            // Fetch user profile
            await get().fetchProfile();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Initialization failed',
            isAuthenticated: false 
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const { user } = get();
          
          if (!user) {
            return;
          }
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
          }
          
          if (data) {
            set({ profile: data });
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile' 
          });
        }
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const { setUser, setSession, fetchProfile } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    setUser(session.user);
    setSession(session);
    fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    setUser(null);
    setSession(null);
    useAuthStore.setState({ 
      profile: null, 
      isAuthenticated: false 
    });
  } else if (event === 'TOKEN_REFRESHED' && session) {
    setSession(session);
  }
});
