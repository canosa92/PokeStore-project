import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../usecontext/UserContext.jsx';
import PropTypes from 'prop-types';
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
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const success = await login(email, password);
    
    if (success) {
      onClose(); // Cerrar el formulario después del login exitoso
    } else {
      setError(error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md" display={isOpen ? 'block' : 'none'} zIndex="2000">
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
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} width="100%">
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
  );
};

LoginForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginForm;
