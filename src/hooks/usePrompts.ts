import { useQuery } from 'react-query';

export default function usePrompts() {
  return useQuery('prompts', getPrompts);
}

async function getPrompts() {
  const response = await fetch('/api/prompts');
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  const data = await response.json();
  return data.prompts;
}
