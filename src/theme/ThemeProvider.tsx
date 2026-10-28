import { useEffect, useState, type ReactNode } from "react";
import { getTheme, saveTheme } from "../services/storage";
import { ThemeContext } from "./context";
import type { ResolvedTheme, Theme } from "./types";

interface Props {
  children: ReactNode;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: Props) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Update attribute on root html element
  const applyThemeToDOM = (t: Theme) => {
    const root = document.documentElement;
    if (t === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", t);
    }
  };

  // Read saved theme on startup
  useEffect(() => {
    async function loadSavedTheme() {
      const saved = await getTheme();
      setThemeState(saved);
      applyThemeToDOM(saved);
      setResolvedTheme(saved === "system" ? getSystemTheme() : saved);
    }
    loadSavedTheme();
  }, []);

  // Listen for OS theme changes when in 'system' mode
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        setResolvedTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  // Update theme and persist to storage
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    setResolvedTheme(newTheme === "system" ? getSystemTheme() : newTheme);
    await saveTheme(newTheme);
  };

  // Quick toggle between light and dark
  const toggleTheme = async () => {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    await setTheme(nextTheme);
  };


  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
