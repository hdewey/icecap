import { DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure, Text, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton, Icon, Spinner } from "@chakra-ui/react"
import React, { useState } from "react"

const DeleteButton = ({ message, id, collection, refetch }: { message: string, id: string, collection: string, refetch: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!id || !collection) {
      return;
    }
    setIsDeleting(true);
  
    try {
      const req = await fetch(`/api/delete?id=${id}&collection=${collection}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (req.status === 200) {
        console.log('deleted')
        refetch();
        setIsDeleting(false);
        onClose()
      }
    } catch (error) {
      console.log(error)
      setIsDeleting(false);
      onClose();
    }
  }

  return (
    <>
      <Button 
        onClick={onOpen}
        bg={'transparent'}
        _hover={{bg: "var(--primary-dark)", color: "var(--primary-white)"}}
        borderRadius={"15px"}
      >
        <Icon 
          as={DeleteIcon}
          h={4}
          w={4}
        />
      </Button>
      
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text textStyle={'p'}>{message}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Back
            </Button>
            <Button colorScheme='red' ml={3} onClick={handleConfirm}>
              { isDeleting ? <Spinner /> : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
};

export default DeleteButton;