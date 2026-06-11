import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "worldCupHubTheme";

const ThemeContext = createContext({
  themeMode: "dark",
  toggleThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "normal" || savedTheme === "dark") {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((currentTheme) =>
      currentTheme === "dark" ? "normal" : "dark"
    );
  };

  const value = useMemo(
    () => ({
      themeMode,
      toggleThemeMode,
    }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
