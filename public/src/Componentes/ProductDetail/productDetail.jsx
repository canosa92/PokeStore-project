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
    const newComment = {
      ...data,
      createdAt: new Date()
    };
    addCommentToProduct(product._id, newComment);
    setComments((prevComments) => [...prevComments, newComment]);
    setRatingData({
      star: data.updatedRating.star,
      likesCount: data.updatedRating.likesCount,
    });
  };

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
      <Box p={4}>
        <Flex direction="column" align="center" mb={4}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">
            {product.id_pokedex} - {product.nombre}
          </Text>
          <Flex align="center" mb={4}>
            {renderStars(ratingData.star)}{' '}
            <Text ml={2}>
              {ratingData.star.toFixed(1)} ({ratingData.likesCount} likes)
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
            <Flex justify="center" wrap="wrap" gap={5} my={2}>
              <Tag colorScheme="green" fontSize="lg">{product.peso} kg</Tag>
              <Tag colorScheme="green" fontSize="lg">{product.altura} m</Tag>
            </Flex>
            <Flex justify="center" wrap="wrap" gap={5} my={2}>
              {product.tipo.map((tipo, index) => (
                <Tag key={index} colorScheme="blue" fontSize="lg">
                  {tipo}
                </Tag>
              ))}
            </Flex>
            <Text fontSize="xl" fontWeight="bold">Ratio de captura:</Text>
            <Tag colorScheme="blue" fontSize="lg">{product.ratio_captura}</Tag>
            <Text fontSize="xl" fontWeight="bold">Experiencia Base:</Text>
            <Tag colorScheme="blue" fontSize="lg">{product.base_experience} puntos</Tag>
            <Text fontSize="xl" fontWeight="bold">Habilidades:</Text>
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
            <Text fontSize="xl" fontWeight="bold">Cadena Evolutiva:</Text>
            {product.cadena_evoluciones.length > 1 ? (
              <Flex wrap="wrap" justify="center" my={2}>
                {product.cadena_evoluciones.map((evolucion, index) => (
                  <Text key={index} mx={2} fontSize="lg" fontWeight="bold">
                    <Link to={`/product/${evolucion.especie}`} style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                      {evolucion.especie} (Nivel {evolucion.nivel})
                    </Link>
                    {index < product.cadena_evoluciones.length - 1 && (
                      <Text as="span"> &rarr; </Text>
                    )}
                  </Text>
                ))}
              </Flex>
            ) : (
              <Text>Este Pokémon no tiene evoluciones.</Text>
            )}
          </Box>
        </Flex>

        <ButtonGroup justifyContent="center" mt={4} spacing={4}>
          <Button
            colorScheme="green"
            onClick={() => añadir(product)}
            disabled={!product.stock}
          >
            {product.stock ? 'Añadir al carrito' : 'Sin stock'}
          </Button>
          <HStack spacing={2}>
            <IconButton
              aria-label={user?.wishList?.includes(product._id) ? 'Eliminar de la lista de deseos' : 'Añadir a la lista de deseos'}
              icon={user?.wishList?.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
              onClick={() => toggleWishList(product)}
              colorScheme={user?.wishList?.includes(product._id) ? 'red' : 'gray'}
            />
          </HStack>
        </ButtonGroup>
      </Box>

      <Divider my={4} />

      <Box p={4}>
        {user ? (
          <>
            <ProductCommentForm
              productId={product._id}
              productName={product.nombre}
              productImage={product.imagen}
              productDescription={product.descripcion}
              onCommentSubmit={handleCommentSubmit}
            />
            <Box mt={4}>
              {comments.length > 0 ? (
                comments.map((review, index) => (
                  <Box key={index} mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
                    <Text fontSize="md" fontWeight="bold">
                      {review.username} - {renderStars(review.rating)}
                    </Text>
                    <Text mt={2}>{review.comment}</Text>
                    <Text mt={2} fontSize="sm" color="gray.500">
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text>Logeate o registrate para ser el primero en comentar.</Text>
              )}
            </Box>
          </>
        ) : (
          <Text>Para añadir un comentario debes de estar logeado.</Text>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default ProductDetail;
