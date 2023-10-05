import { ThemeOverride } from '@chakra-ui/react';  // Ensure the correct import.

const TextStylesOverrides: ThemeOverride = {
  textStyles: {
    h1: {
      fontSize: "2.5rem", 
      fontWeight: 700, 
      fontFamily: "'Lexend', sans-serif",
    },
    h2: {
      fontSize: "1.875rem",  
      fontWeight: 600,
      fontFamily: "'Lexend', sans-serif",
    },
    h3: {
      fontSize: "1.3rem",  
      fontWeight: 500,
      fontFamily: "'Lexend', sans-serif",
    },
    p: {
      fontSize: "1.2rem", 
      fontWeight: 400,
      fontFamily: "'Inter', sans-serif",
    },
    dataText: {
      fontSize: "0.75rem",  
      fontWeight: 300,
      color: "gray.600",  
      background: "primary.gradient",
      padding: "0.25rem",
      bgClip: "text",
      fontFamily: "'Lexend', sans-serif",
    },
  },
};

export default TextStylesOverrides;