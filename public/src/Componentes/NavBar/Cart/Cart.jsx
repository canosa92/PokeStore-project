import { useState } from 'react';
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
  HStack,
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';

const Cart = () => {
  const { carrito, ajustarCantidad, eliminar, vaciarCarrito } = useCarrito();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  const totalPrecio = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

  return (
    <>
    <Box position="relative">
      <IconButton
        icon={<FaShoppingCart />}
        aria-label="Carrito"
        variant="outline"
        bg={'white'}
        onClick={() => setMostrarCarrito(!mostrarCarrito)}
      />
      {carrito.length > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-1"
          right="-1"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          {carrito.length}
        </Badge>
      )}
      {mostrarCarrito && (
        <Box
          position="absolute"
          right={0}
          p={4}
          borderRadius="md"
          boxShadow="lg"
          w="350px"
          color="black"
          bg="white"
          mt={2}
          zIndex={10}
        >
          {carrito.length === 0 ? (
            <Text>No hay productos en el carrito.</Text>
          ) : (
            <Stack spacing={4}>
              {carrito.map((producto) => (
                <Flex key={producto._id} align="center" justify="space-between">
                  <Image src={producto.imagen} alt={producto.nombre} boxSize="50px" borderRadius="md" />
                  <Box flex="1" ml={3}>
                    <Text fontWeight="bold">{producto.nombre}</Text>
                    <Text>{producto.precio} €</Text>
                  </Box>
                  <Flex align="center">
                    <IconButton
                      icon={<MinusIcon />}
                      size="sm"
                      onClick={() => ajustarCantidad(producto._id, producto.cantidad - 1)}
                    />
                    <Text mx={2}>{producto.cantidad}</Text>
                    <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      onClick={() => ajustarCantidad(producto._id, producto.cantidad + 1)}
                         />
                  </Flex>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => eliminar(producto._id)}
                  />
                </Flex>
              ))}
              <Box textAlign="center" mt={4}>
                <Text fontWeight="bold" fontSize="xl">Total: {totalPrecio} €</Text>
                <HStack spacing={4} justifyContent="center" mt={2}>
                  <Button colorScheme="red" onClick={vaciarCarrito}>Vaciar Carrito</Button>
                  <Button as={Link} to="/carrito" colorScheme="blue">Ir al Carrito</Button>
                </HStack>
              </Box>
            </Stack>
          )}
        </Box>
      )}
    </Box>
    </>
  );
};

export default Cart;
