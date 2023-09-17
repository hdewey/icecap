import axios from '../utils/axios';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/ScribeForm.module.css';
import RecordRTC from 'recordrtc';
import TaskChecker from './TaskChecker';
import useProperties from '../hooks/useProperties';
import Loader from './Loader';

const ScribeForm = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [propertyId, setPropertyId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<RecordRTC | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [audioBlob, setAudioBlob ] = useState<Blob | null>(null);

  const audioChunks = useRef<Blob[]>([]);

  const [ taskId, setTaskId ] = useState('');

  const [timer, setTimer] = useState<number>(0);
  let intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: properties, isLoading: isPropertiesLoading } = useProperties(); 
  
  const startRecording = async () => {
    if (typeof document !== 'undefined') {
      if (!navigator.mediaDevices) {
        console.log('getUserMedia not supported on your browser!');
        return;
      }
    
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new RecordRTC(stream, {
        type: 'audio',
        ondataavailable: function (blob) {
          audioChunks.current.push(blob);
        },
      });
    
      mediaRecorder.startRecording();
      setIsRecording(true);
      setMediaRecorder(mediaRecorder);
    
      intervalRef.current = setInterval(() => setTimer((prev) => Math.round((prev + 0.1) * 100) / 100), 100);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && typeof document !== 'undefined') {
      mediaRecorder.stopRecording(() => {
        const recordedBlob = mediaRecorder.getBlob();
        const audioURL = URL.createObjectURL(recordedBlob);
        setAudioBlob(recordedBlob);
        setAudioURL(audioURL);
        setIsRecording(false)
      });
      setIsRecording(false)
      audioChunks.current = [];
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTaskId('');
  
    if (!audioBlob && !file) {
      alert('You need to either record audio or upload a file.');
      return;
    }
  
    if (!propertyId) {
      alert('Property ID is required.');
      return;
    }
  
    const formData = new FormData();
  
    // Decide on the priority here. This time, we're checking for audioBlob first.
    // If audioBlob exists, it uses that; otherwise, it uses the file.
    let dataToUpload: File | Blob | null = audioBlob;
  
    if (dataToUpload) {
      const fileType = dataToUpload?.type.split(';')[0].split('/')[1];
      const fileName = fileType ? `recording.${fileType}` : 'recording';
      console.log(`Recording size: ${dataToUpload.size} bytes`);
      formData.append('file', dataToUpload, fileName);
    } else if (file) {
      formData.append('file', file);
    }
  
    formData.append('property_id', propertyId);
  
    try {
      const response = await axios.post('/scribe', formData);
      const { data } = response;
      if (data.message === 'task queued') {
        setTaskId(data.task_id);
      }
    } catch (error) {
      console.log(error)
      alert('An error occurred while uploading the file. Please try again.');
    }
  };

  return (
    <>
      {
        properties ? (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
            <select
              className={styles.textInput}
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="">Select a Property</option>
              {
                properties && properties.map((property: any) => (
                  <option key={property._id} value={property._id}>
                    {property.property_name}
                  </option>
                ))
              }
            </select>
              <div className={styles.actionRow}>
                {isRecording ? (
                    <button className={styles.recordingButton} type="button" onClick={stopRecording}>
                        Stop Recording
                    </button>
                ) : (
                    <button className={styles.recordingButton} type="button" onClick={startRecording}>
                        Start Recording
                    </button>
                )}
                {
                  !audioURL ? (
                    <>
                      <span className={styles.orText}>or</span>
                      <input
                          id="fileUploadInput"
                          className={styles.fileupload}
                          type="file"
                          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      />
                      <label 
                          className={file ? styles.uploadLabelUploaded : styles.uploadLabel} 
                          htmlFor="fileUploadInput">
                          {file ? file.name : "Upload Audio"}
                      </label>
                    </>
                  ) : (audioURL && <audio className={styles.audio} src={audioURL} controls></audio>) 
                }
                
            </div>
            
            <button className={styles.submitButton} type="submit">Submit</button>
          </form>
          {
            taskId && <TaskChecker taskId={taskId} taskType={'scribe'} />
          }
        </>
        ) : <Loader />
      }
    </>
  );
};

export default ScribeForm;
