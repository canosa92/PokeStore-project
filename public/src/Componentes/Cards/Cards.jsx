import React from 'react';
import { useCarrito } from '../../usecontext/CarritoContext';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Text, Heading, Image, VStack, HStack, Divider, Spacer, IconButton } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

const Cards = ({ products, showSort }) => {
  const { añadir, mensaje, carrito } = useCarrito();

  const añadirProducto = (producto) => {
    const productoEnCarrito = carrito.find((item) => item._id === producto._id);
    if (productoEnCarrito) {
      // Si el producto ya está en el carrito, mostrar mensaje
      añadir(producto);
    } else {
      añadir(producto);
    }
  };

  return (
    <Box p={4}>
      {showSort && (
        <Flex mb={4} align="center">
          <Text mr={2}>Ordenar por:</Text>
          {/* Resto del código para el selector de orden */}
        </Flex>
      )}
      <Flex wrap="wrap" justify="center">
        {products.map((producto) => (
          <Box key={producto._id} maxW="sm" m={4} boxShadow="lg" borderRadius="md" overflow="hidden" bg="white" transition="background 0.3s ease">
            <Image src={producto.imagen} alt={producto.nombre} />
            <Box p={4}>
              <Heading as="h3" size="md" mb={2}>{producto.nombre}</Heading>
              <Text mb={2}>{producto.descripcion}</Text>
              <Text mb={2}>Precio: {producto.precio} €</Text>
              <Button colorScheme="blue" mr={2} onClick={() => añadirProducto(producto)}>Añadir al carrito</Button>
              <Link to={`/producto/${producto._id}`}>
                <Button variant="outline" colorScheme="blue">Detalles</Button>
              </Link>
              <IconButton
                aria-label="Eliminar"
                icon={<FaTrash />}
                size="sm"
                colorScheme="red"
                ml={2}
                onClick={() => eliminarProducto(producto._id)}
              />
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Cards;
