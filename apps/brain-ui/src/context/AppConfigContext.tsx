import { createContext, useContext } from "react";

export type AppConfigContextType = {
  vlApiUrl: URL;
};

export const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx)
    throw new Error(
      "useAppConfigShellTitle must be used within ShellTitleProvider"
    );
  return ctx;
}
