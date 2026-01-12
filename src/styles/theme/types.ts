import type { primitives } from "../tokens/primitives";
import type { componentTokens } from "../tokens/components";

export type Primitives = typeof primitives;
export type SemanticTheme = {
  bg: { page: string; surface: string };
  text: { primary: string; secondary: string; danger: string };
  border: { default: string };
  accent: { primary: string; primaryHover: string };
};
export type ComponentTokens = typeof componentTokens;

export type AppTheme = {
  primitives: Primitives;      
  semantic: SemanticTheme;     
  components: ComponentTokens; 
};
