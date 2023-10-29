import { useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Box, Text, Button, Skeleton } from "@chakra-ui/react"
import { useEffect } from "react";

const SmartStepper = ({ stepperState }: { stepperState: any }) => {

  const steps = [
    { title: 'create', description: '' },
    { title: 'describe', description: '' },
    { title: 'results', description: '' },
  ]

  const { activeStep, setActiveStep } = useSteps({
    index: stepperState,
    count: steps.length,
  })

  useEffect(() => {
    if (stepperState) {
      setActiveStep(stepperState.step);
    }
  }, [ stepperState ])
  
  return (
    <>
      {
        stepperState && 
          <Stepper index={activeStep} colorScheme={"blackAlpha"} p={3} w={["100px", null, "300px", "500px"]}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator
                  w="24px"
                  h="24px"
                  borderRadius="50%"
                  border={"none"}
                  boxShadow={"var(--box-shadow)"}
                  bg={index < activeStep ? "black" : index === activeStep ? "": "transparent"}
                  bgGradient={index === activeStep ? "primaryGradient" : ""}
                >
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>
                    <Text w={['50px', null, null, '80px']} textTransform={index === activeStep ? 'uppercase' : 'lowercase'} fontWeight={index === activeStep ? 'bold' : 'normal'}>{step.title}</Text>
                  </StepTitle>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
      }
      
    </>
  );
};

export default SmartStepper;