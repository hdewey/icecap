import type { AppProps } from 'next/app'

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from 'react-query';
import { SessionProvider } from 'next-auth/react';

import theme from '../chakraTheme/Theme';

import Layout from '../components/Utils/Layout';

import '../styles/globals.css';

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

export default MyApp;