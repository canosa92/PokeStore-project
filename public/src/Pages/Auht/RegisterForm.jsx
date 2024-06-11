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
