import { Box, Center } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactElement}) => (
  <Center 
    w={"100vw"}
    minHeight={"100vh"}
    alignItems={"flex-start"}
    bgColor={"tertiary"}
  >
    <Box
      w={"100%"}
      h={"100%"}
      px={6}
      py={4}
    >
      { children }
    </Box>
  </Center>
)

export default Layout;