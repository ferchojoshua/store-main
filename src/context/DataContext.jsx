import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [title, setTitle] = useState("Auto&Moto");
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(null);
  const [isDefaultPass, setIsDefaultPass] = useState(true);
  const [reload, setReload] = useState(false);
  const [user, setUser] = useState([]);
  const [access, setAccess] = useState([]);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
