import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Utils/Header";
import CreateAccountModal from "../../components/Modals/Auth/CreateAccount";
import { useSession } from "../../hooks/useSession";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUpPage = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      onClose();
      router.push('/');
    } else {
      onOpen();
    }
  }, [ status ])

  return (
    <>
      <Header />
      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default SignUpPage;