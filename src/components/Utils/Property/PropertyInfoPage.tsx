import { Box, Button, Center, Flex, HStack, IconButton, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import usePropertyInfo from "../../../hooks/usePropertyInfo";
import { useRouter } from "next/router";
import { CloseIcon } from "@chakra-ui/icons";
import SmartStepper from "../SmartStepper";
import { useState, useEffect } from "react";
import DescribePanel from "../Panels/DescribePanel";
import ResultsPanel from "../Panels/ResultsPanel";
import ConfirmDeleteProperty from "../../Modals/ConfirmDeleteProperty";

const PropertyInfoPage = () => {

  const router = useRouter();

  const { propertyId } = router.query;

  const { data } = usePropertyInfo(propertyId as string)

  return (
    <>
      <PropertyInfoTitleBox propertyName={data?.property.property_name} stepperState={data?.stepperState} />
      {
        data ?
          <PropertyContentBox propertyId={propertyId as string} />
          :
          <Center w={'100%'} h={'20vh'}>
            <Spinner />
          </Center>
      }
    </>
  )
}

export default PropertyInfoPage;

const PropertyInfoTitleBox = ({ propertyName, stepperState }: { propertyName: string, stepperState: any}) => {

  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { propertyId } = router.query;

  const handleDeleteProperty = (e: any) => {
    e.stopPropagation();

    onOpen();
  }

  return (
    <>
      <Box
        display={"flex"}
        flexDir={["column", null, null, "row"]}
        justifyContent={"space-between"}
        alignContent={"center"}
        gap={[4, 4, null, null]}
        boxShadow={"var(--box-shadow)"}
        bgColor={"secondary"}
        w={"100%"}
        px={[4, null, null, 12]}
        py={8}
      >
        <HStack gap={6} minW={'50%'}>
          <IconButton icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="24" viewBox="0 0 65 24" fill="none">
            <path d="M0.939339 10.9393C0.353554 11.5251 0.353554 12.4749 0.939339 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939339 10.9393ZM65 10.5L2 10.5V13.5L65 13.5V10.5Z" fill="black"/>
            </svg>
          } aria-label={"back"} bgColor={"transparent"} p={3} onClick={() => { router.push('/')}} />
          <Text textStyle={"h2"}>{propertyName}</Text>
        </HStack>

        <SmartStepper stepperState={stepperState} />
       
        <IconButton onClick={e => handleDeleteProperty(e)} bgColor={"tertiary"} icon={<CloseIcon />} aria-label={"Delete property"} />

        <ConfirmDeleteProperty isOpen={isOpen} onClose={onClose} propertyId={propertyId as string} />
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

  const { data } = usePropertyInfo(propertyId);

  return (
    <>
      <Flex
        direction={["column", null, "row", "row"]}
        py={6}
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
          {
            data && data.stepperState.name === 'finished' &&  
              <Button
                variant={selected === 'results' ? 'PrimaryButton' : 'InverseButton'}
                py={[2, null, null, 8]}
                w={"100%"}
                onClick={() => handleClick('results')}
              >
                <Text>{"RESULTS"}</Text>
              </Button>
          }
        </Flex>
        <Box w={"100%"} minH={"500px"} >
          {
            selected === 'results' ? <ResultsPanel /> : <DescribePanel setSelected={setSelected} />
          }
        </Box>
      </Flex>
    </>
  );
};
