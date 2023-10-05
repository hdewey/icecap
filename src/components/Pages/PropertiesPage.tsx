import { Box, Button, HStack, Select, Stack, Switch, Text } from "@chakra-ui/react";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "./PropertyCard";

const PropertiesPage = () => {
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        
        gap={6}
      >
        <PropertiesTitleBox />

        <Button 
          variant={"InverseButton"}
          w={"300px"}
          h={40}
        >
          <Text textStyle={"h2"}>
            {"+ create"}
          </Text> 
        </Button>
      </Box>
      <PropertyList />
    </>
  ) 
}

export default PropertiesPage;

const PropertiesTitleBox = () => {
  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}

        boxShadow={"var(--box-shadow)"}

        w={"100%"}
        h={40}
        px={12}
        py={8}
      >
        <Text textStyle={"h2"}>{"Properties"}</Text>

        <Stack 
          align={"flex-end"}
          gap={6}
        >
          <HStack>
            <Switch defaultChecked={true} />
            <Text textStyle={"p"} fontWeight={"bold"}>only my properties</Text>
          </HStack>

          <HStack>
            <Text textStyle={"p"}>ordered by:</Text>
            <Text textStyle={"h3"}>{"MOST RECENT"}</Text>
          </HStack>
        </Stack>
      </Box>
    </>
  )  
}

const PropertyList = () => {
  const { data: properties } = useProperties();

  return (
    <>
      <Stack
        my={6}
        gap={6}
        w={"100%"}
      >
        {
          properties && properties.map((property: any) => (
            <PropertyCard propertyId={property._id} key={property._id} />
          ))
        }
      </Stack>
    </>
  )
}