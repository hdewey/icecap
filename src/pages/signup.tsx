import type { NextPage } from 'next'
import Header from '../components/Utils/Header'
import { useDisclosure } from '@chakra-ui/react'
import { useSession } from '../hooks/useSession'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import SignUpModal from '../components/Modals/Auth/CreateAccount'

const Login: NextPage = () => {

  const { session, status } = useSession();

  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (status === 'unauthenticated') {
      onOpen();
    } if (status === 'authenticated') {
      router.push(`/`);
      onClose();
    }
  }) 

  return (
    <>
      <Header />
      <SignUpModal isOpen={isOpen} onClose={onClose} />
    </> 
  )
}

export default Login;

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

