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
            {renderStars(product.likes[0]?.likes || 0)}
            <Text ml={2}>{product.likes[0]?.likesCount} likes</Text>
          </Flex>
          {product.mythical && <Tag fontWeight="bold" colorScheme="yellow">Mithical</Tag>}
          {product.legendario && <Tag fontWeight="bold" colorScheme="yellow">Legendario</Tag>}
        </Flex>

        <Flex direction={['column', 'column', 'row']} justify="center" align="flex-start">
          <Box flex="1" textAlign="center" mb={4} mx={[0, 4]}>
            <Image src={product.imagen} alt={product.nombre} boxSize={['100%', '300px', '400px']} mx="auto" />
          </Box>

          <Box flex="1" textAlign="center" mb={4} mx={[0, 4]}>
            <Text fontSize="xl" >{product.descripcion}</Text>
            <Flex justify="center" wrap="wrap" gap={2}>
              <Tag colorScheme="green">{product.peso} kg</Tag>
              <Tag  colorScheme="green">{product.altura} m</Tag>
            </Flex>
            <Flex justify="center" wrap="wrap" gap={2}>
              {product.tipo.map((tipo, index) => (
                <Tag key={index} colorScheme="blue">
                  {tipo}
                </Tag>
              ))}
            </Flex>
            <Text fontSize="xl" fontWeight="bold">Ratio de captura:</Text>
            <Tag colorScheme="blue">{product.ratio_captura}</Tag>
            <Text fontSize="xl" fontWeight="bold">Experiencia Base:</Text>
            <Tag colorScheme="blue">{product.base_experience} puntos</Tag>
            <Text fontSize="xl" fontWeight="bold">Habilidades:</Text>
            <ul >
              {product.habilidades.map((habilidad, index) => (
                <li key={index} >
                  <Text as="span" fontWeight="bold">{habilidad.nombre}:</Text> {habilidad.descripcion}
                </li>
              ))}
            </ul>
            <Text fontSize="xl" fontWeight="bold">Cadena Evolutiva:</Text>
          {product.cadena_evoluciones.length > 1 ? (
            <Flex wrap="wrap" justify="center">
              {product.cadena_evoluciones.map((evolucion, index) => (
                <Text key={index} mx={2}>
                  <Link to={`/product/${evolucion.especie.toLowerCase()}`}>
                    <Text as="span" fontWeight="bold">
                      {capitalizeName(evolucion.especie)}
                    </Text>
                  </Link> 
                  {evolucion.nivel ? ` - Nivel: ${evolucion.nivel}` : ' - Nivel: 0'}
                </Text>
              ))}
            </Flex>
          ) : (
            <Text fontSize="lg">Este Pokémon no tiene cadena evolutiva.</Text>
          )}
          </Box>
        </Flex>

        <Box textAlign="center" mt={4}>
          <Text fontSize="xl" fontWeight="bold">Estadísticas:</Text>
          <Stack spacing={2} mt={2}>
            {product.estadisticas.map((stat, index) => (
              <Flex key={index} direction="column" align="center">
                <Text fontWeight="bold">{capitalizeName(stat.nombre)}:</Text>
                <Progress value={stat.valor} max="200" colorScheme="green" size="sm" width="80%" />
              </Flex>
            ))}
          </Stack>
        </Box>

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
            <Box mt={4} textAlign ="center">
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

