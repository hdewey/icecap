import useProperties from "../hooks/useProperties";
import usePropertyInfo from "../hooks/usePropertyInfo";
import theme from '../styles/theme.module.css';

import styles from "../styles/Log.module.css";
import Loader from "./Loader";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { convertUnixTimestampToDate, timeSince } from "../utils/etc";
import { Badge, Box, Icon } from "@chakra-ui/react";
import GenerateSection from "./GenerateSection";
import { CloseIcon } from "@chakra-ui/icons";

const Log = () => {

  const { data: properties, isLoading: isPropertiesLoading } = useProperties();

  const [ openedCard, setOpenedCard ] = useState<null | number>(null);

  const handleCardClick = (index: number) => {
    // const selection = window.getSelection();
    // if (!selection || selection.toString().length === 0) {
      setOpenedCard(prevIndex => prevIndex === index ? index : index);
    // }
  };

  const handleCardClose = () => {
    setOpenedCard(null);
  }

  return (
    <>
      <div style={{marginTop: '5vh', width: '100%'}}>
        { 
          properties ? properties.map( (property: any, index: number) => {
            return (
              <div key={index} className={styles.cardWrapper} onClick={() => handleCardClick(index)}>
                <PropertyInfoCard isOpen={openedCard === index ? true : false} property={property} closeCard={handleCardClose} />
              </div>
            )
          }) : <Loader />
        }
      </div>
    </>
  )
}

export default Log;

const PropertyInfoCard = ({ isOpen, property, closeCard }: { isOpen: boolean, property: any, closeCard: any }) => {

  const { data: propertyInfo, isLoading: isPropertyInfoLoading } = usePropertyInfo(property._id);

  const [ isTranscriptionsOpen, setIsTranscriptionsOpen ] = useState(false);
  const toggleIsTranscriptionsOpen = () => setIsTranscriptionsOpen(!isTranscriptionsOpen);

  const [ isDescriptionsOpen, setIsDescriptionsOpen ] = useState(false);
  const toggleIsDescriptionsOpen = () => setIsDescriptionsOpen(!isDescriptionsOpen);

  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);

  const [ tabSelected, setTabSelected ] = useState<string>('transcripts');

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
  };

//   const [ propertyInfo, setPropertyInfo ] = useState<any>(null);

  useEffect(() => {
    if (propertyInfo) {
      const max_unix_ts = Math.max(
        ...propertyInfo.transcripts.map((t: any) => t.upload_time),
        ...propertyInfo.descriptions.map((d: any) => d.upload_time)
      )

      if (propertyInfo.transcripts.length + propertyInfo.descriptions.length > 0 ) {
        const latestUploadDate = new Date(max_unix_ts * 1000);
        setLastUpdated(latestUploadDate);
      }
    }
  }, [propertyInfo]);

//   useEffect(() => {
//     const eventSource = new EventSource(`/api/sse?propertyId=${property._id}`);
//     eventSource.onmessage = function(event) {
//       const data = JSON.parse(event.data);
//       setPropertyInfo(data);
//     };
//     return () => {
//       eventSource.close();
//     };
// }, [property]);

  return (
    <>
      <div className={`${styles.propertyBox} ${isOpen ? styles.openedPropertyBox : ''}` }>
        <div className={styles.closedCardRow}>
          <div className={styles.side}>
            <h1 className={theme.propName}>{property.property_name}</h1>
            <p>Agent: <strong>{property.agent}</strong></p>
          </div>
          <div className={styles.sideLeft}>
            {/* { isOpen && <CloseIcon onClick={() => closeCard()} boxSize={12} />} */}
            { lastUpdated && <><div>Last modified: </div><Badge p={2} fontSize={12} bg={'var(--primary-gradient)'} color={'var(--primary-white)'} borderRadius={'30px'} variant='solid' mb={1}>{timeSince(lastUpdated)}</Badge></>}
            { propertyInfo && !lastUpdated && <div>{"No modifications"}</div> }
          </div>
        </div>
          {
            isOpen ? 
              <>
                {!propertyInfo && <Loader />}

                {propertyInfo && (
                  <>
                    <Box
                      mt={'4vh'}
                      display={'flex'}
                      justifyContent={'space-around'}
                      alignItems={'center'}
                      flexDir={'row'}
                    >
                      <ActionSelector name={'Transcripts'} setTabSelected={setTabSelected} isSelected={tabSelected === 'transcripts'} />
                      <ActionSelector name={'Generate'} setTabSelected={setTabSelected} isSelected={tabSelected === 'generate'} />
                      <ActionSelector name={'Results'} setTabSelected={setTabSelected} isSelected={tabSelected === 'results'} />
                    </Box>
                  </>
                )}
              </>
            : (
              <></>
            )
          }
      </div>
    {
      propertyInfo && isOpen &&
        <>
        <Box
          w={'100%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDir={'column'}
        >
          <ActionDropdown tabSelected={tabSelected} propertyId={property._id} propertyInfo={propertyInfo} />
        </Box>
      {/* {propertyInfo.descriptions && 
            <div>
              <h2 className={styles.sectionTitle}>Descriptions: ({propertyInfo.descriptions.length})</h2>
              <div className={styles.listContainer}>
                {propertyInfo.descriptions.map((desc: any, index: number) => (
                  <div key={index} className={styles.dataBox}>
                    <h1 className={styles.index}>{index + 1}.</h1>
                    <div className={styles.content}>
                      <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(desc.upload_time)}</h3>
                      <div className={styles.textResult}>{desc.descriptions}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } */}
        </>
    }
    </>
  );
}

const ActionSelector = ({ name, isSelected, setTabSelected } : { name: string, isSelected: boolean, setTabSelected: Dispatch<SetStateAction<string>>}) => {
  return (
    <>
      <div 
        className={`${styles.tabSelect} ${isSelected ? styles.tabSelected : ''}`} 
        onClick={(e) => {
          setTabSelected(name.toLowerCase());
        }}
      >
        <h1>{name}</h1>
      </div>
    </>
  )
}

const ActionDropdown = ({ tabSelected, propertyId, propertyInfo }: {tabSelected: string, propertyId: string, propertyInfo: any}) => {
  return (
    <>
      { tabSelected && (
        <Box
          className={styles.propertyDropdown}
          w={'95%'}
        >
          { tabSelected === 'transcripts' && <TranscriptTab propertyId={propertyId} propertyInfo={propertyInfo} />}
          { tabSelected === 'generate' && <GenerateTab propertyId={propertyId} propertyInfo={propertyInfo} />}
          { tabSelected === 'results' && <ResultsTab propertyId={propertyId} propertyInfo={propertyInfo} />}
        </Box>
      )}
    </>
  )
}


const TranscriptTab = ({ propertyId, propertyInfo }: {propertyId: string, propertyInfo: any}) => {
  const [edits, setEdits] = useState<Map<number, string>>(new Map());
  const [lastEdited, setLastEdited] = useState<null | number>(null);

  const handleContentEdit = (index: number, event: React.FocusEvent<HTMLDivElement>) => {
    const updatedTranscription = event.target.innerText;
    setLastEdited(index)
    setEdits(prev => new Map(prev).set(index, updatedTranscription));
  };

  const saveTranscriptionEdit = async (index: number) => {
    if (edits.has(index)) {
      const newData = edits.get(index);

      const response = await fetch(`/api/save`, {
        method: 'POST',
        body: JSON.stringify({ newData, collection: 'transcripts', id: propertyInfo.transcripts[index]._id, key: 'transcription' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error("Error saving edit:", await response.json());
      }
    }
  };

  useEffect(() => {
    if (lastEdited !== null ) {
      saveTranscriptionEdit(lastEdited);
    }
  }, [lastEdited ]);

  return (
    <>
      {propertyInfo.transcripts &&
        <div>
          <h2 className={styles.sectionTitle}>Transcripts: ({propertyInfo.transcripts.length})</h2>
          <div className={styles.listContainer}>
            {propertyInfo.transcripts.slice().reverse().map((transcript: any, index: number) => (
              <div key={index} className={styles.dataBox}>
                <h1 className={styles.index}>{propertyInfo.transcripts.length - index }.</h1>
                <div className={styles.content}>
                  <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(transcript.upload_time)} <Badge ml={3} bg={'var(--primary-gradient)'} color={'var(--primary-white)'} borderRadius={'30px'} variant='solid' mb={1}>{timeSince(new Date(transcript.upload_time * 1000))}</Badge></h3>
                  <div
                    className={styles.textResult}
                    contentEditable={true}
                    onBlur={(e) => handleContentEdit(propertyInfo.transcripts.length - index - 1, e)}
                    dangerouslySetInnerHTML={{ __html: edits.get(propertyInfo.transcripts.length - index - 1) || transcript.transcription }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
};

const GenerateTab = ({ propertyId, propertyInfo }: {propertyId: string, propertyInfo: any}) => (
  <GenerateSection propertyId={propertyId} />
)

const ResultsTab = ({ propertyId, propertyInfo }: {propertyId: string, propertyInfo: any}) => (
  <>
    {propertyInfo.descriptions && 
      <div>
        <h2 className={styles.sectionTitle}>Description Results: ({propertyInfo.descriptions.length})</h2>
        <div className={styles.listContainer}>
          {propertyInfo.descriptions.slice().reverse().map((description: any, index: number) => (
            <div key={index} className={styles.dataBox}>
              <h1 className={styles.index}>{propertyInfo.descriptions.length - index}.</h1>
              <div className={styles.content}>
              <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(description.upload_time)} <Badge ml={3} bg={'var(--primary-gradient)'} color={'var(--primary-white)'} borderRadius={'30px'} variant='solid' mb={1}>{timeSince(new Date(description.upload_time * 1000))}</Badge></h3>
                <div className={styles.textResult}>{description.descriptions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  </>
)
