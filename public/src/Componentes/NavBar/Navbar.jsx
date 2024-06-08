import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, HStack, IconButton, useDisclosure, Stack, Text, Button } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import Cart from './Cart/Cart.jsx';
import SearchBar from './SearchBar/SearchBar.jsx';
import LoginForm from './LoginForm/LoginForm.jsx';
import NavLinks from './NavLinks/NavLinks.jsx';

const Navbar = () => {
  const { user, Logout } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    if (!searchOpen) {
      onClose(); // Cerrar NavLinks si se abre SearchBar
    }
    setSearchOpen(!searchOpen);
  };

  const handleNavLinksToggle = () => {
    if (!isOpen) {
      setSearchOpen(false); // Cerrar SearchBar si se abre NavLinks
    }
    isOpen ? onClose() : onOpen();
  };

  return (
    <>
      <Box bg="gray.800" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={handleNavLinksToggle}
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: 'lg' }}>
                PokeStore
              </Link>
            </Box>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLinks />
            </HStack>
          </HStack>
          <Flex alignItems="center" flex="1" justifyContent="center">
            <Box display={{ base: 'none', md: 'block' }}>
              <SearchBar />
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Box display={{ base: 'block', md: 'none' }}>
              <IconButton
                icon={<SearchIcon />}
                onClick={handleSearchToggle}
                variant="ghost"
                aria-label="Search Pokémon"
                color="white"
              />
              {searchOpen && (
                <Box position="absolute" top="60px" left="0" right="0" bg="gray.800" p={4} zIndex={10}>
                  <SearchBar isMobile />
                </Box>
              )}
            </Box>
            <Box ml={4}>
              <LoginForm />
            </Box>
            <Cart />
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              <NavLinks />
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
