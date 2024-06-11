import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  VStack,
  Text,
  Button,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import { useCarrito } from '../../usecontext/CarritoContext.jsx';
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import Cart from './Cart/Cart.jsx';
import SearchBar from './SearchBar/SearchBar.jsx';
import LoginForm from './LoginForm/LoginForm.jsx';
import NavLinks from './NavLinks/NavLinks.jsx';

const Navbar = () => {
  const { user, setUser, login, logout } = useUser();
  const { carrito } = useCarrito();
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      onMenuClose();
    } else {
      onMenuOpen();
      onSearchClose();
      onProfileClose();
    }
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      onSearchClose();
    } else {
      onSearchOpen();
      onMenuClose();
      onProfileClose();
    }
  };

  const handleProfileToggle = () => {
    if (isProfileOpen) {
      onProfileClose();
    } else {
      onProfileOpen();
      onMenuClose();
      onSearchClose();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetch('http://localhost:2999/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            login(data.user, token);
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
        });
    }
  }, [user, setUser, login]);

  return (
    <>
      <Box bg="gray.800" px={4} py={2} width={'auto'}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={handleMenuToggle}
            bg="white"
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: 'lg' }}>
                PokeStore
              </Link>
            </Box>
            <Box display={{ base: 'none', md: 'block' }}>
              <NavLinks />
            </Box>
          </HStack>
          <Flex alignItems="center" flex="1" justifyContent={{ base: 'flex-end', md: 'center' }}>
            <Box flex="1" textAlign="center" display={{ base: 'none', md: 'block' }}>
              <SearchBar />
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
              <IconButton
                icon={<SearchIcon />}
                onClick={handleSearchToggle}
                variant="ghost"
                aria-label="Search Pokémon"
                color="white"
              />
            </Box>
            <Box ml={4} display="flex" alignItems="center" flexDirection={'column'} marginRight={15}>
              {user ? (
                <>
                  <Text color="white" mr={4} noOfLines={1} maxW="150px">Welcome, {user.name}</Text>
                  <Button variant="link" color="white" onClick={() => logout()}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <Box marginRight={15}>
                  <IconButton
                    icon={<FaUserAlt />}
                    variant="outline"
                    onClick={handleProfileToggle}
                    aria-label="User menu"
                    color="black"
                    bg="white"
                  />
                  {isProfileOpen && (
                    <Box p={4} bg="white">
                      <LoginForm isOpen={isProfileOpen} onClose={onProfileClose} />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Box position="relative" ml={4}>
              <IconButton
                icon={<FaShoppingCart />}
                variant="outline"
                onClick={isCartOpen ? onCartClose : onCartOpen}
                aria-label="Carrito"
                color="black"
                bg="white"
              />
              {carrito.length > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1"
                  right="-1"
                >
                  {carrito.length}
                </Badge>
              )}
              {isCartOpen && (
                <Box position="absolute" right={0} bg="white" p={4} borderRadius="md" boxShadow="md" mt={2} zIndex={10}>
                  <Cart />
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>

        {isMenuOpen && (
          <VStack p={2} pb={4} display={{ md: 'none' }} alignItems="flex-start">
            <NavLinks />
          </VStack>
        )}
        {isSearchOpen && (
          <Box display={{ base: 'block', md: 'none' }}>
            <SearchBar isMobile />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
