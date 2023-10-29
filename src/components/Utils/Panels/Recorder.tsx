import { useState, useRef, useEffect } from 'react';

import { Box, Button, HStack, Spinner, Stack, Text } from '@chakra-ui/react';

import RecordRTC from 'recordrtc';

import { useSession } from '../../../hooks/useSession';

import axios from '../../../utils/axios';
import usePropertyInfo from '../../../hooks/usePropertyInfo';
import JobLoader from '../JobLoader';

const Recorder = ({ propertyId, setSelected }: { propertyId: string, setSelected: any }) => {
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<RecordRTC | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [audioBlob, setAudioBlob ] = useState<Blob | null>(null);

  const audioChunks = useRef<Blob[]>([]);

  const { session } = useSession();

  const [taskId, setTaskId] = useState<string | null>(null);

  const { refetch } = usePropertyInfo(propertyId);

  const finishedHandler = () => {
    refetch();
    setSelected('results');
  }
  
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioBlob) {
      alert('You need to either record audio.');
      return;
    }

    const formData = new FormData();
  
    // Decide on the priority here.This time, we're checking for audioBlob first.
    // If audioBlob exists, it uses that; otherwise, it uses the file.
    let dataToUpload: File | Blob | null = audioBlob;

    if (dataToUpload) {
      const fileType = dataToUpload?.type.split(';')[0].split('/')[1];
      const fileName = fileType ? `recording.${fileType}` : 'recording';
      console.log(`Recording size: ${dataToUpload.size} bytes`);
      formData.append('file', dataToUpload, fileName);
    } 
  
    formData.append('property_id', propertyId);

    if (!session) {
      alert("No session!")
      return;
    }
  
    try {
      const response = await axios.post('/quick_gen_scribe', formData, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      const { data } = response;

      if (data.task_id) {
        setTaskId(data.task_id);
      }
    } catch (error) {
      console.log(error)
      alert('An error occurred while uploading the file. Please try again.');
    }
  };

  return (
    <>
    <Stack gap={6} py={12} px={6}>

      <Text textStyle={"h3"}>{"Record and upload your audio description:"} </Text>
      {!audioURL && 
        <>
          {isRecording ? (
            <Button variant={"PrimaryButton"} onClick={stopRecording}>
              <HStack><Spinner /> <Text textStyle={'h3'}>Stop</Text></HStack>
            </Button>
          ) : (
            <Button variant={"PrimaryButton"} onClick={startRecording}>
              <Text textStyle={'h3'}>Start Recording</Text>
            </Button>
          )}
        </>
      }
      
      {
        audioURL && <audio style={{"width": "100%"}} src={audioURL} controls></audio>
      }

      {
        audioURL && 
          <Button variant={"PrimaryButton"} onClick={handleSubmit}>
            { taskId ? <JobLoader taskId={taskId} handler={finishedHandler} /> : "Upload" }
          </Button>
      }
    </Stack>
    </>
  )
};

export default Recorder;