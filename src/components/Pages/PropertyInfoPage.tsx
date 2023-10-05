import { Box, Button, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import usePropertyInfo from "../../hooks/usePropertyInfo";
import { useRouter } from "next/router";
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import SmartStepper from "../Utils/SmartStepper";
import { useState, useEffect } from "react";

const PropertyInfoPage = () => {

  const router = useRouter();

  const { propertyId } = router.query;

  const { data } = usePropertyInfo(propertyId as string)

  return (
    <>
      <PropertyInfoTitleBox propertyName={data?.property.property_name} stepperState={data?.stepperState} />
      <PropertyContentBox propertyId={propertyId as string} />
    </>
  )
}

export default PropertyInfoPage;

const PropertyInfoTitleBox = ({ propertyName, stepperState }: { propertyName: string, stepperState: any}) => {

  const router = useRouter();

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}

        boxShadow={"var(--box-shadow)"}

        w={"100%"}
        h={40}
        px={12}
        py={8}
      >
        <HStack gap={6}>
          <IconButton icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="24" viewBox="0 0 65 24" fill="none">
            <path d="M0.939339 10.9393C0.353554 11.5251 0.353554 12.4749 0.939339 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939339 10.9393ZM65 10.5L2 10.5V13.5L65 13.5V10.5Z" fill="black"/>
            </svg>
          } aria-label={"back"} bgColor={"transparent"} p={3} onClick={() => { router.push('/')}} />
          <Text textStyle={"h2"}>{propertyName}</Text>
        </HStack>

        <SmartStepper stepperState={stepperState} />
       
        <IconButton bgColor={"tertiary"} icon={<CloseIcon />} aria-label={"Delete property"} />

      </Box>
    </>
  )
}

const PropertyContentBox = ({ propertyId }: { propertyId: string }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(router.query.mode as string || "describe");

  useEffect(() => {
    if (selected && propertyId) {
      router.push(`/property/${propertyId}?mode=${selected}`, undefined, { shallow: true });
    }
  }, [selected]);

  const handleClick = (mode: string) => {
    setSelected(mode);
  };

  return (
    <>
    <Flex
        direction={["row"]}
        py={12}
        gap={6}
      >
      <Flex
        direction={["row", null, null, "column"]}
        w={["100%", null, null, "30%"]}
        gap={6}
        
      >
        <Button
          variant={selected === 'describe' ? 'PrimaryButton' : 'InverseButton'}
          py={[2, null, null, 8]}
          w={"100%"}
          onClick={() => handleClick('describe')}
        >
          <Text>{"DESCRIBE"}</Text>
        </Button>

        <Button
          variant={selected === 'results' ? 'PrimaryButton' : 'InverseButton'}
          py={[2, null, null, 8]}
          w={"100%"}
          onClick={() => handleClick('results')}
        >
          <Text>{"RESULTS"}</Text>
        </Button>
      </Flex>
      <Box w={"100%"} minH={"500px"} boxShadow={"var(--box-shadow)"}>

      </Box>
      </Flex>
    </>
  );
};
