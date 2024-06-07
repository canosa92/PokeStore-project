import React from 'react';
import { Box, Image, Text, Badge, Flex, VStack, HStack, Stack, SimpleGrid } from '@chakra-ui/react';
import ProductCommentForm from './ProductCommentForm'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

const ProductDetail = ({ product }) => {
  const handleCommentSubmit = (newComment) => {
    // Actualizar la lista de comentarios con el nuevo comentario
  };

  return (
    <Box p={4}>
      <Flex direction={{ base: 'column', md: 'row' }} align="center">
        <Image
          src={product.imagen}
          alt={product.nombre}
          boxSize="300px"
          objectFit="cover"
          mr={{ md: 4 }}
        />
        <VStack align="start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">{product.nombre}</Text>
          <Text fontSize="lg">Pokedex ID: {product.id_pokedex}</Text>
          {product.legendario && <Badge colorScheme="yellow">Legendario</Badge>}
          {product.mythical && <Badge colorScheme="purple">Místico</Badge>}
          <Text fontSize="xl" fontWeight="bold">{product.precio}€</Text>
          <Text>{product.descripcion}</Text>
          <Text>Peso: {product.peso} kg</Text>
          <Text>Altura: {product.altura} m</Text>
          <Box>
            <Text fontSize="lg" fontWeight="bold">Estadísticas:</Text>
            <SimpleGrid columns={2} spacing={2} w="full">
              {product.estadisticas.map((estadistica, index) => (
                <HStack key={index} justifyContent="space-between" w="full">
                  <Text>{estadistica.nombre}:</Text>
                  <Text>{estadistica.valor}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
          <ProductCommentForm productId={product.id} onCommentSubmit={handleCommentSubmit} />
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProductDetail;
