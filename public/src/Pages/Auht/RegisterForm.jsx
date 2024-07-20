import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Alert, AlertIcon, Flex } from '@chakra-ui/react';

const RegisterForm = ({ isMobile, role }) => {
  const { register } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: role,
    wishList: [],
    comments: [],
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
    setError('');
    setSuccessMessage('');

    try {
      const result = await register(formData.email, formData.password, formData.name, formData.username, formData.role);
      if (result.success) {
        setSuccessMessage('Registro exitoso. Iniciando sesión...');
        setTimeout(() => {
          navigate('/myprofile');
        }, 2000); // Redirect after 2 seconds
      } else {
        setError(result.message || 'Error en el registro');
      }
    } catch (error) {
      setError(error.message);
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
      flexDirection={isMobile ? 'column' : 'row'}
    >
      <Box
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={6}
        width={isMobile ? '90%' : '50%'}
        textAlign={isMobile ? 'center' : 'left'}
        mb={isMobile ? 6 : 0}
      >
        {!isMobile && (
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            ¡Regístrate ahora y descubre un mundo de posibilidades!
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
                name="name"
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Usuario</FormLabel>
              <Input
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
                name="username"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                name="email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                name="password"
              />
            </FormControl>
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert status="success">
                <AlertIcon />
                {successMessage}
              </Alert>
            )}
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting} width="100%">
              Registrarse
            </Button>
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
        <Text fontSize={isMobile ? '2xl' : 'xl'} fontWeight="bold" mb={4}>
          ¡Únete a nuestra comunidad!
        </Text>
        <Text mb={2}>
          ¡Descubre un mundo de ventajas al registrarte en nuestra plataforma!
        </Text>
        <ul>
          <li>Accede a productos exclusivos antes que nadie</li>
          <li>Comenta y valora tus productos favoritos</li>
          <li>Únete a una comunidad activa y participativa</li>
        </ul>
        <Text mt={4}>
          ¡No esperes más y forma parte de nuestra familia!
        </Text>
      </Box>
    </Flex>
  );
};

export default RegisterForm;
