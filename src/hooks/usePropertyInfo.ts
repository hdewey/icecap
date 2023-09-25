import { useQuery } from 'react-query';
import { Property } from '../utils/types';

export default function usePropertyInfo(propertyId: string) {
  return useQuery(['property', propertyId], () => getPropertyInfo(propertyId));
}

export async function getPropertyInfo(propertyId: string): Promise<Property> {
  const response = await fetch(`/api/${propertyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch property info');
  }
  const data = await response.json();
  return data.property;
}