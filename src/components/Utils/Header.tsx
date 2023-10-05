import { Box, Text } from "@chakra-ui/react";
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
        >
          <Text textStyle={"h1"}>{"snowcap"}</Text>
          <Text textStyle={"h3"}>{"home"}</Text>
        </Box>

        <AuthBox />
      </Box>
    </>
  )
};

export default Header;