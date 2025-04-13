// /pages/_app.tsx

import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Asegúrate de que este archivo exista

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
