import { useProducts } from '../../usecontext/ProductContext';
import { useCarrito } from '../../usecontext/CarritoContext';
import { useUser } from '../../usecontext/UserContext';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCommentForm from '../ProductComment/ProductComment';
import {
  ChakraProvider,
  Box,
  Text,
  Image,
  Flex,
  Stack,
  Button,
  Tag,
  Progress,
  Divider,
  ButtonGroup,
  HStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductDetail = () => {
  const { añadir } = useCarrito();
  const products = useProducts();
  const { nombre } = useParams();
  const { user } = useUser();
  const [comments, setComments] = useState([]);

  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const capitalizedNombre = capitalizeName(nombre);

  const product = products.find(product => product.nombre.toLowerCase() === capitalizedNombre.toLowerCase());

  useEffect(() => {
    if (product) {
      setComments(product.reviews);
    }
  }, [product]);

  if (!product) {
    return <Box textAlign="center"><Text fontSize="2xl">Producto no encontrado.</Text></Box>;
  }

  const handleCommentSubmit = (newComment) => {
    setComments([...comments, newComment]);
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill('')
      .map((_, i) => (
        <StarIcon key={i} color={i < rating ? 'yellow.400' : 'gray.300'} />
      ));
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex direction="column" align="center" mb={4}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">{product.id_pokedex} - {product.nombre}</Text>
          <Flex align="center" mb={4}>
            {product.mithical && <Text fontWeight="bold" color="yellow.400">Mithical</Text>}
            {product.legendario && <Text fontWeight="bold" color="yellow.400">Legendario</Text>}
            {renderStars(product.likes[0]?.star || 0)}
            <Text ml={2}>{product.likes[0]?.likesCount} likes</Text>
          </Flex>
        </Flex>

        <Flex direction={['column', 'row']} justify="space-between" align="flex-start">
          <Box flex={['1', '1', '1']} textAlign="center" mb={4} mx={[0, 4]}>
            <Image src={product.imagen} alt={product.nombre} boxSize={['100%', '300px', '400px']} mx="auto" />
          </Box>

          <Stack spacing={4} p={4} flex={['1', '2', '2']} minWidth={['100%', '35%', '35%']} mb={4} mx={[0, 4]}>
            <Text fontSize="lg">{product.descripcion}</Text>
            <Flex wrap="wrap" gap={2}>
              {product.tipo.map((tipo, index) => (
                <Tag key={index} colorScheme="blue">
                  {tipo}
                </Tag>
              ))}
            </Flex>
            <Flex wrap="wrap" gap={2}>
              <Tag colorScheme="green">{product.peso} kg</Tag>
              <Tag colorScheme="green">{product.altura} m</Tag>
            </Flex>
            <Box>
              <Text fontWeight="bold">Habilidades:</Text>
              <ul>
                {product.habilidades.map((habilidad, index) => (
                  <li key={index}>
                    <Text as="span" fontWeight="bold">{habilidad.nombre}:</Text> 
                    <Text>{habilidad.descripcion}</Text>
                  </li>
                ))}
              </ul>
            </Box>
            <Text fontWeight="bold">Ratio de captura:</Text>
            <Tag colorScheme="blue">{product.ratio_captura}</Tag>
            <Text fontWeight="bold">Experiencia Base:</Text>
            <Tag>{product.base_experience} puntos</Tag>
          </Stack>

          <Stack spacing={4} p={4} flex={['1', '1', '1']} mb={4} mx={[0, 4]}>
            <Text fontSize="lg" fontWeight="bold">Estadísticas:</Text>
            <ul>
              {product.estadisticas.map((stat, index) => (
                <li key={index}>
                  <Text as="span" fontWeight="bold">{capitalizeName(stat.nombre)}:</Text> 
                  <Progress value={stat.valor} max="200" colorScheme="green" size="sm" borderRadius="full" width="100%" />
                </li>
              ))}
            </ul>
          </Stack>
        </Flex>

        <Box mt={4} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">Precio: {product.precio} €</Text>
          <ButtonGroup mt={2}>
            {!user && (
              <Button colorScheme="blue"><Link to="/login">Inicia sesión</Link></Button>
            )}
            <Button onClick={() => añadir(product)}>Añadir a la lista</Button>
          </ButtonGroup>
        </Box>

        <Box mt={4}>
          <Divider />
        </Box>

        <Box mt={4}>
          {comments.length > 0 ? (
            <Box mt={4}>
              <Text fontSize="xl" fontWeight="bold">Reviews:</Text>
              {comments.map((review, index) => (
                <Box key={index} p={4} bg="gray.100" borderRadius="md" mt={2}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">{review.username || 'Usuario desconocido'}</Text>
                    <HStack spacing={1}>{renderStars(review.rating)}</HStack>
                  </Flex>
                  <Text>{review.comment}</Text>
                </Box>
              ))}
            </Box>
          ) : (
            <Box mt={4} textAlign="center">
              <Text fontSize="lg">¡Sé el primero en comentar!</Text>
              {!user && (
                <Text fontSize="lg">Por favor, <Link to="/register">regístrate</Link> o <Link to="/login">inicia sesión</Link>.</Text>
              )}
            </Box>
          )}
        </Box>

        {user && <ProductCommentForm productId={product._id} onCommentSubmit={handleCommentSubmit} />}
      </Box>
    </ChakraProvider>
  );
};

export default ProductDetail;
