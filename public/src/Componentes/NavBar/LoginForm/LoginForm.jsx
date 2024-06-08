import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Link as ChakraLink,
} from '@chakra-ui/react';

const LoginForm = ({ isOpen, onClose }) => {
  const { setUser, login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      localStorage.setItem('token', data.user.token);
      setUser(data.user);
      login(data.user, data.user.token);
      navigate('/myprofile');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Box
      p={6}
      bg="gray.700"
      borderRadius="md"
      boxShadow="md"
      mx="auto"
      width={{ base: '90%', md: 'auto' }} // Ajustamos el ancho en dispositivos móviles
      position="absolute" // Posición absoluta para centrar verticalmente
      top="50%" // Posición vertical centrada
      left="50%" // Posición horizontal centrada
      transform="translate(-50%, -50%)" // Centrado exacto en el medio
      display={isOpen ? 'block' : 'none'} // Mostrar solo cuando isOpen es true
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel color="white">Correo electrónico</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              bg="gray.800"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel color="white">Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              bg="gray.800"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} width="100%">
            Iniciar sesión
          </Button>
          <Text color="white">
            <ChakraLink as={Link} to="/user/register">
              ¿No estás registrado?
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
