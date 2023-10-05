import { extendTheme } from "@chakra-ui/react";
import { Input } from "./Input";
import { Stepper } from "./Stepper";
import { Button } from "./Button";
import TextStyles from "./TextStyles";
import Tabs from "./Tabs";

const colors = {
  primary: "#030001",
  secondary: "#FFFFFF",
  tertiary: "#FAF9F6"
};

const gradients = {
  primaryGradient: "linear-gradient(116deg, #453BB7 1.72%, #9DA2FF 89.93%)",
};

const components = {
  Input,
  Stepper,
  Tabs,
  Button,
};

const theme = extendTheme({
  colors,
  gradients,
  components,
  ...TextStyles,
  styles: {
    global: {
      bg: {
        backgroundImage: gradients.primaryGradient
      }
    }
  }
});

export default theme;