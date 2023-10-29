import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Flex, HStack, Input, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import useProperties from "../../hooks/useProperties";
import { useRouter } from "next/router";

const ConfirmDeleteProperty = ({ isOpen, onClose, propertyId, propertyName = '' }: { isOpen: any, onClose: any, propertyId: string, propertyName?: string }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { refetch } = useProperties();

  const [ deleteSpinnerLoading, setDeleteSpinnerLoading ] = useState<boolean>(false); 

  const router = useRouter();

  const navigate = () => {
    router.push(`/`);
  };

  const handleDeleteProperty = async () => {
    if (!propertyId) {
      alert('Property ID is required.');
      return;
    }
    try {
      setDeleteSpinnerLoading(true);
      const response = await fetch(`/api/delete?id=${propertyId}&collection=${'properties'}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setDeleteSpinnerLoading(false);
        throw new Error("Failed to delete property");
      }
      
      refetch();
      
      navigate();
    } catch (error) {
      console.error(error);
      setDeleteSpinnerLoading(false);
      alert('An error occurred while deleting the property. Please try again.');
    }
  }



  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteSpinnerLoading ? () => {} : onClose}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='xl' fontWeight='bold'>
              <Text textStyle={"h2"}>{"Delete Property"}</Text>
            </AlertDialogHeader>

            <AlertDialogBody py={12} px={6}>
              <Text textStyle={"p"}>{"Are you sure? You can't undo this action afterwards."}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant={"InverseButton"} ref={cancelRef} onClick={deleteSpinnerLoading ? () => {} : onClose}>
                Cancel
              </Button>
              <Button variant={"PrimaryButton"} onClick={handleDeleteProperty} ml={5}>
                {
                  deleteSpinnerLoading ? <Spinner /> : 'Delete'
                }
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
};

export default ConfirmDeleteProperty;