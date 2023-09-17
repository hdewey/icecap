import useProperties from "../hooks/useProperties";
import usePropertyInfo from "../hooks/usePropertyInfo";
import theme from '../styles/theme.module.css';

import styles from "../styles/Log.module.css";
import Loader from "./Loader";
import { useState } from "react";

const Log = () => {

  const { data: properties, isLoading: isPropertiesLoading } = useProperties();

  const [ openedCard, setOpenedCard ] = useState<null | number>(null);

  return (
    <>
      <div style={{marginTop: '5vh', width: '100%'}}>
        { 
          properties ? properties.map( (property: any, index: number) => {
            return (
              <div key={index} className={styles.cardWrapper} onClick={() => setOpenedCard(index)}>
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

  function convertUnixTimestampToDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); 
    return `${date.toDateString()} ${date.toTimeString().split(' ')[0]}`; 
  }

  return (
    <div className={styles.propertyBox}>
        <div className={styles.statusRow}>
          <h2 className={styles.propertyName}>{property.property_name}</h2>
          <h2>{property.agent}</h2>
        </div>
        {
          propertyInfo && isOpen ?
            <>
              { propertyInfo.transcripts && 
                <div>
                  <h2>Transcriptions: ({propertyInfo.transcripts.length})</h2>
                  <div className={styles.listContainer}>
                    {propertyInfo.transcripts.map((transcript: any, index: number) => (
                      <>
                        <h1 className={styles.taskNumber}>{index + 1}</h1>

                        <div key={index} className={styles.dataBox}>
                          <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(transcript.upload_time)}</h3>
                          <div className={styles.textResult}>{transcript.transcription}</div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              }

              { propertyInfo.descriptions && 
                <div>
                  <h2>Descriptions: ({propertyInfo.descriptions.length})</h2>
                  <div className={styles.listContainer}>
                    {propertyInfo.descriptions.map((desc: any, index: number) => (
                      <>
                        <h1 className={styles.taskNumber}>{index + 1}</h1>

                        <div key={index} className={styles.dataBox}>
                          <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(desc.upload_time)}</h3>
                          <div className={styles.textResult}>{desc.descriptions}</div>
                        </div>
                      </>
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
