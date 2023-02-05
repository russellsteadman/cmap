import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          src="https://cdn.jsdelivr.net/gh/golang/go@go1.19.5/misc/wasm/wasm_exec.min.js"
          strategy="beforeInteractive"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha256-wLz3iY/cO4e6vKZ4zRmo4+9XDpMcgKOvv/zEU3OMlRo="
          crossOrigin="anonymous"
        />
        <Script id="golang-bind" strategy="afterInteractive">
          {`const go = new Go();
          WebAssembly.instantiateStreaming(fetch("cmap.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
          });`}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
