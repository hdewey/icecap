import { extendTheme } from "@chakra-ui/react";

import TabsOverrides from "./Tabs";
import TextStylesOverrides from "./TextStyles";
import ButtonOverrides from "./buttons";

const theme = extendTheme({
  colors: {
    primary: {
      dark: "var(--primary-dark)",
      gradient: "var(--primary-gradient)",
      white: "var(--primary-white)",
      light: "var(--primary-light)",
    }
  },
  ...TextStylesOverrides, 
  ...TabsOverrides,
  ButtonOverrides,
});

export default theme;