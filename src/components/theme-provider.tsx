"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DesignTokens, defaultTokens } from "@/lib/tokens";

const ThemeContext = createContext<{
  tokens: DesignTokens;
  setTokens: (tokens: DesignTokens) => void;
}>({
  tokens: defaultTokens,
  setTokens: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<DesignTokens>(defaultTokens);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${key}`, value);
    });
    root.style.setProperty("--brand-font-family", tokens.typography.fontFamily);
    root.style.setProperty("--brand-heading-font-family", tokens.typography.headingFontFamily);
    root.style.setProperty("--brand-base-font-size", tokens.typography.baseFontSize);
    root.style.setProperty("--brand-border-radius", tokens.typography.borderRadius);
    root.style.setProperty("--brand-shadow", tokens.visuals.shadow);
    root.style.setProperty("--brand-animation-speed", `${tokens.visuals.animationSpeed}s`);
  }, [tokens]);

  return (
    <ThemeContext.Provider value={{ tokens, setTokens }}>
      <div 
        style={{ 
          transition: `all ${tokens.visuals.animationSpeed}s ease-in-out`,
          backgroundColor: "var(--brand-background)",
          color: "var(--brand-foreground)",
          fontFamily: "var(--brand-font-family)",
          minHeight: "100vh"
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
