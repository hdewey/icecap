import { useRouter } from 'next/router';

import usePropertyInfo from "../../hooks/usePropertyInfo";

import { Box, IconButton, Stack, Text } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons";

import SmartStepper from "../Utils/SmartStepper";

const PropertyCard = ({ propertyId }: { propertyId: string }) => {

  const { data } = usePropertyInfo(propertyId);

  const router = useRouter();

  const navigate = () => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <>
      <Box
        py={6}
        px={12}
        boxShadow={"var(--box-shadow)"}
        w={"100%"}

        display={"flex"}
        flexDir={["column", "column", "column", "row"]}
        justifyContent={"space-between"}
        alignItems={"center"}

        onClick={navigate}
        _hover={{
          cursor: 'pointer'
        }}
      >
        <Text textStyle={"h3"} w={["200px", null, null, "450px"]}>{data?.property.property_name}</Text>

        <Stack textAlign={"left"} w={"200px"}>
          <Text textStyle={"p"}>agent: <Text textStyle={"h3"}>{data?.property.agent}</Text></Text> 
        </Stack>

        <SmartStepper stepperState={data?.stepperState} />

        <IconButton bgColor={"tertiary"} icon={<CloseIcon />} aria-label={"Delete property"} />
      </Box>
    </>
  )
}

export default PropertyCard;