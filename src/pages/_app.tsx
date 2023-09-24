import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider } from "@chakra-ui/react";

import Header from '../components/shared/Header';
import theme from '../theme/theme';
import Layout from '../components/shared/Layout';


function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Header title={"snowcap"} />
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
