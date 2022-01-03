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
  radii: {
    sm: 2,
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
  //"André Åström": "#d3aaf3",

  "Henrik Norrman": "#34781f",
  //"Henrik Norrman": "#bceaae",

  "Kenth Ljung": "#98f9ff",
  //"Kenth Ljung": "#c2fbff",

  "André Åström,Henrik Norrman": "#4a83ff",
  "André Åström,Kenth Ljung": "#ff7dcd",
  "Henrik Norrman,Kenth Ljung": "#d4ff7d",
  "André Åström,Henrik Norrman,Kenth Ljung": "#ffc663",
};

export function mixColors(colors: string[]): string {
  const split = colors.map((color) => [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ]);

  const summed = split.reduce<number[]>(
    (acc, color) => {
      return [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]];
    },
    [0, 0, 0]
  );

  const mixed = summed.map<number>((part) => Math.round(part / colors.length));

  const hex = mixed.map<string>((part) => part.toString(16));

  return `#${hex.join("")}`;
}
