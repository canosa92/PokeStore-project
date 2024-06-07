import React from 'react';
import { Box, Image, Text, Flex, useColorModeValue } from '@chakra-ui/react';

const Card = ({ producto }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <Box 
      bg={bg} 
      boxShadow={boxShadow} 
      rounded="lg" 
      overflow="hidden"
      _hover={{ transform: 'scale(1.05)', transition: '0.2s' }}
    >
      <Image src={producto.imagen} alt={producto.nombre} objectFit="cover" />
      <Box p={4}>
        <Text fontWeight="bold" fontSize="lg">{producto.nombre}</Text>
        <Text mt={2}>Precio: {producto.precio}€</Text>
      </Box>
    </Box>
  );
};

export default Card;
