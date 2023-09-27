import { Box } from "@chakra-ui/react";
import SignUpForm from "../../components/auth/SignUpForm";
import Header from "../../components/shared/Header";
import Panel from "../../components/shared/Panel";

const SignUpPage = () => {
  return (
    <>
      <Header title={"snowcap"} noNav />
      <Panel title={"sign up"}>
          <SignUpForm />
      </Panel>
    </>
  );
};

export default SignUpPage;