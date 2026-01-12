"use client";

import { Global, ThemeProvider } from "@emotion/react";
import * as React from "react";
import { createTheme } from "@/styles/theme/createTheme";
import { globalStyles } from "@/styles/global";

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = React.useMemo(() => createTheme("light"), []);
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles(theme)} />
      {children}
    </ThemeProvider>
  );
}
