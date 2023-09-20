import { useEffect, useState } from "react";
import axios from "../utils/axios";

import styles from "../styles/TaskChecker.module.css";

const funcs: {[index: string]: string } = {
  'fabricate': 'Generation',
  'scribe': 'Transcription'
}

const TaskChecker = ({ taskId, taskType }: { taskId: string | null, taskType: string | null }) => {
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
        }
        else if (data.state === 'FAILURE') {
          clearInterval(interval);
          setTaskState('FAILURE');
        }

      } catch (error) {
        console.error("Error checking task status:", error);
        clearInterval(interval);
        setTaskState('FAILURE');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  return (
    <div className={styles.taskBox}>
      <div className={styles.statusRow}>
        <div className={styles.circle + ' ' + styles[taskState.toLowerCase()]}></div>
        { taskResult && taskType && <h3>{ funcs[taskType] } is finished!</h3> }
        { taskState === "LOADING" && taskType && <h3>{ funcs[taskType] } is  pending completion.</h3> }
        { taskState === "FAILURE" && taskType && <h3>{ funcs[taskType] } failed. Please try again.</h3> }  
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