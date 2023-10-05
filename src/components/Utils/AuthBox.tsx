import { Box, Text } from "@chakra-ui/react"

const AuthBox = () => {
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}

        w={"300px"}
        h={20}
        boxShadow={"var(--box-shadow)"}
      > 
        <Box
          w={8}
          h={8}
          borderRadius={"50%"}
          bgGradient={"linear-gradient(116deg, #453BB7 1.72%, #9DA2FF 89.93%)"}
          display={"inline-block"}
        />
        <Text textStyle={"h3"}>
          {"Hello, Henry"}
        </Text>
      </Box>
    </>
  )
};

export default AuthBox;