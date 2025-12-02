"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ChakraProvider value={defaultSystem}>
        {children}
      </ChakraProvider>
    </NextThemeProvider>
  );
};

export { ThemeProvider };