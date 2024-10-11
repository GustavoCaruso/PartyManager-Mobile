import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definindo o tipo para o estado do usuário
interface User {
  nomeUsuario?: string;
  email?: string;
  senha?: string;
  logado: boolean;
  id?: number;
  token?: string;
}

// Definindo o tipo para o contexto de usuário
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
}

// Criando o contexto de usuário com tipagem correta
const userContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Criando o Provider
export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    logado: false,
  });

  // Função para logout
  const logout = () => {
    setUser({ logado: false });
    localStorage.removeItem('token'); // Limpar token do localStorage
  };

  return (
    <userContext.Provider value={{ user, setUser, logout }}>
      {children}
    </userContext.Provider>
  );
}

// Custom Hook para usar o contexto
export function useUser() {
  const context = useContext(userContext);

  // Se o contexto for indefinido, lança um erro
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }

  const { user, setUser, logout } = context;
  return { user, setUser, logout };
}
