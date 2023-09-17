import { useState } from 'react';
import styles from '../styles/GenerateForm.module.css';
import theme from '../styles/theme.module.css';

const CreatePropertyForm = () => {
  const [propertyName, setPropertyName] = useState<string>('');
  const [agent, setAgent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [propertyAdded, setPropertyAdded] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPropertyAdded(false);

    if (!propertyName || !agent) {
      alert('Both property name and agent are required.');
      return;
    }
  
    try {
      const response = await fetch('/api/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyName, agent }),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }
  
      const data = await response.json();
  
      if (data.insertedId) {
        setPropertyAdded(true);
        setPropertyName('');
        setAgent('');
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
        <input
          className={theme.textInput}
          type="text"
          placeholder="Property Name"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
        />
        <input
          className={theme.textInput}
          type="text"
          placeholder="Agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
        />
        <button className={theme.submitButton} type="submit">Create Property</button>
      </form>
      {
        propertyAdded && <p>Property successfully added!</p>
      }
    </>
  );
}

export default CreatePropertyForm;