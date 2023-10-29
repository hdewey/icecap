import { ThemeOverride } from "@chakra-ui/react";

const TabsOverrides: ThemeOverride = {
  components: {
    Tabs: {
      variants: {
        unstyled: {
          tablist: {
            borderBottom: "none",
            mb: "1em",
          },
          tab: {
            borderBottomRadius: 'var(--border-radius)',
            _hover: {
              background: 'var(--primary-light)',
            },
            _selected: {
              background: 'var(--primary-dark)',
              color: 'var(--primary-white)',
            },
          },
          tabIndicator: {
            border: "none", 
          },
        },
      },
    },
  },
};

export default TabsOverrides;
