import { useState } from "react";
import { Button, HStack, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import ReusableModal from "./ReusableModal";
import { useSession } from "../../hooks/useSession";
import { signOut } from "next-auth/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdditionalInfoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");

  const { session } = useSession();
  
  const [ additionalInfoSpinnerLoading, setAdditionalInfoSpinnerLoading ] = useState<boolean>(false);

  const handleAdditionalInfo = async () => {
    setAdditionalInfoSpinnerLoading(true);
    try {
      const submit = await fetch("/api/user", {
        method: "PUT",
        body: JSON.stringify({
          email: session?.user?.email,
          username,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!submit || !submit.ok) {
        setAdditionalInfoSpinnerLoading(false);
        return;
      } else {
      }
      
      if (submit.ok) {
        setAdditionalInfoSpinnerLoading(false);
        await signOut();
      } else {
      }
    } catch (e: any) {
      setAdditionalInfoSpinnerLoading(false);
    }
  };

  return (
    <>
      <ReusableModal title={"Additional Information"} isOpen={isOpen} onClose={onClose} noclose>
        <Stack spacing={8}>
          <Text textStyle={'h3'}>{"Please add your name! You'll need to sign in again after adding."}</Text>
          <HStack spacing={1}>
            <Text>Name:</Text>
            <Input
              type="text"
              placeholder="First Last"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </HStack>
          <Button variant={"PrimaryButton"} onClick={additionalInfoSpinnerLoading ? () => {} : handleAdditionalInfo}>
            { additionalInfoSpinnerLoading ? <Spinner /> : "Add Name" }
          </Button>
        </Stack>
      </ReusableModal>
    </>
  );
};

export default AdditionalInfoModal;