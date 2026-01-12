import { primitives } from "./primitives";

export const componentTokens = {
  button: {
    height: {
      md: "40px",
    },
    paddingX: {
      md: primitives.spacing[16],
    },
    radius: primitives.radius[12],
  },
} as const;
