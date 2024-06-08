import React from 'react';
import { Box, Flex, IconButton, useDisclosure, VStack, Text, Button } from '@chakra-ui/react';
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

  return (
    <>
      <Box bg="gray.800" px={4} py={2}>
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
            {!isOpen && ( // Solo muestra el formulario de inicio de sesión si el menú no está abierto
              <Box display={{ base: 'none', md: 'block' }}>
                <SearchBar />
              </Box>
            )}
            <Box display={{ base: 'block', md: 'none' }}>
              <IconButton
                icon={<SearchIcon />}
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
                <LoginForm isOpen={isOpen} onClose={onClose} />
              )}
            </Box>
            <Cart />
          </Flex>
        </Flex>

        {isOpen && (
          <VStack p={2} pb={4} display={{ md: 'none' }} alignItems="flex-start">
            <NavLinks />
          </VStack>
        )}
      </Box>
    </>
  );
};

export default Navbar;
