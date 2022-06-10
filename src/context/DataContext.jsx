import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [title, setTitle] = useState("Auto&Moto");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(null);
  const [isDefaultPass, setIsDefaultPass] = useState(null);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState([]);
  const [access, setAccess] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DataContext.Provider
      value={{
        title,
        setTitle,
        isLoading,
        setIsLoading,
        isLogged,
        setIsLogged,
        reload,
        setReload,
        access,
        setAccess,
        user,
        setUser,
        isDefaultPass,
        setIsDefaultPass,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
