import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const ConfirmSignOut = ({ isOpen, onClose }: { isOpen: any, onClose: any }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [ signoutSpinnerLoading, setSignoutSpinnerLoading ] = useState<boolean>(false); 
  
  const router = useRouter();

  const handleSignOut = async () => {
    setSignoutSpinnerLoading(true);
    await signOut();
    router.push('/login');
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='xl' fontWeight='bold'>
              <Text textStyle={"h2"}>{"Sign Out"}</Text>
            </AlertDialogHeader>

            <AlertDialogBody py={12} px={6}>
              <Text textStyle={"p"}>{"Are you sure you'd like to sign out?"}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant={"InverseButton"} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button variant={"PrimaryButton"} onClick={signoutSpinnerLoading ? () => {} : handleSignOut} ml={5}>
                { signoutSpinnerLoading ? <Spinner /> : "Sign Out"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmSignOut;