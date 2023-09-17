import { useQuery } from 'react-query';

export default function useProperties() {
  return useQuery('properties', getProperties);
}

async function getProperties() {
  const response = await fetch('/api/properties');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  const data = await response.json();
  return data.properties;
}
