import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute:', { 
    path: location.pathname,
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    location
  });

  // Aguarda o carregamento inicial
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Carregando estado de autenticação...');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Acesso negado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute: Acesso permitido para:', location.pathname);
  return <>{children}</>;
};
