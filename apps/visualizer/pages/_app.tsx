import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "theme-ui";
import theme from "../utils/theme";
import { Flex } from "@theme-ui/components";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <ThemeProvider theme={theme}>
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Component {...pageProps} />
        </Flex>
      </ThemeProvider>
    </>
  );
}

export default App;
