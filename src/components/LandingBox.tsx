import { Box, Icon, Text } from "@chakra-ui/react"

import { AddPropertyIcon, ListPropertyIcon, UploadPropertyIcon } from "./icons/home";
import Link from "next/link";

const LandingBox = () => {


  return (
    <>
      <Box
        flexDirection={["column", "column", "row", "row"]}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"10vw"}
      >
        <Wrapper cta={"Add Property"} link={"/create"}><Icon as={AddPropertyIcon} w={200} h={200} /></Wrapper>
        <Wrapper cta={"Record Descriptions"} link={"/record"}><Icon as={UploadPropertyIcon} w={200} h={200}  /></Wrapper>
        <Wrapper cta={"Manage Properties"} link={"/properties"}><Icon as={ListPropertyIcon} w={200} h={200}  /></Wrapper>
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
          borderRadius: "60px"
        }}
      >
        { children }
      </Box>

      <Text w={'100%'} textAlign={"center"} textStyle={"h3"} p={3}>{cta}</Text>
    </Link>

  )
}