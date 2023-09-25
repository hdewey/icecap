import { useEffect, useState } from "react";
import axios from "../utils/axios";

import styles from "../styles/TaskChecker.module.css";
import { Box, Text } from "@chakra-ui/react";

const funcs: {[index: string]: string } = {
  'fabricate': 'Generation',
  'scribe': 'Transcription'
}

const TaskChecker = ({ taskId, taskType, refetch }: { taskId: string | null, taskType: string | null, refetch?: any }) => {
  const [taskResult, setTaskResult] = useState<null | any>(null);
  const [taskState, setTaskState] = useState<'LOADING' | 'SUCCESS' | 'FAILURE'>('LOADING');

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/task/${taskId}`);
        const { data } = response;

        if (data.state === 'SUCCESS') {
          clearInterval(interval);
          setTaskState('SUCCESS');
          setTaskResult(data.result);
          if (refetch) refetch();
        }
        else if (data.state === 'FAILURE') {
          clearInterval(interval);
          setTaskState('FAILURE');
          if (refetch) refetch();
        }

      } catch (error) {
        console.error("Error checking task status:", error);
        clearInterval(interval);
        setTaskState('FAILURE');
        if (refetch) refetch();
      }
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  const dotColors: { [index: string]: string } = {
    "SUCCESS": "var(--success)",
    "LOADING": "var(--warning)",
    "FAILURE": "var(--error)",
  }

  return (
    <div className={styles.taskBox}>
      <div className={styles.statusRow}>
      <Box
            animation={taskState === "LOADING" ? "fadeInOut 2s infinite" : ""}
            w="15px"
            h="15px"
            borderRadius="50%"
            boxShadow={`0 0 10px ${dotColors[taskState]}`}
            bgColor={dotColors[taskState]}
            border="1px solid"
            borderColor={"var(--primary-white)"}
          />
        { taskResult && taskType && <Text textStyle={"h3"} color={"var(--primary-white)"}>{ funcs[taskType] } is finished!</Text> }
        { taskState === "LOADING" && taskType && <Text textStyle={"h3"} color={"var(--primary-white)"}>{ funcs[taskType] } is  pending.</Text> }
        { taskState === "FAILURE" && taskType && <Text textStyle={"h3"} color={"var(--primary-white)"}>{ funcs[taskType] } failed. Try again. </Text> }  
      </div>
      {
        taskResult && 
        <div className={styles.taskResult}>
          {taskType === 'fabricate' && taskResult.descriptions}
          {taskType === 'scribe' && taskResult.transcription}
        </div>
      }
    </div>
  );
};

export default TaskChecker;