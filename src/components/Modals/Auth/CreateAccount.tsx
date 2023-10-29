import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, HStack, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import ReusableModal from "../ReusableModal";
import { useRouter } from "next/router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { invite_code } = router.query;

  const [ signupSpinnerLoading, setSignupSpinnerLoading ] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setSignupSpinnerLoading(true);
      const submit = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          invite_code
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!submit || !submit.ok) {
        setSignupSpinnerLoading(false);
        return;
      } else {
      }
      
      if (submit.ok) {
        const finished = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password
        })
  
        if (!finished || !finished.ok) {
          setSignupSpinnerLoading(false);
          return
        } else {
          router.push("/");
        }
      }
    } catch (e: any) {
      setSignupSpinnerLoading(false);
    }
  };

  return (
    <>
      <ReusableModal title={"Create Account"} isOpen={isOpen} onClose={onClose} noclose>
        <Stack spacing={8}>
          <HStack spacing={1}>
            <Text>Invite Code:</Text>
            <Input
              type="text"
              value={invite_code}
            />
          </HStack>
          <HStack spacing={1}>
            <Text>Name:</Text>
            <Input
              type="text"
              placeholder="First Last"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </HStack>
          <HStack spacing={1}>
            <Text>Email:</Text>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </HStack>
          <HStack spacing={1}>
            <Text>Password:</Text>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </HStack>
          <Button variant={"PrimaryButton"} onClick={signupSpinnerLoading ? () => {} : handleLogin}>
            { signupSpinnerLoading ? <Spinner /> : "Create Account" }
          </Button>
        </Stack>
      </ReusableModal>
    </>
  );
};

export default CreateAccountModal;