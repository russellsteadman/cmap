import type { AppProps } from "next/app";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "@/styles/global.scss";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Head from "next/head";
import theme from "@/shared/theme";

try {
  Sentry.init({
    dsn: "https://29e5c06816904d13a3362e7f993e47e0@o413040.ingest.sentry.io/4504652525928449",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
} catch (error) {
  console.error("Unable to initialize Sentry.", error);
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      <CssBaseline />
    </>
  );
}
