import { useSession } from './useSession';

function useSave(): any {
  const { session, status } = useSession();

  const save = async (id: string, collection: string, key_name: string, newData: string) => {
    if (!session || status !== 'authenticated') {
      throw new Error("No session");
    }
  
    const res = await fetch(`/api/save`, {
      method: "POST",
      body: JSON.stringify({
        id, collection, key: key_name, newData
      }),
      headers: {
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) {
      console.log(res.statusText)
    }
  
    const data = await res.json();
  
    return data
  }

  return {
    save
  };
}
export default useSave;
