import { useQuery, UseQueryResult } from 'react-query';
import { useSession } from './useSession';

async function getProperties(session: any, email: string): Promise<any> {
  if (!session) {
    throw new Error("No session");
  }

  const filled_email = email ? email : '';

  const res = await fetch(`/api/properties?${email ? `email=${encodeURIComponent(filled_email)}` : ''}`, {
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

function useProperties(email: string = ''): UseQueryResult<any, Error> {
  const { session, status } = useSession();

  return useQuery(`properties ${email}`, () => getProperties(session, email), {
    refetchInterval: 3000,
    enabled: status === 'authenticated',  // only run the query if the user is authenticated
  });
}
export default useProperties;
