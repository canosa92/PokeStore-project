import React from 'react';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem, Button, useDisclosure } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { useUser } from '../../../usecontext/UserContext';

const LoginForm = () => {
  const { user, Login, Logout } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        icon={<FiUser />}
        variant="outline"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      />
      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
        {user ? (
          <>
            <MenuItem>Welcome, {user.name}</MenuItem>
            <MenuItem onClick={() => Logout()}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => Login()}>Login</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default LoginForm;
