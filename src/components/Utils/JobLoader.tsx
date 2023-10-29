import { useEffect, useState } from "react";
import { useSession } from "../../hooks/useSession";
import axios from "../../utils/axios";
import { Spinner, Text } from "@chakra-ui/react";

const JobLoader = ({ taskId, handler }: { taskId: string, handler: () => any }) => {

  const [taskState, setTaskState] = useState<'LOADING' | 'SUCCESS' | 'FAILURE'>('LOADING');

  const { session } = useSession();
  
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/task/${taskId}`, {
          headers: {
            "Authorization": `Bearer ${session.accessToken}`,
          }
        })

        const { data } = response;

        if (data.state === 'SUCCESS') {
          clearInterval(interval);
          setTaskState('SUCCESS');
          if (handler) handler();
        }
        else if (data.state === 'FAILURE') {
          clearInterval(interval);
          setTaskState('FAILURE');
          if (handler) handler();
        }

      } catch (error) {
        console.error("Error checking task status:", error);
        clearInterval(interval);
        setTaskState('FAILURE');
        if (handler) handler();
      }
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [taskId]);
  
  return (
    <>
      {
        taskState == "LOADING" && <Spinner />
      }
      {
        taskState == "FAILURE" && <Text>{"Failed, please refresh and try again."}</Text>
      }
      {
        taskState == "SUCCESS" && <Text>{"Success!"}</Text>
      }
    </>
  );
};

export default JobLoader;