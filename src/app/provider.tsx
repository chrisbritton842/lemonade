"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { system } from "@/theme/system";

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
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </NextThemeProvider>
  );
};

export { ThemeProvider };