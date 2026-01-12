export const primitives = {
  color: {
    gray: {
      0: "#FFFFFF",
      50: "#F7F7F8",
      100: "#EDEEF0",
      200: "#D9DBE0",
      700: "#3A3D45",
      900: "#111318",
    },
    blue: {
      500: "#2F6BFF",
      600: "#1F56E6",
    },
    red: { 500: "#E5484D" },
  },

  spacing: {
    0: "0px",
    2: "2px",
    4: "4px",
    8: "8px",
    12: "12px",
    16: "16px",
    20: "20px",
    24: "24px",
    32: "32px",
  },

  radius: {
    0: "0px",
    8: "8px",
    12: "12px",
    16: "16px",
  },

  typography: {
    fontFamily: {
      base: `'Pretendard', system-ui, -apple-system, sans-serif`,
    },
    fontSize: {
      14: "14px",
      16: "16px",
      20: "20px",
    },
    lineHeight: {
      20: "20px",
      24: "24px",
      28: "28px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
} as const;
