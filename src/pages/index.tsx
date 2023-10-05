import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { Box } from '@chakra-ui/react'
import Header from '../components/Utils/Header'
import PropertiesPage from '../components/Pages/PropertiesPage'

const Home: NextPage = () => {
  return (
    <>
      <Header />
      
      <PropertiesPage />
    </> 
  )
}

export default Home;

// export async function getServerSideProps(context: any) {
//   const session = await getSession(context) as any

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/sign-in',
//         permanent: false,
//       },
//     }
//   }
//   return {
//     props: { session }
//   }
// }