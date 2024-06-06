import React, { useState } from 'react';
import { useCarrito } from '../../../usecontext/CarritoContext';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text, Image, IconButton } from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';

const Cart = () => {
  const { carrito, eliminar, vaciarCarrito, ajustarCantidad, mensaje } = useCarrito();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const handleEliminarProducto = (id) => {
    eliminar(id);
  };

  const totalPrecio = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

  return (
    <Box className="Cart-container" onMouseLeave={() => setMostrarCarrito(false)}>
      <Button className="Cart-toggle" onMouseEnter={() => setMostrarCarrito(true)}>
        🛒 ({carrito.length})
      </Button>
      {mostrarCarrito && (
        <Box className="Cart-content" bg="white" p={4} borderRadius="md" boxShadow="md" mt={2}>
          {mensaje && <Text color="red.500">{mensaje}</Text>}
          {carrito.map((producto) => (
            <Flex key={producto.id_pokedex} align="center" mb={4}>
              <Image src={producto.imagen} alt={producto.nombre} width="50px" mr={4} />
              <Box flex="1">
                <Text fontWeight="bold">{producto.nombre}</Text>
                <Text>{producto.precio} €</Text>
                <Flex align="center">
                  <IconButton
                    icon={<MinusIcon />}
                    size="sm"
                    onClick={() => ajustarCantidad(producto.id_pokedex, producto.cantidad - 1)}
                  />
                  <Text mx={2}>{producto.cantidad}</Text>
                  <IconButton
                    icon={<AddIcon />}
                    size="sm"
                    onClick={() => ajustarCantidad(producto.id_pokedex, producto.cantidad + 1)}
                  />
                </Flex>
              </Box>
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                onClick={() => handleEliminarProducto(producto.id_pokedex)}
              />
            </Flex>
          ))}
          {carrito.length > 0 && (
            <Flex justify="space-between" align="center" mt={4}>
              <Button onClick={vaciarCarrito} colorScheme="red" size="sm">
                Vaciar Carrito
              </Button>
              <Link to="/carrito">
                <Button colorScheme="blue" size="sm">
                  Ir al Carrito
                </Button>
              </Link>
              <Text fontWeight="bold">Total: {totalPrecio} €</Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Cart;
