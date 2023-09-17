import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/shared/Header';

function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header title={"snowcap"} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  )
}

export default MyApp
