import { useQuery } from 'react-query';

export default function usePrompt(id: string | undefined) {
  return useQuery(['prompt', id], () => getPrompt(id));
}

async function getPrompt(id: string | undefined) {
  if (!id) {
    return
  }
  const response = await fetch('/api/prompts');
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  const data = await response.json();
  return data.prompts;
}
