import React, { useState, useEffect } from 'react';
import styles from '../../styles/Header.module.css';
import ActiveLink from './ActiveLink';
import Link from 'next/link';
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';import { useSession } from '../../hooks/useSession';
import { signOut } from 'next-auth/react';

const pages = [
  { name: 'create', path: '/create' },
  { name: 'record', path: '/record' },
  { name: 'properties', path: '/properties' }
];

const Header = ({ title, noNav = false, }: { title: string, noNav?: boolean; }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);

  const breakpoint = useBreakpointValue({ base: "base", md: "md" }); 

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
      const handleScroll = () => {
          const offsetY = window.scrollY;
          if (offsetY > (headerHeight)) {
              setIsScrolled(true);
          } else {
              setIsScrolled(false);
          }
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`${styles.container} ${isScrolled ? styles.containerScrolled : ''}`}>
        <div className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`} ref={headerRef}>
          <Link href="/"><Text fontFamily={"Lexend"} textStyle={"h1"} fontSize={"4rem"}>{title}</Text></Link>
          {
            !noNav && (breakpoint === "md" ? <DesktopNav /> : <MobileNav isOpen={isOpen} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)} />)
          }
        </div>
      </div>
      <Box style={{ height: (headerHeight * 1.5) + "px", width: "100vw", background: 'var(--primary-white)'}} zIndex={-1}></Box>
    </>
  );
};
export default Header;

const DesktopNav = () => {
  const session = useSession();

  return (
    <Flex className={styles.desktopNav}>
      { session.status === 'authenticated' && <Text onClick={() => signOut({callbackUrl: "/"})} _hover={{cursor: 'pointer'}}>sign out</Text>}
      {pages.map((page) => (
        <ActiveLink key={page.path} href={page.path} activeClassName={styles.activeLink}>
          <Text color="var(--primary-dark)" mr={4} >
            {page.name}
          </Text>
        </ActiveLink>
      ))}
    </Flex>
  );
}

const MobileNav = ({ isOpen, onOpen, onClose }: { isOpen: boolean, onOpen: () => void, onClose: () => void }) => {
  const session = useSession();

  return (
    <>
      <Button 
        onClick={onOpen} 
        variant="unstyled" 
        p={2}
        _hover={{
            backgroundColor: "var(--primary-dark)"
        }}
      >
        <HamburgerIcon 
            color="var(--primary-dark)" 
            _hover={{
                color: "var(--primary-white)"
            }} 
            boxSize={10} 
        />
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerBody bgColor={"var(--primary-white)"} h={'100%'}>
              <VStack spacing={10} my={'10vh'} >
              { session.status === 'authenticated' && <Text onClick={() => signOut({callbackUrl: "/"})} _hover={{cursor: 'pointer'}}>sign out</Text>}
                {pages.map((page) => (
                  <ActiveLink key={page.path} href={page.path} activeClassName={styles.activeLink}>
                    <Text onClick={onClose}>
                      {page.name}
                    </Text>
                  </ActiveLink>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
