import React from 'react';
import { ChakraProvider, Box, Flex, IconButton, useDisclosure, HStack, Link, Spacer } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
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
          {/* Hamburger Icon for Mobile */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          {/* Logo */}
          <Link as={RouterLink} to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: 'lg' }}>
            MyLogo
          </Link>

          {/* SearchBar or Search Icon */}
          <Box flex="1" textAlign="center">
            <SearchBar />
          </Box>

          {/* Login and Cart */}
          <Flex alignItems="center" ml="auto">
            {user ? (
              <>
                <Text color="white" mr={4}>Welcome, {user.name}</Text>
                <Button variant="link" color="white" onClick={() => Logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <LoginForm />
            )}
            <Cart />
          </Flex>
        </Flex>

        {/* Responsive Navigation Links */}
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <NavLinks />
          </Box>
        ) : null}
      </Box>
    </ChakraProvider>
  );
};

export default Navbar;
