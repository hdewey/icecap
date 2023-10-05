import { useQuery } from 'react-query';
import { Property } from '../utils/types';
import { useSession } from './useSession';

export default function usePropertyInfo(propertyId: string) {
  const { session } = useSession();

  // const jwt = session.accessToken;
  const jwt = "DISABLED"

  return useQuery(['property', propertyId], () => getPropertyInfo(propertyId, jwt));
}

async function getPropertyInfo(propertyId: string, jwt: string | undefined): Promise<any> {
  const headers: HeadersInit = jwt ? { 'Authorization': `Bearer ${jwt}` } : {};
  const response = await fetch(`/api/propertyInfo/${propertyId}`, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch property info');
  }

  const data = await response.json();
  return data;
}
