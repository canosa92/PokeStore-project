import React from 'react';
import { useCarrito } from '../../usecontext/CarritoContext';
import { Box, Button, Flex, Heading, Image, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const { carrito, eliminar, vaciarCarrito } = useCarrito();

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md" zIndex="1000">
      <Heading as="h1" mb={6}>Mi Carrito</Heading>
      {carrito.length === 0 ? (
        <Text>No hay productos en el carrito.</Text>
      ) : (
        <VStack spacing={4} alignItems="flex-start">
          {carrito.map((producto) => (
            <Flex key={producto._id} w="100%" bg="gray.100" borderRadius="md" p={2} alignItems="center">
              <Image src={producto.imagen} alt={producto.nombre} boxSize="50px" objectFit="cover" />
              <VStack ml={2} alignItems="flex-start">
                <Text>{producto.nombre}</Text>
                <Text>Precio: {producto.precio} €</Text>
                <Text>Cantidad: {producto.cantidad}</Text>
                <IconButton
                  aria-label="Eliminar"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => eliminar(producto._id)}
                />
              </VStack>
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

export default Cart;
