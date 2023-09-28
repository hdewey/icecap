import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/router';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";

import theme from "../../styles/theme.module.css";

const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();

  const [isLoading, setLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Both email and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const submit = await signIn("credentials", {
      redirect: false,
      email,
      password
    })

    if (!submit || !submit.ok) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } else {
      toast({
        title: "Signed In!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    }
  };

  return (
    <form className={theme.form} onSubmit={handleSubmit}>
      <div className={theme.stack}>
        <Text textStyle={"h3"} className={theme.inputTitle}>Email:</Text>
        <input
          className={theme.textInput}
          type="email"
          placeholder="example@snowcap.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Text textStyle={"h3"} className={theme.inputTitle}>Password:</Text>
        <input
          className={theme.textInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        type='submit'
        mt={5}
        bg={"var(--primary-dark)"}
        color={"var(--primary-white)"}
        transition={"all ease 0.3s"}
        border={"var(--border)"}
        _hover={{
          bg: "var(--primary-white)",
          color: "var(--primary-dark)",
          border: "var(--border)",
        }}
        borderRadius={"30px"}
        p={5}
        py={6}
      >
        { isLoading ? <Spinner /> : <Text textStyle={"h3"}>Sign In</Text> } 
    </Button>
  </form> 
  );
};

export default SignInForm;
