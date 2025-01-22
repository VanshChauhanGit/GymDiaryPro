"use client";
import { createContext, useContext, useState } from "react";

// Create Context
const LoaderContext = createContext();

// Custom Hook to Access Loader Context
export const useLoader = () => useContext(LoaderContext);

// Loader Provider Component
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
