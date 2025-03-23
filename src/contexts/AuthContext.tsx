import { createContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateAuthState: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false
  });

  const updateAuthState = async () => {
    try {
      console.log('🔄 AuthContext: Atualizando estado de autenticação...');
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ AuthContext: Erro ao buscar sessão:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('ℹ️ AuthContext: Nenhuma sessão encontrada');
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false
        });
        return;
      }

      console.log('✅ AuthContext: Sessão encontrada para:', session.user.email);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('❌ AuthContext: Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      console.log('✅ AuthContext: Perfil carregado:', profile.username);

      setState({
        user: session.user,
        profile,
        isLoading: false,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('❌ AuthContext: Erro ao atualizar estado:', error);
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };

  // Initial auth state check
  useEffect(() => {
    console.log('🏁 AuthContext: Verificação inicial de autenticação');
    updateAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      console.log('🔔 AuthContext: Mudança de estado de autenticação:', _event);
      updateAuthState();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 AuthContext: Tentando login para:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthContext: Erro no login:', error);
        return { error };
      }

      console.log('✅ AuthContext: Login bem sucedido para:', email);
      await updateAuthState();
      return { error: null };
    } catch (error) {
      console.error('❌ AuthContext: Erro inesperado no login:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 AuthContext: Iniciando cadastro para:', email);
      
      // Create username from email
      const username = email.split('@')[0].toLowerCase();
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, username }
        }
      });

      if (error) {
        console.error('❌ AuthContext: Erro no cadastro:', error);
        return { error };
      }

      if (!data?.user) {
        console.error('❌ AuthContext: Nenhum usuário retornado do cadastro');
        return { error: new Error('Nenhum usuário retornado do cadastro') };
      }

      console.log('✅ AuthContext: Usuário criado, criando perfil...');

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            name,
            email,
            bio: 'Olá! Sou novo no Zopin 👋',
            location: 'Brasil',
            social_links: { website: 'https://zopin.com' },
            is_verified: false,
            followers_count: 0,
            following_count: 0,
            posts_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .single();

      if (profileError) {
        console.error('❌ AuthContext: Erro ao criar perfil:', profileError);
        return { error: profileError };
      }

      console.log('✅ AuthContext: Perfil criado com sucesso');
      await updateAuthState();
      return { error: null };
    } catch (error) {
      console.error('❌ AuthContext: Erro inesperado no cadastro:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 AuthContext: Iniciando logout...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ AuthContext: Erro no logout:', error);
        throw error;
      }

      console.log('✅ AuthContext: Logout bem sucedido');
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('❌ AuthContext: Erro inesperado no logout:', error);
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
