import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Box } from '@chakra-ui/react'
import Header from '../../components/Utils/Header'
import PropertyInfoPage from '../../components/Pages/PropertyInfoPage'

const PropertyDetails: NextPage = () => {
  return (
    <>
      <Header />
      <PropertyInfoPage />
    </>
  )
}
export default PropertyDetails;
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