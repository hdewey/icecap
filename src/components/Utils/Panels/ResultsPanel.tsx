import { useRouter } from "next/router";
import usePropertyInfo from "../../../hooks/usePropertyInfo";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

const ResultsPanel = () => {
  
  const router = useRouter();

  const { propertyId } = router.query;

  const { data: propertyInfo, isLoading: propertyInfoLoading } = usePropertyInfo(propertyId as string);

  return (
    <>
      {
        <Box
          minH={50}
          w={'100%'}
          boxShadow={'var(--box-shadow)'}
          background={'secondary'}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"flex-start"}
          flexDirection={"column"}
          py={8} 
          px={10}
          gap={6}
        >
          <Text textStyle={"h3"}>{"Generated Results"}</Text>
          {
            !propertyInfoLoading && propertyInfo ?
              <Text textStyle={"p"} whiteSpace="pre-line">
                { 
                  propertyInfo.property.descriptions && propertyInfo.property.descriptions.length > 0 ? propertyInfo.property.descriptions[0].descriptions : "No generated results yet." 
                }
              </Text>
              :
              <Center w={'100%'} h={'20vh'}>
                <Spinner />
              </Center>
          }
         
        </Box>
      }
    </>
  )
};

export default ResultsPanel;