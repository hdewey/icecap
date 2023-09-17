import useProperties from "../hooks/useProperties";
import usePropertyInfo from "../hooks/usePropertyInfo";

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
              <h3>Transcripts: ({propertyInfo.transcripts.length}) </h3>
              <ul>
                {propertyInfo.transcripts.map((transcript: any, index: number) => (
                  <li key={index}  className={styles.textResult}>{transcript.transcription}</li>
                ))}
              </ul>
            </div>}

            {propertyInfo.descriptions && <div>
              <h3>Descriptions: ({propertyInfo.descriptions.length})</h3>
              <ul>
                {propertyInfo.descriptions.map((desc: any, index: number) => (
                  <li key={index} className={styles.textResult}>{desc.descriptions}</li>
                ))}
              </ul>
            </div>}
          </>
        : <Loader />
      }
    </div>
  );
}
