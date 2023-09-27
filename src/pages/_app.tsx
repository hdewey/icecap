import type { AppProps } from 'next/app'

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from "@chakra-ui/react";

import Header from '../components/shared/Header';
import theme from '../theme/theme';
import Layout from '../components/shared/Layout';

import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const queryClient = new QueryClient();
  
  return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </QueryClientProvider>
      </SessionProvider>
  )
}

export default MyApp
