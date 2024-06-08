import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Alert, AlertIcon, Link as ChakraLink, Image } from '@chakra-ui/react';
import registrationIllustration from './registrationIllustration.png';

const RegisterForm = ({ isMobile }) => {
  const { user, setUser, register } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const rol = user ? user.role : '';

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: rol,
    wishList: [],
    comments:[],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'username' && !value.startsWith('@')) {
      formattedValue = '@' + value;
    }
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:2999/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }
      const userData = await response.json();
      register(userData.user, userData.token);
      setUser(userData.user);
      navigate('/myprofile');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <Box p={6} bg="gray.700" borderRadius="md" boxShadow="md" mx="auto" width={isMobile ? '90%' : 'auto'} textAlign={isMobile ? 'center' : 'left'}>
      {isMobile ? (
        <Image src={registrationIllustration} alt="Registration Illustration" mb={4} />
      ) : (
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          ¡Regístrate ahora y descubre un mundo de posibilidades!
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel color="white">Nombre</FormLabel>
            <Input
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              bg="gray.800"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel color="white">Usuario</FormLabel>
            <Input
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Usuario"
              bg="gray.800"
              color="white"
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel color="white">Correo electrónico</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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
            Registrarse
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
