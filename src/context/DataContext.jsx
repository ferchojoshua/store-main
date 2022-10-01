import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [title, setTitle] = useState("AutoMoto");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(null);
  const [isDefaultPass, setIsDefaultPass] = useState(null);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState([]);
  const [access, setAccess] = useState([]);
  const [serverAccess, setServerAccess] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [version, setVersion] = useState("2.1.0");

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
        version,
        setVersion,
        serverAccess,
        setServerAccess,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
