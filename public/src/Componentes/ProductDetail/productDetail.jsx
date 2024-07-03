import React, { useState, useEffect } from 'react';
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
  IconButton,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useProducts } from '../../usecontext/ProductContext';
import { useCarrito } from '../../usecontext/CarritoContext';
import { useUser } from '../../usecontext/UserContext';

const ProductDetail = () => {
  const { añadir } = useCarrito();
  const { products, addCommentToProduct } = useProducts();
  const { user, toggleWishList } = useUser();
  const { nombre } = useParams();

  const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const capitalizedNombre = capitalizeName(nombre);

  const product = products.find(
    (product) =>
      product.nombre.toLowerCase() === capitalizedNombre.toLowerCase()
  );

  const [comments, setComments] = useState([]);
  const [ratingData, setRatingData] = useState({ star: 0, likesCount: 0 });

  useEffect(() => {
    if (product) {
      setComments(product.reviews); // Actualiza los comentarios del producto desde el contexto global al montar el componente
      setRatingData({
        star: product.likes[0].star || 0,
        likesCount: product.likes[0].likesCount || 0,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <Box textAlign="center">
        <Text fontSize="2xl">Producto no encontrado.</Text>
      </Box>
    );
  }

  const handleCommentSubmit = (newComment) => {
    addCommentToProduct(product._id, newComment); // Llama a la función del contexto global para agregar el comentario
    setComments((prevComments) => [...prevComments, newComment]); // Actualiza los comentarios en el estado local
    setRatingData((prevRatingData) => ({
      star: newComment.updatedRating.star,
      likesCount: newComment.updatedRating.likesCount,
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 10) / 10; // Redondear a un decimal

    // Mostrar 3 estrellas si el rating redondeado es mayor a 2.5
    const numberOfStars = roundedRating > 2.5 ? 3 : 2;

    // Renderizar las estrellas según el número calculado
    for (let i = 0; i < numberOfStars; i++) {
      stars.push(<StarIcon key={i} color="yellow.400" />);
    }

    // Rellenar con estrellas grises si no se alcanza el total de 5
    while (stars.length < 5) {
      stars.push(<StarIcon key={stars.length} color="gray.300" />);
    }

    return stars;
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex direction="column" align="center" mb={4}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">
            {product.id_pokedex} - {product.nombre}
          </Text>
          <Flex align="center" mb={4}>
            {renderStars(ratingData.star)}{' '}
            <Text ml={2}>
              {ratingData.star.toFixed(1)} ({ratingData.likesCount}{' '}
              likes)
            </Text>
          </Flex>
          {product.mythical && (
            <Tag fontWeight="bold" colorScheme="yellow">
              Mithical
            </Tag>
          )}
          {product.legendario && (
            <Tag fontWeight="bold" colorScheme="yellow">
              Legendario
            </Tag>
          )}
        </Flex>

        <Flex direction={['column', 'column', 'row']} justify="center" align="flex-start">
          <Box flex="1" textAlign="center" mb={4} mx={[0, 4]}>
            <Image
              src={product.imagen}
              alt={product.nombre}
              boxSize={['100%', '300px', '400px']}
              mx="auto"
            />
          </Box>

          <Box flex="1" textAlign="center" mb={4} mx={[0, 4]}>
            <Text fontSize="xl">{product.descripcion}</Text>
            <Flex justify="center" wrap="wrap" gap={2}>
              <Tag colorScheme="green">{product.peso} kg</Tag>
              <Tag colorScheme="green">{product.altura} m</Tag>
            </Flex>
            <Flex justify="center" wrap="wrap" gap={2}>
              {product.tipo.map((tipo, index) => (
                <Tag key={index} colorScheme="blue">
                  {tipo}
                </Tag>
              ))}
            </Flex>
            <Text fontSize="xl" fontWeight="bold">
              Ratio de captura:
            </Text>
            <Tag colorScheme="blue">{product.ratio_captura}</Tag>
            <Text fontSize="xl" fontWeight="bold">
              Experiencia Base:
            </Text>
            <Tag colorScheme="blue">{product.base_experience} puntos</Tag>
            <Text fontSize="xl" fontWeight="bold">
              Habilidades:
            </Text>
            <ul>
              {product.habilidades.map((habilidad, index) => (
                <li key={index}>
                  <Text as="span" fontWeight="bold">
                    {habilidad.nombre}:
                  </Text>{' '}
                  {habilidad.descripcion}
                </li>
              ))}
            </ul>
            <Text fontSize="xl" fontWeight="bold">
              Cadena Evolutiva:
            </Text>
            {product.cadena_evoluciones.length > 1 ? (
              <Flex wrap="wrap" justify="center">
                {product.cadena_evoluciones.map((evolucion, index) => (
                  <Text key={index} mx={2}>
                    <Link to={`/pokemon/${evolucion.especie.toLowerCase()}`}>
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
          <Text fontSize="xl" fontWeight="bold">
            Estadísticas:
          </Text>
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
          <Text fontSize="2xl" fontWeight="bold">
            Precio: {product.precio} €
          </Text>
          <ButtonGroup mt={2}>
            {!user && (
              <Button colorScheme="blue">
                <Link to="/login">Inicia sesión</Link>
              </Button>
            )}
            <Button onClick={() => añadir(product)}>Añadir a la lista</Button>
            {user && (
              <IconButton
                icon={user.wishList.includes(product._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                aria-label="Add to wishlist"
                variant="ghost"
                colorScheme="blue"
                onClick={() => toggleWishList(user.uid, product._id)}
              />
            )}
          </ButtonGroup>
        </Box>

        <Box mt={4}>
          <Divider />
        </Box>

        <Box mt={4}>
          {comments.length > 0 ? (
            <Box mt={4}>
              <Text fontSize="xl" fontWeight="bold">
                Reviews:
              </Text>
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
                <Text fontSize="lg">
                  Por favor, <Link to="/register">regístrate</Link> o{' '}
                  <Link to="/login">inicia sesión</Link>.
                </Text>
              )}
            </Box>
          )}
        </Box>
        {user && (
          <ProductCommentForm
            productId={product._id}
            productName={product.nombre}
            productImage={product.imagen}
            productDescription={product.descripcion}
            onCommentSubmit={handleCommentSubmit}
          />
        )}
      </Box>
    </ChakraProvider>
  );
};

export default ProductDetail;
