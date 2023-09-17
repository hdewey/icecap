import useProperties from "../hooks/useProperties";
import usePropertyInfo from "../hooks/usePropertyInfo";
import theme from '../styles/theme.module.css';

import styles from "../styles/Log.module.css";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { timeSince } from "../utils/etc";

const Log = () => {

  const { data: properties, isLoading: isPropertiesLoading } = useProperties();

  const [ openedCard, setOpenedCard ] = useState<null | number>(null);

  const handleCardClick = (index: number) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setOpenedCard(prevIndex => prevIndex === index ? null : index);
    }
  };


  return (
    <>
      <div style={{marginTop: '5vh', width: '100%'}}>
        { 
          properties ? properties.map( (property: any, index: number) => {
            return (
              <div key={index} className={styles.cardWrapper} onClick={() => handleCardClick(index)}>
                <PropertyInfoCard isOpen={openedCard === index ? true : false} property={property} />
              </div>
            )
          }) : <Loader />
        }
      </div>
    </>
  )
}

export default Log;

const PropertyInfoCard = ({ isOpen, property }: { isOpen: boolean, property: any }) => {

  const { data: propertyInfo, isLoading: isPropertyInfoLoading } = usePropertyInfo(property._id);

  const [ isTranscriptionsOpen, setIsTranscriptionsOpen ] = useState(false);
  const toggleIsTranscriptionsOpen = () => setIsTranscriptionsOpen(!isTranscriptionsOpen);

  const [ isDescriptionsOpen, setIsDescriptionsOpen ] = useState(false);
  const toggleIsDescriptionsOpen = () => setIsDescriptionsOpen(!isDescriptionsOpen);

  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);

  const handleMouseDown = (e: any) => {
    e.stopPropagation();
  };

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
  }, [propertyInfo])

  function convertUnixTimestampToDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); 
    return `${date.toDateString()} ${date.toTimeString().split(' ')[0]}`; 
  }

  return (
    <div className={styles.propertyBox} onMouseDown={handleMouseDown}>
      <div className={styles.closedCardRow}>
        <div>
          <h1>{property.property_name}</h1>
          <p>Agent: {property.agent}</p>
        </div>
        <div>
          {/* {convertUnixTimestampToDate(property.uploaded_at)} */}
          { lastUpdated && <div>Last modified: {timeSince(lastUpdated)}</div> }
          { propertyInfo && !lastUpdated && <div>{"No modifications"}</div> }
        </div>
      </div>
        {/* {
          !isOpen ? 
            <>
            </>
          : (
            <>
            </>
          )
        } */}
        {
          propertyInfo && isOpen ?
            <>
              {propertyInfo.transcripts && 
                <div>
                  <h2 className={styles.sectionTitle}>Transcriptions: ({propertyInfo.transcripts.length})</h2>
                  <div className={styles.listContainer}>
                    {propertyInfo.transcripts.map((transcript: any, index: number) => (
                      <div key={index} className={styles.dataBox}>
                        <h1 className={styles.index}>{index + 1}.</h1>
                        <div className={styles.content}>
                          <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(transcript.upload_time)}</h3>
                          <div className={styles.textResult}>{transcript.transcription}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }

              {propertyInfo.descriptions && 
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
              }
            </>
          : isPropertyInfoLoading && <Loader />
        }
    </div>
  );
}
