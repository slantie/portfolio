import { createContext, useContext, ReactNode, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

type ThemeProviderState = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  toggleTheme: () => undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("portfolio-theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);

    return () => {
      root.classList.remove("dark");
      delete root.dataset.theme;
    };
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.key.toLowerCase() !== "d" ||
        target?.isContentEditable ||
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      setTheme((current) => (current === "light" ? "dark" : "light"));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
