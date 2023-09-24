import { ThemeOverride } from "@chakra-ui/react";

const TextStylesOverrides: ThemeOverride = {
  textStyles: {
    h1: {
      fontSize: "2.25rem", 
      fontWeight: "bold",
    },
    h2: {
      fontSize: "1.875rem",  
      fontWeight: "semibold",
    },
    h3: {
      fontSize: "1.3rem",  
      fontWeight: "medium",
    },
    p: {
      fontSize: "1.2rem", 
      fontWeight: "normal",
    },
    dataText: {
      fontSize: "0.75rem",  
      fontWeight: "light",
      color: "gray.600",  
      background: "primary.gradient",
      padding: "0.25rem",
      bgClip: "text",
    },
  },
};

export default TextStylesOverrides;