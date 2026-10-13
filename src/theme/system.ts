import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                lemon: {
                    50: { value: "#FFFBEB" },
                    100: { value: "#FFF9C4" },
                    200: { value: "#FFF44F" },
                    300: { value: "#FFDE4F" },
                    400: { value: "#FACC15" },
                    500: { value: "#EAB308" },
                },
                limeAccent: {
                    300: { value: "#DEFF4F" },
                    400: { value: "#94FF4F" },
                },
                cocoa: {
                    800: { value: "#644D19" },
                    900: { value: "#3F300F" },
                },
            },
        },
        semanticTokens: {
            colors: {
                brand: {
                    solid: { value: "{colors.lemon.300}" },
                    contrast: {value: "{colors.cocoa.900}" },
                    fg: { value: "{colors.cocoa.800}" },
                    muted: { value: "{colors.lemon.100}" },
                    subtle: { value: "{colors.lemon.200}" },
                    emphasized: { value: "{colors.lemon.200}" },
                    focusRing: { value: "{colors.lemon.300}" },
                },
                app: {
                    bg: { value: "{colors.lemon.50}" },
                    surface: { value: "white" },
                    text: { value: "#1F2937" },
                    mutedText: { value: "#6B7280" },
                },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

export { system };