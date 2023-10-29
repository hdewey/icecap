import { Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Uploader from "./Uploader";
import { useState } from "react";
import usePropertyInfo from "../../../hooks/usePropertyInfo";
import axios from "../../../utils/axios";
import { useSession } from "../../../hooks/useSession";
import JobLoader from "../JobLoader";

const Recorder = dynamic(() => import("./Recorder"), {
  ssr: false,
});

const DescribePanel = ({ setSelected }: { setSelected: any }) => {

  const router = useRouter();

  const { propertyId } = router.query;

  return (
    <>
      <Tabs 
        isFitted
        borderRadius="none"
      >
        <TabList 
          borderBottom="2px solid"
          borderColor="black.400"
        >
          <Tab 
            _selected={{ color: "white", bgGradient: "primaryGradient" }} 
            _hover={{ bgGradient: "primaryGradient", opacity: 0.6, color: 'white' }}
          >
            RECORD
          </Tab>
          <Tab 
            _selected={{ color: "white", bgGradient: "primaryGradient", }} 
            _hover={{ bgGradient: "primaryGradient", opacity: 0.6, color: 'white' }}
          >
            WRITE
          </Tab>
          <Tab 
            _selected={{ color: "white", bgGradient: "primaryGradient", }} 
            _hover={{ bgGradient: "primaryGradient", opacity: 0.6, color: 'white' }}
          >
            UPLOAD AUDIO FILE
          </Tab>
        </TabList>
        <TabPanels 
          bgColor={"secondary"}
          boxShadow={"var(--box-shadow)"}
          borderRadius="md"
        >
          <TabPanel p={4}>
            <Recorder propertyId={propertyId as string} setSelected={setSelected} />
          </TabPanel>
          <TabPanel p={4}>
            <WritePanel propertyId={propertyId as string} setSelected={setSelected}  />
          </TabPanel>
          <TabPanel p={4}>
            <Uploader propertyId={propertyId as string} setSelected={setSelected}  />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default DescribePanel;

const WritePanel = ({ propertyId, setSelected }: { propertyId: string, setSelected: any }) => {
  const [value, setValue] = useState('');

  const [taskId, setTaskId] = useState<string | null>(null);

  const { session } = useSession();

  const { refetch } = usePropertyInfo(propertyId);

  const handleInputChange = (e: any) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/quick_gen', {
        property_id: propertyId,
        description: value
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to create description");
      }

      const { data } = response;
      if (data.message == 'task queued') {
        setTaskId(data.task_id);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the property. Please try again.');
    }
  };

  const finishedHandler = () => {
    refetch();
    setSelected('results');
  }

  return (
    <>
      <Stack gap={6} py={12} px={6}>
        <Text textStyle={"h3"}>{"Write and upload your description:"} </Text>
        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder='Please write or paste your description here!'
          size='lg'
        />
      {
        (value !== '') && 
          <Button variant={"PrimaryButton"} onClick={handleSubmit}>
            { taskId ? <JobLoader taskId={taskId} handler={finishedHandler} /> : "Upload" }
          </Button>
      }
      </Stack>
    </>  
  )
}