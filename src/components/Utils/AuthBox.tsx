import { useState } from 'react';

import { useSession } from "../../hooks/useSession";
import { signOut } from "next-auth/react";

import {
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  HStack,
  useDisclosure
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import ConfirmSignOut from '../Modals/Auth/LogoutModal';

const AuthBox = () => {
  const { session } = useSession();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
        <Menu>
          <MenuButton 
            as={Flex} 
            alignItems="center" 
            flexDirection={"row"} 
            justifyContent="center"
            gap={4}
            px={6}
            h={20}
            boxShadow="var(--box-shadow)"
            bgColor={"secondary"}
            cursor={'pointer'}
            >
           <HStack>
            <Box
              w={8}
              h={8}
              borderRadius="50%"
              bgGradient="linear-gradient(116deg, #453BB7 1.72%, #9DA2FF 89.93%)"
              display="inline-block"
            />
            <Text textStyle="h3" isTruncated maxWidth={["100px", null, null, "200px"]}>
              {(session?.user?.name ? session?.user?.name : session?.user?.email)}
            </Text>
            <ChevronDownIcon />
          </HStack>

          </MenuButton>
          <MenuList>
            <MenuItem isDisabled={true}>{session?.user?.email}</MenuItem>
            <MenuItem onClick={onOpen}>Sign Out</MenuItem>
          </MenuList>
        </Menu>

      <ConfirmSignOut isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default AuthBox;