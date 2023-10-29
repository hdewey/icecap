import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Header from '../components/Utils/Header'
import dynamic from 'next/dynamic'
const PropertiesPage = dynamic(() => import("../components/Pages/PropertiesPage"), {
  ssr: false,
});
const Home: NextPage = () => {
  return (
    <>
      <Header />
      <PropertiesPage />
    </> 
  )
}

export default Home;

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