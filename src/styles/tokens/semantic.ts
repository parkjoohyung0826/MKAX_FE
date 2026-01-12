import { SemanticTheme } from "../theme/types";
import { primitives } from "./primitives";

export const semantic = {
  light: {
    bg: {
      page: primitives.color.gray[50],
      surface: primitives.color.gray[0],
    },
    text: {
      primary: primitives.color.gray[900],
      secondary: primitives.color.gray[700],
      danger: primitives.color.red[500],
    },
    border: {
      default: primitives.color.gray[100],
    },
    accent: {
      primary: primitives.color.blue[500],
      primaryHover: primitives.color.blue[600],
    },
  },
  dark: {
    bg: {
      page: primitives.color.gray[900],
      surface: primitives.color.gray[700],
    },
    text: {
      primary: primitives.color.gray[0],
      secondary: primitives.color.gray[100],
      danger: primitives.color.red[500],
    },
    border: {
      default: primitives.color.gray[700],
    },
    accent: {
      primary: primitives.color.blue[500],
      primaryHover: primitives.color.blue[600],
    },
  },
} satisfies Record<"light" | "dark", SemanticTheme>; // ✅ 핵심
