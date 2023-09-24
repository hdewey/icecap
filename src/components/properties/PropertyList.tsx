import { useState } from "react";
import useProperties from "../../hooks/useProperties";
import Loader from "../Loader";
import PropertyCard from "./PropertyCard";

const PropertyList = () => {

  const { data: properties, isLoading: isPropertiesLoading } = useProperties();

  return (
    <>
      <div style={{marginTop: '5vh', width: '100%'}}>
        { 
          properties ? properties.map( (property: any, index: number) => {
            return (
              <PropertyCard propertyId={property._id} key={index} />
            )
          }) : <Loader />
        }
      </div>
    </>
  )
}

export default PropertyList;