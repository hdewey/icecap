import { useQuery } from "react-query";
import { getPropertyInfo } from "./usePropertyInfo";

export default function useResults(propertyId: string) {
  return useQuery(['results', propertyId], async () => {
    const propertyInfo = await getPropertyInfo(propertyId);
    return propertyInfo.descriptions;
  });
}