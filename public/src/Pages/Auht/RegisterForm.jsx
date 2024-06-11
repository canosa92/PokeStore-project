import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../usecontext/UserContext.jsx';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Alert, AlertIcon, Flex } from '@chakra-ui/react';

const RegisterForm = ({ isMobile }) => {
  const { register } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
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
    
    const result = await register(formData);
    
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
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Usuario</FormLabel>
              <Input
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
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
      <Box 
        ml={isMobile ? 0 : 10} 
        mb={isMobile ? 6 : 0} 
        p={6} 
        maxWidth={isMobile ? '90%' : '400px'}
        textAlign={isMobile ? 'center' : 'left'}
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          ¡Únete a nuestra comunidad!
        </Text>
        <Text mb={2}>
          Al registrarte, podrás disfrutar de múltiples beneficios:
        </Text>
        <ul>
          <li>Poder comprar nuestros productos exclusivos</li>
          <li>Valorar y comentar tus productos favoritos</li>
          <li>Formar parte de una comunidad única y especial</li>
        </ul>
        <Text mt={4}>
          ¡No esperes más y forma parte de nuestra familia!
        </Text>
      </Box>
    </Flex>
  );
};

export default RegisterForm;
