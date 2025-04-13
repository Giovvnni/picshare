// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-pink-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
