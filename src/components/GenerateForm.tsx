import { useState } from 'react';
import styles from '../styles/GenerateForm.module.css';
import theme from '../styles/theme.module.css';

import axios from "../utils/axios"
import TaskChecker from './TaskChecker';
import useProperties from '../hooks/useProperties';
import Loader from './Loader';

const GenerateForm = () => {
  const [propertyId, setPropertyId] = useState<string>('');
  const [ taskId, setTaskId ] = useState<null | string>(null);
  const [ loading, setLoading ] = useState<boolean>(false);
  const { data: properties, isLoading: isPropertiesLoading } = useProperties(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTaskId('');
  
    if (!propertyId) {
      alert('Property ID is required.');
      return;
    }
  
    try {
      const response = await axios.get(`/fabricate?property_id=${propertyId}`);
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
        properties ? (
          <>
            <form className={theme.form} onSubmit={handleSubmit}>
              <select
                className={theme.textInput}
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
              >
                <option value="">Select a Property</option>
                {
                  properties && properties.map((property: any) => (
                    <option key={property._id} value={property._id}>
                      {property.property_name}{' - '}{property.agent}
                    </option>
                  ))
                }
              </select>
              <div className={!propertyId ? theme.overlay : ''}>
            {!propertyId && <div className={theme.pseudoOverlay}></div>}
            {!propertyId && <div className={theme.miniPseudoOverlay}><h6>please select property</h6></div>}
              <div className={propertyId ? '' : theme.blur}>
              <button className={theme.submitButton} type="submit">Generate</button>

              </div>
              </div>
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

export default GenerateForm;