// CarritoPages.jsx

import React from 'react';
import { useCarrito } from '../../usecontext/CarritoContext';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Heading, Image, Text, VStack, HStack } from '@chakra-ui/react';

const CarritoPages = () => {
  const { carrito, ajustarCantidad, eliminar, vaciarCarrito } = useCarrito();

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  return (
    <Box p={4} bg="gray.50">
      <Heading as="h1" mb={6}>Mi Carrito</Heading>
      {carrito.length === 0 ? (
        <Text>No hay productos en el carrito. <Link to="/">Vuelve a la tienda</Link></Text>
      ) : (
        <VStack spacing={4}>
          {carrito.map((producto) => (
            <Flex key={producto._id} p={4} bg="white" borderRadius="md" boxShadow="md" width="100%" direction={{ base: 'column', md: 'row' }} alignItems="center">
              <Image src={producto.imagen} alt={producto.nombre} boxSize="100px" objectFit="cover" />
              <Box ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }} flex="1">
                <Heading as="h2" size="md">{producto.nombre}</Heading>
                <Text>{producto.descripcion}</Text>
                <Text>Precio: {producto.precio} €</Text>
                <Text>Cantidad: {producto.cantidad}</Text>
                <HStack mt={2}>
                  <Button size="sm" onClick={() => ajustarCantidad(producto._id, -1)}>-</Button>
                  <Text>{producto.cantidad}</Text>
                  <Button size="sm" onClick={() => ajustarCantidad(producto._id, 1)}>+</Button>
                </HStack>
                <Button mt={2} colorScheme="red" onClick={() => eliminar(producto._id)}>Eliminar</Button>
              </Box>
            </Flex>
          ))}
          <Box width="100%" textAlign="center">
            <Heading as="h3" size="lg">Total: {calcularTotal()} €</Heading>
            <HStack spacing={4} mt={4} justifyContent="center">
              <Button colorScheme="red" onClick={vaciarCarrito}>Vaciar Carrito</Button>
              <Button colorScheme="green">Proceder al Pago</Button>
            </HStack>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default CarritoPages;
