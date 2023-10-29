import type { NextPage } from 'next'
import Header from '../../components/Utils/Header'
import PropertyInfoPage from '../../components/Utils/Property/PropertyInfoPage'
import { getSession } from 'next-auth/react'

const PropertyDetails: NextPage = () => {
  return (
    <>
      <Header />
      <PropertyInfoPage />
    </>
  )
}
export default PropertyDetails;

export async function getServerSideProps(context: any) {
  const session = await getSession(context) as any
  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}