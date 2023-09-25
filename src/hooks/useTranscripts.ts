import { useQuery } from "react-query";
import { getPropertyInfo } from "./usePropertyInfo";

export default function useTranscripts(propertyId: string) {
  return useQuery(['transcripts', propertyId], async () => {
    const propertyInfo = await getPropertyInfo(propertyId);
    return propertyInfo.transcripts;
  });
}
