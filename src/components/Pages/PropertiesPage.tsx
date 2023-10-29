import { Box, Button, Center, HStack, Skeleton, Spinner, Stack, Switch, Text, useDisclosure } from "@chakra-ui/react";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../Utils/Property/PropertyCard";
import CreatePropertyModal from "../Modals/CreatePropertyModal";
import { useEffect, useState } from "react";
import { useSession } from "../../hooks/useSession";
import AdditionalInfoModal from "../Modals/AdditionalInfoModal";

const PropertiesPage = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isAdditionalInfoOpen, onOpen: onAdditionalInfoOpen, onClose: onAdditionalInfoClose } = useDisclosure();

  const savedFiltersJSON = localStorage ? localStorage.getItem('saved_filters') : false;
  const savedFilters = savedFiltersJSON ? JSON.parse(savedFiltersJSON) : false;

  const [ allProperties, setAllProperties ] = useState<boolean>(savedFilters ? savedFilters.allProperties : false);

  const { session, status } = useSession();

  const toggleAllProperties = () => setAllProperties(!allProperties);

  useEffect(() => {
    if (status === 'authenticated' && session.user) {
      if (session.user.name && session.user.name !== "") {

      } else {
        // set additional info
        onAdditionalInfoOpen();
      }
    } 
  }, [ session, status ]);

  useEffect(() => {
    const savedFiltersJSON = localStorage.getItem('saved_filters');

    if (savedFiltersJSON) {
      const savedFilters = JSON.parse(savedFiltersJSON);
      setAllProperties(savedFilters.allProperties);
    } else {
      const savedFilters = {
        allProperties: false
      }
      localStorage.setItem('saved_filters', JSON.stringify(savedFilters));
    }
  }, []);

  useEffect(() => {
    const savedFilters = {
      allProperties
    }
    localStorage.setItem('saved_filters', JSON.stringify(savedFilters));
  }, [ allProperties ])

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        
        gap={6}
      >
        <PropertiesTitleBox toggle={toggleAllProperties} current={allProperties} />

        <Button 
          variant={"InverseButton"}
          w={"300px"}
          h={40}
          onClick={onOpen}
        >
          <Box
            display={'flex'}
            flexDirection={["column", null, null, "row"]}
            gap={4}
          >
            <Text textStyle={"h2"}>
              {"+"}
            </Text>
            <Text textStyle={"h2"}>
              {"create"}
            </Text> 
          </Box>
        </Button>
      </Box>
      <PropertyList allProperties={allProperties} />
      
      <AdditionalInfoModal isOpen={isAdditionalInfoOpen} onClose={onAdditionalInfoClose} />
      <CreatePropertyModal isOpen={isOpen} onClose={onClose} />
    </>
  ) 
}

export default PropertiesPage;

const PropertiesTitleBox = ({ toggle, current }: { toggle: any, current: boolean }) => {
  return (
    <>
      <Box
        display={"flex"}
        flexDir={["column", null, null, "row"]}
        justifyContent={"space-between"}
        alignItems={"flex-start"}

        boxShadow={"var(--box-shadow)"}
        bgColor={"secondary"}

        w={"100%"}
        h={[40]}
        px={[3, null, null, 6]}
        py={[2, null, null, 8]}
      >
        <Text textStyle={"h2"}>{"Properties"}</Text>

        <Stack 
          align={["flex-start", null, null, "flex-end"]}
          gap={6}
        >
          <HStack>
            <Switch size='md' onChange={toggle} defaultChecked={!current} />
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

const PropertyList = ({ allProperties }: { allProperties: boolean }) => {
  const { session } = useSession();

  const { data: properties, isLoading } = useProperties(allProperties ? 'none' : session?.user?.email as string);

  return (
    <>
      {
        isLoading && 
          <Center h={'30vh'}>
            <Spinner />
          </Center>
      } 
      {
        properties && <Stack
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
      } 
    </>
  )
}