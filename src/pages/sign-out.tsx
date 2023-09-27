import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import Loader from '../components/Loader';

const SignOutPage = () => {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <>
      <Box
        w={'100vw'} 
        h={'100vh'}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Loader />
      </Box>
    </>
  );
};

export default SignOutPage;