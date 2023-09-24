import { Skeleton } from "@chakra-ui/react"

const CustomSkeleton = ({ isLoaded, children }: { isLoaded: boolean, children: any }) => {
  return (
    <Skeleton isLoaded={isLoaded} borderRadius={"30px"} startColor='primary.white' endColor='primary.light'>
      { children }
    </Skeleton>
  )
}

export default CustomSkeleton;