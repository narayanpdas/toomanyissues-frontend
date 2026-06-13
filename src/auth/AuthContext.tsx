import { createContext, useContext, useState } from 'react';
import type{ ReactNode } from 'react';
interface AuthContextType {
  jwt: string | null;
  refreshToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (jwt: string, refreshToken: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jwt, setToken] = useState<string | null>(localStorage.getItem('jwt'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('userRole'));

  const login = (newJwt: string, newRefreshToken: string, newRole: string) => {
    localStorage.setItem('jwt', newJwt);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('userRole', newRole);
    setToken(newJwt);
    setRefreshToken(newRefreshToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setRefreshToken(null);
    setRole(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ jwt, refreshToken, role, isAuthenticated: !!jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};