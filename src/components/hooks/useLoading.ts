import { useState, useCallback } from "react";

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState("");

  const startLoading = useCallback((message = "Loading...") => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      message = "Loading..."
    ): Promise<T> => {
      startLoading(message);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading,
  };
};
