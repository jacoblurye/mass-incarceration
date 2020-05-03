import React from "react";
import { ThemeProvider } from "theme-ui";
import defaultTheme from "@theme-ui/preset-dark";
import { breakpoints } from "./Media";

export const theme = {
  ...defaultTheme,
  breakpoints: Object.values(breakpoints),
};

const Theme = ({ element }) => {
  return <ThemeProvider theme={theme}>{element}</ThemeProvider>;
};

export default Theme;
