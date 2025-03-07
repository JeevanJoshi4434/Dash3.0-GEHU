// src/context/UserContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { setStorage, getStorage, removeStorage } from "../utils/storage";

export interface Location {
    type: string;
    coordinates: number[];
}

type UserType = {
    _id: string;
    name: string;
    phone: number;
    type: string;
    location: Location;
};

type UserContextType = {
  user: UserType | null;
  token: string | null;
  setUser: (user: UserType | null, token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserType | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStorage("user");
    const storedToken = getStorage("token");
    if (storedUser && storedToken) {
      setUserState(storedUser);
      setTokenState(storedToken);
    }
  }, []);

  const setUser = (user: UserType | null, token: string | null) => {
    if (user && token) {
      setStorage("user", user);
      setStorage("token", token);
      setUserState(user);
      setTokenState(token);
    } else {
      removeStorage("user");
      removeStorage("token");
      setUserState(null);
      setTokenState(null);
    }
  };

  const logout = () => {
    setUser(null, null);
    window.location.reload();
  };

  const isAuthenticated = !!user && !!token;

  return (
    <UserContext.Provider value={{ user, token, setUser, isAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
