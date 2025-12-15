import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [authData, setAuthData] = useState(undefined);

  useEffect(() => {
    const savedUser = localStorage.getItem("authData");
    if (savedUser) setAuthData(JSON.parse(savedUser));
  }, []);

  const login = (userData) => {
    setAuthData(userData);
    localStorage.setItem("authData", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
