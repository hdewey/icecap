import { useEffect, useState } from 'react';

import theme from '../styles/theme.module.css';
import styles from '../styles/Log.module.css'

import axios from "../../../utils/axios"
import { Badge, Button, Spinner, Text } from '@chakra-ui/react';
import usePropertyInfo from '../../../hooks/usePropertyInfo';
import TaskChecker from '../../TaskChecker';

const GenerateButton = ({ propertyId }: { propertyId: string}) => {
  const [ taskId, setTaskId ] = useState<null | string>(null);
  const [ isLoading, setLoading ] = useState<boolean>(false);

  const { refetch } = usePropertyInfo(propertyId);

  const reset = () => {
    refetch();
    setLoading(false);
  }

  const handleSubmit = async (e: any) => {

    setTaskId('');
  
    if (!propertyId) {
      alert('Property ID is required.');
      return;
    }

    setLoading(true);
  
    try {
      const response = await axios.get(`/fabricate_w_prompt?property_id=${propertyId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = response;
      if (data.message === 'task queued') {
        setTaskId(data.task_id);
      }
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        mt={5}
        bg={"var(--primary-dark)"}
        color={"var(--primary-white)"}
        transition={"all ease 0.3s"}
        border={"var(--border)"}
        _hover={{
          bg: "var(--primary-white)",
          color: "var(--primary-dark)",
          border: "var(--border)",
        }}
        borderRadius={"30px"}
        onClick={handleSubmit}
        p={5}
        py={6}
      >
        { isLoading ? <Spinner />  : <Text textStyle={"h3"}>Generate</Text> } 
      </Button>
      {
        taskId && <TaskChecker taskId={taskId} taskType={'fabricate'} refetch={reset} />
      }
    </>
  );
}

export default GenerateButton;