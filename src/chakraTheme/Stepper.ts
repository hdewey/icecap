import { ThemeOverride } from "@chakra-ui/react";

export const Stepper: ThemeOverride = {
  components: {
    Stepper: {
      variants: {
        SmartStepper: {
        }
      }
    }
  }
};


// const TabsOverrides = {
//   components: {
//     Tabs: {
//       variants: {
//         unstyled: {
//           tablist: {
//             borderBottom: "none",
//             mb: "1em",
//           },
//           tab: {
//             borderBottomRadius: 'var(--border-radius)',
//             _hover: {
//               background: 'var(--primary-light)',
//             },
//             _selected: {
//               background: 'var(--primary-dark)',
//               color: 'var(--primary-white)',
//             },
//           },
//           tabIndicator: {
//             border: "none", 
//           },
//         },
//       },
//     },
//   },
// };
