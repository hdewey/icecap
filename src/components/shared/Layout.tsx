import { Box } from "@chakra-ui/react"


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <Box
        className={'main'}
      >
        { children }
      </Box>
    </>
  )
}

export default Layout;