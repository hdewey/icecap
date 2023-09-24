import { Box, Icon, Text } from "@chakra-ui/react"

import { AddPropertyIcon, ListPropertyIcon, UploadPropertyIcon } from "./icons/home";
import Link from "next/link";

const LandingBox = () => {


  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={100}
      >
        <Wrapper cta={"Add Property"} link={"/create"}><Icon as={AddPropertyIcon} w={300} h={300} /></Wrapper>
        <Wrapper cta={"Upload Descriptions"} link={"/upload"}><Icon as={UploadPropertyIcon} w={300} h={300}  /></Wrapper>
        <Wrapper cta={"Manage Properties"} link={"/properties"}><Icon as={ListPropertyIcon} w={300} h={300}  /></Wrapper>
        
      </Box> 
    </>
  )
}



export default LandingBox;

const Wrapper = ({ cta, link, children }: { cta: string, link: string, children: any}) => {
  
  return (
    <Link href={link}>
      <Box
        border={"var(--border)"}
        boxShadow={"var(--box-shadow)"}
        borderRadius={"var(--border-radius)"}
        transition={"all ease 0.3s"}
        _hover={{
          borderRadius: "15px"
        }}
      >
        { children }
      </Box>

      <Text w={'100%'} textAlign={"center"} textStyle={"h3"} p={3}>{cta}</Text>
    </Link>

  )
}