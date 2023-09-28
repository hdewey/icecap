import { Box, Text, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel, Button } from "@chakra-ui/react"
import { Property } from "../../utils/types";
import EditBox from "../shared/EditBox";
import { convertUnixTimestampToDate } from "../../utils/etc";
import DeleteButton from "../shared/actions/DeleteButton";
import usePropertyInfo from "../../hooks/usePropertyInfo";
import usePrompt from "../../hooks/usePrompt";
import { useEffect, useState } from "react";
import GenerateButton from "../shared/actions/GenerateButton";

const PropertyDropdown = ( { propertyInfo }: { propertyInfo: Property }) => {

  return (
    <Box
      p={4} 
      pt={0}
      mx={"auto"}
      mb={5}
      w={"90%"}
      border={"var(--border)"}
      borderTop={"none"}
      borderRadius={"var(--border-radius)"}
      borderTopRadius={"none"}
      position="relative"
      boxShadow={"var(--box-shadow)"}
    >
      <Tabs isManual isFitted variant='unstyled'>
        <TabList>
          <Tab><Text textStyle={"h3"}>Transcripts</Text></Tab>
          <Tab isDisabled={propertyInfo.transcripts.length === 0}><Text textStyle={"h3"}>Generate</Text></Tab>
          <Tab isDisabled={propertyInfo.descriptions.length === 0}><Text textStyle={"h3"}>Results</Text></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TranscribeDropdown propertyInfo={propertyInfo} />
          </TabPanel>
          <TabPanel>
            <GenerateDropdown propertyInfo={propertyInfo} /> 
          </TabPanel>
          <TabPanel>
            <ResultsDropdown propertyInfo={propertyInfo} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default PropertyDropdown;


const TranscribeDropdown = ( {propertyInfo }: { propertyInfo: Property }) => {
  const { refetch } = usePropertyInfo(propertyInfo._id);
  return (
    <>
      <Box>
        <Text textStyle={'h2'} mb={5}>Edit Transcripts</Text>
        { 
          propertyInfo.transcripts.length > 0 && propertyInfo.transcripts.map((transcript, index) => {
            return (
              <Box
                mb={4}
                key={transcript._id}
              >
                <Box
                  width={'100%'}
                  display={"flex"}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  gap={'20px'}
                  py={2}
                > 
                  <Text textStyle={'h2'}>{index + 1}</Text>
                  <Text textStyle={'h3'}>created on {convertUnixTimestampToDate(transcript.upload_time)}</Text>
                  <DeleteButton id={transcript._id} collection={"transcripts"} refetch={refetch} message={"Are you sure you'd like to delete this transcript?"} />
                </Box>
                <EditBox 
                  collection={'transcripts'} 
                  key={index}
                  content={transcript.transcription}
                  id={transcript._id}
                  key_name={'transcription'} 
                />
              </Box>
            )
          })
        }
      </Box>
    </>
  )
}

const GenerateDropdown = ({ propertyInfo }: { propertyInfo: Property }) => {
  const [ content, setContent ] = useState<string>("");

  // default prompt id:

  useEffect(() => {
    if (propertyInfo.prompt) {
      setContent(propertyInfo.prompt)
    }
  }, [propertyInfo])

  // useEffect(() => {
  //   if (!isDefault && propertyInfo && propertyInfo.prompt !== '') {
  //     setContent(propertyInfo.prompt)
  //   } else {
  //     setContent(prompt.value);
  //   }
  // }, [ propertyInfo, isDefault, prompt ])


  return (
    <Box>
        <Text textStyle={'h2'} mb={5}>Generate Property Descriptions</Text>
          <Box
            mb={4}
          >
            <Box
              width={'100%'}
              display={"flex"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              gap={'20px'}
              py={2}
            > 
              <Text textStyle={'h2'}>Edit Prompt:</Text>
            </Box>
            {<EditBox 
              collection={'properties'} 
              content={content} 
              id={propertyInfo._id} 
              key_name={'prompt'} 
            />}
            <Text>Example Prompt: you are an expert real estate agent in Austin, Texas. You are articulate, friendly, and detail focused. Create 3 listing descriptions for this property, 100 words, 200 words, and 300 words.</Text>
            <GenerateButton propertyId={propertyInfo._id} />
          </Box>
      </Box>
  )
}

const ResultsDropdown = ( {propertyInfo }: { propertyInfo: Property }) => {
  const { refetch } = usePropertyInfo(propertyInfo._id);
  return (
    <>
      <Box>
        <Text textStyle={'h2'} mb={5}>Edit Generated Results</Text>
        { 
          propertyInfo.descriptions.length > 0 && propertyInfo.descriptions.slice().reverse().map((description, index) => {
            return (
              <Box
                mb={4}
                key={description._id}
              >
                <Box
                  width={'100%'}
                  display={"flex"}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  gap={'20px'}
                  py={2}
                > 
                  <Text textStyle={'h2'}>{propertyInfo.descriptions.length - index}</Text>
                  <Text textStyle={'h3'}>generated on {convertUnixTimestampToDate(description.upload_time)}</Text>
                  <DeleteButton id={description._id} collection={"descriptions"} refetch={refetch} message={"Are you sure you'd like to delete this description?"} />
                </Box>
                <EditBox 
                  collection={'descriptions'} 
                  content={description.descriptions} 
                  id={description._id} 
                  key_name={'descriptions'} 
                />
              </Box>
            )
          })
        }
      </Box>
    </>
  )
}