import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useDisclosure, VStack, Link, Text, IconButton } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { useUser } from '../../../usecontext/UserContext';
import { Link as RouterLink } from 'react-router-dom';

const LoginForm = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:2999/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.user.token);
      setUser(data.user);
      onClose();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Box position="relative" onMouseLeave={onClose}>
      <IconButton
        icon={<FiUser />}
        onClick={onOpen}
        variant="outline"
        bg="white"
        _hover={{ bg: "gray.200" }}
        aria-label="Login"
      />
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={2}
          p={4}
          bg="gray.800"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
          width="300px"
          onMouseEnter={onOpen}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email">
                <FormLabel color="white">Correo electrónico</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  color="white"
                  bg="gray.700"
                  _placeholder={{ color: 'gray.400' }}
                  width="100%"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel color="white">Contraseña</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  color="white"
                  bg="gray.700"
                  _placeholder={{ color: 'gray.400' }}
                  width="100%"
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Iniciar sesión
              </Button>
              <Text color="white">
                <Link as={RouterLink} to="/user/register">
                  ¿No estás registrado?
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default LoginForm;
