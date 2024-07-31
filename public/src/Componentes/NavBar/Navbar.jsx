import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  VStack,
  Text,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import { FaUserAlt } from "react-icons/fa";
import Cart from './Cart/Cart.jsx';
import SearchBar from './SearchBar/SearchBar.jsx';
import LoginForm from './LoginForm/LoginForm.jsx';
import NavLinks from './NavLinks/NavLinks.jsx';

const Navbar = () => {
  const { user, logout } = useUser();
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
                <Button variant="link" color="white" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Menu isOpen={isProfileOpen} marginRight={15}>
                <MenuButton
                  as={IconButton}
                  icon={<FaUserAlt />}
                  variant="outline"
                  onClick={handleProfileToggle}
                  aria-label="User menu"
                  color="black"
                  bg="white"
                />
                <MenuList>
                  <Box p={4} bg="white">
                    <LoginForm isOpen={isProfileOpen} onClose={onProfileClose} />
                  </Box>
                </MenuList>
              </Menu>
            )}
          </Box>
          <Cart />
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
