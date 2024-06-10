import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../../usecontext/CarritoContext';
import { useUser } from '../../usecontext/UserContext';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  IconButton,
  Select,
  Image,
  Stack,
  Heading,
  Divider,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';

const Cards = ({ products, showSort }) => {
  const { user } = useUser();
  const { añadir, mensaje } = useCarrito();
  const [productosOrdenados, setProductosOrdenados] = useState(products);
  const [orden, setOrden] = useState('idAsc');
  const [productoAñadido, setProductoAñadido] = useState(null);

  const handleChangeOrden = (e) => {
    setOrden(e.target.value);
  };

  useEffect(() => {
    ordenarProductos(orden);
  }, [orden, products]);

  const ordenarProductos = (tipoOrden) => {
    const sortedProducts = [...products];
    switch (tipoOrden) {
      case 'nombreAsc':
        sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombreDesc':
        sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'precioAsc':
        sortedProducts.sort((a, b) => a.precio - b.precio);
        break;
      case 'precioDesc':
        sortedProducts.sort((a, b) => b.precio - a.precio);
        break;
      case 'idAsc':
        sortedProducts.sort((a, b) => a.id_pokedex - b.id_pokedex);
        break;
      case 'idDesc':
        sortedProducts.sort((a, b) => b.id_pokedex - a.id_pokedex);
        break;
      case 'valorAsc':
        sortedProducts.sort((a, b) => a.likes[0].likes - b.likes[0].likes);
        break;
      case 'valorDesc':
        sortedProducts.sort((a, b) => b.likes[0].likes - a.likes[0].likes);
        break;
      default:
        break;
    }
    setProductosOrdenados(sortedProducts);
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        {showSort && (
          <Flex mb={4} align="center">
            <Text mr={2}>Ordenar por:</Text>
            <Select 
              value={orden} 
              onChange={handleChangeOrden} 
              maxW="200px" 
              w="100%" 
            >
              <option value="nombreAsc">Nombre (A-Z)</option>
              <option value="nombreDesc">Nombre (Z-A)</option>
              <option value="precioAsc">Precio (Menor a Mayor)</option>
              <option value="precioDesc">Precio (Mayor a Menor)</option>
              <option value="idAsc">ID (Menor a Mayor)</option>
              <option value="idDesc">ID (Mayor a Menor)</option>
              <option value='valorAsc'>Valoraciones (Menor a Mayor)</option>
              <option value='valorDesc'>Valoraciones (Mayor a Menor)</option>
            </Select>
          </Flex>
        )}
        <Flex wrap="wrap" justify="center">
          {productosOrdenados.map((product) => (
            <Card 
              key={product._id} 
              maxW="sm" 
              m={4} 
              boxShadow="lg" 
              border="none"
            >
              <CardBody>
                <Image
                  src={product.imagen}
                  alt={product.nombre}
                  borderRadius="lg"
                  filter="drop-shadow(0px 5px 5px rgba(0, 0, 0, 1))" 
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{product.id_pokedex} - {product.nombre}</Heading>
                  {product.likes[0].likesCount > 0 ? (
                    <Box display="flex" alignItems="center">
                      {[...Array(5)].map((_, index) => (
                        <Box
                          key={index}
                          as="span"
                          color={index < Math.floor(product.likes[0].likes) ? 'gold' : 'gray.300'}
                          fontSize="lg"
                        >
                          ★
                        </Box>
                      ))}
                      <Text ml={2}>({product.likes[0].likes})</Text>
                    </Box>
                  ) : (
                    <Text>Este producto aún no tiene valoración.</Text>
                  )}
                  <Text>{product.descripcion}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    {product.precio} €
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  {user && user.role === 'admin' ? (
                    <>
                      <Button variant="solid" colorScheme="red" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                      <Button variant="solid" colorScheme="yellow" onClick={() => handleEdit(product.id)}>Editar</Button>
                    </>
                  ) : (
                    <>
                      <Link to={`/pokemon/${product.nombre}`}>
                        <Button variant="solid" colorScheme="blue">Más Detalles</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          añadir(product);
                          setProductoAñadido(product._id);
                        }}
                      >
                        Añadir al carrito
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </CardFooter>
              {productoAñadido === product._id && mensaje && (
                <Box p={2} bg="green.100" borderRadius="md" mt={2}>
                  <Text>{mensaje}</Text>
                </Box>
              )}
            </Card>
          ))}
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Cards;