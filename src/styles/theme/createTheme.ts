import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { primitives } from "../tokens/primitives";
import { semantic } from "../tokens/semantic";
import { componentTokens } from "../tokens/components";
import type { AppTheme } from "./types";

export function createTheme(mode: "light" | "dark") {
  const customTheme: AppTheme = {
    primitives,
    semantic: semantic[mode],
    components: componentTokens,
  };

  let muiTheme = createMuiTheme({
    palette: {
      mode: mode,
      primary: {
        main: customTheme.semantic.accent.primary,
      },
      background: {
        default: customTheme.semantic.bg.page,
        paper: customTheme.semantic.bg.surface,
      },
      text: {
        primary: customTheme.semantic.text.primary,
        secondary: customTheme.semantic.text.secondary,
      },
      error: {
        main: customTheme.semantic.text.danger,
      },
    },
    spacing: (factor: number) => `${factor * 8}px`, // Simple spacing mapping
    typography: {
      fontFamily: customTheme.primitives.typography.fontFamily.base,
      ...customTheme.primitives.typography.fontSize,
      ...customTheme.primitives.typography.fontWeight,
      ...customTheme.primitives.typography.lineHeight,
    },
    // You can also merge the custom theme to access it directly
    // custom: customTheme,
  });

  muiTheme.components = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: customTheme.components.button.radius,
          height: customTheme.components.button.height.md,
          paddingLeft: customTheme.components.button.paddingX.md,
          paddingRight: customTheme.components.button.paddingX.md,
        },
      },
    },
  };

  return responsiveFontSizes(muiTheme);
}
