import React, { createContext, useContext, useState, useMemo } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [apiBase, setApiBase] = useState("http://127.0.0.1:8000");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // ✅ Notification System
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message, duration = 3000) => {
    setNotification({ type, message, duration });
  };

  const clearNotification = () => setNotification(null);

  const value = useMemo(
    () => ({
      apiBase,
      setApiBase,
      loading,
      setLoading,
      lastResult,
      setLastResult,
      notification,
      showNotification,
      clearNotification,
    }),
    [apiBase, loading, lastResult, notification]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
