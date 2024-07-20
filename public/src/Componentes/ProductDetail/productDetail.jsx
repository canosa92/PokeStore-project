import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCommentForm from '../ProductComment/ProductComment';
import {
  ChakraProvider,
  Box,
  Text,
  Image,
  Flex,
  Tag,
  Divider,
  Button,
  ButtonGroup,
  HStack,
  Container,
  VStack,
  IconButton,
  Heading,
  Badge,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { StarIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
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
      setComments(product.reviews || []);
      const productLike = product.likes[0] || { star: 0, likesCount: 0 };
      setRatingData({
        star: productLike.star,
        likesCount: productLike.likesCount,
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

  const handleCommentSubmit = (data) => {
    const { newReview, updatedRating } = data;
    addCommentToProduct(product._id, newReview);
    setComments(prevComments => [...prevComments, newReview]);
    setRatingData(updatedRating);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 10) / 10;

    for (let i = 0; i < 5; i++) {
      stars.push(<StarIcon key={i} color={i < roundedRating ? "yellow.400" : "gray.300"} />);
    }

    return stars;
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box 
            bg="gray.100" 
            p={6} 
            borderRadius="lg" 
            boxShadow="md"
          >
            <Heading as="h1" size="2xl" textAlign="center" mb={4}>
              #{product.id_pokedex} - {product.nombre}
            </Heading>
            <Flex justify="center" align="center" mb={4}>
              {renderStars(ratingData.star)}
              <Text ml={2} fontSize="lg" fontWeight="medium">
                {ratingData.star.toFixed(1)} ({ratingData.likesCount} likes)
              </Text>
            </Flex>
            <HStack justify="center" spacing={4}>
              {product.mythical && (
                <Badge colorScheme="purple" p={2} borderRadius="full" fontSize="md">
                  Mítico
                </Badge>
              )}
              {product.legendario && (
                <Badge colorScheme="orange" p={2} borderRadius="full" fontSize="md">
                  Legendario
                </Badge>
              )}
            </HStack>
          </Box>
  
          <Flex direction={['column', 'column', 'row']} justify="center" align="flex-start" spacing={8}>
            <Box flex="1" textAlign="center" mb={[4, 4, 0]}>
              <Image
                src={product.imagen}
                alt={product.nombre}
                boxSize={['300px', '400px', '500px']}
                objectFit="contain"
                borderRadius="lg"
                boxShadow="lg"
              />
            </Box>
  
            <VStack flex="1" align="stretch" spacing={6} p={4} bg="white" borderRadius="lg" boxShadow="md">
              <Text fontSize="xl" fontStyle="italic" textAlign="center">{product.descripcion}</Text>
              <Flex justify="center" wrap="wrap" gap={3}>
                <Tag colorScheme="green" size="lg" borderRadius="full">{product.peso} kg</Tag>
                <Tag colorScheme="green" size="lg" borderRadius="full">{product.altura} m</Tag>
                {product.tipo.map((tipo, index) => (
                  <Tag key={index} colorScheme="blue" size="lg" borderRadius="full">
                    {tipo}
                  </Tag>
                ))}
              </Flex>
              <VStack align="start" spacing={3}>
                <Stat>
                  <StatLabel fontSize="lg">Ratio de captura</StatLabel>
                  <StatNumber>{product.ratio_captura}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel fontSize="lg">Experiencia Base</StatLabel>
                  <StatNumber>{product.base_experience} puntos</StatNumber>
                </Stat>
              </VStack>
              <Box>
                <Heading as="h3" size="md" mb={2}>Habilidades:</Heading>
                <List spacing={2}>
                  {product.habilidades.map((habilidad, index) => (
                    <ListItem key={index}>
                      <Text as="span" fontWeight="bold">{habilidad.nombre}:</Text>{' '}
                      {habilidad.descripcion}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Heading as="h3" size="md" mb={2}>Cadena Evolutiva:</Heading>
                {product.cadena_evoluciones.length > 1 ? (
                  <HStack spacing={2} wrap="wrap" justify="center">
                    {product.cadena_evoluciones.map((evolucion, index) => (
                      <React.Fragment key={index}>
                        <Link to={`/pokemon/${evolucion.especie}`}>
                          <Button colorScheme="teal" variant="outline">
                            {evolucion.especie} {evolucion.nivel && `(Nivel ${evolucion.nivel})`}
                          </Button>
                        </Link>
                        {index < product.cadena_evoluciones.length - 1 && (
                          <ArrowForwardIcon />
                        )}
                      </React.Fragment>
                    ))}
                  </HStack>
                ) : (
                  <Text>Este Pokémon no tiene evoluciones.</Text>
                )}
              </Box>
            </VStack>
          </Flex>
  
          <ButtonGroup justifyContent="center" size="lg" mt={6} spacing={4}>
            <Button
              colorScheme="green"
              onClick={() => añadir(product)}
              disabled={!product.stock}
              leftIcon={<FaShoppingCart />}
            >
              {product.stock ? 'Añadir al carrito' : 'Sin stock'}
            </Button>
            <IconButton
              aria-label={user?.wishList?.includes(product._id) ? 'Eliminar de la lista de deseos' : 'Añadir a la lista de deseos'}
              icon={user?.wishList?.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
              onClick={() => toggleWishList(product._id)}
              colorScheme={user?.wishList?.includes(product._id) ? 'red' : 'gray'}
              variant="outline"
            />
          </ButtonGroup>
        </VStack>
  
        <Divider my={8} />
  
        <Box>
          {user ? (
            <>
              <ProductCommentForm
                productId={product._id}
                productName={product.nombre}
                productImage={product.imagen}
                productDescription={product.descripcion}
                onCommentSubmit={handleCommentSubmit}
              />
              <VStack mt={8} spacing={4} align="stretch">
                {comments.length > 0 ? (
                  comments.map((review, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontSize="lg" fontWeight="bold">{review.username}</Text>
                        {renderStars(review.rating)}
                      </Flex>
                      <Text mt={2}>{review.comment}</Text>
                      <Text mt={2} fontSize="sm" color="gray.500">
                        {formatDate(review.createdAt)}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    Animate y se el primero en dejar un comentario a este Pokemon
                  </Alert>
                )}
              </VStack>
            </>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Para añadir un comentario debes de estar logeado.
            </Alert>
          )}
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default ProductDetail;
