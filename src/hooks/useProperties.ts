import { useQuery, UseQueryResult } from 'react-query';
import { useSession } from './useSession';

async function getProperties(session?: any): Promise<any> {
  if (!session) {
    throw new Error("No session");
  }

  const res = await fetch(`/api/properties`, {
    headers: {
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    }
  });
  
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  return data.properties;
}

function useProperties(): UseQueryResult<any, Error> {
  const { session, status } = useSession();
  return useQuery('properties', () => getProperties(session), {
    refetchInterval: 3000,
    enabled: status === 'authenticated',  // only run the query if the user is authenticated
  });
}
export default useProperties;
