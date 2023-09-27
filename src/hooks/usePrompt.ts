import { useQuery } from 'react-query';
import { useSession } from './useSession';

export default function usePrompt(id: string | undefined) {
  const { session } = useSession();

  const jwt = (session as any)?.accessToken;
  
  return useQuery(['prompt', id], () => getPrompt(id, jwt));
}

async function getPrompt(id: string | undefined, jwt: string | undefined) {

  const headers = {
    'Authorization': `Bearer ${jwt}`
  };

  const response = await fetch(`/api/prompt/${id}`, { method: "GET", headers });

  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }

  const data = await response.json();

  return data.prompts;
}