// components/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../../../usecontext/CarritoContext';
import {
  Box,
  Flex,
  IconButton,
  Text,
  Stack,
  Image,
  Badge,
  Button,
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const { carrito, ajustarCantidad, eliminar, mensaje } = useCarrito();

  return (
    <Box position="relative">
      <IconButton
        as={Link}
        to="/carrito"
        icon={<FaShoppingCart />}
        aria-label="Carrito"
        variant="outline"
      />
      {carrito.length > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-1"
          right="-1"
        >
          {carrito.length}
        </Badge>
      )}
      <Box position="absolute" right={0} bg="white" p={4} borderRadius="md" boxShadow="md" w="300px" mt={2} zIndex={10}>
        {carrito.length === 0 ? (
          <Text>No hay productos en el carrito.</Text>
        ) : (
          <Stack spacing={4}>
            {carrito.map((product) => (
              <Flex key={product._id} align="center">
                <Image src={product.imagen} alt={product.nombre} boxSize="50px" borderRadius="md" />
                <Stack spacing={1} ml={2}>
                  <Text fontWeight="bold">{product.nombre}</Text>
                  <Text>{product.precio} €</Text>
                  <Flex align="center">
                    <Button size="xs" onClick={() => ajustarCantidad(product._id, -1)}>-</Button>
                    <Text mx={2}>{product.cantidad}</Text>
                    <Button size="xs" onClick={() => ajustarCantidad(product._id, 1)}>+</Button>
                  </Flex>
                  <Button size="xs" colorScheme="red" onClick={() => eliminar(product._id)}>Eliminar</Button>
                </Stack>
              </Flex>
            ))}
            <Button as={Link} to="/carrito" colorScheme="blue" size="sm" mt={4}>
              Ver Carrito
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
