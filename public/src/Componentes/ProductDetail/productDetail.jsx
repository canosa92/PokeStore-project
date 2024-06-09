import { useProducts } from '../../usecontext/ProductContext';
import { useCarrito } from '../../usecontext/CarritoContext';
import { useUser } from '../../usecontext/UserContext';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCommentForm from '../ProductComment/PorductComment.jsx';
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
  VStack
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductDetail = () => {
  const { añadir } = useCarrito();
  const products = useProducts();
  const { nombre } = useParams();
  const { user } = useUser();
  const [comments, setComments] = useState([]);

  const product = products.find(product => product.nombre === nombre);

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
        <Flex direction="column" align="center">
          <Text fontSize="2xl" fontWeight="bold">{product.id_pokedex} - {product.nombre}</Text>
          <Flex mt={2}>
            <Text mr={4}>
              Legendario: <Tag colorScheme={product.legendario ? "yellow" : "gray"}>
                {product.legendario ? <StarIcon /> : null} {product.legendario ? 'Sí' : 'No'}
              </Tag>
            </Text>
            <Text>
              Místico: <Tag colorScheme={product.mythical ? "purple" : "gray"}>
                {product.mythical ? <StarIcon /> : null} {product.mythical ? 'Sí' : 'No'}
              </Tag>
            </Text>
          </Flex>
        </Flex>

        <Flex direction={['column', 'row']} mt={4}>
          <Image src={product.imagen} alt={product.nombre} boxSize={['100%', '400px']} mx="auto" />

          <Stack spacing={4} p={4} flex="1">
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
                    <Text as="span" fontWeight="bold">{habilidad.nombre}:</Text> {habilidad.descripcion}
                  </li>
                ))}
              </ul>
            </Box>
            <Text>Ratio de captura: <Tag colorScheme="blue">{product.ratio_captura}</Tag></Text>
            <Text>Experiencia Base: <Tag colorScheme="blue">{product.base_experience} puntos</Tag></Text>

            <Box>
              <Text fontSize="xl" fontWeight="bold">Precio: {product.precio} €</Text>
              <ButtonGroup mt={2}>
                <Button colorScheme="blue">Comprar ahora</Button>
                <Button onClick={() => añadir(product)}>Añadir a la lista</Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </Flex>

        <Box mt={4}>
          <Divider />
          <Box mt={4}>
            <Text fontWeight="bold">Estadísticas:</Text>
            <ul>
              {product.estadisticas.map((stat, index) => (
                <li key={index}>
                  <Text as="span" fontWeight="bold">{stat.nombre}: </Text>
                  <Progress value={stat.valor} max="200" colorScheme="green" size="sm" borderRadius="md" />
                  {stat.valor}
                </li>
              ))}
            </ul>
          </Box>
        </Box>

        {product.cadena_evoluciones.length > 1 && (
          <Box mt={4}>
            <Text fontWeight="bold">Cadena Evolutiva:</Text>
            <ul>
              {product.cadena_evoluciones.map((evolucion, index) => (
                <li key={index}>
                  <Link to={`/product/${evolucion.especie.charAt(0).toUpperCase() + evolucion.especie.slice(1)}`}>
                    <Text as="span" fontWeight="bold">
                      {evolucion.especie.charAt(0).toUpperCase() + evolucion.especie.slice(1)}
                    </Text>
                  </Link> 
                  Nivel: {evolucion.nivel === null ? 0 : evolucion.nivel}
                </li>
              ))}
            </ul>
          </Box>
        )}

        <Box mt={4}>
          {product.likes.length > 0 && (
            <Text>Valor: {product.likes[0].star} Likes: {product.likes[0].likesCount}</Text>
          )}
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
              <Text fontSize="lg">
                Este producto aún no tiene ni likes ni reviews.
                <Link to='/register' style={{ color: 'blue' }}> Regístrate</Link> o
                <Link to='/login' style={{ color: 'blue' }}> inicia sesión </Link>para ser el primero.
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {user && <ProductCommentForm productId={product._id} onCommentSubmit={handleCommentSubmit} />}
    </ChakraProvider>
  );
};

export default ProductDetail;
