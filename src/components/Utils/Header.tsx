import { Box, Text, Link } from "@chakra-ui/react";
import AuthBox from "./AuthBox";

const Header = () => {
  
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        
        w={"100%"}
        h={20}
        position={"relative"}
        gap={6}

        mb={10}
      >
        <Box
          display={"flex"}
          flexDir={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}

          w={"100%"}
          h={20}
          px={6}

          boxShadow={"var(--box-shadow)"}
          bgColor={"secondary"}
        >
          <Link href={"/"} textDecor={'none !important'}><Text textStyle={"h1"}>{"snowcap"}</Text></Link>
        </Box>

        <AuthBox />
      </Box>
    </>
  )
};

export default Header;
