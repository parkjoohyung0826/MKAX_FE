import { primitives } from "../tokens/primitives";
import { semantic } from "../tokens/semantic";
import { componentTokens } from "../tokens/components";
import type { AppTheme } from "./types";

export function createTheme(mode: "light" | "dark"): AppTheme {
  return {
    primitives,
    semantic: semantic[mode],
    components: componentTokens,
  };
}
