import { Theme } from "theme-ui";

const makeTheme = <T extends Theme>(t: T) => t;

const theme = makeTheme({
  fonts: {
    body: "'Nunito', sans-serif;",
    heading: "'Raleway', sans-serif;",
  },
  fontSizes: {
    body: 18,
    extra: 24,
    title: 48,
    headline: 96,
  },
  fontWeights: {
    body: 300,
    title: 700,
  },
  space: {
    sm: 10,
    md: 20,
    lg: 50,
  },
  colors: {
    gradientTL: "#75d6ff",
    gradientBR: "#7dff92",
    text: "#000",
  },
  shadows: {
    main: "4px 4px 4px rgba(0, 0, 0, 0.25)",
    popout: "8px 8px 2px rgba(0, 0, 0, 0.25)",
  },
  styles: {
    root: {
      padding: 0,
      margin: 0,
      fontFamily: "body",
      fontWeight: "body",
      fontSize: "body",

      h1: { fontFamily: "heading", fontWeight: "title", fontSize: "headline" },
      h2: { fontFamily: "heading", fontWeight: "title", fontSize: "title" },
    },
  },
});

export default theme;

export type CustomThemeType = typeof theme;

export const senderColorMap = {
  "André Åström": "#8d23e0",
  "Henrik Norrman": "#34781f",
  "Kenth Ljung": "#98f9ff",
};
