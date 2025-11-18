"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider as BaseThemeProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <BaseThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </BaseThemeProvider>
    </ChakraProvider>
  );
};

export { ThemeProvider };