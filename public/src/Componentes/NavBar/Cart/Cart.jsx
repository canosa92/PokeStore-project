import React from 'react';
import { Box, Button, Flex, Image, Stack, Text, IconButton } from '@chakra-ui/react';
import { useCarrito } from '../../usecontext/CarritoContext.jsx';
import { CloseIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { carrito, eliminar, ajustarCantidad, mensaje } = useCarrito();

  const totalPrecio = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

  return (
    <Box>
      {mensaje && <Text>{mensaje}</Text>}
      <Box bg="white" p={4} rounded="md" boxShadow="md">
        {carrito.map((producto, index) => (
          <Flex key={index} align="center" justify="space-between" mb={4}>
            <Image src={producto.imagen} alt={producto.nombre} boxSize="50px" objectFit="cover" mr={4} />
            <Text flex="1">{producto.nombre}</Text>
            <Flex align="center">
              <IconButton
                icon={<MinusIcon />}
                onClick={() => ajustarCantidad(producto.id_pokedex, producto.cantidad - 1)}
              />
              <Text mx={2}>{producto.cantidad}</Text>
              <IconButton
                icon={<AddIcon />}
                onClick={() => ajustarCantidad(producto.id_pokedex, producto.cantidad + 1)}
              />
            </Flex>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => eliminar(producto.id_pokedex)}
              colorScheme="red"
              ml={2}
            />
          </Flex>
        ))}
        <Text>Total: {totalPrecio.toFixed(2)}€</Text>
        <Button colorScheme="teal" as={Link} to="/carrito">
          Comprar
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
