import React, { useState, useEffect } from "react";
import { AppConfigContext } from "./AppConfigContext";
import type { AppConfigContextType } from "./AppConfigContext";

export type Config = {
  vlApiUrl: string;
};

export const AppConfigProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [config, setConfig] = useState<AppConfigContextType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/config.json"); // Path relative to your served app
        if (!response.ok) {
          throw new Error(
            `Failed to load config: HTTP status ${response.status}`
          );
        }
        const data = (await response.json()) as Config;
        setConfig({
          vlApiUrl: new URL(data.vlApiUrl)
        });
      } catch (err) {
        console.error("Error fetching configuration:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []); // Run only once on component mount
  if (loading || !config) {
    return <div>Loading configuration...</div>; // Or a spinner/loading component
  }
  if (error) {
    return (
      <div>
        Error loading configuration:{" "}
        {error instanceof Error ? error.message : "Unkown error"}
      </div>
    );
  }
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
};
