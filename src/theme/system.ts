import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        slate: {
          50: { value: "#F8FAFC" },
          100: { value: "#F1F5F9" },
          200: { value: "#E2E8F0" },
          300: { value: "#CBD5E1" },
          400: { value: "#94A3B8" },
          500: { value: "#64748B" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1E293B" },
          900: { value: "#0F172A" },
        },
        sky: {
          50: { value: "#F0F9FF" },
          100: { value: "#E0F2FE" },
          200: { value: "#BAE6FD" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#075985" },
          900: { value: "#0C4A6E" },
        },
        indigo: {
          50: { value: "#EEF2FF" },
          100: { value: "#E0E7FF" },
          200: { value: "#C7D2FE" },
          300: { value: "#A5B4FC" },
          400: { value: "#818CF8" },
          500: { value: "#6366F1" },
          600: { value: "#4F46E5" },
          700: { value: "#4338CA" },
          800: { value: "#3730A3" },
          900: { value: "#312E81" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.sky.500}" },
          contrast: { value: "#FFFFFF" },
          fg: { value: "{colors.sky.700}" },
          muted: { value: "{colors.sky.100}" },
          subtle: { value: "{colors.sky.50}" },
          emphasized: { value: "{colors.sky.200}" },
          focusRing: { value: "{colors.sky.500}" },
        },
        app: {
          bg: { value: "{colors.slate.50}" },
          surface: { value: "#FFFFFF" },
          subtleSurface: { value: "{colors.sky.50}" },
          border: { value: "{colors.slate.200}" },
          text: { value: "{colors.slate.900}" },
          mutedText: { value: "{colors.slate.600}" },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export { system };