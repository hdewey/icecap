import { useEffect, useState } from 'react';

import theme from '../styles/theme.module.css';
import styles from '../styles/Log.module.css'

import axios from "../utils/axios"
import TaskChecker from './TaskChecker';
import useProperties from '../hooks/useProperties';
import Loader from './Loader';
import usePrompts from '../hooks/usePrompts';
import { Badge } from '@chakra-ui/react';
import usePropertyInfo from '../hooks/usePropertyInfo';

const GenerateSection = ({ propertyId }: { propertyId: string}) => {
  const [ taskId, setTaskId ] = useState<null | string>(null);
  const [ loading, setLoading ] = useState<boolean>(false);
  const { data: prompts } = usePrompts();

  const { refetch } = usePropertyInfo(propertyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTaskId('');
  
    if (!propertyId) {
      alert('Property ID is required.');
      return;
    }
  
    try {
      const response = await axios.get(`/fabricate_w_prompt?property_id=${propertyId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = response;
      if (data.message === 'task queued') {
        setTaskId(data.task_id);
        setLoading(true);
      }

    } catch (error) {
      console.log(error)
      setLoading(false);
      alert('An error occurred while uploading the file. Please try again.');
    }
  };

  return (
    <>
      {
        prompts ? (
          <>
            <PromptBox />
            <form className={theme.form} onSubmit={handleSubmit}>
              <button className={theme.submitButton} 
              onClick={(e) => {
                e.stopPropagation();
              }}
              type="submit">Generate</button>
            </form>
            {
              taskId && <TaskChecker taskId={taskId} taskType={'fabricate'} />
            }
          </>
        ) : <Loader />
      }
    </>
  );
}

export default GenerateSection;

const PromptBox = () => {
  const { data: prompts } = usePrompts();
  const [ hasLoaded, setHasLoaded ] = useState(false);

  const [ promptName, setPromptName ] = useState<string>('fabricate');

  const [ fabricate_prompt, setFabricatePrompt ] = useState<any>(null);

  useEffect(() => {
    if (prompts && !hasLoaded ) {

      const prompt = prompts.find((a: any) => a.name === promptName);

      if (prompt) {
        setFabricatePrompt(prompt)
        setHasLoaded(true);
      }
    }
  }, [ prompts, promptName, hasLoaded ])

  const handleContentEdit = (event: React.FocusEvent<HTMLDivElement>) => {
    const updatedTranscription = event.target.innerText;
    saveTranscriptionEdit(updatedTranscription);
  };

  const saveTranscriptionEdit = async (prompt: string) => {
    console.log({  newData: prompt, collection: 'prompts', id: fabricate_prompt._id, key: 'value' })
    if (fabricate_prompt._id && fabricate_prompt.value) {
      const response = await fetch(`/api/save`, {
        method: 'POST',
        body: JSON.stringify({  newData: prompt, collection: 'prompts', id: fabricate_prompt._id, key: 'value' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setHasLoaded(false);
      }
  
      if (!response.ok) {
        console.error("Error saving prompt:", await response.json());
      }
    }
  };
  
  return (
    <>
      {
        fabricate_prompt ?
        <>
          <h2 className={styles.sectionTitle}>Edit Prompts:</h2>
            <div className={styles.listContainer}>
            <div className={styles.dataBox}>
              <div className={styles.content}>
                <div
                    className={theme.textResult}
                    contentEditable={true}
                    onBlur={(e) => handleContentEdit(e as any)}
                    dangerouslySetInnerHTML={{ __html: fabricate_prompt.value}}
                />
              </div>
            </div>
          </div>
        </> : <Loader />
      }
    </>
  )
}