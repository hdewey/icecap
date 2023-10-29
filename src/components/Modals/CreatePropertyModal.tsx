import { Button, HStack, Input, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import ReusableModal from "./ReusableModal";
import { useState } from "react";
import { useSession } from "../../hooks/useSession";

const CreatePropertyModal = ({ isOpen, onClose }: { isOpen: any, onClose: any}) => {

  const [ propertyName, setPropertyName ] = useState<string>("");
  
  const { session, status } = useSession();

  const [ createSpinnerLoading, setCreateSpinnerLoading ] = useState<boolean>(false); 

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyName) {
      alert('Both property name and agent are required.');
      return;
    }

    try {
      setCreateSpinnerLoading(true);
      const response = await fetch('/api/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyName, agent: session?.user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }
  
      const data = await response.json();
  
      if (data.insertedId) {
        window.location.href = decodeURIComponent(`/property/${data.insertedId}`);
      }
    } catch (error) {
      setCreateSpinnerLoading(false);
      console.error(error);
      alert('An error occurred while creating the property. Please try again.');
    }
  };

  return (
    <>
      <ReusableModal title={"Create a Property"} isOpen={isOpen} onClose={onClose}>
        <Stack spacing={8}>
          <HStack spacing={1}>
            <Text>{"property name:"}</Text>
            <Input
              type="text"
              placeholder="123 Example Rd..."
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
            />
          </HStack>
          <Button variant={"PrimaryButton"} onClick={createSpinnerLoading ? () => {} : handleCreateProperty}>
            {
              createSpinnerLoading ? <Spinner /> : "Create Property"
            }
          </Button>
        </Stack>
      </ReusableModal>
    </>
  )
};

export default CreatePropertyModal;