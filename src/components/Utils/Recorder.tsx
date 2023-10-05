import axios from '../utils/axios';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/ScribeForm.module.css';
import theme from '../styles/theme.module.css';
import RecordRTC from 'recordrtc';
import TaskChecker from './TaskChecker';
import useProperties from '../hooks/useProperties';
import Loader from './Loader';
import { Box, Button, HStack, Spinner, Text } from '@chakra-ui/react';
import { useSession } from '../hooks/useSession';

const ScribeForm = () => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [propertyId, setPropertyId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<RecordRTC | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [audioBlob, setAudioBlob ] = useState<Blob | null>(null);

  const audioChunks = useRef<Blob[]>([]);

  const [ taskId, setTaskId ] = useState('');
  const [ isTaskSynced, setIsTaskSynced ] = useState(true);

  const [timer, setTimer] = useState<number>(0);

  const { session } = useSession();
  
  const startRecording = async () => {
    if (typeof document !== 'undefined') {
      if (!navigator.mediaDevices) {
        console.log('getUserMedia not supported on your browser!');
        return;
      }
    
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new RecordRTC(stream, {
        type: 'audio',
        timeSlice: 1000,
        ondataavailable: function (blob) {
          audioChunks.current.push(blob);
        },
      });
    
      mediaRecorder.startRecording();
      setIsRecording(true);
      setMediaRecorder(mediaRecorder);
    
      // intervalRef.current = setInterval(() => setTimer((prev) => Math.round((prev + 0.1) * 100) / 100), 100);
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
    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    //   intervalRef.current = null;
    // }
    setTimer(0);
  };

  // useEffect(() => {
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, []);

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

    setIsTaskSynced(false);
  
    const formData = new FormData();
  
    // Decide on the priority here. This time, we're checking for audioBlob first.
    // If audioBlob exists, it uses that; otherwise, it uses the file.
    let dataToUpload: File | Blob | null = audioBlob;

    console.log('Submitting: ', dataToUpload);
  
    if (dataToUpload) {
      const fileType = dataToUpload?.type.split(';')[0].split('/')[1];
      const fileName = fileType ? `recording.${fileType}` : 'recording';
      console.log(`Recording size: ${dataToUpload.size} bytes`);
      formData.append('file', dataToUpload, fileName);
    } else if (file) {
      formData.append('file', file);
    }
  
    formData.append('property_id', propertyId);

    if (!session) {
      alert("No session!")
      return;
    }
  
    try {
      const response = await axios.post('/scribe', formData, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
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
            <div className={styles.container}>

            <form className={theme.form} onSubmit={handleSubmit}>
            <Text textStyle={"h3"} mb={4} color={"var(--primary-dark)"}>{"Property:"}</Text>
            <select
              className={theme.textInput}
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value={""}>{"Select a Property"}</option>
              {
                properties && properties.map((property: any) => (
                  <option key={property._id} value={property._id}>
                    {property.property_name}{' - '}{property.agent}
                  </option>
                ))
              }
            </select>
                <Box
                  flexDirection={["column", "column", "row", "row"]}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  w={'100%'}
                  my={"4vh"}
                >
                    {isRecording ? (
                      <button className={theme.button} type="button" onClick={stopRecording}>
                        <HStack><Spinner /> <Text textStyle={'h3'}>Stop</Text></HStack>
                      </button>
                    ) : (
                      <button className={theme.button} type="button" onClick={startRecording}>
                        <Text textStyle={'h3'}>Start Recording</Text>
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
                            accept={'.mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm'}
                          />
                          <label 
                            className={file ? styles.uploadLabelUploaded : styles.uploadLabel} 
                            htmlFor="fileUploadInput">
                            <Text textStyle={'h3'}>{file ? file.name : "Upload Audio"}</Text>
                          </label>
                        </>
                      ) : (audioURL && <Box my={4}><audio className={styles.audio} src={audioURL} controls></audio></Box>) 
                    }
                </Box>
                {
                  propertyId && 
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
                    { isTaskSynced ? <Text textStyle={'h3'}>Submit</Text> : <Spinner />  }
                  </Button>
                }
          </form>
          </div>
          {
            (taskId) && <TaskChecker taskId={taskId} taskType={'scribe'} refetch={() => setIsTaskSynced(true)}  />
          }
        </>
        ) : <Loader />
      }
    </>
  );
};

export default ScribeForm;