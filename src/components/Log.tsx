import useProperties from "../hooks/useProperties";
import usePropertyInfo from "../hooks/usePropertyInfo";
import theme from '../styles/theme.module.css';

import styles from "../styles/Log.module.css";
import Loader from "./Loader";

const Log = () => {

  const { data: properties, isLoading: isPropertiesLoading } = useProperties();

  return (
    <>
      <div style={{marginTop: '5vh', width: '100%'}}>
        { 
          properties ? properties.map( (property: any, index: number) => {
            return <PropertyInfoCard key={index} property={property} />
          }) : <Loader />
        }
      </div>
    </>
  )
}

export default Log;

const PropertyInfoCard = ({ property }: { property: any }) => {

  const { data: propertyInfo, isLoading: isPropertyInfoLoading } = usePropertyInfo(property._id);

  function convertUnixTimestampToDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return `${date.toDateString()} ${date.toTimeString().split(' ')[0]}`; // Format to full date and time
  }

  return (
    <div className={styles.propertyBox}>
        <div className={styles.statusRow}>
          <h2 className={styles.propertyName}>{property.property_name}</h2>
          <h2>{property.agent}</h2>
        </div>
        {
          propertyInfo ?
            <>
              { propertyInfo.transcripts && 
                <div>
                  <h3>Transcriptions: ({propertyInfo.transcripts.length}) </h3>
                  <ul className={styles.listContainer}>
                    {propertyInfo.transcripts.map((transcript: any, index: number) => (
                      <li key={index} className={styles.dataBox}>
                        <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(transcript.upload_time)}</h3>
                        <div className={styles.textResult}>{transcript.transcription}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              }

              { propertyInfo.descriptions && 
                <div>
                  <h3>Descriptions: ({propertyInfo.descriptions.length})</h3>
                  <ul className={styles.listContainer}>
                    {propertyInfo.descriptions.map((desc: any, index: number) => (
                      <li key={index} className={styles.dataBox}>
                        <h3 className={styles.timestampHeader}>{convertUnixTimestampToDate(desc.upload_time)}</h3>
                        <div className={styles.textResult}>{desc.descriptions}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </>
          : <Loader />
        }
    </div>
  );
}
