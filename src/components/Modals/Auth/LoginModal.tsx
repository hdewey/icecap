import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, HStack, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import ReusableModal from "../ReusableModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [ signinSpinnerLoading, setSigninSpinnerLoading ] = useState<boolean>(false); 

  const handleLogin = async () => {
    setSigninSpinnerLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  
    if (result?.error) {
      console.error(result.error);
      setSigninSpinnerLoading(false);
    } else {
    }
  };

  return (
    <>
      <ReusableModal title={"Login"} isOpen={isOpen} onClose={onClose} noclose>
        <Stack spacing={8}>
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
          <Button variant={"PrimaryButton"} onClick={signinSpinnerLoading ? () => {} : handleLogin}>
            { signinSpinnerLoading ? <Spinner /> : "Login" }
          </Button>
        </Stack>
      </ReusableModal>
    </>
  );
};

export default LoginModal;