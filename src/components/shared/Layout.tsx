import { Box } from "@chakra-ui/react"

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <Box
      width={"100vw"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      >
        { children }
      </Box>
    </>
  )
}

export default Layout;