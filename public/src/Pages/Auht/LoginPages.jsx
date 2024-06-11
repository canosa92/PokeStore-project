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
  Flex,
} from '@chakra-ui/react';

const LoginPage = ({ isMobile }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/myprofile');
    } else {
      setError(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <Flex 
      justify="center" 
      align="center" 
      height="100vh" 
      p={6} 
      bg="gray.100"
      flexDirection={isMobile ? 'column' : 'row'} // Flex direction based on screen size
    >
      <Box 
        bg="white" 
        borderRadius="md" 
        boxShadow="md" 
        p={6} 
        width={isMobile ? '90%' : '50%'} 
        textAlign={isMobile ? 'center' : 'left'}
        mb={isMobile ? 6 : 0} // Margin bottom for small screens
      >
        {!isMobile && (
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            ¡Bienvenido de nuevo!
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </FormControl>
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              Iniciar sesión
            </Button>
            <Text>
              <ChakraLink as={Link} to="/user/register">
                ¿No estás registrado?
              </ChakraLink>
            </Text>
          </VStack>
        </form>
      </Box>
      <Box 
        ml={isMobile ? 0 : 10} 
        mb={isMobile ? 6 : 0} 
        p={6} 
        maxWidth={isMobile ? '90%' : '400px'}
        textAlign={isMobile ? 'center' : 'left'}
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          ¡Bienvenido de nuevo!
        </Text>
        <Text mb={2}>
          Nos alegra verte de nuevo. Gracias por volver a nuestra plataforma.
        </Text>
        <Text mb={2}>
          Al iniciar sesión, podrás disfrutar de todos nuestros servicios, como:
        </Text>
        <ul>
          <li>Acceder a tus productos favoritos</li>
          <li>Dejar comentarios y valoraciones</li>
          <li>Formar parte de nuestra comunidad especial</li>
        </ul>
        <Text mt={4}>
          ¡Gracias por ser parte de nuestra familia!
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginPage;
