import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/index.css";
import "react-medium-image-zoom/dist/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
