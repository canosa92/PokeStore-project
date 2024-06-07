import React from 'react';
import { ChakraProvider, Box, Flex, HStack, IconButton, useDisclosure, Stack, Text, Button } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import Cart from './Cart/Cart.jsx';
import SearchBar from './SearchBar/SearchBar.jsx';
import LoginForm from './LoginForm/LoginForm.jsx';
import NavLinks from './NavLinks/NavLinks.jsx';

const Navbar = () => {
  const { user, Logout } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Box bg="gray.800" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
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
          <Flex alignItems="center">
            <Box display={{ base: 'none', md: 'block' }}>
              <SearchBar />
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
              <IconButton
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="ghost"
                aria-label="Search Pokémon"
                color="white"
              />
            </Box>
            <Box ml={4}>
              {user ? (
                <>
                  <Text color="white">Welcome, {user.name}</Text>
                  <Button variant="link" color="white" onClick={() => Logout()}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <LoginForm />
              )}
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
    </ChakraProvider>
  );
};

export default Navbar;
