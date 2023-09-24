import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Icon, useDisclosure, Text, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, TabIndicator, Skeleton } from "@chakra-ui/react";
import PropertyDropdown from "./PropertyDropdown";
import DeleteButton from "../shared/actions/DeleteButton";
import usePropertyInfo from "../../hooks/usePropertyInfo";
import { useEffect, useState } from "react";
import CustomSkeleton from "../shared/CustomSkeleton";
import { timeSince } from "../../utils/etc";
import useProperties from "../../hooks/useProperties";

const PropertyCard = ({ propertyId }: { propertyId: string }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [ isLoaded, setIsLoaded ] = useState<boolean>(false);

  const { data: propertyInfo } = usePropertyInfo(propertyId);

  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);

  const { refetch } = useProperties();

  useEffect(() => {
    if (propertyInfo) {
      const max_unix_ts = Math.max(
        ...propertyInfo.transcripts.map((t: any) => t.upload_time),
        ...propertyInfo.descriptions.map((d: any) => d.upload_time)
      )

      if (propertyInfo.transcripts.length + propertyInfo.descriptions.length > 0 ) {
        const latestUploadDate = new Date(max_unix_ts * 1000);
        setLastUpdated(latestUploadDate);
      }
    }
  }, [propertyInfo]);

  useEffect(() => {
    if (!isLoaded && propertyInfo) {
      setIsLoaded(true);
    }
  }, [ propertyInfo ])

  return (
    <>
      <Box 
        p={4} 
        w={"100%"}
        border={isOpen ? "var(--border)" : "var(--secondary-border)"}
        borderRadius={"var(--border-radius)"}
        position="relative"
        boxShadow={"var(--box-shadow)"}
        cursor={isOpen ? "" : "pointer"}
        onClick={!isOpen ? onToggle : undefined}
        mb={isOpen ? 0 : 5}
        transition={"all ease 0.3s"}
      >
        <Box
          mx={"auto"}
          width={"90%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          py={4}
        >
          <Stack spacing={5}>
            <HStack spacing={10}>
              <CustomSkeleton isLoaded={isLoaded}><Text textStyle={"h2"}>{propertyInfo ? propertyInfo.property_name : "PLACEHOLDER"}</Text></CustomSkeleton>
            </HStack>
            <HStack>
              <Text textStyle={"p"}>agent: </Text><CustomSkeleton isLoaded={isLoaded}><Text textStyle={"h3"}>{propertyInfo ?  propertyInfo.agent : "AGENT X" }</Text></CustomSkeleton>
            </HStack>
          </Stack>

          <Stack mr={3}>
            <HStack>
              <CustomSkeleton isLoaded={isLoaded}><Text textStyle={'h3'}>{lastUpdated ? timeSince(lastUpdated) : (isLoaded ? "no updates" : "aboutta week ago") }</Text></CustomSkeleton>
            </HStack>
            
            <Box
              w={"100%"}
              display={'flex'}
              justifyContent={'flex-end'}
              h={10}
            >
              <DeleteButton id={propertyId} collection={"properties"} refetch={refetch} message="Are you sure you'd like to delete this property?" />
            </Box>
            
          </Stack>

        </Box>
        {/* Close Icon */}
        {isOpen && (
          <Icon 
            as={CloseIcon} 
            position="absolute"
            color={"var(--primary-dark)"}
            _hover={{
              background: "var(--primary-dark)",
              color: "var(--primary-white)",
            }}
            p={2}
            borderRadius={'15px'}
            transition={"background,color ease 0.3s"}
            top={8} 
            right={8}
            w={12} 
            h={12}
            cursor="pointer"
            onClick={onClose} 
          />
        )}
      </Box>
      {/* Card Content */}
      <Collapse in={isOpen} animateOpacity>
        { propertyInfo && <PropertyDropdown propertyInfo={propertyInfo} /> }
      </Collapse>
    </>
  );
}

export default PropertyCard;