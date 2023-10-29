import { useRef, useState } from 'react';
import { Stack, Input, Button, Text, Box } from '@chakra-ui/react';
import { useSession } from '../../../hooks/useSession';
import axios from '../../../utils/axios';
import JobLoader from '../JobLoader';
import usePropertyInfo from '../../../hooks/usePropertyInfo';

const Uploader = ({ propertyId, setSelected }: { propertyId: string, setSelected: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { session } = useSession();

  const { refetch } = usePropertyInfo(propertyId);

  const [taskId, setTaskId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const response = await axios.post('/quick_gen_scribe', {
      file,
      property_id: propertyId
    }, {
      headers: {
        "Authorization": `Bearer ${session.accessToken}`,
        "Content-Type": "multipart/form-data"
      }
    });

    const { data } = response;
    if (data.task_id) {
      setTaskId(data.task_id);
    }
  };
  
  const finishedHandler = () => {
    refetch();
    setSelected('results');
  }

  return (
    <Stack gap={6}  py={12} px={6}>
      <Text textStyle={"h3"}>{"Attach and upload your audio description:"} </Text>
      <Box>
        <Input placeholder="Choose a file..." value={file?.name || ''} readOnly onClick={handleClick} color={"primary"} _hover={{ cursor: "pointer"}} />
        <input type="file" accept="audio/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
      </Box>
      {file && <Button variant="PrimaryButton" onClick={handleSubmit} isLoading={isUploading} colorScheme="primary">
        { taskId ? <JobLoader taskId={taskId} handler={finishedHandler} /> : "Upload" }
      </Button>}
    </Stack>
  );
};


export default Uploader;