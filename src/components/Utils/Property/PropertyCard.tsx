import { useRouter } from 'next/router';

import usePropertyInfo from "../../../hooks/usePropertyInfo";

import { Box, IconButton, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons";

import SmartStepper from "../SmartStepper";
import ConfirmDeleteProperty from '../../Modals/ConfirmDeleteProperty';

const PropertyCard = ({ propertyId }: { propertyId: string }) => {

  const { data, isLoading } = usePropertyInfo(propertyId);

  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const navigate = () => {
    // this should prob be simplified in the future
    router.push(`/property/${propertyId}?mode=${ data && data.stepperState ? (data.stepperState.name === 'finished' ? 'results' : 'describe') : 'describe'}`);
  };

  const handleDeleteProperty = (e: any) => {
    e.stopPropagation();

    onOpen();
  }

  return (
    <>
      <Skeleton isLoaded={!isLoading}>
        <Box
          py={6}
          px={[8, null, null, 6]}
        
          bgColor={"secondary"}
          w={"100%"}

          boxShadow={"var(--box-shadow)"}

          display={"flex"}
          flexDirection={["column", null, "row"]}
          justifyContent={["center", null, "space-between"]}
          alignContent={"center"}

          gap={[4, 4, null, null]}

          transition={"border-radius ease 0.2s"}
          onClick={navigate}
          _hover={{
            cursor: 'pointer',
            borderRadius: "var(--border-radius)"
          }}
        >
            <Text textStyle={"h3"} w={['200px', null, null, '500px']} >{data?.property.property_name}</Text>

            <Stack textAlign={"left"} spacing={0} w={"200px"}>
              <Text textStyle={"p"}>{"agent: "}</Text><Text textStyle={"h3"}>{data?.property.agent}</Text> 
            </Stack>

            <SmartStepper stepperState={data?.stepperState} />

          <IconButton onClick={e => handleDeleteProperty(e)} bgColor={"tertiary"} icon={<CloseIcon />} aria-label={"Delete property"} />

          <ConfirmDeleteProperty isOpen={isOpen} onClose={onClose} propertyId={propertyId} />
        </Box>
      </Skeleton>

    </>
  )
}

export default PropertyCard;