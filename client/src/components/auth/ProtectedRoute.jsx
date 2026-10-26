import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Rocket } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070B14] text-[#F1F5F9]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center animate-pulse glow-cyan shadow-xl">
              <Rocket className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/40 animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-mono font-medium tracking-wider text-sky-400 uppercase">
              Verifying SpaceOps Credentials...
            </p>
            <p className="text-[11px] font-mono text-slate-500">Securing quantum encrypted session</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
