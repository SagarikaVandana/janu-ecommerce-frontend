import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Expose environment variables to the client
  useEffect(() => {
    // @ts-ignore - We're adding ENV to window
    window.ENV = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default MyApp;
