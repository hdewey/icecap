import { useState } from 'react';
import theme from '../styles/theme.module.css';
import { Button, Spinner, Text } from '@chakra-ui/react';

const CreatePropertyForm = () => {
  const [propertyName, setPropertyName] = useState<string>('');
  const [agent, setAgent] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [propertyAdded, setPropertyAdded] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!propertyName || !agent) {
      alert('Both property name and agent are required.');
      return;
    }

    setPropertyAdded(false);
    setLoading(true);
  
    try {
      const response = await fetch('/api/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyName, agent }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to create property");
      }
  
      const data = await response.json();
  
      if (data.insertedId) {
        setPropertyAdded(true);
        setPropertyName('');
        setAgent('');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('An error occurred while creating the property. Please try again.');
    }
  };

  return (
    <>
      <form className={theme.form} onSubmit={handleSubmit}>
        
        <div className={theme.stack}>
          <Text textStyle={"h3"} className={theme.inputTitle}>Property Name:</Text>
          <input
            className={theme.textInput}
            type="text"
            placeholder="Property Name"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
          <Text textStyle={"h3"} className={theme.inputTitle}>Agent:</Text>
          <input
            className={theme.textInput}
            type="text"
            placeholder="Agent"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
          />
        </div>
        <Button
          type='submit'
          mt={5}
          bg={"var(--primary-dark)"}
          color={"var(--primary-white)"}
          transition={"all ease 0.3s"}
          border={"var(--border)"}
          _hover={{
            bg: "var(--primary-white)",
            color: "var(--primary-dark)",
            border: "var(--border)",
          }}
          borderRadius={"30px"}
          p={5}
          py={6}
        >
          { isLoading ? <Spinner />  : <Text textStyle={"h3"}>Create Property</Text> } 
        </Button>
      </form>
      {
        propertyAdded && <Text p={4} textStyle={'h3'}>Property added!</Text>
      }
    </>
  );
}

export default CreatePropertyForm;