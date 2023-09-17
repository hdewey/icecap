import { useQuery } from 'react-query';

export default function usePropertyInfo(propertyId: string) {
  return useQuery(['property', propertyId], () => getPropertyInfo(propertyId));
}

async function getPropertyInfo(propertyId: string) {
  const response = await fetch(`/api/${propertyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch property info');
  }
  const data = await response.json();
  return data.property;
}