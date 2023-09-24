import { ThemeOverride } from "@chakra-ui/react";

const ButtonOverrides: ThemeOverride = {
    Button: {
      variants: {
        custom: {
          bg: '#000',
          _hover: {
            background: 'var(--primary-light)',
            borderColor: 'var(--primary-light)',
            boxShadow: 'var(--box-shadow)',

          },
          _active: {
            background: 'var(--primary-dark)',
            borderColor: 'var(--primary-dark)',
            color: 'var(--primary-white)',
            boxShadow: 'var(--box-shadow)',

          },
          _focus: {
            boxShadow: 'var(--box-shadow)',
          },
        },
      },
    },
};

export default ButtonOverrides;