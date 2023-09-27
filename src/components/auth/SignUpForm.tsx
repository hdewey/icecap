import { Button, FormControl, FormLabel, Input, Select, Stack, useToast, Text, Spinner } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

import { signIn } from "next-auth/react";

import { useRouter } from "next/router";

import theme from "../../styles/theme.module.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const router = useRouter();

  const [isLoading, setLoading ] = useState<boolean>(false);

  const { invite_code } = router.query;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true);

    try {
      const submit = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          invite_code
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!submit || !submit.ok) {
        setLoading(false);
        toast({
          title: "Error signing up!",
          description: "Likely an invalid code.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Signed Up!",
          status: "success",
          description: "Now signing in...",
          duration: 3000,
          isClosable: true,
        });
      }
      
      if (submit.ok) {
        const finished = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password
        })
  
        if (!finished || !finished.ok) {
          setLoading(false);
          return
        } else {
          router.push("/");
        }
      }
    } catch (e: any) {
      setLoading(false);
    }
  }

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
        { isLoading ? <Spinner /> : <Text textStyle={"h3"}>Sign Up</Text> } 
    </Button>
  </form> 
  );
};

export default SignupForm;
